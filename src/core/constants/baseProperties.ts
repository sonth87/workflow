import type { PropertyDefinition } from "@/core/types/base.types";

/**
 * Base Property Definitions for Nodes
 * Những property mặc định sẽ được thêm tự động vào tất cả các nodes
 */
export const baseNodePropertyDefinitions: PropertyDefinition[] = [
  {
    id: "id",
    name: "id",
    label: "ID",
    type: "text",
    required: true,
    defaultValue: "",
    description: "Unique identifier for this node",
    order: 0,
    group: "basic",
    readonly: true,
  },
  {
    id: "title",
    name: "title",
    label: "Title",
    type: "text",
    required: true,
    defaultValue: "",
    description: "Display name for this node",
    order: 1,
    group: "basic",
  },
  {
    id: "description",
    name: "description",
    label: "Description",
    type: "textarea",
    required: false,
    defaultValue: "",
    description: "Detailed description of this node's purpose",
    placeholder: "Enter description...",
    order: 2,
    group: "basic",
  },
];

/**
 * Base Property Definitions for Edges
 * Những property mặc định sẽ được thêm tự động vào tất cả các edges
 */
export const baseEdgePropertyDefinitions: PropertyDefinition[] = [
  {
    id: "start-label",
    name: "start-label",
    label: "Start Label",
    type: "text",
    required: false,
    defaultValue: "",
    description: "Label displayed at the start of the edge",
    order: 0,
    group: "label",
    readonly: false,
  },
  {
    id: "center-label",
    name: "center-label",
    label: "Center Label",
    type: "text",
    required: false,
    defaultValue: "",
    description: "Label displayed at the center of the edge",
    order: 1,
    group: "label",
    readonly: false,
  },
  {
    id: "end-label",
    name: "end-label",
    label: "End Label",
    type: "text",
    required: false,
    defaultValue: "",
    description: "Label displayed at the end of the edge",
    order: 2,
    group: "label",
    readonly: false,
  },
];

/**
 * Backward compatibility
 * @deprecated Use baseNodePropertyDefinitions instead
 */
export const basePropertyDefinitions = baseNodePropertyDefinitions;

/**
 * Merge base properties với custom properties cho Node
 * Base properties sẽ được thêm vào đầu, trừ khi custom properties đã define
 */
export function mergeWithBaseNodeProperties(
  customProperties?: PropertyDefinition[]
): PropertyDefinition[] {
  if (!customProperties || customProperties.length === 0) {
    return baseNodePropertyDefinitions;
  }

  // Lọc bỏ các property đã được define trong customProperties
  const customIds = new Set(customProperties.map(p => p.id));
  const filteredBaseProperties = baseNodePropertyDefinitions.filter(
    p => !customIds.has(p.id)
  );

  // Merge và sort theo order
  const merged = [...filteredBaseProperties, ...customProperties];
  return merged.sort((a, b) => (a.order || 0) - (b.order || 0));
}

/**
 * Merge base properties với custom properties cho Edge
 * Base properties sẽ được thêm vào đầu, trừ khi custom properties đã define
 */
export function mergeWithBaseEdgeProperties(
  customProperties?: PropertyDefinition[]
): PropertyDefinition[] {
  if (!customProperties || customProperties.length === 0) {
    return baseEdgePropertyDefinitions;
  }

  // Lọc bỏ các property đã được define trong customProperties
  const customIds = new Set(customProperties.map(p => p.id));
  const filteredBaseProperties = baseEdgePropertyDefinitions.filter(
    p => !customIds.has(p.id)
  );

  // Merge và sort theo order
  const merged = [...filteredBaseProperties, ...customProperties];
  return merged.sort((a, b) => (a.order || 0) - (b.order || 0));
}
