/**
 * AI Documentation Generator
 * Automatically generates comprehensive documentation for AI consumption from the node registry
 */

import { nodeRegistry } from "../registry/NodeRegistry";
import { CategoryType } from "@/enum/workflow.enum";
import type { BaseNodeConfig, MultilingualText } from "../types/base.types";

/**
 * Property documentation interface
 */
export interface AIPropertyDoc {
  name: string;
  type: string;
  label: string;
  description?: string;
  required: boolean;
  defaultValue?: unknown;
  options?: Array<{ label: string; value: unknown }>;
}

/**
 * Node documentation interface
 */
export interface AINodeDocumentation {
  type: string;
  title: string;
  description: string;
  category: string;
  exampleJSON: object;
  properties: AIPropertyDoc[];
  connectionRules: string;
  usageGuidelines?: string;
  commonScenarios?: string[];
}

/**
 * Category documentation interface
 */
export interface CategoryDocumentation {
  description: string;
  nodes: AINodeDocumentation[];
}

/**
 * Special node documentation interface
 */
export interface SpecialNodeDoc {
  structure: object;
  usage: string;
  example: object;
}

/**
 * Complete AI documentation interface
 */
export interface AIDocumentation {
  categories: {
    [category: string]: CategoryDocumentation;
  };
  specialNodes: {
    note: SpecialNodeDoc;
    annotation: SpecialNodeDoc;
  };
}

/**
 * Resolve multilingual text to string
 */
function resolveText(text: MultilingualText | undefined | string): string {
  if (!text) return "";
  if (typeof text === "string") return text;
  return text.en || text.vi || (Object.values(text)[0] as string) || "";
}

/**
 * Generate example JSON for a node type
 */
export function generateNodeExampleJSON(nodeType: string): object | null {
  const node = nodeRegistry.createNode(nodeType);
  if (!node) return null;

  // Create a realistic example with proper structure
  return {
    id: `${nodeType}-${Date.now()}`,
    type: nodeType,
    nodeType: nodeType,
    position: { x: 0, y: 0 },
    data: {
      label: resolveText(node.metadata?.title) || "Example Node",
      title: resolveText(node.metadata?.title) || "Example Node",
      description: resolveText(node.metadata?.description) || "",
      ...generateExampleDataFields(node),
    },
    properties: {
      label: resolveText(node.metadata?.title) || "Example Node",
      title: resolveText(node.metadata?.title) || "Example Node",
      description: resolveText(node.metadata?.description) || "",
      ...generateExamplePropertiesFields(node),
    },
  };
}

/**
 * Generate example data fields based on node type
 */
function generateExampleDataFields(node: BaseNodeConfig): object {
  const fields: any = {};

  // Add common fields based on node type or category
  if (node.category === CategoryType.TASK) {
    fields.assignee = "user@example.com";
  }

  return fields;
}

/**
 * Generate example properties fields
 */
function generateExamplePropertiesFields(node: BaseNodeConfig): object {
  const fields: any = {};

  // Generate examples for property definitions
  node.propertyDefinitions?.forEach(prop => {
    if (
      prop.id === "label" ||
      prop.id === "title" ||
      prop.id === "description"
    ) {
      return; // Skip, already handled
    }

    fields[prop.id] = prop.defaultValue || generateExampleValue(prop.type);
  });

  return fields;
}

/**
 * Generate example value based on property type
 */
function generateExampleValue(type: string): unknown {
  switch (type) {
    case "text":
      return "Example text";
    case "number":
      return 100;
    case "boolean":
      return true;
    case "select":
      return "option1";
    case "textarea":
      return "Example description";
    default:
      return "";
  }
}

/**
 * Generate documentation for a single node
 */
export function generateNodeDocumentation(
  nodeType: string
): AINodeDocumentation | null {
  const item = nodeRegistry.get(nodeType);
  if (!item) return null;

  const config = item.config;
  const meta = config.metadata;

  // Extract properties
  const properties: AIPropertyDoc[] = (config.propertyDefinitions || []).map(
    (prop: any) => ({
      name: prop.id,
      type: prop.type,
      label: resolveText(prop.label),
      description: resolveText(prop.description),
      required: prop.required || false,
      defaultValue: prop.defaultValue,
      options: Array.isArray(prop.options)
        ? prop.options.map((opt: any) => ({
            label: resolveText(opt.label),
            value: opt.value,
          }))
        : undefined,
    })
  );

  // Generate connection rules description
  const connectionRules = generateConnectionRulesDescription(config);

  // Generate example JSON
  const exampleJSON = generateNodeExampleJSON(nodeType) || {};

  return {
    type: nodeType,
    title: resolveText(meta?.title) || resolveText(item.name) || nodeType,
    description: resolveText(meta?.description) || "",
    category: item.category || config.category || "",
    exampleJSON,
    properties,
    connectionRules,
    usageGuidelines: resolveText((meta as any)?.usageGuidelines),
    commonScenarios: (meta as any)?.exampleScenarios,
  };
}

/**
 * Generate connection rules description
 */
