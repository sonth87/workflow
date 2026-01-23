import { CategoryType } from "@/enum/workflow.enum";
import type { CategoryConfig } from "@/core/registry/CategoryRegistry";
import type { PluginConfig } from "@/core/plugins/PluginManager";

const createCategory = (
  categoryType: CategoryType | string,
  name: string | { [key: string]: string },
  overrides: Partial<CategoryConfig> = {}
) => {
  const id = `category-${categoryType}`;
  const config: CategoryConfig = {
    id,
    name,
    categoryType: categoryType as CategoryType,
    isOpen: true,
    ...overrides,
  };
  return { id, type: categoryType, name, config };
};

export const defaultCategories: PluginConfig["categories"] = [
  createCategory(CategoryType.START, "plugin.default.category.start.name", {
    description: "plugin.default.category.start.description",
    order: 1,
  }),
  createCategory(CategoryType.TASK, "plugin.default.category.task.name", {
    description: "plugin.default.category.task.description",
    order: 2,
  }),
  createCategory(CategoryType.GATEWAY, "plugin.default.category.gateway.name", {
    description: "plugin.default.category.gateway.description",
    order: 3,
  }),
  createCategory(CategoryType.END, "plugin.default.category.end.name", {
    description: "plugin.default.category.end.description",
    order: 4,
  }),
  createCategory(
    CategoryType.IMMEDIATE,
    "plugin.default.category.immediate.name",
    {
      description: "plugin.default.category.immediate.description",
      order: 5,
      separator: { show: true, style: "line", color: "#e5e7eb" },
    }
  ),
  createCategory(CategoryType.BOUNDARY, "Boundary Events", {
    description: "Events attached to tasks",
    order: 5.5,
  }),
  createCategory(CategoryType.OTHER, "plugin.default.category.other.name", {
    description: "plugin.default.category.other.description",
    order: 6,
  }),
];
