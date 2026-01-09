/**
 * useClipboard Hook
 * Handle copy/paste/cut operations for workflow nodes
 */

import { useCallback, useRef } from "react";
import { useReactFlow, type Node, type Edge } from "@xyflow/react";
import { useWorkflowStore } from "@/core/store/workflowStore";
import type { BaseNodeConfig, BaseEdgeConfig } from "@/core/types/base.types";
import { createDuplicatedNode, generateId } from "@/utils/nodeDuplication";

/**
 * Converts ReactFlow nodes to base node config for storage
 */
function nodesToConfig(nodes: Node[]): BaseNodeConfig[] {
  return nodes.map(node => {
    const nodeMeta =
      ((node as Record<string, unknown>).metadata as
        | Record<string, unknown>
        | undefined) || {};
    return {
      id: node.id,
      type: node.type || "default",
      position: node.position,
      data: node.data || {},
      metadata: {
        id: (nodeMeta.id as string) || node.id,
        title: (nodeMeta.title as string) || `Node ${node.id}`,
        description: nodeMeta.description as string | undefined,
        version: nodeMeta.version as string | undefined,
        author: nodeMeta.author as string | undefined,
        createdAt: nodeMeta.createdAt as Date | undefined,
        updatedAt: nodeMeta.updatedAt as Date | undefined,
        tags: nodeMeta.tags as string[] | undefined,
      },
      nodeType: node.type || "default",
      category: "custom",
      selected: false,
      zIndex: node.zIndex || 0,
    } as BaseNodeConfig;
  });
}

/**
 * Converts ReactFlow edges to base edge config for storage
 */
function edgesToConfig(edges: Edge[]): BaseEdgeConfig[] {
  return edges.map(edge => {
    const edgeMeta =
      ((edge as Record<string, unknown>).metadata as
        | Record<string, unknown>
        | undefined) || {};
    return {
      id: edge.id,
      source: edge.source,
      target: edge.target,
      type: edge.type || "default",
      data: edge.data || {},
      metadata: {
        id: (edgeMeta.id as string) || edge.id,
        title: (edgeMeta.title as string) || `Edge ${edge.id}`,
        description: edgeMeta.description as string | undefined,
        version: edgeMeta.version as string | undefined,
        author: edgeMeta.author as string | undefined,
        createdAt: edgeMeta.createdAt as Date | undefined,
        updatedAt: edgeMeta.updatedAt as Date | undefined,
        tags: edgeMeta.tags as string[] | undefined,
      },
      pathType: "default",
      selected: false,
    } as BaseEdgeConfig;
  });
}

/**
 * Hook for clipboard operations
 */
