/**
 * Hook for workflow import/export functionality
 */

import { useCallback } from "react";
import { useWorkflowStore } from "@/core/store/workflowStore";
import type { BaseNodeConfig, BaseEdgeConfig } from "@/core/types/base.types";
import type { Node, Edge } from "@xyflow/react";
import { nodeRegistry } from "@/core/registry/NodeRegistry";
import { edgeRegistry } from "@/core/registry/EdgeRegistry";

export interface WorkflowData {
  nodes: Node[];
  edges: Edge[];
  metadata?: {
    version?: string;
    timestamp?: string;
    [key: string]: unknown;
  };
}

/**
 * Sanitize node data for export
 */
const sanitizeNode = (node: any) => {
  const {
    id,
    type,
    nodeType,
    position,
    data,
    properties,
    parentId,
    width,
    height,
    zIndex,
    extent,
    expandParent,
  } = node;

  return {
    id,
    type,
    nodeType,
    position,
    data: {
      label: data?.label,
    },
    properties,
    parentId,
    width,
    height,
    zIndex,
    extent,
    expandParent,
  };
};

/**
 * Sanitize edge data for export
 */
const sanitizeEdge = (edge: any) => {
  const {
    id,
    source,
    target,
    type,
    data,
    properties,
    sourceHandle,
    targetHandle,
    animated,
    label,
  } = edge;

  return {
    id,
    source,
    target,
    type,
    data,
    properties,
    sourceHandle,
    targetHandle,
    animated,
    label,
  };
};

export function useWorkflowImportExport() {
  const {
    nodes,
    edges,
    setNodes,
    setEdges,
    clearWorkflow,
    workflowName,
    workflowDescription,
  } = useWorkflowStore();

  /**
   * View current workflow data
   */
  const viewWorkflow = useCallback(() => {
    return {
      nodes,
      edges,
      workflowName,
      workflowDescription,
    };
  }, [nodes, edges, workflowName, workflowDescription]);

  /**
   * Export workflow data as JSON
   */
  const exportWorkflow = useCallback(
    (includeMetadata = true): WorkflowData => {
      const data: WorkflowData = {
        nodes: nodes.map(sanitizeNode) as any,
        edges: edges.map(sanitizeEdge) as any,
      };

      if (includeMetadata) {
        data.metadata = {
          version: "1.0.0",
          timestamp: new Date().toISOString(),
        };
      }

      return data;
    },
    [nodes, edges]
  );

  /**
   * Export workflow as downloadable JSON file
   */
  const downloadWorkflow = useCallback(
    (filename = "workflow.json") => {
      const data = exportWorkflow();
      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    },
    [exportWorkflow]
  );

  /**
   * Import workflow data
   */
  const importWorkflow = useCallback(
    (data: WorkflowData, clearExisting = true) => {
      if (clearExisting) {
        clearWorkflow();
      }

      if (data.nodes) {
        const rehydratedNodes = data.nodes
          .map(node => {
            const nodeType = (node as any).nodeType || node.type;
            return nodeRegistry.createNode(nodeType, node as any);
          })
          .filter(Boolean) as BaseNodeConfig[];

        setNodes(rehydratedNodes);
      }

      if (data.edges) {
        const rehydratedEdges = data.edges
          .map(edge => {
            const edgeType = (edge as any).type || "default";
            return edgeRegistry.createEdge(
              edgeType,
              edge.source,
              edge.target,
              edge as any
            );
          })
          .filter(Boolean) as BaseEdgeConfig[];

        setEdges(rehydratedEdges);
      }

      return true;
    },
    [setNodes, setEdges, clearWorkflow]
  );

  /**
   * Import workflow from file
   */
  const uploadWorkflow = useCallback((): Promise<WorkflowData> => {
    return new Promise((resolve, reject) => {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = ".json";

      input.onchange = async (e: Event) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (!file) {
          reject(new Error("No file selected"));
          return;
        }

        try {
          const text = await file.text();
          const data = JSON.parse(text) as WorkflowData;
          importWorkflow(data);
          resolve(data);
        } catch (error) {
          reject(error);
        }
      };

      input.click();
    });
  }, [importWorkflow]);

  return {
    viewWorkflow,
    exportWorkflow,
    downloadWorkflow,
    importWorkflow,
    uploadWorkflow,
  };
}
