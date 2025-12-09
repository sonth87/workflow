/**
 * Workflow Canvas Component
 * Sử dụng workflowStore và event bus
 */

import { useCallback, useEffect, useState } from "react";
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
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useWorkflowStore } from "@/core/store/workflowStore";
import { edgeRegistry } from "@/core/registry/EdgeRegistry";
import { validateConnection } from "@/utils/validation";
import { NodeType } from "@/enum/workflow.enum";

// Import node/edge types from workflow
import { nodeTypes } from "./nodes";
import { edgeTypes } from "./edges";

interface CanvasProps {
  onNodeDrop?: (nodeType: string, position: { x: number; y: number }) => void;
}

function CanvasInner({ onNodeDrop }: CanvasProps) {
  const {
    nodes,
    edges,
    setNodes,
    setEdges,
    selectNode,
    selectEdge,
    clearSelection,
    addEdge,
  } = useWorkflowStore();
  const { screenToFlowPosition } = useReactFlow();
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
  } | null>(null);

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

  // Handle connection with validation
  const onConnect = useCallback(
    (connection: Connection) => {
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
      const hasCycle = (nodeId: string, visited: Set<string>, recStack: Set<string>): boolean => {
        if (!visited.has(nodeId)) {
          visited.add(nodeId);
          recStack.add(nodeId);

          const neighbors = graph.get(nodeId) || [];
          for (const neighbor of neighbors) {
            if (!visited.has(neighbor) && hasCycle(neighbor, visited, recStack)) {
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
          alert("❌ Cannot create connection: This would create a circular loop in the workflow!");
          return;
        }
      }

      const edge = edgeRegistry.createEdge(
        "default",
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
    [nodes, edges, addEdge]
  );

  // Handle node click
  const onNodeClick = useCallback(
    (_event: React.MouseEvent, node: any) => {
      selectNode(node.id);
    },
    [selectNode]
  );

  // Handle edge click
  const onEdgeClick = useCallback(
    (_event: React.MouseEvent, edge: any) => {
      selectEdge(edge.id);
    },
    [selectEdge]
  );

  // Handle pane click
  const onPaneClick = useCallback(() => {
    clearSelection();
  }, [clearSelection]);

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

      onNodeDrop?.(type, centeredPosition);
    },
    [screenToFlowPosition, onNodeDrop]
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

  return (
    <main
      className="absolute inset-0 w-full h-full overflow-hidden bg-background"
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
        defaultEdgeOptions={{
          type: "smooth",
          animated: true,
          markerEnd: { type: "arrowclosed" },
        }}
        connectionLineType={ConnectionLineType.SmoothStep}
        snapGrid={[15, 15]}
        selectNodesOnDrag={false}
        panOnDrag={[1, 2]}
        selectionOnDrag
        selectionMode={SelectionMode.Partial}
        reconnectRadius={20}
        minZoom={0.2}
        maxZoom={3}
        onPaneContextMenu={e => {
          e.preventDefault();
          setContextMenu({
            x: e.clientX,
            y: e.clientY,
          });
        }}
      >
        <Background gap={15} />
      </ReactFlow>
      {contextMenu && (
        <div
          onClick={e => e.stopPropagation()}
          style={{
            position: "fixed",
            top: contextMenu.y,
            left: contextMenu.x,
            background: "var(--card)",
            border: "1px solid var(--border)",
            padding: 8,
            borderRadius: 6,
            zIndex: 999,
          }}
        >
          <div className="text-sm">Context Menu</div>
        </div>
      )}
    </main>
  );
}

export function Canvas(props: CanvasProps) {
  return <CanvasInner {...props} />;
}
