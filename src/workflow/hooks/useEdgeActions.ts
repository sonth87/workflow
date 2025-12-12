/**
 * useEdgeActions Hook
 * Provides actions for updating edge properties
 */

import { useCallback } from "react";
import { useWorkflowStore } from "@/core/store/workflowStore";
import type { BaseEdgeConfig } from "@/core/types/base.types";
import { paletteToEdgeVisualConfig } from "@/core/utils/contextMenuHelpers";

export function useEdgeActions() {
  const { edges, updateEdge, deleteEdge } = useWorkflowStore();

  /**
   * Change edge color palette
   */
  const changeEdgeColor = useCallback(
    (edgeId: string, paletteId: string) => {
      const edge = edges.find(e => e.id === edgeId);
      if (!edge) return;

      const visualConfig = paletteToEdgeVisualConfig(paletteId);
      updateEdge(edgeId, {
        visualConfig: { ...(edge.visualConfig || {}), ...visualConfig },
        data: {
          ...(edge.data || {}),
          visualConfig: { ...(edge.data?.visualConfig || {}), ...visualConfig },
        },
      } as Partial<BaseEdgeConfig>);
    },
    [edges, updateEdge]
  );

  /**
   * Change edge rendering type (smooth, straight, bezier, etc.)
   */
  const changeEdgeType = useCallback(
    (edgeId: string, edgeType: string) => {
      const edge = edges.find(e => e.id === edgeId);
      if (!edge) return;

      updateEdge(edgeId, {
        edgeType: edgeType as any,
        properties: { ...(edge.properties || {}), edgeType },
        data: { ...(edge.data || {}), edgeType },
      } as Partial<BaseEdgeConfig>);
    },
    [edges, updateEdge]
  );

  /**
   * Change edge path style (solid, dashed, dotted)
   */
  const changeEdgePathStyle = useCallback(
    (edgeId: string, pathStyle: string) => {
      const edge = edges.find(e => e.id === edgeId);
      if (!edge) return;

      updateEdge(edgeId, {
        pathStyle: pathStyle as any,
        properties: { ...(edge.properties || {}), pathStyle },
        data: { ...(edge.data || {}), pathStyle },
      } as Partial<BaseEdgeConfig>);
    },
    [edges, updateEdge]
  );

  /**
   * Delete an edge
   */
  const removeEdge = useCallback(
    (edgeId: string) => {
      deleteEdge(edgeId);
    },
    [deleteEdge]
  );

  return {
    changeEdgeColor,
    changeEdgeType,
    changeEdgePathStyle,
    removeEdge,
  };
}
