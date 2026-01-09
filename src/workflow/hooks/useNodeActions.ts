/**
 * useNodeActions Hook
 * Provides actions for updating node properties
 */

import { useCallback } from "react";
import { useWorkflowStore } from "@/core/store/workflowStore";
import type { BaseNodeConfig } from "@/core/types/base.types";
import { paletteToNodeVisualConfig } from "@/core/utils/contextMenuHelpers";
import { createDuplicatedNode } from "@/utils/nodeDuplication";

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

      // Create duplicated node
      const duplicatedNode = createDuplicatedNode(node, 30, 30, true);

      // Add the duplicated node to the store
      const { addNode } = useWorkflowStore.getState();
      addNode(duplicatedNode);
    },
    [nodes]
  );

  /**
   * Update node data
   */
  const updateNodeData = useCallback(
    (nodeId: string, dataUpdates: Record<string, any>) => {
      const node = nodes.find(n => n.id === nodeId);
      if (!node) return;

      updateNode(nodeId, {
        data: {
          ...(node.data || {}),
          ...dataUpdates,
        },
      } as Partial<BaseNodeConfig>);
    },
    [nodes, updateNode]
  );

  return {
    changeNodeColor,
    changeNodeBorderStyle,
    removeNode,
    toggleNodeCollapse,
    duplicateNode,
    updateNodeData,
  };
}
