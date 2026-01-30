import type { BaseNodeConfig, BaseEdgeConfig } from "../types/base.types";
import { getRegistryCapabilities } from "../utils/aiUtils";
import {
  GeminiProvider,
  type LLMProvider,
  OpenAIProvider,
} from "./llm/LLMProvider";
import { AIValidationService } from "./AIValidationService";

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

# CAPABILITIES (Available Building Blocks)
## NODES
The following nodes are registered and allowed. YOU MUST ONLY USE THESE NODE TYPES:
${JSON.stringify(capabilities.nodes, null, 2)}

## EDGES
Supported Edge Types: ${JSON.stringify(capabilities.edges, null, 2)}
(Default: "sequence-flow")

# RULES
1.  **Output Format**: Must be a valid JSON object with "nodes" and "edges" arrays.
2.  **Node Structure**:
    - "id": Must be unique. Use format "node_{type}_{random_suffix}" (e.g., "node_task_user_a1b2").
    - "type": Must be one of the CAPABILITIES NODES.
    - "data": { "label": "Human readable name" }.
    - "properties": Key-value pairs matching the node's property definitions.
3.  **Edge Structure**:
    - "id": Unique string (e.g., "edge_1").
    - "source": ID of the source node.
    - "target": ID of the target node.
    - "type": Use "sequence-flow" unless specified otherwise.
4.  **Logical Flow**:
    - Always start with a Start Event.
    - Always end with an End Event.
    - Ensure all nodes are connected.
5.  **Gateways & Conditions**:
    - Exclusive Gateways MUST have outgoing edges with "condition" property.
    - Condition Syntax: Simple JavaScript-like expression (e.g., \`amount > 1000\`, \`status == 'approved'\`).
    - One outgoing edge should be default (no condition or \`true\`).
6.  **Positions**:
    - Ignore layouting. Return { "x": 0, "y": 0 } for all nodes. The system will auto-layout.
7.  **No Markdown**:
    - Return RAW JSON only. Do not wrap in \`\`\`json blocks.

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
        throw new Error(
          "Invalid response structure: Missing nodes or edges array."
        );
      }

      // 5. Validation, Sanitization & Auto-Layout
      const validation = AIValidationService.validateAndEnhanceWorkflow(
        json.nodes,
        json.edges
      );

      if (!validation.valid) {
        throw new Error(
          "Generated workflow failed validation:\n" +
            validation.errors.join("\n")
        );
      }

      return {
        nodes: validation.sanitizedNodes || [],
        edges: validation.sanitizedEdges || [],
      } as AIWorkflowResponse;
    } catch (error: any) {
      console.error("AI Generation Error:", error);
      throw new Error("Failed to generate workflow: " + error.message);
    }
  }
}
