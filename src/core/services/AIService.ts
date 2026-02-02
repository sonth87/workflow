import type { BaseNodeConfig, BaseEdgeConfig } from "../types/base.types";
import { getRegistryCapabilities } from "../utils/aiUtils";
import {
  GeminiProvider,
  type LLMProvider,
  OpenAIProvider,
} from "./llm/LLMProvider";
import { AIValidationService } from "./AIValidationService";
import { generateComprehensiveDocumentation } from "../utils/generateAIDocumentation";

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

    // 2. Construct Enhanced System Prompt with Schema Details
    const systemPrompt = this.buildSystemPrompt(capabilities);

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

  /**
   * Build comprehensive system prompt with schema details
   */
  private static buildSystemPrompt(capabilities: any): string {
    return `
You are a BPMN Workflow Generator Expert.
Your task is to generate a valid BPMN 2.0 workflow JSON based on the user's request.

# OUTPUT STRUCTURE

You MUST return a JSON object matching this EXACT schema:

{
  "workflowName": "string (descriptive workflow name)",
  "workflowDescription": "string (optional brief description)",
  "nodes": [ /* array of node objects */ ],
  "edges": [ /* array of edge objects */ ]
}

## NODE STRUCTURE

Each node in the "nodes" array MUST have this exact structure:

{
  "id": "string (unique, format: nodeType-timestamp, e.g., 'taskDefault-1234567890')",
  "type": "string (MUST be one of the AVAILABLE NODE TYPES below)",
  "nodeType": "string (MUST match 'type' field exactly)",
  "position": {
    "x": 0,  // Always set to 0, system will auto-layout
    "y": 0   // Always set to 0, system will auto-layout
  },
  "data": {
    "label": "string (REQUIRED - concise, human-readable name for this node)",
    "title": "string (REQUIRED - display title, usually the node type in readable form)",
    "description": "string (REQUIRED - detailed explanation of what happens at this step)"
  },
  "properties": {
    "label": "string (REQUIRED - COPY value from data.label)",
    "title": "string (REQUIRED - COPY value from data.title)",
    "description": "string (REQUIRED - COPY value from data.description)"
  }
}

CRITICAL for nodes:
- id, type, nodeType, position, data.label, data.title, data.description are REQUIRED
- properties.label, properties.title, properties.description are REQUIRED
- properties object MUST COPY values from data object: set properties.title = data.title, properties.description = data.description, etc.
- type MUST equal nodeType (both must be exactly the same value)

## SPECIAL NODE STRUCTURES

### NOTE NODE
Notes are used to document and explain the workflow. They are standalone (no edge connections required).

Structure:
{
  "id": "note-timestamp",
  "type": "note",
  "nodeType": "note",
  "position": { "x": 0, "y": 0 },
  "data": {
    "label": "string (brief label)",
    "title": "string (note title)",
    "description": "string (brief description)",
    "content": "string (MARKDOWN formatted content - this is the main note text)",
    "color": "string (OPTIONAL - background color: 'blue', 'green', 'yellow', 'red', 'purple', 'gray')",
    "fontSize": "string (OPTIONAL - text size: 'xs', 'sm', 'base', 'lg', 'xl')"
  },
  "properties": {
    "label": "string (COPY from data.label)",
    "description": "string (COPY from data.description)"
  },
  "width": 300,
  "height": 200,
  "zIndex": -1
}

**When to use Notes:**
- ALWAYS include at least one note at the beginning describing the overall workflow purpose
- Add notes to explain complex gateway conditions or business rules
- Use markdown formatting in content field for rich documentation
- Set appropriate color to categorize notes (e.g., blue for info, yellow for warnings)

Example Note:
{
  "id": "note-1234567890",
  "type": "note",
  "nodeType": "note",
  "position": { "x": 0, "y": 0 },
  "data": {
    "label": "Workflow Overview",
    "title": "Workflow Description",
    "description": "Overview of the parking lot entry workflow",
    "content": "## Parking Lot Entry Workflow\\n\\nThis workflow handles:\\n- Vehicle entry validation\\n- Available spot checking\\n- Gate control automation\\n\\n**Key Logic:**\\n- System checks availableSpots > 0\\n- Valid tickets open the gate\\n- Invalid tickets are logged",
    "color": "yellow",
    "fontSize": "sm"
  },
  "properties": {
    "label": "Workflow Overview",
    "description": "Overview of the parking lot entry workflow"
  },
  "width": 400,
  "height": 300,
  "zIndex": -1
}

### ANNOTATION NODE
Annotations are small callouts with arrows pointing to specific elements. They have no background, only text with an arrow.

Structure:
{
  "id": "annotation-timestamp",
  "type": "annotation",
  "nodeType": "annotation",
  "position": { "x": 0, "y": 0 },
  "data": {
    "label": "string (brief label)",
    "title": "string (annotation title)",
    "description": "string (brief description)",
    "content": "string (MARKDOWN formatted annotation text)",
    "textColor": "string (OPTIONAL - text color: 'red', 'green', 'blue', 'yellow', 'purple', 'gray')",
    "fontSize": "string (OPTIONAL - 'xs', 'sm', 'base', 'lg', 'xl')",
    "arrowPosition": { "x": 50, "y": 50 },
    "arrowRotation": 0,
    "arrowFlip": false
  },
  "properties": {
    "label": "string (COPY from data.label)",
    "description": "string (COPY from data.description)"
  }
}

**When to use Annotations:**
- Point out important details on specific nodes
- Add quick reminders or warnings
- Highlight critical decision points

### POOL NODE
Pools organize workflows into swimlanes representing different participants, roles, or systems. Pools can contain lanes.

Structure:
{
  "id": "pool-timestamp",
  "type": "pool",
  "nodeType": "pool",
  "position": { "x": 0, "y": 0 },
  "data": {
    "label": "string (pool name)",
    "title": "string (pool title)",
    "description": "string (pool description)",
    "lanes": [
      {
        "id": "lane-timestamp1",
        "label": "string (lane name, e.g., 'Customer', 'System', 'Admin')",
        "sizeRatio": 0.5
      },
      {
        "id": "lane-timestamp2",
        "label": "string (lane name)",
        "sizeRatio": 0.5
      }
    ],
    "isLocked": false,
    "orientation": "string ('vertical' or 'horizontal')",
    "minWidth": 300,
    "minHeight": 400,
    "color": "string (OPTIONAL - 'blue', 'green', 'yellow', 'red', 'purple', 'gray')"
  },
  "properties": {
    "label": "string (COPY from data.label)",
    "description": "string (COPY from data.description)",
    "isLocked": false
  }
}

**When to use Pools:**
- Workflow involves multiple participants/roles (e.g., Customer, Admin, System)
- Need to separate responsibilities across departments
- Want to visualize cross-functional processes
- Each lane represents a different actor/system

**Pool Guidelines:**
- Use descriptive lane labels (e.g., "Customer Actions", "Backend System", "Admin Review")
- Vertical orientation is most common for BPMN
- Nodes inside pool should have parentId set to the pool's id (or lane's id if targeting specific lane)
- sizeRatio for lanes should sum to 1.0 (e.g., two lanes = 0.5 each, three lanes = 0.33 each)


## EDGE STRUCTURE

Each edge in the "edges" array MUST have this exact structure:

{
  "id": "string (unique, descriptive format recommended: 'sourceId-targetId-timestamp')",
  "source": "string (REQUIRED - must reference an existing node id)",
  "target": "string (REQUIRED - must reference an existing node id)",
  "type": "string (default: 'sequence-flow')",
  "sourceHandle": "out",
  "targetHandle": "in",
  "animated": false,
  "label": "",
  "data": {
    "pathType": "bezier",
    "pathStyle": "solid",
    "labels": [ /* For display labels on canvas */ ],
    "start-label": "string (OPTIONAL - human-friendly display label, e.g., 'Approved', 'Has Space')"
  },
  "properties": {
    "pathType": "bezier",
    "pathStyle": "solid",
    "condition": "string (REQUIRED for gateway edges - MUST be a machine-readable expression, e.g., 'availableSpots > 0', 'status == approved', 'result == true')",
    "start-label": "string (REQUIRED for gateway edges - human-friendly display label, e.g., 'Còn chỗ', 'Approved', 'Valid')"
  }
}

CRITICAL for edges:
- id, source, target are REQUIRED
- source and target MUST reference existing node IDs in the nodes array
- **IMPORTANT DISTINCTION**:
  - **properties.condition**: Machine-readable expression for workflow execution logic (e.g., "availableSpots > 0", "amount >= 1000", "status == 'approved'")
  - **properties["start-label"]**: Human-friendly display text shown on canvas (e.g., "Còn chỗ", "Approved", "Valid Ticket")
  - These are DIFFERENT - condition is for execution, label is for display
- For edges FROM gateway nodes, you MUST include:
  - properties.condition (the executable condition expression)
  - properties["start-label"] (the display label)
  - data.labels: [{ "text": "display label text", "position": "start" }]
  - data["start-label"] (same as properties["start-label"])

## AVAILABLE NODE TYPES

${this.formatNodeDocumentation()}

## AVAILABLE EDGE TYPES

${JSON.stringify(capabilities.edges)}
(Default and most common: "sequence-flow")

# CRITICAL RULES

1. **Unique IDs**: Every node and edge must have a globally unique ID
   - Node ID format: nodeType-timestamp (e.g., "taskDefault-1234567890")
   - Edge ID format: sourceNodeId-targetNodeId-timestamp (recommended)

2. **Type Matching**: node.type MUST exactly equal node.nodeType

3. **Required Fields**:
   - Nodes: id, type, nodeType, position, data.label, data.title, data.description, properties.label, properties.description
   - Edges: id, source, target, type

4. **Gateway Conditional Logic**:
   - Exclusive gateways diverge workflow into multiple conditional paths
   - **CRITICAL DISTINCTION**: Gateway conditions have TWO aspects:
     a) **Logic/Condition Expression** (properties.condition): Machine-readable expression for workflow execution
        - Examples: "availableSpots > 0", "amount >= 1000", "status == 'approved'", "result == true"
        - This is what the workflow engine evaluates
     b) **Display Label** (properties["start-label"]): Human-friendly text shown on canvas
        - Examples: "Còn chỗ", "Approved", "Valid Ticket", "Amount >= $1000"
        - This is what users see
   - EACH outgoing edge from a gateway MUST include ALL of the following:
     a) properties.condition - executable condition expression (e.g., "availableSpots > 0", "status == 'approved'")
     b) properties["start-label"] - human-friendly display label (e.g., "Còn chỗ", "Approved")
     c) data.labels - array: [{ "text": "display label", "position": "start" }]
     d) data["start-label"] - same as properties["start-label"]
   - **Example for parking lot scenario**:
     - Condition: "availableSpots > 0" (machine evaluates this)
     - Label: "Còn chỗ" (users see this on canvas)
   - **Example for approval scenario**:
     - Condition: "status == 'approved'" (machine evaluates this)
     - Label: "Approved" (users see this on canvas)
   - Gateway edges example structure:
     {
      "id": "edge-gateway-opengate-3",
      "source": "exclusiveGateway-1003",
      "target": "taskDefault-1004",
      "type": "sequence-flow",
      "sourceHandle": "out",
      "targetHandle": "in",
      "animated": false,
      "label": "",
      "data": {
        "pathType": "bezier",
        "pathStyle": "solid",
        "labels": [
          {
            "text": "Valid",
            "position": "start"
          }
        ],
        "start-label": "Valid"
      },
      "properties": {
        "pathType": "bezier",
        "pathStyle": "solid",
        "condition": "ticketValid == true",
        "start-label": "Valid"
      }
    },
    {
      "id": "edge-gateway-logerror-4",
      "source": "exclusiveGateway-1003",
      "target": "serviceTask-1007",
      "type": "sequence-flow",
      "sourceHandle": "out",
      "targetHandle": "in",
      "animated": false,
      "label": "",
      "data": {
        "pathType": "bezier",
        "pathStyle": "solid",
        "labels": [
          {
            "text": "Invalid",
            "position": "start"
          }
        ],
        "start-label": "Invalid"
      },
      "properties": {
        "pathType": "bezier",
        "pathStyle": "solid",
        "condition": "ticketValid == false",
        "start-label": "Invalid"
      },
       "sourceHandle": "out",
       "targetHandle": "in",
       "animated": false,
       "label": ""
     }

5. **Special Node Types**:
   - **Notes are RECOMMENDED**: Always include at least one note describing the overall workflow purpose
   - See "SPECIAL NODE STRUCTURES" section above for detailed Note, Annotation, and Pool node formats
   - Notes use markdown in data.content field and support color/fontSize customization
   - Annotations are lightweight callouts with arrows (no background)
   - Pools organize workflow by participants/roles with lanes
   - Notes and Annotations do NOT need edge connections (standalone)

6. **Flow Requirements**:
   - Workflows MUST start with a Start Event node (e.g., startEventDefault)
   - Workflows MUST end with at least one End Event node (e.g., endEventDefault, endEventError)
   - All nodes (except notes/annotations) must be connected via edges (no orphaned nodes)

7. **Edge References**: 
   - edge.source MUST be an id from the nodes array
   - edge.target MUST be an id from the nodes array

8. **Position Field**: 
   - For REGULAR nodes: Set position to { "x": 0, "y": 0 } (System will auto-layout)
   - For NOTE/ANNOTATION nodes: Set explicit position to separate them from the main workflow (e.g., { "x": -400, "y": 0 })
   - **CRITICAL**: Always place Notes to the left (negative x) or top (negative y) of the Start Event to avoid overlapping with the auto-layout

9. **No Markdown Formatting**: 
   - Return ONLY raw JSON
   - Do NOT wrap in \`\`\`json code blocks
   - Do NOT include any explanatory text before or after JSON

NOW GENERATE THE WORKFLOW BASED ON THE USER'S REQUEST.
REMEMBER: Return ONLY the JSON object, no markdown formatting, no explanations.
`;
  }

  /**
   * Format node documentation from auto-generated registry data
   */
  private static formatNodeDocumentation(): string {
    const docs = generateComprehensiveDocumentation();
    let output = "";

    // Format each category
    Object.entries(docs.categories).forEach(
      ([category, categoryData]: [string, any]) => {
        if (!categoryData.nodes || categoryData.nodes.length === 0) return;

        output += "### " + category.toUpperCase() + "\\n";
        output += categoryData.description + "\\n\\n";

        categoryData.nodes.forEach((node: any) => {
          output += "**" + node.type + "**\\n";
          output += "  Title: " + node.title + "\\n";
          if (node.description) {
            output += "  Description: " + node.description + "\\n";
          }
          output += "  Connection: " + node.connectionRules + "\\n";
          output += "  Example JSON:\\n";
          output +=
            "```json\\n" +
            JSON.stringify(node.exampleJSON, null, 2) +
            "\\n```\\n\\n";
        });

        output += "\\n";
      }
    );

    return output;
  }
}
