/**
 * Toolbox Component
 * Giống với Toolbox của workflow cũ
 */

import { categoryRegistry } from "@/core/registry/CategoryRegistry";
import { nodeRegistry } from "@/core/registry/NodeRegistry";
import { CategoryType, NodeType } from "@/enum/workflow.enum";
import {
  X,
  ChevronDown,
  ChevronRight,
  PanelLeft,
  PanelRight,
} from "lucide-react";
import React, { useMemo, useState } from "react";
import { type NodeCategory, NODES_BY_CATEGORIES } from "../../data/toolboxData";
import IconConfig from "../IconConfig";
import { cn } from "@sth87/shadcn-design-system";
import { useLanguage } from "@/workflow/hooks/useLanguage";

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

type ToolboxProps = { className?: string };

type ToolboxState = "minimize" | "collapsed" | "expanded";

export function Toolbox({ className }: ToolboxProps) {
  const [selectedCategoryType, setSelectedCategoryType] =
    useState<CategoryType>();
  const [toolboxState, setToolboxState] = useState<ToolboxState>("collapsed");
  const { getText, getUIText } = useLanguage();

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
        const newCategory: NodeCategory = {
          name: registryItem.config.name as any,
          isOpen: registryItem.config.isOpen ?? true,
          categoryType: categoryType as CategoryType,
          nodes: [],
          icon: registryItem.config.icon || <CustomCategoryIcon />,
          order: registryItem.config.order,
          separator: registryItem.config.separator || undefined,
        };
        categories.push(newCategory);
      } else if (existing) {
        // Update existing category with registry config
        existing.order = registryItem.config.order;
        existing.separator = registryItem.config.separator || undefined;
      }
    });

    const getCategoryDisplayName = (
      categoryType: CategoryType | string
    ): string => {
      const categoryNames: Record<string, { [key: string]: string }> = {
        [CategoryType.START]: { en: "Start Events", vi: "Sự kiện bắt đầu" },
        [CategoryType.TASK]: { en: "Tasks", vi: "Nhiệm vụ" },
        [CategoryType.GATEWAY]: { en: "Gateways", vi: "Cổng quyết định" },
        [CategoryType.IMMEDIATE]: { en: "Immediate", vi: "Tức thì" },
        [CategoryType.END]: { en: "End Events", vi: "Sự kiện kết thúc" },
        [CategoryType.OTHER]: { en: "Other", vi: "Khác" },
        [CategoryType.CUSTOM]: { en: "Custom", vi: "Tùy chỉnh" },
        [CategoryType.SUBFLOW]: { en: "Subflow", vi: "Luồng con" },
      };

      const names = categoryNames[categoryType];
      if (names) {
        return getText(names);
      }
      // Fallback for unknown categories
      return categoryType.charAt(0).toUpperCase() + categoryType.slice(1);
    };

    const ensureCategory = (
      categoryType: CategoryType | string
    ): NodeCategory => {
      let existing = categories.find(cat => cat.categoryType === categoryType);
      if (!existing) {
        // Create new category with default icon
        existing = {
          name: getCategoryDisplayName(categoryType),
          isOpen: true,
          categoryType: categoryType as CategoryType,
          nodes: [],
          icon:
            categoryType === CategoryType.CUSTOM ? (
              <CustomCategoryIcon />
            ) : undefined,
          order: undefined,
          separator: undefined,
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
          label: registryItem.config.metadata?.title || registryItem.name,
          description: registryItem?.config?.metadata?.description,
          icon: registryItem?.config?.icon,
          visualConfig: registryItem?.config?.visualConfig,
        });
      }
    });

    // Filter out empty categories and sort by order
    return categories
      .filter(cat => cat.nodes.length > 0)
      .sort((a, b) => {
        const orderA = a.order ?? 999;
        const orderB = b.order ?? 999;
        return orderA - orderB;
      });
  }, [getText]);

  const selectedCategory = useMemo(
    () =>
      builderCategories.find(
        category => category.categoryType === selectedCategoryType
      ),
    [builderCategories, selectedCategoryType]
  );

  return (
    <aside
      className={cn(
        "border rounded-2xl shadow-xl flex flex-col relative overflow-visible bg-background/90 backdrop-blur-xs",
        { "h-[calc(100%-1rem)] w-sm": toolboxState === "expanded" },
        className
      )}
    >
      {/* {toolboxState === "minimize" && (
        <div className="px-2.5 py-4 flex flex-col items-center gap-2">
          <button
            onClick={() => setToolboxState("collapsed")}
            className="p-2 rounded-lg hover:bg-foreground/10 transition-colors"
            title={getUIText("toolbox.expandToolbox")}
          >
            <ChevronDown size={16} />
          </button>
        </div>
      )} */}

      {toolboxState === "collapsed" && (
        <>
          <div className="px-2.5 py-4 flex-1 overflow-y-auto flex flex-col items-center gap-1">
            <div
              className="p-2 rounded-lg hover:bg-foreground/10 cursor-pointer flex items-center justify-center"
              onClick={() => {
                setToolboxState("expanded");
                setSelectedCategoryType(undefined);
              }}
            >
              <PanelLeft size={16} />
            </div>
            <div className="h-px w-[calc(100%-0.5rem)] bg-border my-2" />

            {builderCategories.map((category, index) => (
              <div
                key={`${typeof category.name === "string" ? category.name : JSON.stringify(category.name)}-${index}`}
              >
                <div
                  className="p-2 rounded-lg hover:bg-foreground/10 cursor-pointer flex items-center justify-center"
                  onClick={() => setSelectedCategoryType(category.categoryType)}
                  title={getText(category.name)}
                >
                  {typeof category.icon === "string" &&
                  category.icon.startsWith("data:image/svg") ? (
                    <img
                      src={category.icon}
                      alt={getText(category.name) as string}
                      className="w-4.5 h-4.5"
                    />
                  ) : (
                    category.icon
                  )}
                </div>
                {/* Render separator if configured */}
                {category.separator &&
                  category.separator.show &&
                  index < builderCategories.length - 1 && (
                    <div className="flex items-center justify-center py-2">
                      {category.separator.style === "line" ? (
                        <div
                          className="h-px w-6"
                          style={{
                            backgroundColor:
                              category.separator.color || "#e5e7eb",
                          }}
                        />
                      ) : (
                        <div className="h-2" />
                      )}
                    </div>
                  )}
              </div>
            ))}
            <div className="h-px w-[calc(100%-0.5rem)] bg-border my-2" />
            {/* <button
              onClick={() => setToolboxState("minimize")}
              className="p-2 rounded-lg hover:bg-foreground/10 transition-colors"
              title="Minimize toolbox"
            >
              <ChevronRight size={16} />
            </button> */}
          </div>
          {selectedCategory && (
            <div className="min-w-[320px] border-border absolute top-0 left-[calc(100%+4px)] border rounded-2xl z-10 bg-background">
              <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                <h2 className="text-base text-ink800 font-medium flex-1">
                  {getText(selectedCategory?.name)}
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
                    return (
                      <div
                        key={node.type}
                        draggable
                        onDragStart={e => handleDragStart(e, node.type)}
                        className="flex items-start gap-2 rounded-lg bg-card/80 backdrop-blur-sm p-3 font-medium cursor-move hover:bg-foreground/10 hover:border-primary hover:scale-[1.02] active:scale-95 transition-all duration-150"
                      >
                        <IconConfig
                          type={node.type}
                          visualConfig={node?.visualConfig}
                          icon={node?.icon}
                        />
                        <div className="flex flex-col justify-start">
                          <span className="text-sm font-medium text-ink800 line-clamp-2">
                            {getText(node.label)}
                          </span>
                          {node.description && (
                            <div className="text-xs mt-1 text-ink600 font-normal line-clamp-3">
                              {getText(node.description)}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}
        </>
      )}

      {toolboxState === "expanded" && (
        <>
          <div className="flex items-center justify-between px-4 py-4">
            <h1 className="text-lg font-semibold text-ink800">
              {getUIText("toolbox.toolbox")}
            </h1>
            <button
              onClick={() => setToolboxState("collapsed")}
              className="p-2 rounded-lg hover:bg-foreground/10 transition-colors"
              title={getUIText("toolbox.collapseToolbox")}
            >
              <PanelRight size={16} />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto px-4 pb-4 flex flex-col gap-4">
            {builderCategories.map((category, index) => (
              <div
                key={`${category.name}-${index}`}
                className="flex flex-col gap-2"
              >
                <div className="flex items-center gap-2 px-2">
                  {typeof category.icon === "string" &&
                  category.icon.startsWith("data:image/svg") ? (
                    <img
                      src={category.icon}
                      alt={getText(category.name)}
                      className="w-5 h-5"
                    />
                  ) : (
                    <div className="w-5 h-5">{category.icon}</div>
                  )}
                  <h3 className="text-sm font-semibold text-ink800">
                    {getText(category.name)}
                  </h3>
                </div>
                <div className="pl-5">
                  {category.nodes
                    .filter(node => node && node.type)
                    .map(node => {
                      return (
                        <div
                          key={node.type}
                          draggable
                          onDragStart={e => handleDragStart(e, node.type)}
                          className="flex items-start gap-2 rounded-lg bg-card/80 backdrop-blur-sm p-3 font-medium cursor-move hover:bg-foreground/10 hover:border-primary hover:scale-[1.02] active:scale-95 transition-all duration-150"
                        >
                          <IconConfig
                            type={node.type}
                            visualConfig={node?.visualConfig}
                            icon={node?.icon}
                          />
                          <div className="flex flex-col justify-start">
                            <span className="text-sm font-medium text-ink800">
                              {getText(node.label)}
                            </span>
                            {node.description && (
                              <div className="text-xs mt-1 text-ink600 font-normal">
                                {getText(node.description)}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                </div>
                {index < builderCategories.length - 1 && (
                  <div className="h-px bg-border my-0" />
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </aside>
  );
}
