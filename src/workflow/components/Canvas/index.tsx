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
  MiniMap,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useWorkflowStore } from "@/core/store/workflowStore";
import { edgeRegistry } from "@/core/registry/EdgeRegistry";
import { nodeRegistry } from "@/core/registry/NodeRegistry";
import { validateConnection } from "@/utils/validation";
import { NodeType } from "@/enum/workflow.enum";
import type { ContextMenuContext } from "@/core/types/base.types";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";

// Import node/edge types from workflow
import { nodeTypes as builtInNodeTypes } from "./nodes";
import { CustomNode } from "./nodes/CustomNodes";
import { edgeTypes } from "./edges";
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

  // Handle node changes
  const onNodesChange = useCallback(
    (changes: NodeChange[]) => {
      setNodes(applyNodeChanges(changes, nodes) as any);
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

  // Handle node drag stop
  const onNodeDragStop = useCallback(() => {
    setIsDragging(false);
  }, []);

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
    [screenToFlowPosition, onNodeDrop, isPanMode, onPanModeChange]
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

  // Keyboard shortcuts handlers
  const handleDeleteSelection = useCallback(
    (nodeIds: string[], edgeIds: string[]) => {
      // Save history before deletion
      saveToHistory();

      // Delete nodes
      if (nodeIds.length > 0) {
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

  // Use keyboard shortcuts hook
  useKeyboardShortcuts(nodes, edges, {
    handlers: {
      onDeleteSelection: handleDeleteSelection,
      onSelectAll: handleSelectAll,
      onClearSelection: clearSelection,
      onUndo: undo,
      onRedo: redo,
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
        onNodeDragStop={onNodeDragStop}
        defaultEdgeOptions={{
          type: "smooth",
          animated: true,
          markerEnd: { type: "arrowclosed" },
        }}
        connectionLineType={ConnectionLineType.Bezier}
        snapGrid={[15, 15]}
        snapToGrid={true}
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
        maxZoom={5}
      >
        <Background gap={15} />
      </ReactFlow>
      {showMinimap && (
        <MiniMap
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
          className="fill-transparent border border-border rounded-lg"
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