export function useClipboard() {
  const { getNodes, setNodes, getEdges, setEdges } = useReactFlow();
  const { copyNodesToClipboard, getClipboard } = useWorkflowStore();

  // Track the last pasted node positions to calculate offset for next paste
  const lastPastedPositionsRef = useRef<Map<
    string,
    { x: number; y: number }
  > | null>(null);

  /**
   * Copy selected nodes to clipboard
   */
  const handleCopy = useCallback(
    (nodesToCopy: Node[]) => {
      if (nodesToCopy.length === 0) return;

      // Get all current edges
      const currentEdges = getEdges();

      // Find edges connected to selected nodes
      const relatedEdges = currentEdges.filter(
        edge =>
          nodesToCopy.some(node => node.id === edge.source) ||
          nodesToCopy.some(node => node.id === edge.target)
      );

      // Convert to config format for storage
      const nodeConfigs = nodesToConfig(nodesToCopy);
      const edgeConfigs = edgesToConfig(relatedEdges);

      // Save to clipboard
      copyNodesToClipboard(nodeConfigs, edgeConfigs);

      // Reset last pasted positions when copying new nodes
      lastPastedPositionsRef.current = null;

      console.warn("✅ Copied to clipboard:", nodesToCopy.length, "nodes");
    },
    [getEdges, copyNodesToClipboard]
  );

  /**
   * Paste nodes from clipboard
   */
  const handlePaste = useCallback(() => {
    const clipboard = getClipboard();
    if (!clipboard || clipboard.nodes.length === 0) {
      console.warn("⚠️ Clipboard is empty");
      return { nodes: [], edges: [] };
    }

    const currentNodes = getNodes();
    const currentEdges = getEdges();

    // Create ID map for new nodes (old ID -> new ID)
    const idMap = new Map<string, string>();
    clipboard.nodes.forEach(node => {
      const nodeType = node.type || "node";
      idMap.set(node.id, generateId(nodeType));
    });

    // Create new nodes with offset position
    const offset = 30;
    let offsetX = offset;
    let offsetY = offset;

    // If we have a record of the last pasted positions, calculate offset from there
    // This ensures multiple pastes don't overlap
    if (
      lastPastedPositionsRef.current &&
      lastPastedPositionsRef.current.size > 0
    ) {
      // Get the first node's position from last paste
      const lastFirstNode = Array.from(
        lastPastedPositionsRef.current.values()
      )[0];
      // Get the first node in current clipboard
      const firstClipboardNode = clipboard.nodes[0];

      if (lastFirstNode && firstClipboardNode) {
        // Calculate the offset that was applied in the last paste
        const lastAppliedOffsetX =
          lastFirstNode.x - firstClipboardNode.position.x;
        const lastAppliedOffsetY =
          lastFirstNode.y - firstClipboardNode.position.y;

        // For next paste, add additional offset to the last paste position
        offsetX = lastAppliedOffsetX + offset;
        offsetY = lastAppliedOffsetY + offset;
      }
    }

    const pastedNodes: Node[] = clipboard.nodes.map(node => {
      const newId = idMap.get(node.id);
      if (!newId) {
        throw new Error("Failed to generate new ID for pasted node");
      }
      return createDuplicatedNode(node, offsetX, offsetY, true, newId) as Node;
    });

    // Create new edges with remapped source/target
    const pastedEdges: Edge[] = clipboard.edges
      .filter(edge => {
        const hasSource = idMap.has(edge.source);
        const hasTarget = idMap.has(edge.target);
        return hasSource && hasTarget;
      })
      .map(edge => {
        const newSourceId = idMap.get(edge.source);
        const newTargetId = idMap.get(edge.target);
        if (!newSourceId || !newTargetId) {
          throw new Error("Failed to generate new IDs for pasted edge");
        }

        return {
          id: generateId("edge"),
          source: newSourceId,
          target: newTargetId,
          type: edge.type,
          data: { ...edge.data },
          selected: false,
        } as Edge;
      });

    // Store the new positions for the next paste
    lastPastedPositionsRef.current = new Map(
      pastedNodes.map(node => [
        node.id,
        { x: node.position.x, y: node.position.y },
      ])
    );

    // Update nodes and edges
    setNodes([...currentNodes, ...pastedNodes]);
    setEdges([...currentEdges, ...pastedEdges]);

    console.warn("✅ Pasted from clipboard:", pastedNodes.length, "nodes");

    return { nodes: pastedNodes, edges: pastedEdges };
  }, [getClipboard, getNodes, getEdges, setNodes, setEdges]);

  /**
   * Cut selected nodes (copy + delete)
   */
  const handleCut = useCallback(
    (nodesToCut: Node[]) => {
      if (nodesToCut.length === 0) return;

      // First copy to clipboard
      handleCopy(nodesToCut);

      // Then delete the nodes
      const currentNodes = getNodes();
      const currentEdges = getEdges();

      const nodeIdsToDelete = nodesToCut.map(n => n.id);

      const newNodes = currentNodes.filter(
        node => !nodeIdsToDelete.includes(node.id)
      );
      const newEdges = currentEdges.filter(
        edge =>
          !nodeIdsToDelete.includes(edge.source) &&
          !nodeIdsToDelete.includes(edge.target)
      );

      setNodes(newNodes);
      setEdges(newEdges);

      console.warn("✅ Cut to clipboard:", nodesToCut.length, "nodes");
    },
    [handleCopy, getNodes, getEdges, setNodes, setEdges]
  );

  /**
   * Duplicate selected nodes
   */
  const handleDuplicate = useCallback(
    (nodesToDuplicate: Node[]) => {
      if (nodesToDuplicate.length === 0) return;

      // Copy to clipboard
      handleCopy(nodesToDuplicate);

      // Paste from clipboard
      handlePaste();
    },
    [handleCopy, handlePaste]
  );

  return {
    handleCopy,
    handlePaste,
    handleCut,
    handleDuplicate,
    hasClipboardContent: getClipboard() !== null,
  };
}
