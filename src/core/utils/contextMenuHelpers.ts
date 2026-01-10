/**
 * Context Menu Helpers
 * Utility functions for creating common context menu items
 */

import type {
  ContextMenuItem,
  NodeVisualConfig,
  EdgeVisualConfig,
} from "../types/base.types";
import { themeRegistry } from "../registry/ThemeRegistry";
import { contextMenuActionsRegistry } from "../registry/ContextMenuActionsRegistry";
import { Copy, Settings2, Tags, Trash2 } from "lucide-react";

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
      label: "Reset Color",
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
    label: "Change Color",
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
    label: "Delete",
    icon: {
      type: "lucide",
      value: Trash2,
      color: "red",
    },
    onClick: onDelete,
  };
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
    { id: "solid", label: "Solid", icon: "━" },
    { id: "dashed", label: "Dashed", icon: "╍" },
    { id: "dotted", label: "Dotted", icon: "┄" },
    { id: "double", label: "Double", icon: "═" },
  ];

  return borderStyles.map(style => ({
    id: `border-style-${style.id}`,
    label: style.label,
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
  onDelete: (context: any) => void | Promise<void>
): ContextMenuItem[] {
  return [
    {
      id: "appearance",
      label: "Appearance",
      icon: "",
      children: [
        createColorPickerMenuItem(onColorChange),
        {
          id: "change-border-style",
          label: "Border Style",
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
      id: "properties",
      label: "Properties",
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
      id: "duplicate",
      label: "Duplicate",
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
    createDeleteMenuItem(onDelete),
    {
      id: generateSeparatorId(),
      label: "",
      separator: true,
    },
    {
      id: "collapse",
      label: "Collapse",
      icon: "▼",
      onClick: async (context: any) => {
        console.log("Collapse node:", context.nodeId);
      },
      visible: (context: any) => !context.node?.collapsed,
    },
    {
      id: "expand",
      label: "Expand",
      icon: "▶",
      onClick: async (context: any) => {
        console.log("Expand node:", context.nodeId);
      },
      visible: (context: any) => context.node?.collapsed === true,
    },
  ];
}

/**
 * Create edge path type submenu items
 */
export function createPathTypeMenuItems(
  onPathTypeChange: (pathType: string, context: any) => void | Promise<void>
): ContextMenuItem[] {
  const pathTypes = [
    { id: "bezier", label: "Bezier (Curved)", icon: "⤴" },
    { id: "straight", label: "Straight", icon: "→" },
    { id: "step", label: "Step", icon: "⌐" },
  ];

  return pathTypes.map(type => ({
    id: `path-type-${type.id}`,
    label: type.label,
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
    { id: "solid", label: "Solid", icon: "━" },
    { id: "dashed", label: "Dashed", icon: "╍" },
    { id: "dotted", label: "Dotted", icon: "┄" },
  ];

  return pathStyles.map(style => ({
    id: `path-style-${style.id}`,
    label: style.label,
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
      label: "Enable",
      onClick: async (context: any) => {
        await onAnimationChange(true, context);
      },
    },
    {
      id: "animation-disable",
      label: "Disable",
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
      label: "Label at Start",
      onClick: async (context: any) => {
        await onAddLabel("start", context);
      },
    },
    {
      id: "add-label-center",
      label: "Label at Center",
      onClick: async (context: any) => {
        await onAddLabel("center", context);
      },
    },
    {
      id: "add-label-end",
      label: "Label at End",
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
      label: "Appearance",
      icon: "",
      children: [
        createColorPickerMenuItem(onColorChange),
        {
          id: generateSeparatorId(),
          label: "",
          separator: true,
        },
        {
          id: "change-path-type",
          label: "Path Type",
          icon: "⤴",
          children: createPathTypeMenuItems(onPathTypeChange),
        },
        {
          id: "change-path-style",
          label: "Path Style",
          icon: "━",
          children: createEdgePathStyleMenuItems(onPathStyleChange),
        },
        {
          id: "change-animation",
          label: "Animation",
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
      label: "Add Label",
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
      label: "Properties",
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
    { id: "yellow", label: "Yellow", color: "#fde68a" },
    { id: "blue", label: "Blue", color: "#bfdbfe" },
    { id: "green", label: "Green", color: "#d9f99d" },
    { id: "pink", label: "Pink", color: "#fecdd3" },
    { id: "purple", label: "Purple", color: "#ddd6fe" },
    { id: "orange", label: "Orange", color: "#fed7aa" },
    { id: "gray", label: "Gray", color: "#e4e4e7" },
    { id: "transparent", label: "Transparent", color: "transparent" },
  ];

  const noteFontSizes = [
    { id: "xs", label: "Extra Small" },
    { id: "sm", label: "Small" },
    { id: "base", label: "Base" },
    { id: "lg", label: "Large" },
  ];

  return [
    {
      id: "appearance",
      label: "Appearance",
      icon: "",
      children: [
        {
          id: "change-color",
          label: "Color",
          icon: "",
          children: noteColors.map(noteColor => ({
            id: `color-${noteColor.id}`,
            label: noteColor.label,
            color: noteColor.color,
            onClick: async (context: any) => {
              const action = contextMenuActionsRegistry.getAction("updateNodeData");
              if (action && context.nodeId) {
                action(context.nodeId, { color: noteColor.color });
              }
              await onColorChange?.(noteColor.id, context);
            },
          })),
        },
        {
          id: "change-font-size",
          label: "Font Size",
          icon: "",
          children: noteFontSizes.map(size => ({
            id: `font-size-${size.id}`,
            label: size.label,
        onClick: async (context: any) => {
          const action = contextMenuActionsRegistry.getAction("updateNodeData");
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
    { id: "black", label: "Black", color: "#000000" },
    { id: "white", label: "White", color: "#ffffff" },
    { id: "red", label: "Red", color: "#ef4444" },
    { id: "blue", label: "Blue", color: "#3b82f6" },
    { id: "green", label: "Green", color: "#10b981" },
    { id: "yellow", label: "Yellow", color: "#eab308" },
    { id: "purple", label: "Purple", color: "#8b5cf6" },
    { id: "gray", label: "Gray", color: "#6b7280" },
  ];

  const noteFontSizes = [
    { id: "xs", label: "Extra Small" },
    { id: "sm", label: "Small" },
    { id: "base", label: "Base" },
    { id: "lg", label: "Large" },
  ];

  return [
    {
      id: "appearance",
      label: "Appearance",
      icon: "",
      children: [
        {
          id: "change-color",
          label: "Color",
          icon: "",
          children: textColors.map(textColor => ({
            id: `color-${textColor.id}`,
            label: textColor.label,
            color: textColor.color,
            onClick: async (context: any) => {
              const action = contextMenuActionsRegistry.getAction("updateNodeData");
              if (action && context.nodeId) {
                action(context.nodeId, { color: textColor.color });
              }
              await onColorChange?.(textColor.id, context);
            },
          })),
        },
        {
          id: "change-font-size",
          label: "Font Size",
          icon: "",
          children: noteFontSizes.map(size => ({
            id: `font-size-${size.id}`,
            label: size.label,
            onClick: async (context: any) => {
              const action = contextMenuActionsRegistry.getAction("updateNodeData");
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
      label: "Flip Arrow",
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
