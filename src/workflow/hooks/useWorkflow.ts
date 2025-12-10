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

/**
 * Hook để handle node operations
 */
export function useNodeOperations() {
  const { addNode, updateNode, deleteNode, nodes } = useWorkflowStore();

  const createNode = useCallback(
    (
      nodeType: string,
      position: { x: number; y: number },
      properties?: Record<string, unknown>
    ) => {
      const node = nodeRegistry.createNode(nodeType, {
        position,
        properties: properties || {},
      });

      if (node) {
        addNode(node);
        return node;
      }
      return null;
    },
    [addNode]
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
    (source: string, target: string, edgeType: string = "default") => {
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

/**
 * Hook để handle workflow import/export
 */
export function useWorkflowImportExport() {
  const { nodes, edges, workflowName, workflowDescription, loadWorkflow } =
    useWorkflowStore();

  /**
   * Export workflow to JSON file
   */
  const exportWorkflow = useCallback(() => {
    const workflowData = {
      version: "1.0.0",
      metadata: {
        name: workflowName,
        description: workflowDescription,
        exportedAt: new Date().toISOString(),
      },
      nodes,
      edges,
    };

    const jsonString = JSON.stringify(workflowData, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `${workflowName.replace(/\s+/g, "_")}_${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    globalEventBus.emit("workflow:exported", {
      name: workflowName,
      nodesCount: nodes.length,
      edgesCount: edges.length,
    });
  }, [nodes, edges, workflowName, workflowDescription]);

  /**
   * Import workflow from JSON file
   */
  const importWorkflow = useCallback(() => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";

    input.onchange = async (e: Event) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      try {
        const text = await file.text();
        const workflowData = JSON.parse(text);

        // Validate workflow data structure
        if (!workflowData.nodes || !workflowData.edges) {
          throw new Error("Invalid workflow file: missing nodes or edges data");
        }

        // Load workflow
        loadWorkflow({
          workflowName: workflowData.metadata?.name || "Imported Workflow",
          workflowDescription:
            workflowData.metadata?.description || "Imported from file",
          nodes: workflowData.nodes,
          edges: workflowData.edges,
        });

        globalEventBus.emit("workflow:imported", {
          name: workflowData.metadata?.name,
          nodesCount: workflowData.nodes.length,
          edgesCount: workflowData.edges.length,
        });
      } catch (error) {
        console.error("Failed to import workflow:", error);
        globalEventBus.emit("validation:error", {
          message:
            error instanceof Error
              ? error.message
              : "Failed to import workflow",
        });
      }
    };

    input.click();
  }, [loadWorkflow]);

  return {
    exportWorkflow,
    importWorkflow,
  };
}
