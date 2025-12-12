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
      updateNode(nodeId, {
        visualConfig: { ...(node.visualConfig || {}), ...visualConfig },
        data: {
          ...(node.data || {}),
          visualConfig: { ...(node.data?.visualConfig || {}), ...visualConfig },
        },
      } as Partial<BaseNodeConfig>);
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

      updateNode(nodeId, {
        visualConfig: {
          ...(node.visualConfig || {}),
          borderStyle: borderStyle as any,
        },
        data: {
          ...(node.data || {}),
          visualConfig: {
            ...(node.data?.visualConfig || {}),
            borderStyle: borderStyle as any,
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
  const duplicateNode = useCallback((nodeId: string) => {
    // TODO: Implement node duplication
    console.log("Duplicate node:", nodeId);
  }, []);

  return {
    changeNodeColor,
    changeNodeBorderStyle,
    removeNode,
    toggleNodeCollapse,
    duplicateNode,
  };
}
