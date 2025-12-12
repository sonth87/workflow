/**
 * Toolbox Component
 * Giống với Toolbox của workflow cũ
 */

import { CategoryType, NodeType } from "@/enum/workflow.enum";
import { getIconConfig } from "../../utils/iconConfig";
import { X } from "lucide-react";
import React, { useMemo, useState } from "react";
import { type NodeCategory, NODES_BY_CATEGORIES } from "../../data/toolboxData";
import { nodeRegistry } from "@/core/registry/NodeRegistry";
import { categoryRegistry } from "@/core/registry/CategoryRegistry";

// Default icon for custom category
const CustomCategoryIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 18 18"
    fill="none"
  >
    <path
      d="M16.6667 8.95833C16.6667 4.70114 13.2155 1.25 8.95833 1.25C4.70114 1.25 1.25 4.70114 1.25 8.95833C1.25 13.2155 4.70114 16.6667 8.95833 16.6667C13.2155 16.6667 16.6667 13.2155 16.6667 8.95833ZM17.9167 8.95833C17.9167 13.9059 13.9059 17.9167 8.95833 17.9167C4.01078 17.9167 0 13.9059 0 8.95833C0 4.01078 4.01078 0 8.95833 0C13.9059 0 17.9167 4.01078 17.9167 8.95833Z"
      fill="#9D6DFF"
    />
    <path d="M9 12L6.5 9.5L9 7L11.5 9.5L9 12Z" fill="#9D6DFF" />
    <path d="M9 6L7 4L9 2L11 4L9 6Z" fill="#9D6DFF" />
  </svg>
);

export function Toolbox() {
  const [selectedCategoryType, setSelectedCategoryType] =
    useState<CategoryType>();

  const handleDragStart = (e: React.DragEvent, nodeType: NodeType) => {
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("application/reactflow", nodeType);
  };

  // Build categories từ registry
  const builderCategories = useMemo(() => {
    // Start with default categories
    const categories = NODES_BY_CATEGORIES.map(category => ({
      ...category,
      nodes: [...category.nodes],
    }));

    // Add categories from CategoryRegistry (from plugins)
    const registeredCategories = categoryRegistry.getAllSorted();
    registeredCategories.forEach(registryItem => {
      const categoryType = registryItem.config.categoryType;
      // Check if category already exists
      const existing = categories.find(
        cat => cat.categoryType === categoryType
      );
      if (!existing) {
        categories.push({
          name: registryItem.config.name,
          isOpen: registryItem.config.isOpen ?? true,
          categoryType: categoryType as CategoryType,
          nodes: [],
          icon: registryItem.config.icon || <CustomCategoryIcon />,
        });
      }
    });

    const ensureCategory = (
      categoryType: CategoryType | string
    ): NodeCategory => {
      let existing = categories.find(cat => cat.categoryType === categoryType);
      if (!existing) {
        // Create new category with default icon
        existing = {
          name: categoryType.charAt(0).toUpperCase() + categoryType.slice(1),
          isOpen: true,
          categoryType: categoryType as CategoryType,
          nodes: [],
          icon:
            categoryType === CategoryType.CUSTOM ? (
              <CustomCategoryIcon />
            ) : undefined,
        };
        categories.push(existing);
      }
      return existing;
    };

    // Add nodes from registry
    const allNodes = nodeRegistry.getAll();

    allNodes.forEach(registryItem => {
      const nodeType = registryItem.type as NodeType;
      const category = registryItem.config.category || "task";

      // Map category to CategoryType
      const categoryTypeMap: Record<string, CategoryType> = {
        start: CategoryType.START,
        end: CategoryType.END,
        task: CategoryType.TASK,
        gateway: CategoryType.GATEWAY,
        custom: CategoryType.CUSTOM,
        subflow: CategoryType.SUBFLOW,
        other: CategoryType.OTHER,
      };

      const categoryType =
        categoryTypeMap[category as string] || (category as CategoryType);
      const targetCategory = ensureCategory(categoryType);

      if (!targetCategory.nodes.some(item => item?.type === nodeType)) {
        targetCategory.nodes.push({
          type: nodeType,
          label: registryItem.name,
        });
      }
    });

    // Filter out empty categories
    return categories.filter(cat => cat.nodes.length > 0);
  }, []);

  const selectedCategory = useMemo(
    () =>
      builderCategories.find(
        category => category.categoryType === selectedCategoryType
      ),
    [builderCategories, selectedCategoryType]
  );

  return (
    <aside className="h-full border border-border/50 bg-card overflow-y-auto rounded-2xl shadow-xl flex">
      <div className="px-2.5 py-4 space-y-1 flex-1 overflow-y-auto flex flex-col items-center">
        {builderCategories.map((category, index) => (
          <div
            key={`${category.name}-${index}`}
            className="p-2 rounded-lg hover:bg-foreground/10 cursor-pointer flex items-center justify-center"
            onClick={() => setSelectedCategoryType(category.categoryType)}
          >
            {typeof category.icon === "string" &&
            category.icon.startsWith("data:image/svg") ? (
              <img
                src={category.icon}
                alt={category.name}
                className="w-4.5 h-4.5"
              />
            ) : (
              category.icon
            )}
          </div>
        ))}
        <div className="h-px w-6 bg-border my-4" />
      </div>
      {selectedCategory && (
        <div className="min-w-[320px] border-l border-border">
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <h2 className="text-base text-ink800 font-medium flex-1">
              {selectedCategory?.name}
            </h2>
            <button
              onClick={() => setSelectedCategoryType(undefined)}
              className="p-2 rounded-lg hover:bg-foreground/10"
            >
              <X size={16} />
            </button>
          </div>
          <div className="p-4 space-y-1">
            {selectedCategory.nodes
              .filter(node => node && node.type)
              .map(node => {
                const iconConfig = getIconConfig(node.type);
                const Icon = iconConfig.icon;

                return (
                  <div
                    key={node.type}
                    draggable
                    onDragStart={e => handleDragStart(e, node.type)}
                    className="flex items-center gap-2 rounded-lg bg-card/80 backdrop-blur-sm p-3 font-medium cursor-move hover:bg-foreground/10 hover:border-primary hover:scale-[1.02] active:scale-95 transition-all duration-150"
                  >
                    {typeof Icon === "string" ? (
                      <img src={Icon} alt={node.label} className="w-6 h-6" />
                    ) : (
                      <Icon size={24} style={{ color: iconConfig.color }} />
                    )}
                    <span className="text-sm font-medium text-ink800">
                      {node.label}
                    </span>
                  </div>
                );
              })}
          </div>
        </div>
      )}
    </aside>
  );
}
