/**
 * Hook for workflow import/export functionality
 */

import { useCallback } from "react";
import { useWorkflowStore } from "@/core/store/workflowStore";
import type { BaseNodeConfig, BaseEdgeConfig } from "@/core/types/base.types";
import type { Node, Edge } from "@xyflow/react";

export interface WorkflowData {
  nodes: Node[];
  edges: Edge[];
  metadata?: {
    version?: string;
    timestamp?: string;
    [key: string]: unknown;
  };
}

export function useWorkflowImportExport() {
  const { nodes, edges, setNodes, setEdges, clearWorkflow } =
    useWorkflowStore();

  /**
   * Export workflow data as JSON
   */
  const exportWorkflow = useCallback(
    (includeMetadata = true): WorkflowData => {
      const data: WorkflowData = {
        nodes,
        edges,
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
        setNodes(data.nodes as BaseNodeConfig[]);
      }

      if (data.edges) {
        setEdges(data.edges as BaseEdgeConfig[]);
      }

      return true;
    },
    [setNodes, setEdges, clearWorkflow]
  );

  /**
   * Import workflow from file
   */
  const uploadWorkflow = useCallback(
    (): Promise<WorkflowData> => {
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
    },
    [importWorkflow]
  );

  return {
    exportWorkflow,
    downloadWorkflow,
    importWorkflow,
    uploadWorkflow,
  };
}
