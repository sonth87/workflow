/**
 * Custom hooks for workflow
 */

import { useCallback, useEffect } from "react";
import { useWorkflowStore } from "@/core/store/workflowStore";
import { nodeRegistry } from "@/core/registry/NodeRegistry";
import { edgeRegistry } from "@/core/registry/EdgeRegistry";
import { validationEngine } from "@/core/validation/ValidationEngine";
import { globalEventBus, type WorkflowEventType } from "@/core/events/EventBus";
import type { BaseNodeConfig, BaseEdgeConfig } from "@/core/types/base.types";
import { Position } from "@xyflow/react";

/**
 * Hook để handle node operations
 */
export function useNodeOperations() {
  const { addNode, updateNode, deleteNode, nodes, layoutDirection } =
    useWorkflowStore();

  const createNode = useCallback(
    (
      nodeType: string,
      position: { x: number; y: number },
      properties?: Record<string, unknown>
    ) => {
      const layoutHorizontal = layoutDirection === "horizontal";
      const node = nodeRegistry.createNode(nodeType, {
        position,
        targetPosition: layoutHorizontal ? Position.Left : Position.Top,
        sourcePosition: layoutHorizontal ? Position.Right : Position.Bottom,
        properties: properties || {},
      });

      if (node) {
        addNode(node);
        return node;
      }
      return null;
    },
    [addNode, layoutDirection]
  );

  const updateNodeProperties = useCallback(
    (nodeId: string, properties: Record<string, unknown>) => {
      const node = nodes.find(n => n.id === nodeId);
      if (node) {
        updateNode(nodeId, {
          properties: {
            ...node.properties,
            ...properties,
          },
        });
      }
    },
    [nodes, updateNode]
  );

  return {
    createNode,
    updateNodeProperties,
    deleteNode,
  };
}

/**
 * Hook để handle edge operations
 */
export function useEdgeOperations() {
  const { addEdge, updateEdge, deleteEdge } = useWorkflowStore();

  const createEdge = useCallback(
    (source: string, target: string, edgeType: string = "sequence-flow") => {
      const edge = edgeRegistry.createEdge(edgeType, source, target);

      if (edge) {
        addEdge(edge);
        return edge;
      }
      return null;
    },
    [addEdge]
  );

  return {
    createEdge,
    updateEdge,
    deleteEdge,
  };
}

/**
 * Hook để handle validation
 */
export function useWorkflowValidation() {
  const { nodes, edges, setValidationErrors, validationErrors } =
    useWorkflowStore();

  const validate = useCallback(async () => {
    const result = await validationEngine.validateWorkflow(
      nodes as BaseNodeConfig[],
      edges as BaseEdgeConfig[]
    );

    setValidationErrors(result.errors);
    return result;
  }, [nodes, edges, setValidationErrors]);

  const validateNode = useCallback(
    async (nodeId: string) => {
      const node = nodes.find(n => n.id === nodeId);
      if (node) {
        const result = await validationEngine.validateNode(
          node as BaseNodeConfig
        );
        return result;
      }
      return { valid: true, errors: [], warnings: [] };
    },
    [nodes]
  );

  return {
    validate,
    validateNode,
    validationErrors,
    hasErrors: validationErrors.length > 0,
  };
}

/**
 * Hook để listen workflow events
 */
export function useWorkflowEvents(
  eventType: WorkflowEventType,
  handler: (event: any) => void,
  deps: any[] = []
) {
  useEffect(() => {
    const subscription = globalEventBus.on(eventType, handler);
    return () => subscription.unsubscribe();
  }, [eventType, ...deps]);
}

/**
 * Hook để get available node types
 */
export function useAvailableNodes() {
  const nodeTypes = nodeRegistry.getAll();

  const getNodesByCategory = useCallback((category: string) => {
    return nodeRegistry.getByCategory(category);
  }, []);

  return {
    nodeTypes,
    getNodesByCategory,
  };
}
