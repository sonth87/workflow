/**
 * useEdgeActions Hook
 * Provides actions for updating edge properties
 */

import { useCallback } from "react";
import { useWorkflowStore } from "@/core/store/workflowStore";
import type { BaseEdgeConfig, EdgeLabel } from "@/core/types/base.types";
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

      // If resetting (empty paletteId), remove visualConfig to reset to defaults
      if (!paletteId) {
        updateEdge(edgeId, {
          visualConfig: undefined,
          data: {
            ...(edge.data || {}),
            visualConfig: undefined,
          },
        } as Partial<BaseEdgeConfig>);
      } else {
        updateEdge(edgeId, {
          visualConfig: { ...(edge.visualConfig || {}), ...visualConfig },
          data: {
            ...(edge.data || {}),
            visualConfig: {
              ...(edge.data?.visualConfig || {}),
              ...visualConfig,
            },
          },
        } as Partial<BaseEdgeConfig>);
      }
    },
    [edges, updateEdge]
  );

  /**
   * Change edge path rendering type (bezier, straight, step)
   */
  const changePathType = useCallback(
    (edgeId: string, pathType: string) => {
      const edge = edges.find(e => e.id === edgeId);
      if (!edge) return;

      updateEdge(edgeId, {
        pathType: pathType as any,
        properties: { ...(edge.properties || {}), pathType },
        data: { ...(edge.data || {}), pathType },
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
   * Change edge animation
   */
  const changeEdgeAnimation = useCallback(
    (edgeId: string, animated: boolean) => {
      const edge = edges.find(e => e.id === edgeId);
      if (!edge) return;

      updateEdge(edgeId, {
        animated,
        visualConfig: {
          ...(edge.visualConfig || {}),
          animated,
        },
        data: {
          ...(edge.data || {}),
          animated,
          visualConfig: {
            ...(edge.data?.visualConfig || {}),
            animated,
          },
        },
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

  /**
   * Add label to edge at specific position
   */
  const addEdgeLabel = useCallback(
    (edgeId: string, position: "start" | "center" | "end") => {
      const edge = edges.find(e => e.id === edgeId);
      if (!edge) return;

      const existingLabels = (edge.labels as EdgeLabel[]) || [];
      const hasLabelAtPosition = existingLabels.some(
        l => l.position === position
      );

      // If label already exists at this position, select the edge to show properties panel
      if (hasLabelAtPosition) {
        // The user can edit it in properties panel
        return;
      }

      // Add new label with placeholder text
      const newLabel: EdgeLabel = {
        text: `${position.charAt(0).toUpperCase() + position.slice(1)} Label`,
        position,
      };

      updateEdge(edgeId, {
        labels: [...existingLabels, newLabel],
        data: {
          ...(edge.data || {}),
          labels: [...existingLabels, newLabel],
        },
      } as Partial<BaseEdgeConfig>);
    },
    [edges, updateEdge]
  );

  return {
    changeEdgeColor,
    changePathType,
    changeEdgePathStyle,
    changeEdgeAnimation,
    addEdgeLabel,
    removeEdge,
  };
}
