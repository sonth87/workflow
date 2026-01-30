import { nodeRegistry } from "../registry/NodeRegistry";
import { edgeRegistry } from "../registry/EdgeRegistry";
import type { MultilingualText } from "../types/base.types";

export interface AIPropertyDefinition {
  name: string;
  type: string;
  label?: string;
  description?: string;
  required?: boolean;
  options?: Array<{ label: string; value: string }>;
}

export interface AINodeDefinition {
  type: string;
  category?: string;
  title: string;
  description?: string;
  properties: AIPropertyDefinition[];
}

export interface AICapabilities {
  nodes: AINodeDefinition[];
  edges: string[]; // List of edge types
}

function resolveText(text: MultilingualText | undefined | string): string {
  if (!text) return "";
  if (typeof text === "string") return text;
  // @ts-ignore - access safe properties for multilingual objects
  return text.en || text.vi || (Object.values(text)[0] as string) || "";
}

/**
 * Extracts a simplified schema of all registered nodes and edges.
 * This schema is optimized for AI consumption to understand available building blocks.
 */
export function getRegistryCapabilities(): AICapabilities {
  const allNodes = nodeRegistry.getAll();
  const allEdges = edgeRegistry.getAll();

  const nodes: AINodeDefinition[] = allNodes.map(item => {
    const config = item.config;
    const meta = config.metadata || {};

    // Map property definitions to a simplified format
    const properties: AIPropertyDefinition[] = (
      config.propertyDefinitions || []
    ).map((prop: any) => ({
      name: prop.id,
      type: prop.type,
      label: resolveText(prop.label),
      description: resolveText(prop.description),
      required: prop.required,
      options: Array.isArray(prop.options)
        ? prop.options.map((opt: any) => ({
            label: resolveText(opt.label),
            value: opt.value,
          }))
        : undefined,
    }));

    // Resolve node title/desc
    let title = resolveText(meta.title);
    if (!title) title = resolveText(item.name);
    if (!title) title = item.id;

    const description =
      resolveText(meta.description) || resolveText(item.description);

    return {
      type: item.id, // The registry ID is the node type
      category: item.category || config.category,
      title: title,
      description: description,
      properties,
    };
  });

  const edges = allEdges.map(item => item.id);

  return {
    nodes,
    edges,
  };
}

// Validation logic moved to AIValidationService
