/**
 * Workflow Canvas Component
 * Sử dụng workflowStore và event bus
 */

import { useCallback, useEffect, useState, useMemo } from "react";
import {
  ReactFlow,
  Background,
  ConnectionLineType,
  SelectionMode,
  applyNodeChanges,
  applyEdgeChanges,
  useReactFlow,
  type Connection,
  type NodeChange,
  type EdgeChange,
  type Node,
  MiniMap,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useWorkflowStore } from "@/core/store/workflowStore";
import { edgeRegistry } from "@/core/registry/EdgeRegistry";
import { nodeRegistry } from "@/core/registry/NodeRegistry";
import { validateConnection } from "@/utils/validation";
import { NodeType } from "@/enum/workflow.enum";
import type {
  ContextMenuContext,
  BaseNodeConfig,
} from "@/core/types/base.types";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { useClipboard } from "@/workflow/hooks/useClipboard";
import { globalEventBus } from "@/core/events/EventBus";
import {
  canLaneBeDroppedOnCanvas,
  canLaneBeDragged,
  canLaneExistStandalone,
  findTargetContainer,
  toRelativePosition,
  validateLaneOperation,
  sortNodesByParentChild,
} from "@/workflow/utils/poolLaneRules";

// Import node/edge types from workflow
import { nodeTypes as builtInNodeTypes } from "./nodes";
import { CustomNode } from "./nodes/CustomNodes";
import { edgeTypes } from "./edges";
import { ConnectionLinePreview } from "./edges/preview";
import clsx from "clsx";
import { ContextMenu } from "../ContextMenu";

interface CanvasProps {
  onNodeDrop?: (nodeType: string, position: { x: number; y: number }) => void;
  isPanMode?: boolean;
  onPanModeChange?: (isPanMode: boolean) => void;
  showMinimap?: boolean;
}

