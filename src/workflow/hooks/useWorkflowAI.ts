import { AIService } from "../../core/services/AIService";
import { useWorkflowStore } from "../../core/store/workflowStore";
import { useCallback } from "react";

export interface AIConfig {
  apiKey: string;
  provider: "openai" | "gemini";
}

export function useWorkflowAI() {
  const { setNodes, setEdges } = useWorkflowStore();

  /**
   * Configure the AI Service with API Key and Provider
   */
  const configureAI = useCallback((config: AIConfig) => {
    AIService.configure(config);
  }, []);

  /**
   * Generate a workflow from a text prompt.
   * Optionally configures the service if config is provided.
   */
  const generateWorkflow = useCallback(
    async (prompt: string, config?: AIConfig) => {
      if (config) {
        AIService.configure(config);
      }

      try {
        const { nodes, edges } = await AIService.generateWorkflow(prompt);

        // Update store
        setNodes(nodes);
        setEdges(edges);

        return { success: true, nodes, edges };
      } catch (error: any) {
        console.error("Workflow AI Generation Failed:", error);
        throw error;
      }
    },
    [setNodes, setEdges]
  );

  return {
    configureAI,
    generateWorkflow,
  };
}
