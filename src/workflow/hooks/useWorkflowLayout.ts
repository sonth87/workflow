/**
 * Hook for workflow layout operations
 */

import { useCallback } from "react";
import { useReactFlow, useUpdateNodeInternals } from "@xyflow/react";
import { useWorkflowStore } from "@/core/store/workflowStore";
import type { BaseNodeConfig } from "@/core/types/base.types";
import { getLayoutedElements } from "../utils/layout";
import type { LayoutDirection } from "../components/Header";

export function useWorkflowLayout() {
  const {
    nodes,
    edges,
    setNodes,
    layoutDirection,
    setLayoutDirection: storeSetLayoutDirection,
    saveToHistory,
  } = useWorkflowStore();
  const { fitView } = useReactFlow();
  const updateNodeInternals = useUpdateNodeInternals();

  /**
   * Change layout direction (horizontal/vertical)
   */
  const setLayoutDirection = useCallback(
    (direction: LayoutDirection) => {
      // Save history before layout change
      saveToHistory();

      storeSetLayoutDirection(direction);

      const { nodes: layoutedNodes } = getLayoutedElements(
        nodes,
        edges,
        direction
      );

      setNodes(layoutedNodes as BaseNodeConfig[]);

      setTimeout(() => {
        layoutedNodes.forEach(n => updateNodeInternals(n.id));
        fitView({ padding: 0.2, duration: 300, maxZoom: 1 });
      }, 100);
    },
    [
      nodes,
      edges,
      setNodes,
      updateNodeInternals,
      fitView,
      saveToHistory,
      storeSetLayoutDirection,
    ]
  );

  /**
   * Apply auto-layout to workflow
   */
  const applyAutoLayout = useCallback(() => {
    saveToHistory();

    const { nodes: layoutedNodes } = getLayoutedElements(
      nodes,
      edges,
      layoutDirection
    );

    setNodes(layoutedNodes as BaseNodeConfig[]);

    setTimeout(() => {
      layoutedNodes.forEach(n => updateNodeInternals(n.id));
      fitView({ padding: 0.2, duration: 300, maxZoom: 1 });
    }, 100);
  }, [
    nodes,
    edges,
    layoutDirection,
    setNodes,
    updateNodeInternals,
    fitView,
    saveToHistory,
  ]);

  /**
   * Fit view to show all nodes
   */
  const fitToView = useCallback(
    (options?: { padding?: number; duration?: number; maxZoom?: number }) => {
      fitView({
        padding: options?.padding ?? 0.2,
        duration: options?.duration ?? 300,
        maxZoom: options?.maxZoom ?? 1,
      });
    },
    [fitView]
  );

  /**
   * Focus on specific node
   */
  const focusNode = useCallback(
    (nodeId: string) => {
      const node = nodes.find(n => n.id === nodeId);
      if (node) {
        fitView({ nodes: [node], duration: 300, padding: 0.3 });
      }
    },
    [nodes, fitView]
  );

  return {
    layoutDirection,
    setLayoutDirection,
    applyAutoLayout,
    fitToView,
    focusNode,
  };
}