function CanvasInner({
  onNodeDrop,
  isPanMode,
  onPanModeChange,
  showMinimap = false,
}: CanvasProps) {
  const {
    nodes,
    edges,
    setNodes,
    setEdges,
    selectNode,
    selectEdge,
    clearSelection,
    addEdge,
    undo,
    redo,
    saveToHistory,
  } = useWorkflowStore();
  const { screenToFlowPosition } = useReactFlow();
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    context: ContextMenuContext;
  } | null>(null);

  // Dynamically build nodeTypes from registry (includes plugin nodes)
  const nodeTypes = useMemo(() => {
    const customNodeTypes: Record<string, React.ComponentType<any>> = {};
    const allNodes = nodeRegistry.getAll();

    // Add custom nodes from plugins (any node not in built-in types)
    allNodes.forEach(item => {
      if (!(item.type in builtInNodeTypes)) {
        customNodeTypes[item.type] = CustomNode;
      }
    });

    return { ...builtInNodeTypes, ...customNodeTypes };
  }, []);

  const [isDragging, setIsDragging] = useState(false);
  const [disableZoomOnScroll, setDisableZoomOnScroll] = useState(false);

  // Handle node changes
  const onNodesChange = useCallback(
    (changes: NodeChange[]) => {
      const updatedNodes = applyNodeChanges(changes, nodes) as any;

      // Post-process: Apply extent: 'parent' for nodes in locked containers
      const finalNodes = updatedNodes.map((node: any) => {
        if (node.parentId) {
          const parent = updatedNodes.find((n: any) => n.id === node.parentId);

          // RULE 4: Lanes inside Pool should not be draggable
          const isDraggable = canLaneBeDragged(node, updatedNodes);
          if (!isDraggable) {
            return {
              ...node,
              draggable: false,
              extent: "parent" as const,
            };
          }

          if (parent && parent.data?.isLocked) {
            // Node is in a locked container
            return {
              ...node,
              extent: "parent" as const,
            };
          }
        }

        // RULE 3: Lane must be in Pool (should not exist standalone)
        const standaloneCheck = canLaneExistStandalone(node);
        if (!standaloneCheck.allowed) {
          console.warn(
            "⚠️ Lane detected without parent Pool. This should not happen."
          );
        }

        // Clear extent if not in locked container
        if (node.extent === "parent" && !node.parentId) {
          return {
            ...node,
            extent: undefined,
          };
        }
        return node;
      });

      setNodes(finalNodes);
    },
    [nodes, setNodes]
  );

  // Handle edge changes
  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => {
      setEdges(applyEdgeChanges(changes, edges) as any);
    },
    [edges, setEdges]
  );

  // Handle node drag start - save history before drag begins
  const onNodeDragStart = useCallback(() => {
    if (!isDragging) {
      saveToHistory(); // Save state BEFORE drag
      setIsDragging(true);
    }
  }, [isDragging, saveToHistory]);

  // Handle node drag - ensure children move with parent
  const onNodeDrag = useCallback(
    (_event: React.MouseEvent, node: BaseNodeConfig) => {
      // When dragging pool or lane, we don't need to do anything special
      // ReactFlow handles parent-child movement automatically if parentId is set correctly
      // This is just here for future extensions if needed
    },
    []
  );

  // Handle node drag stop
  const onNodeDragStop = useCallback(
    (_event: React.MouseEvent, node: BaseNodeConfig) => {
      setIsDragging(false);

      // Get the latest nodes state
      const allNodes = useWorkflowStore.getState().nodes;

      // RULE 3: Lane MUST be inside Pool (cannot be standalone)
      const standaloneCheck = canLaneExistStandalone(node);
      if (!standaloneCheck.allowed) {
        alert(standaloneCheck.reason);
        // Remove the lane node if it's not in a pool
        const { deleteNode } = useWorkflowStore.getState();
        deleteNode(node.id);
        return;
      }

      // Calculate absolute position - node.position might be relative if it has a parent
      const absolutePosition = node.parentId
        ? (() => {
            const parent = allNodes.find(n => n.id === node.parentId);
            return parent
              ? {
                  x: node.position.x + parent.position.x,
                  y: node.position.y + parent.position.y,
                }
              : node.position;
          })()
        : node.position;

      // Use node with absolute position for container detection
      const nodeWithAbsolutePosition = { ...node, position: absolutePosition };

      // Find target container using centralized logic (don't exclude locked - we'll check below)
      const targetContainer = findTargetContainer(
        nodeWithAbsolutePosition,
        allNodes,
        false
      );

      // SPECIAL HANDLING FOR LANE
      if (node.type === "lane" || node.data?.nodeType === "lane") {
        // Use centralized validation
        const validation = validateLaneOperation(
          "dragStop",
          node,
          targetContainer,
          allNodes
        );

        if (!validation.valid) {
          alert(validation.error);
          return;
        }

        // If validation passed and lane is entering a pool
        if (targetContainer && node.parentId !== targetContainer.id) {
          const { updateNode: updateNodeFn } = useWorkflowStore.getState();
          updateNodeFn(node.id, {
            parentId: targetContainer.id,
            draggable: false, // RULE 4: Lanes in pool cannot be dragged
            extent: "parent" as const,
            position: toRelativePosition(
              node.position,
              targetContainer.position
            ),
          });

          // Sort nodes to ensure parent appears before child
          const currentNodes = useWorkflowStore.getState().nodes;
          const sortedNodes = sortNodesByParentChild(currentNodes);
          useWorkflowStore.getState().setNodes(sortedNodes);
        }
        return;
      }

      // NORMAL NODES handling
      const { updateNode: updateNodeFn } = useWorkflowStore.getState();

      // Check if node is trying to leave a locked parent
      if (node.parentId && !targetContainer) {
        const currentParent = allNodes.find(n => n.id === node.parentId);
        if (currentParent?.data?.isLocked) {
          // LOCKED MODE: Cannot drag node out of locked container
          // Force node back to parent with extent
          updateNodeFn(node.id, {
            parentId: currentParent.id,
            extent: "parent" as const,
            position: node.position, // Keep current relative position
          });
          return;
        }
      }

      if (targetContainer && node.parentId !== targetContainer.id) {
        // Node moved INTO container - ADD parentId
        updateNodeFn(node.id, {
          parentId: targetContainer.id,
          extent: targetContainer.data?.isLocked
            ? ("parent" as const)
            : undefined,
          position: toRelativePosition(
            absolutePosition,
            targetContainer.position
          ),
        });

        // Sort nodes to ensure parent appears before child
        const currentNodes = useWorkflowStore.getState().nodes;
        const sortedNodes = sortNodesByParentChild(currentNodes);
        useWorkflowStore.getState().setNodes(sortedNodes);
      } else if (!targetContainer && node.parentId) {
        // Node moved OUT of container - REMOVE parentId
        const oldParent = allNodes.find(n => n.id === node.parentId);
        if (oldParent) {
          // Always remove parentId when dragged out (unless it's locked, which is already checked above)
          updateNodeFn(node.id, {
            parentId: undefined,
            extent: undefined,
            position: absolutePosition, // Use calculated absolute position
          });
        }
      }

      // Ensure nodes inside locked containers always have extent: 'parent'
      if (node.parentId) {
        const currentParent = allNodes.find(n => n.id === node.parentId);
        if (currentParent?.data?.isLocked && node.extent !== "parent") {
          updateNodeFn(node.id, {
            extent: "parent" as const,
          });
        }
      }
    },
    []
  );

  // Handle connection with validation
  const onConnect = useCallback(
    (connection: Connection) => {
      // Disable connections in pan mode
      if (isPanMode) return;

      if (!connection.source || !connection.target) return;

      const sourceNode = nodes.find(n => n.id === connection.source);
      const targetNode = nodes.find(n => n.id === connection.target);

      if (!sourceNode || !targetNode) return;

      const sourceType = sourceNode.type as NodeType;
      const targetType = targetNode.type as NodeType;

      const existingSourceConnections = edges.filter(
        e => e.source === connection.source
      ).length;
      const existingTargetConnections = edges.filter(
        e => e.target === connection.target
      ).length;

      const validation = validateConnection(
        sourceType,
        targetType,
        existingSourceConnections,
        existingTargetConnections
      );

      if (!validation.valid) {
        console.warn("Connection validation failed:", validation.message);
        alert(`Cannot create connection: ${validation.message}`);
        return;
      }

      // Cycle Detection - kiểm tra xem connection mới có tạo vòng lặp không
      const tempEdges = [
        ...edges,
        { source: connection.source, target: connection.target },
      ];

      // Build adjacency list
      const graph = new Map<string, string[]>();
      nodes.forEach(node => {
        graph.set(node.id, []);
      });
      tempEdges.forEach(edge => {
        const neighbors = graph.get(edge.source) || [];
        neighbors.push(edge.target);
        graph.set(edge.source, neighbors);
      });

      // DFS để phát hiện cycle
      const hasCycle = (
        nodeId: string,
        visited: Set<string>,
        recStack: Set<string>
      ): boolean => {
        if (!visited.has(nodeId)) {
          visited.add(nodeId);
          recStack.add(nodeId);

          const neighbors = graph.get(nodeId) || [];
          for (const neighbor of neighbors) {
            if (
              !visited.has(neighbor) &&
              hasCycle(neighbor, visited, recStack)
            ) {
              return true;
            } else if (recStack.has(neighbor)) {
              return true; // Cycle detected!
            }
          }
        }
        recStack.delete(nodeId);
        return false;
      };

      // Kiểm tra từ tất cả các nodes
      const visited = new Set<string>();
      const recStack = new Set<string>();

      for (const node of nodes) {
        if (hasCycle(node.id, visited, recStack)) {
          console.warn("❌ Cycle detected! Cannot create this connection.");
          alert(
            "❌ Cannot create connection: This would create a circular loop in the workflow!"
          );
          return;
        }
      }

      const edge = edgeRegistry.createEdge(
        "sequence-flow",
        connection.source,
        connection.target,
        {
          sourceHandle: connection.sourceHandle || undefined,
          targetHandle: connection.targetHandle || undefined,
        }
      );

      if (edge) {
        addEdge(edge);
      }
    },
    [nodes, edges, addEdge, isPanMode]
  );

  // Handle node click
  const onNodeClick = useCallback(
    (_event: React.MouseEvent, node: any) => {
      // Disable node selection in pan mode
      if (isPanMode) return;

      const { panelStates, selectedNodeId, selectedEdgeId } =
        useWorkflowStore.getState();
      if (panelStates.properties && (selectedNodeId || selectedEdgeId)) {
        selectNode(node.id);
      }
    },
    [isPanMode, selectNode]
  );

  // Handle edge click
  const onEdgeClick = useCallback(
    (_event: React.MouseEvent, edge: any) => {
      // Disable edge selection in pan mode
      if (isPanMode) return;

      const { panelStates, selectedNodeId, selectedEdgeId } =
        useWorkflowStore.getState();
      if (panelStates.properties && (selectedNodeId || selectedEdgeId)) {
        selectEdge(edge.id);
      }
    },
    [isPanMode, selectEdge]
  );

  // Handle pane click
  const onPaneClick = useCallback(() => {
    clearSelection();
  }, [clearSelection]);

  // Handle node context menu
  const onNodeContextMenu = useCallback(
    (event: React.MouseEvent, node: any) => {
      event.preventDefault();
      // Disable context menu in pan mode
      if (isPanMode) return;
      setContextMenu({
        x: event.clientX,
        y: event.clientY,
        context: {
          nodeId: node.id,
          node: node,
          position: { x: event.clientX, y: event.clientY },
        },
      });
    },
    [isPanMode]
  );

  // Handle edge context menu
  const onEdgeContextMenu = useCallback(
    (event: React.MouseEvent, edge: any) => {
      event.preventDefault();
      // Disable context menu in pan mode
      if (isPanMode) return;
      setContextMenu({
        x: event.clientX,
        y: event.clientY,
        context: {
          edgeId: edge.id,
          edge: edge,
          position: { x: event.clientX, y: event.clientY },
        },
      });
    },
    [isPanMode]
  );

  // Handle pane context menu
  const onPaneContextMenu = useCallback(
    (event: MouseEvent | React.MouseEvent<Element, MouseEvent>) => {
      event.preventDefault();
      // Disable context menu in pan mode
      if (isPanMode) return;
      setContextMenu({
        x: event.clientX,
        y: event.clientY,
        context: {
          position: { x: event.clientX, y: event.clientY },
        },
      });
    },
    [isPanMode]
  );

  // Handle drop
  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const type = event.dataTransfer.getData("application/reactflow");
      if (!type) return;

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      // Center the node on drop
      const centeredPosition = {
        x: position.x - 75,
        y: position.y - 35,
      };

      // Auto-exit pan mode when dropping a node
      if (isPanMode && onPanModeChange) {
        onPanModeChange(false);
      }

      onNodeDrop?.(type, centeredPosition);
    },
    [screenToFlowPosition, onNodeDrop, isPanMode, onPanModeChange, nodes]
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  // Close context menu on click
  useEffect(() => {
    const handleClick = () => setContextMenu(null);
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  // Listen for note hover events to disable zoom on scroll
  useEffect(() => {
    const handleNoteHover = (event: any) => {
      setDisableZoomOnScroll(event.payload);
    };

    globalEventBus.on("note-hover", handleNoteHover);
    return () => globalEventBus.off("note-hover", handleNoteHover);
  }, []);

  // Keyboard shortcuts handlers
  const handleDeleteSelection = useCallback(
    (nodeIds: string[], edgeIds: string[]) => {
      // Save history before deletion
      saveToHistory();

      // Delete nodes
      if (nodeIds.length > 0) {
        // Check if any deleted node is a Note or Annotation node
        const hasNoteNode = nodes.some(
          node =>
            nodeIds.includes(node.id) &&
            (node.type === NodeType.NOTE || node.type === NodeType.ANNOTATION)
        );

        // If deleting a note node, reset zoom on scroll
        if (hasNoteNode) {
          globalEventBus.emit("note-hover", false);
        }

        setNodes(nodes.filter(node => !nodeIds.includes(node.id)));
        // Also delete connected edges
        setEdges(
          edges.filter(
            edge =>
              !nodeIds.includes(edge.source) && !nodeIds.includes(edge.target)
          )
        );
      }

      // Delete edges
      if (edgeIds.length > 0) {
        setEdges(edges.filter(edge => !edgeIds.includes(edge.id)));
      }
    },
    [nodes, edges, setNodes, setEdges, saveToHistory]
  );

  const handleSelectAll = useCallback(() => {
    setNodes(
      nodes.map(node => ({
        ...node,
        selected: true,
      }))
    );
  }, [nodes, setNodes]);

  // Use clipboard hook
  const { handleCopy, handlePaste, handleCut, handleDuplicate } =
    useClipboard();

  const handleCopyWrapper = useCallback(
    (nodesToCopy: Node[]) => {
      handleCopy(nodesToCopy);
    },
    [handleCopy]
  );

  const handlePasteWrapper = useCallback(() => {
    saveToHistory();
    const result = handlePaste();

    // Select the pasted nodes
    if (result && result.nodes.length > 0) {
      const pastedNodeIds = result.nodes.map(n => n.id);
      setNodes(
        nodes.map(node => ({
          ...node,
          selected: pastedNodeIds.includes(node.id),
        }))
      );
    }
  }, [handlePaste, saveToHistory, setNodes, nodes]);

  const handleCutWrapper = useCallback(
    (nodesToCut: Node[]) => {
      saveToHistory();
      handleCut(nodesToCut);
    },
    [handleCut, saveToHistory]
  );

  const handleDuplicateWrapper = useCallback(
    (nodesToDuplicate: Node[]) => {
      const nodesBefore = nodes.length;
      saveToHistory();
      handleDuplicate(nodesToDuplicate);

      // After duplication, select the newly created nodes
      // We'll do this in the next render cycle
      setTimeout(() => {
        const nodesAfter = nodes.length;
        if (nodesAfter > nodesBefore) {
          // Select all nodes that were just added
          setNodes(
            nodes.map((node, idx) => ({
              ...node,
              selected: idx >= nodesBefore,
            }))
          );
        }
      }, 0);
    },
    [handleDuplicate, saveToHistory, nodes, setNodes]
  );

  // Use keyboard shortcuts hook
  useKeyboardShortcuts(nodes, edges, {
    handlers: {
      onDeleteSelection: handleDeleteSelection,
      onSelectAll: handleSelectAll,
      onClearSelection: clearSelection,
      onUndo: undo,
      onRedo: redo,
      onCopy: handleCopyWrapper,
      onPaste: handlePasteWrapper,
      onCut: handleCutWrapper,
      onDuplicate: handleDuplicateWrapper,
    },
  });

  return (
    <main
      className={clsx(
        "w-full h-full overflow-hidden bg-whiteOpacity100",
        isPanMode ? "pan-mode-active" : ""
      )}
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        onEdgeClick={onEdgeClick}
        onPaneClick={onPaneClick}
        onNodeContextMenu={onNodeContextMenu}
        onEdgeContextMenu={onEdgeContextMenu}
        onPaneContextMenu={onPaneContextMenu}
        onNodeDragStart={onNodeDragStart}
        onNodeDrag={onNodeDrag}
        onNodeDragStop={onNodeDragStop}
        defaultEdgeOptions={{
          type: "smooth",
          animated: true,
          markerEnd: { type: "arrowclosed" },
        }}
        connectionLineType={ConnectionLineType.Bezier}
        connectionLineComponent={ConnectionLinePreview}
        snapGrid={[15, 15]}
        // snapToGrid={true}
        selectNodesOnDrag={false}
        panOnDrag={isPanMode ? [0, 1, 2] : [1, 2]}
        selectionOnDrag={!isPanMode}
        selectionMode={SelectionMode.Partial}
        nodesDraggable={!isPanMode}
        nodesConnectable={!isPanMode}
        elementsSelectable={!isPanMode}
        edgesReconnectable={!isPanMode}
        reconnectRadius={20}
        minZoom={0.2}
        maxZoom={3}
        zoomOnScroll={!disableZoomOnScroll}
      >
        <Background gap={15} />
      </ReactFlow>
      {/* <MiniMap zoomable pannable nodeClassName={nodeClassName} /> */}
      {showMinimap && (
        <MiniMap
          zoomable
          pannable
          nodeStrokeColor={n => {
            if (n.type === "input") return "#0041d0";
            if (n.type === "selectorNode") return "#3b82f6";
            if (n.type === "output") return "#ff0072";
            return "#000"; // Default stroke color for other node types
          }}
          nodeColor={n => {
            try {
              const { category } = (n as any) || {};
              if (category === "task") return "#24b0fb";
              if (category === "start") return "#39cc7e";
              if (category === "end") return "#ff6262";
              if (category === "gateway") return "#ff9d57";
              return "#fff";
            } catch (_) {
              return "#fff";
            }
          }}
          className="border border-border rounded-lg overflow-hidden"
        />
      )}
      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          context={contextMenu.context}
          onClose={() => setContextMenu(null)}
        />
      )}
    </main>
  );
}

export function Canvas(props: CanvasProps) {
  return <CanvasInner {...props} />;
}
