/**
 * Hook for workflow import/export functionality
 */

import { useCallback } from "react";
import { useWorkflowStore } from "@/core/store/workflowStore";
import type { BaseNodeConfig, BaseEdgeConfig } from "@/core/types/base.types";
import {
  WorkflowTransformer,
  type MinimalWorkflowData,
} from "@/core/utils/WorkflowTransformer";
import { useLanguage } from "./useLanguage";

export interface WorkflowData {
  nodes: Partial<BaseNodeConfig>[];
  edges: Partial<BaseEdgeConfig>[];
  metadata?: {
    version?: string;
    timestamp?: string;
    [key: string]: unknown;
  };
}

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

  const { currentLanguage } = useLanguage();

  /**
   * View current workflow data (Transformed)
   */
  const viewWorkflow = useCallback(() => {
    const transformed = WorkflowTransformer.exportMinimal(
      nodes,
      edges,
      currentLanguage
    );
    return {
      ...transformed,
      workflowName,
      workflowDescription,
    };
  }, [nodes, edges, workflowName, workflowDescription, currentLanguage]);

  /**
   * Export workflow data as JSON (Transformed)
   */
  const exportWorkflow = useCallback(
    (includeMetadata = true): WorkflowData => {
      const data = WorkflowTransformer.exportMinimal(
        nodes,
        edges,
        currentLanguage
      );

      if (includeMetadata) {
        data.metadata = {
          version: "1.1.0",
          timestamp: new Date().toISOString(),
          workflowName,
          workflowDescription,
        };
      }

      return data as unknown as WorkflowData;
    },
    [nodes, edges, currentLanguage, workflowName, workflowDescription]
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
   * Import workflow data (Hydrated)
   */
  const importWorkflow = useCallback(
    (data: WorkflowData, clearExisting = true) => {
      if (clearExisting) {
        clearWorkflow();
      }

      const { nodes: fullNodes, edges: fullEdges } =
        WorkflowTransformer.importFull(data);

      if (fullNodes) {
        setNodes(fullNodes);
      }

      if (fullEdges) {
        setEdges(fullEdges);
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
