import type { BaseNodeConfig, BaseEdgeConfig } from "../types/base.types";
import { getRegistryCapabilities } from "../utils/aiUtils";
import { GeminiProvider, type LLMProvider, OpenAIProvider } from "./llm/LLMProvider";

// Mock response interface
interface AIWorkflowResponse {
  nodes: BaseNodeConfig[];
  edges: BaseEdgeConfig[];
}

export interface AIConfig {
  apiKey: string;
  provider: "openai" | "gemini";
}

export class AIService {
  private static config: AIConfig | null = null;
  private static provider: LLMProvider | null = null;

  static configure(config: AIConfig) {
    this.config = config;
    if (config.provider === "openai") {
      this.provider = new OpenAIProvider(config.apiKey);
    } else {
      this.provider = new GeminiProvider(config.apiKey);
    }
  }

  /**
   * Generates a workflow based on the user prompt.
   */
  static async generateWorkflow(prompt: string): Promise<AIWorkflowResponse> {
    if (!this.provider) {
      throw new Error("AI Service not configured. Please set API Key.");
    }

    // 1. Get capabilities (context for AI)
    const capabilities = getRegistryCapabilities();

    // 2. Construct System Prompt
    const systemPrompt = `
You are a BPMN Workflow Generator Expert.
Your task is to generate a valid BPMN 2.0 workflow JSON based on the user's request.

# CAPABILITIES (Available Nodes)
The following nodes are registered in the system. YOU MUST ONLY USE THESE NODE TYPES.
${JSON.stringify(capabilities.nodes, null, 2)}

# RULES
1.  Output MUST be a valid JSON object with "nodes" and "edges" arrays.
2.  Each Node MUST have: "id", "type" (from CAPABILITIES), "position" ({x, y}), "data" ({label}), and "properties".
3.  Each Edge MUST have: "id", "source", "target", "type" (usually "sequence-flow").
4.  Ensure logical flow: Start Event -> Tasks/Gateways -> End Event.
5.  Positioning: Arrange nodes logically from Left to Right. Incremement X by 200 for each step.
6.  Gateways: Exclusive Gateways should have multiple outgoing edges with "condition" property in properties.
7.  Do NOT wrap the output in Markdown code blocks (like \`\`\`json). Return raw JSON.

# RESPONSE FORMAT
{
  "nodes": [ ... ],
  "edges": [ ... ]
}
`;

    // 3. Call LLM
    try {
        console.log("Sending prompt to AI:", prompt);
        const response = await this.provider.generate(prompt, systemPrompt);

        // 4. Clean and Parse JSON
        let content = response.content.trim();
        // Remove markdown formatting if present
        if (content.startsWith("```json")) {
            content = content.replace(/^```json/, "").replace(/```$/, "");
        } else if (content.startsWith("```")) {
            content = content.replace(/^```/, "").replace(/```$/, "");
        }

        const json = JSON.parse(content);

        // Basic structure check
        if (!Array.isArray(json.nodes) || !Array.isArray(json.edges)) {
            throw new Error("Invalid response structure: Missing nodes or edges array.");
        }

        // 5. Semantic Validation
        const { validateGeneratedWorkflow } = await import("../utils/aiUtils");
        const validation = validateGeneratedWorkflow(json.nodes, json.edges);

        if (!validation.valid) {
             throw new Error("Generated workflow failed validation:\n" + validation.errors.join("\n"));
        }

        return json as AIWorkflowResponse;

    } catch (error: any) {
        console.error("AI Generation Error:", error);
        throw new Error("Failed to generate workflow: " + error.message);
    }
  }
}