function generateConnectionRulesDescription(config: BaseNodeConfig): string {
  const rules = config.connectionRules?.[0];
  if (!rules) return "No specific connection rules";

  const parts: string[] = [];

  if (rules.maxInputConnections === 0) {
    parts.push("No inputs allowed");
  } else if (rules.maxInputConnections === 1) {
    parts.push("Max 1 input");
  } else if (rules.maxInputConnections && rules.maxInputConnections > 1) {
    parts.push(`Max ${rules.maxInputConnections} inputs`);
  } else {
    parts.push("Unlimited inputs");
  }

  if (rules.maxOutputConnections === 0) {
    parts.push("No outputs allowed");
  } else if (rules.maxOutputConnections === 1) {
    parts.push("Max 1 output");
  } else if (rules.maxOutputConnections && rules.maxOutputConnections > 1) {
    parts.push(`Max ${rules.maxOutputConnections} outputs`);
  } else {
    parts.push("Unlimited outputs");
  }

  return parts.join(", ");
}

/**
 * Generate documentation for a category
 */
export function generateCategoryDocumentation(
  category: CategoryType | string
): CategoryDocumentation {
  const nodes = nodeRegistry.getByCategory(category);

  const categoryDescriptions: Record<string, string> = {
    [CategoryType.START]: "Start events that begin a workflow process",
    [CategoryType.END]: "End events that conclude a workflow process",
    [CategoryType.TASK]: "Tasks representing work to be performed",
    [CategoryType.GATEWAY]:
      "Gateways for controlling workflow flow and making decisions",
    [CategoryType.IMMEDIATE]: "Immediate actions that execute without waiting",
    [CategoryType.OTHER]: "Other specialized nodes and annotations",
  };

  return {
    description: categoryDescriptions[category] || `${category} nodes`,
    nodes: nodes
      .map(item => generateNodeDocumentation(item.id))
      .filter((doc): doc is AINodeDocumentation => doc !== null),
  };
}

/**
 * Generate comprehensive documentation for all nodes
 */
export function generateComprehensiveDocumentation(): AIDocumentation {
  const categories = [
    CategoryType.START,
    CategoryType.TASK,
    CategoryType.GATEWAY,
    CategoryType.IMMEDIATE,
    CategoryType.END,
    CategoryType.OTHER,
  ];

  const categoryDocs: { [category: string]: CategoryDocumentation } = {};

  categories.forEach(category => {
    categoryDocs[category] = generateCategoryDocumentation(category);
  });

  return {
    categories: categoryDocs,
    specialNodes: {
      note: generateNoteDocumentation(),
      annotation: generateAnnotationDocumentation(),
    },
  };
}

/**
 * Generate documentation for Note nodes
 */
function generateNoteDocumentation(): SpecialNodeDoc {
  return {
    structure: {
      id: "note-timestamp",
      type: "note",
      nodeType: "note",
      position: { x: 0, y: 0 },
      data: {
        label: "string",
        title: "string",
        description: "string",
        content: "string (MARKDOWN formatted)",
        color:
          "string (OPTIONAL: 'blue', 'green', 'yellow', 'red', 'purple', 'gray')",
        fontSize: "string (OPTIONAL: 'xs', 'sm', 'base', 'lg', 'xl')",
      },
      properties: {
        label: "string (COPY from data.label)",
        description: "string (COPY from data.description)",
      },
      width: 350,
      height: 250,
      zIndex: -1,
    },
    usage:
      "Notes document and explain the workflow. They are standalone (no edge connections required). Position will be automatically handled by the system (placed below workflow). Use markdown in content field for rich documentation.",
    example: {
      id: "note-1234567890",
      type: "note",
      nodeType: "note",
      position: { x: 0, y: 0 },
      data: {
        label: "Workflow Overview",
        title: "Workflow Description",
        description: "Overview of the workflow",
        content:
          "## Workflow Purpose\\n\\nThis workflow handles:\\n- Key process step 1\\n- Key process step 2\\n\\n**Important Notes:**\\n- Critical detail 1\\n- Critical detail 2",
        color: "blue",
        fontSize: "sm",
      },
      properties: {
        label: "Workflow Overview",
        description: "Overview of the workflow",
      },
      width: 500,
      height: 400,
      zIndex: -1,
    },
  };
}

/**
 * Generate documentation for Annotation nodes
 */
function generateAnnotationDocumentation(): SpecialNodeDoc {
  return {
    structure: {
      id: "annotation-timestamp",
      type: "annotation",
      nodeType: "annotation",
      position: { x: 0, y: 0 },
      data: {
        label: "string",
        title: "string",
        description: "string",
        content: "string (MARKDOWN formatted)",
        textColor:
          "string (OPTIONAL: 'red', 'green', 'blue', 'yellow', 'purple', 'gray')",
        fontSize: "string (OPTIONAL: 'xs', 'sm', 'base', 'lg', 'xl')",
        arrowPosition: { x: 50, y: 50 },
        arrowRotation: 0,
        arrowFlip: false,
      },
      properties: {
        label: "string (COPY from data.label)",
        description: "string (COPY from data.description)",
      },
    },
    usage:
      "Annotations are lightweight callouts with arrows pointing to elements. No background, only text with arrow. Use to point out important details, add quick reminders, or highlight critical decision points.",
    example: {
      id: "annotation-1234567890",
      type: "annotation",
      nodeType: "annotation",
      position: { x: 0, y: 0 },
      data: {
        label: "Important Note",
        title: "Critical Decision",
        description: "Pay attention to this condition",
        content: "**Check availability** before proceeding",
        textColor: "red",
        fontSize: "sm",
        arrowPosition: { x: 50, y: 50 },
        arrowRotation: 45,
        arrowFlip: false,
      },
      properties: {
        label: "Important Note",
        description: "Pay attention to this condition",
      },
    },
  };
}
