/**
 * Context Menu Helpers
 * Utility functions for creating common context menu items
 *
 * NOTE: Labels use multilingual objects from contextMenuLabels
 * These are resolved to current language in React components via getText()
 */

import type {
  ContextMenuItem,
  NodeVisualConfig,
  EdgeVisualConfig,
  ContextMenuContext,
  IconConfig,
} from "../types/base.types";
import { themeRegistry } from "../registry/ThemeRegistry";
import { contextMenuActionsRegistry } from "../registry/ContextMenuActionsRegistry";
import { nodeRegistry } from "../registry/NodeRegistry";
import { CategoryType } from "@/enum/workflow.enum";
import {
  Copy,
  Highlighter,
  Settings2,
  Tags,
  Trash2,
  ArrowLeftRight,
} from "lucide-react";
import { getContextMenuLabel } from "./contextMenuLabels";
import { getIconConfig } from "../../workflow/utils/iconConfig";

/**
 * Generate unique separator ID
 */
function generateSeparatorId(): string {
  return `separator-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Create color submenu items from color palettes
 */
export function createColorMenuItems(
  onColorChange: (paletteId: string, context: any) => void | Promise<void>
): ContextMenuItem[] {
  const palettes = themeRegistry.getAllColorPalettes();

  const paletteItems = palettes.map(palette => ({
    id: `color-${palette.id}`,
    label: palette.name,
    color: palette.primary, // Hiển thị màu primary của palette
    onClick: async (context: any) => {
      await onColorChange(palette.id, context);
    },
  }));

  // Add reset option at the beginning
  return [
    {
      id: "color-reset",
      label: getContextMenuLabel("resetColor"),
      icon: "↺",
      onClick: async (context: any) => {
        await onColorChange("", context); // Pass empty string to reset
      },
    },
    {
      id: generateSeparatorId(),
      label: "",
      separator: true,
    },
    ...paletteItems,
  ];
}

/**
 * Create a color picker menu item with submenu
 */
export function createColorPickerMenuItem(
  onColorChange: (paletteId: string, context: any) => void | Promise<void>
): ContextMenuItem {
  return {
    id: "change-color",
    label: getContextMenuLabel("changeColor"),
    icon: "",
    children: createColorMenuItems(onColorChange),
  };
}

/**
 * Create delete menu item
 */
export function createDeleteMenuItem(
  onDelete: (context: any) => void | Promise<void>
): ContextMenuItem {
  return {
    id: "delete",
    label: getContextMenuLabel("delete"),
    icon: {
      type: "lucide",
      value: Trash2,
      color: "red",
    },
    onClick: onDelete,
  };
}

/**
 * Create change type menu item with submenu for nodes in the same category
 */
export function createChangeTypeMenuItem(
  onTypeChange: (
    targetNodeType: string,
    context: ContextMenuContext
  ) => void | Promise<void>
): ContextMenuItem {
  return {
    id: "change-type",
    label: getContextMenuLabel("changeType"),
    icon: {
      type: "lucide",
      value: ArrowLeftRight,
    },
    visible: (context: ContextMenuContext) => {
      // Only show for nodes with category START, TASK, GATEWAY, END
      if (!context.node) return false;
      const category = context.node.category as string;
      return [
        CategoryType.START,
        CategoryType.TASK,
        CategoryType.GATEWAY,
        CategoryType.IMMEDIATE,
        CategoryType.END,
      ].includes(category as CategoryType);
    },
    children: [], // Will be populated dynamically based on context
    // Store the callback for later use
    _onTypeChange: onTypeChange as any,
  };
}

/**
 * Get category label for Change Type menu
 */
export function getCategoryTypeLabel(category: string): string {
  const labels: Record<string, string> = {
    [CategoryType.START]: getContextMenuLabel("startType"),
    [CategoryType.TASK]: getContextMenuLabel("taskType"),
    [CategoryType.GATEWAY]: getContextMenuLabel("gatewayType"),
    [CategoryType.IMMEDIATE]: getContextMenuLabel("immediateType"),
    [CategoryType.END]: getContextMenuLabel("endType"),
  };
  return labels[category] || getContextMenuLabel("changeType");
}

/**
 * Create dynamic change type submenu items based on node category
 */
export function createChangeTypeSubmenuItems(
  context: ContextMenuContext,
  onTypeChange: (
    targetNodeType: string,
    context: ContextMenuContext
  ) => void | Promise<void>
): ContextMenuItem[] {
  if (!context.node) return [];

  const currentNodeType = context.node.nodeType;
  const category = context.node.category as string;

  // Get all nodes in the same category from registry
  const nodesInCategory = nodeRegistry.getByCategory(category);

  // Create menu items for each node type
  return nodesInCategory.map(item => {
    // Get icon with fallback from iconConfig
    let icon: any = item.config?.icon || item.icon;
    if (!icon) {
      const config = getIconConfig(item.id as any);

      if (config?.icon) {
        if (typeof config.icon === "string") {
          icon = {
            type: "image",
            value: config.icon,
            color: config.color,
            backgroundColor: config.bgColor,
          } as IconConfig;
        } else {
          icon = {
            type: "lucide",
            value: config.icon,
            color: config.color,
            backgroundColor: config.bgColor,
          } as IconConfig;
        }
      }
    }

    return {
      id: `change-type-${item.id}`,
      label: item.config?.metadata?.title || item.name, // Use translation key from metadata
      icon,
      disabled: item.id === currentNodeType, // Disable current node type
      onClick: async (ctx: ContextMenuContext) => {
        await onTypeChange(item.id, ctx);
      },
    };
  });
}

/**
 * Convert color palette to NodeVisualConfig
 */
export function paletteToNodeVisualConfig(paletteId: string): NodeVisualConfig {
  // If paletteId is empty, return config to reset colors
  if (!paletteId) {
    return {
      backgroundColor: undefined,
      borderColor: undefined,
      ringColor: undefined,
      textColor: undefined,
      descriptionColor: undefined,
      iconBackgroundColor: undefined,
      iconColor: undefined,
    };
  }

  const palette = themeRegistry.getColorPalette(paletteId);
  if (!palette) {
    console.warn(`Color palette "${paletteId}" not found`);
    return {};
  }

  return {
    backgroundColor: palette.background,
    borderColor: palette.border || palette.primary,
    ringColor: `${palette.primary}40`,
    textColor: palette.foreground,
    descriptionColor: palette.accent || palette.primary,
    iconBackgroundColor: palette.muted,
    iconColor: palette.accent || palette.primary,
  };
}

/**
 * Convert color palette to EdgeVisualConfig
 */
export function paletteToEdgeVisualConfig(paletteId: string): EdgeVisualConfig {
  // If paletteId is empty, return config to reset colors
  if (!paletteId) {
    return {
      strokeColor: undefined,
      selectedStrokeColor: undefined,
      markerColor: undefined,
      labelBackgroundColor: undefined,
      labelTextColor: undefined,
      labelBorderColor: undefined,
    };
  }

  const palette = themeRegistry.getColorPalette(paletteId);
  if (!palette) {
    console.warn(`Color palette "${paletteId}" not found`);
    return {};
  }

  return {
    strokeColor: palette.primary,
    strokeWidth: 2,
    strokeStyle: "solid",
    selectedStrokeColor: palette.accent || palette.primary,
    selectedStrokeWidth: 3,
    markerColor: palette.primary,
    labelBackgroundColor: palette.background,
    labelTextColor: palette.foreground,
    labelBorderColor: palette.border || palette.primary,
  };
}

/**
 * Create node border style submenu items
 */
export function createNodeBorderStyleMenuItems(
  onBorderStyleChange: (
    borderStyle: string,
    context: any
  ) => void | Promise<void>
): ContextMenuItem[] {
  const borderStyles = [
    { id: "solid", labelKey: "solid", icon: "━" },
    { id: "dashed", labelKey: "dashed", icon: "╍" },
    { id: "dotted", labelKey: "dotted", icon: "┄" },
    { id: "double", labelKey: "double", icon: "═" },
  ];

  return borderStyles.map(style => ({
    id: `border-style-${style.id}`,
    label: getContextMenuLabel(
      style.labelKey as keyof typeof import("./contextMenuLabels").contextMenuLabels
    ),
    icon: style.icon,
    onClick: async (context: any) => {
      await onBorderStyleChange(style.id, context);
    },
  }));
}

/**
 * Create default node context menu items
 */
export function createDefaultNodeContextMenuItems(
  onColorChange: (paletteId: string, context: any) => void | Promise<void>,
  onBorderStyleChange: (
    borderStyle: string,
    context: any
  ) => void | Promise<void>,
  onDelete: (context: any) => void | Promise<void>,
  onTypeChange?: (
    targetNodeType: string,
    context: ContextMenuContext
  ) => void | Promise<void>
): ContextMenuItem[] {
  const menuItems: ContextMenuItem[] = [];

  // Add Change Type menu item at the top for applicable nodes
  if (onTypeChange) {
    const changeTypeItem = createChangeTypeMenuItem(onTypeChange);
    // Override label to be dynamic based on category
    changeTypeItem.label = ""; // Will be set dynamically
    changeTypeItem.children = []; // Will be populated in ContextMenu component

    // Create a wrapper that dynamically generates submenu
    const dynamicChangeTypeItem: ContextMenuItem = {
      ...changeTypeItem,
      children: [], // Placeholder, will be populated dynamically
      // Override to populate children dynamically based on context
      onClick: undefined, // No direct onClick, only submenu
    };

    menuItems.push(dynamicChangeTypeItem);
    menuItems.push({
      id: generateSeparatorId(),
      label: "",
      separator: true,
    });
  }

  menuItems.push(
    {
      id: "properties",
      label: getContextMenuLabel("properties"),
      icon: {
        type: "lucide",
        value: Settings2,
      },
      onClick: async (context: any) => {
        const action = contextMenuActionsRegistry.getAction("selectNode");
        if (action && context.nodeId) {
          action(context.nodeId);
        }
      },
    },
    {
      id: generateSeparatorId(),
      label: "",
      separator: true,
    },
    {
      id: "appearance",
      label: getContextMenuLabel("appearance"),
      icon: {
        type: "lucide",
        value: Highlighter,
      },
      children: [
        createColorPickerMenuItem(onColorChange),
        {
          id: "change-border-style",
          label: getContextMenuLabel("borderStyle"),
          icon: "",
          children: createNodeBorderStyleMenuItems(onBorderStyleChange),
        },
      ],
    },
    {
      id: generateSeparatorId(),
      label: "",
      separator: true,
    },
    {
      id: "duplicate",
      label: getContextMenuLabel("duplicate"),
      icon: {
        type: "lucide",
        value: Copy,
      },
      onClick: async (context: any) => {
        const action = contextMenuActionsRegistry.getAction("duplicateNode");
        if (action && context.nodeId) {
          action(context.nodeId);
        }
      },
    },
    createDeleteMenuItem(onDelete)
  );

  return menuItems;
}

/**
 * Create edge path type submenu items
 */
export function createPathTypeMenuItems(
  onPathTypeChange: (pathType: string, context: any) => void | Promise<void>
): ContextMenuItem[] {
  const pathTypes = [
    { id: "bezier", labelKey: "bezierCurved", icon: "⤴" },
    { id: "straight", labelKey: "straight", icon: "→" },
    { id: "step", labelKey: "step", icon: "⌐" },
  ];

  return pathTypes.map(type => ({
    id: `path-type-${type.id}`,
    label: getContextMenuLabel(
      type.labelKey as keyof typeof import("./contextMenuLabels").contextMenuLabels
    ),
    icon: type.icon,
    onClick: async (context: any) => {
      await onPathTypeChange(type.id, context);
    },
  }));
}

/**
 * Create edge path style submenu items
 */
export function createEdgePathStyleMenuItems(
  onPathStyleChange: (pathStyle: string, context: any) => void | Promise<void>
): ContextMenuItem[] {
  const pathStyles = [
    { id: "solid", labelKey: "solid", icon: "━" },
    { id: "dashed", labelKey: "dashed", icon: "╍" },
    { id: "dotted", labelKey: "dotted", icon: "┄" },
  ];

  return pathStyles.map(style => ({
    id: `path-style-${style.id}`,
    label: getContextMenuLabel(
      style.labelKey as keyof typeof import("./contextMenuLabels").contextMenuLabels
    ),
    icon: style.icon,
    onClick: async (context: any) => {
      await onPathStyleChange(style.id, context);
    },
  }));
}

/**
 * Create edge animation submenu items
 */
export function createEdgeAnimationMenuItems(
  onAnimationChange: (animated: boolean, context: any) => void | Promise<void>
): ContextMenuItem[] {
  return [
    {
      id: "animation-enable",
      label: getContextMenuLabel("enable"),
      onClick: async (context: any) => {
        await onAnimationChange(true, context);
      },
    },
    {
      id: "animation-disable",
      label: getContextMenuLabel("disable"),
      onClick: async (context: any) => {
        await onAnimationChange(false, context);
      },
    },
  ];
}

/**
 * Create edge label submenu items
 */
export function createEdgeLabelMenuItems(
  onAddLabel: (
    position: "start" | "center" | "end",
    context: any
  ) => void | Promise<void>
): ContextMenuItem[] {
  return [
    {
      id: "add-label-start",
      label: getContextMenuLabel("labelAtStart"),
      onClick: async (context: any) => {
        await onAddLabel("start", context);
      },
    },
    {
      id: "add-label-center",
      label: getContextMenuLabel("labelAtCenter"),
      onClick: async (context: any) => {
        await onAddLabel("center", context);
      },
    },
    {
      id: "add-label-end",
      label: getContextMenuLabel("labelAtEnd"),
      onClick: async (context: any) => {
        await onAddLabel("end", context);
      },
    },
  ];
}

/**
 * Create default edge context menu items
 */
export function createDefaultEdgeContextMenuItems(
  onColorChange: (paletteId: string, context: any) => void | Promise<void>,
  onPathTypeChange: (pathType: string, context: any) => void | Promise<void>,
  onPathStyleChange: (pathStyle: string, context: any) => void | Promise<void>,
  onAnimationChange: (animated: boolean, context: any) => void | Promise<void>,
  onAddLabel: (
    position: "start" | "center" | "end",
    context: any
  ) => void | Promise<void>,
  onDelete: (context: any) => void | Promise<void>
): ContextMenuItem[] {
  return [
    {
      id: "appearance",
      label: getContextMenuLabel("appearance"),
      icon: {
        type: "lucide",
        value: Highlighter,
      },
      children: [
        createColorPickerMenuItem(onColorChange),
        {
          id: generateSeparatorId(),
          label: "",
          separator: true,
        },
        {
          id: "change-path-type",
          label: getContextMenuLabel("pathType"),
          icon: "⤴",
          children: createPathTypeMenuItems(onPathTypeChange),
        },
        {
          id: "change-path-style",
          label: getContextMenuLabel("pathStyle"),
          icon: "━",
          children: createEdgePathStyleMenuItems(onPathStyleChange),
        },
        {
          id: "change-animation",
          label: getContextMenuLabel("animation"),
          children: createEdgeAnimationMenuItems(onAnimationChange),
        },
      ],
    },
    {
      id: generateSeparatorId(),
      label: "",
      separator: true,
    },
    {
      id: "add-label",
      label: getContextMenuLabel("addLabel"),
      icon: {
        type: "lucide",
        value: Tags,
      },
      children: createEdgeLabelMenuItems(onAddLabel),
    },
    {
      id: generateSeparatorId(),
      label: "",
      separator: true,
    },
    {
      id: "properties",
      label: getContextMenuLabel("properties"),
      icon: {
        type: "lucide",
        value: Settings2,
      },
      onClick: async (context: any) => {
        const action = contextMenuActionsRegistry.getAction("selectEdge");
        if (action && context.edgeId) {
          action(context.edgeId);
        }
      },
    },
    {
      id: generateSeparatorId(),
      label: "",
      separator: true,
    },
    createDeleteMenuItem(onDelete),
  ];
}

/**
 * Create note node context menu items (simplified)
 */
export function createNoteNodeContextMenuItems(
  onColorChange?: (color: string, context: any) => void | Promise<void>,
  onFontSizeChange?: (size: string, context: any) => void | Promise<void>
): ContextMenuItem[] {
  const noteColors = [
    { id: "yellow", labelKey: "yellow", color: "#fde68a" },
    { id: "blue", labelKey: "blue", color: "#bfdbfe" },
    { id: "green", labelKey: "green", color: "#d9f99d" },
    { id: "pink", labelKey: "pink", color: "#fecdd3" },
    { id: "purple", labelKey: "purple", color: "#ddd6fe" },
    { id: "orange", labelKey: "orange", color: "#fed7aa" },
    { id: "gray", labelKey: "gray", color: "#e4e4e7" },
    { id: "transparent", labelKey: "transparent", color: "transparent" },
  ];

  const noteFontSizes = [
    { id: "xs", labelKey: "extraSmall" },
    { id: "sm", labelKey: "small" },
    { id: "base", labelKey: "base" },
    { id: "lg", labelKey: "large" },
  ];

  return [
    {
      id: "appearance",
      label: getContextMenuLabel("appearance"),
      icon: {
        type: "lucide",
        value: Highlighter,
      },
      children: [
        {
          id: "change-color",
          label: getContextMenuLabel("color"),
          icon: "",
          children: noteColors.map(noteColor => ({
            id: `color-${noteColor.id}`,
            label: getContextMenuLabel(
              noteColor.labelKey as keyof typeof import("./contextMenuLabels").contextMenuLabels
            ),
            color: noteColor.color,
            onClick: async (context: any) => {
              const action =
                contextMenuActionsRegistry.getAction("updateNodeData");
              if (action && context.nodeId) {
                action(context.nodeId, { color: noteColor.color });
              }
              await onColorChange?.(noteColor.id, context);
            },
          })),
        },
        {
          id: "change-font-size",
          label: getContextMenuLabel("fontSize"),
          icon: "",
          children: noteFontSizes.map(size => ({
            id: `font-size-${size.id}`,
            label: getContextMenuLabel(
              size.labelKey as keyof typeof import("./contextMenuLabels").contextMenuLabels
            ),
            onClick: async (context: any) => {
              const action =
                contextMenuActionsRegistry.getAction("updateNodeData");
              if (action && context.nodeId) {
                action(context.nodeId, { fontSize: size.id });
              }
              await onFontSizeChange?.(size.id, context);
            },
          })),
        },
      ],
    },
  ];
}

/**
 * Create default annotation node context menu items
 */
export function createAnnotationNodeContextMenuItems(
  onColorChange?: (color: string, context: any) => void | Promise<void>,
  onFontSizeChange?: (size: string, context: any) => void | Promise<void>
): ContextMenuItem[] {
  const textColors = [
    { id: "black", labelKey: "black", color: "#000000" },
    { id: "white", labelKey: "white", color: "#ffffff" },
    { id: "red", labelKey: "red", color: "#ef4444" },
    { id: "blue", labelKey: "blue", color: "#3b82f6" },
    { id: "green", labelKey: "green", color: "#10b981" },
    { id: "yellow", labelKey: "yellow", color: "#eab308" },
    { id: "purple", labelKey: "purple", color: "#8b5cf6" },
    { id: "gray", labelKey: "gray", color: "#6b7280" },
  ];

  const noteFontSizes = [
    { id: "xs", labelKey: "extraSmall" },
    { id: "sm", labelKey: "small" },
    { id: "base", labelKey: "base" },
    { id: "lg", labelKey: "large" },
  ];

  return [
    {
      id: "appearance",
      label: getContextMenuLabel("appearance"),
      icon: {
        type: "lucide",
        value: Highlighter,
      },
      children: [
        {
          id: "change-color",
          label: getContextMenuLabel("color"),
          icon: "",
          children: textColors.map(textColor => ({
            id: `color-${textColor.id}`,
            label: getContextMenuLabel(
              textColor.labelKey as keyof typeof import("./contextMenuLabels").contextMenuLabels
            ),
            color: textColor.color,
            onClick: async (context: any) => {
              const action =
                contextMenuActionsRegistry.getAction("updateNodeData");
              if (action && context.nodeId) {
                action(context.nodeId, { color: textColor.color });
              }
              await onColorChange?.(textColor.id, context);
            },
          })),
        },
        {
          id: "change-font-size",
          label: getContextMenuLabel("fontSize"),
          icon: "",
          children: noteFontSizes.map(size => ({
            id: `font-size-${size.id}`,
            label: getContextMenuLabel(
              size.labelKey as keyof typeof import("./contextMenuLabels").contextMenuLabels
            ),
            onClick: async (context: any) => {
              const action =
                contextMenuActionsRegistry.getAction("updateNodeData");
              if (action && context.nodeId) {
                action(context.nodeId, { fontSize: size.id });
              }
              await onFontSizeChange?.(size.id, context);
            },
          })),
        },
      ],
    },
    {
      id: generateSeparatorId(),
      label: "",
      separator: true,
    },
    {
      id: "flip-arrow",
      label: getContextMenuLabel("flipArrow"),
      icon: "↺",
      onClick: async (context: any) => {
        const action = contextMenuActionsRegistry.getAction("updateNodeData");
        if (action && context.nodeId) {
          const currentFlip = context.node?.data?.arrowFlip || false;
          action(context.nodeId, { arrowFlip: !currentFlip });
        }
      },
    },
  ];
}
