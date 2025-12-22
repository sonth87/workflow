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
      id: "separator-color",
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
    createColorPickerMenuItem(onColorChange),
    {
      id: "change-border-style",
      label: "Border Style",
      icon: "",
      children: createNodeBorderStyleMenuItems(onBorderStyleChange),
    },
    {
      id: "separator-0",
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
      id: "separator-1",
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
      id: "separator-2",
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
    createColorPickerMenuItem(onColorChange),
    {
      id: "separator-0",
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
    {
      id: "separator-1",
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
      id: "separator-2",
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
      id: "separator-3",
      label: "",
      separator: true,
    },
    createDeleteMenuItem(onDelete),
  ];
}
