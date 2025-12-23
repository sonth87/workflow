/**
 * useNodeActions Hook
 * Provides actions for updating node properties
 */

import { useCallback } from "react";
import { useWorkflowStore } from "@/core/store/workflowStore";
import type { BaseNodeConfig } from "@/core/types/base.types";
import { paletteToNodeVisualConfig } from "@/core/utils/contextMenuHelpers";

export function useNodeActions() {
  const { nodes, updateNode, deleteNode } = useWorkflowStore();

  /**
   * Change node color palette
   */
  const changeNodeColor = useCallback(
    (nodeId: string, paletteId: string) => {
      const node = nodes.find(n => n.id === nodeId);
      if (!node) return;

      const visualConfig = paletteToNodeVisualConfig(paletteId);

      // If resetting (empty paletteId), remove undefined values to reset to defaults
      if (!paletteId) {
        updateNode(nodeId, {
          visualConfig: undefined,
          data: {
            ...(node.data || {}),
            visualConfig: undefined,
          },
        } as Partial<BaseNodeConfig>);
      } else {
        updateNode(nodeId, {
          visualConfig: { ...(node.visualConfig || {}), ...visualConfig },
          data: {
            ...(node.data || {}),
            visualConfig: {
              ...(node.data?.visualConfig || {}),
              ...visualConfig,
            },
          },
        } as Partial<BaseNodeConfig>);
      }
    },
    [nodes, updateNode]
  );

  /**
   * Change node border style
   */
  const changeNodeBorderStyle = useCallback(
    (nodeId: string, borderStyle: string) => {
      const node = nodes.find(n => n.id === nodeId);
      if (!node) return;

      // For double border style, ensure borderWidth is at least 3px
      const nodeData = node.data as BaseNodeConfig | undefined;
      const currentBorderWidth =
        node.visualConfig?.borderWidth ??
        nodeData?.visualConfig?.borderWidth ??
        2;
      const adjustedBorderWidth =
        borderStyle === "double" && currentBorderWidth < 4
          ? 4
          : currentBorderWidth;

      updateNode(nodeId, {
        visualConfig: {
          ...(node.visualConfig || {}),
          borderStyle: borderStyle as any,
          borderWidth: adjustedBorderWidth,
        },
        data: {
          ...(node.data || {}),
          visualConfig: {
            ...(node.data?.visualConfig || {}),
            borderStyle: borderStyle as any,
            borderWidth: adjustedBorderWidth,
          },
        },
      } as Partial<BaseNodeConfig>);
    },
    [nodes, updateNode]
  );

  /**
   * Delete a node
   */
  const removeNode = useCallback(
    (nodeId: string) => {
      deleteNode(nodeId);
    },
    [deleteNode]
  );

  /**
   * Toggle node collapse state
   */
  const toggleNodeCollapse = useCallback(
    (nodeId: string, collapsed: boolean) => {
      updateNode(nodeId, {
        collapsed,
      } as Partial<BaseNodeConfig>);
    },
    [updateNode]
  );

  /**
   * Duplicate a node
   */
  const duplicateNode = useCallback(
    (nodeId: string) => {
      const node = nodes.find(n => n.id === nodeId);
      if (!node) return;

      // Generate new unique ID
      const newId = `${node.type}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

      // Clone the node with new ID and offset position
      const duplicatedNode: BaseNodeConfig = {
        ...node,
        id: newId,
        position: {
          x: node.position.x + 50, // Offset by 50px to the right
          y: node.position.y + 50, // Offset by 50px down
        },
        // Update metadata if exists
        metadata: {
          ...node.metadata,
          id: newId,
          title: `${node.metadata.title} (Copy)`,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        // Clone data deeply
        data: node.data ? JSON.parse(JSON.stringify(node.data)) : undefined,
        // Reset selection state
        selected: false,
      };

      // Add the duplicated node to the store
      const { addNode } = useWorkflowStore.getState();
      addNode(duplicatedNode);
    },
    [nodes]
  );

  return {
    changeNodeColor,
    changeNodeBorderStyle,
    removeNode,
    toggleNodeCollapse,
    duplicateNode,
  };
}
