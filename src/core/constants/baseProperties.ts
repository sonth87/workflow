import type { PropertyDefinition } from "@/core/types/base.types";

/**
 * Base Property Definitions
 * Những property mặc định sẽ được thêm tự động vào tất cả các nodes
 */

export const basePropertyDefinitions: PropertyDefinition[] = [
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
    readonly: true, // ID không nên edit được
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
 * Merge base properties với custom properties
 * Base properties sẽ được thêm vào đầu, trừ khi custom properties đã define
 */
export function mergeWithBaseProperties(
  customProperties?: PropertyDefinition[]
): PropertyDefinition[] {
  if (!customProperties || customProperties.length === 0) {
    return basePropertyDefinitions;
  }

  // Lọc bỏ các property đã được define trong customProperties
  const customIds = new Set(customProperties.map(p => p.id));
  const filteredBaseProperties = basePropertyDefinitions.filter(
    p => !customIds.has(p.id)
  );

  // Merge và sort theo order
  const merged = [...filteredBaseProperties, ...customProperties];
  return merged.sort((a, b) => (a.order || 0) - (b.order || 0));
}
