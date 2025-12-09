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

/**
 * Create color submenu items from color palettes
 */
export function createColorMenuItems(
  onColorChange: (paletteId: string, context: any) => void | Promise<void>
): ContextMenuItem[] {
  const palettes = themeRegistry.getAllColorPalettes();

  return palettes.map(palette => ({
    id: `color-${palette.id}`,
    label: palette.name,
    onClick: async (context: any) => {
      await onColorChange(palette.id, context);
    },
  }));
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
    onClick: onDelete,
  };
}

/**
 * Convert color palette to NodeVisualConfig
 */
export function paletteToNodeVisualConfig(paletteId: string): NodeVisualConfig {
  const palette = themeRegistry.getColorPalette(paletteId);
  if (!palette) {
    console.warn(`Color palette "${paletteId}" not found`);
    return {};
  }

  return {
    backgroundColor: palette.background,
    borderColor: palette.border || palette.primary,
    borderStyle: "solid",
    borderWidth: 2,
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
 * Create default node context menu items
 */
export function createDefaultNodeContextMenuItems(
  onColorChange: (paletteId: string, context: any) => void | Promise<void>,
  onDelete: (context: any) => void | Promise<void>
): ContextMenuItem[] {
  return [
    createColorPickerMenuItem(onColorChange),
    {
      id: "separator-1",
      label: "",
      separator: true,
    },
    createDeleteMenuItem(onDelete),
    {
      id: "separator-2",
      label: "",
      separator: true,
    },
    {
      id: "duplicate",
      label: "Duplicate",
      onClick: async (context: any) => {
        console.log("Duplicate node:", context.nodeId);
      },
    },
    {
      id: "collapse",
      label: "Collapse",
      onClick: async (context: any) => {
        console.log("Collapse node:", context.nodeId);
      },
      visible: (context: any) => !context.node?.collapsed,
    },
    {
      id: "expand",
      label: "Expand",
      onClick: async (context: any) => {
        console.log("Expand node:", context.nodeId);
      },
      visible: (context: any) => context.node?.collapsed === true,
    },
  ];
}

/**
 * Create default edge context menu items
 */
export function createDefaultEdgeContextMenuItems(
  onColorChange: (paletteId: string, context: any) => void | Promise<void>,
  onDelete: (context: any) => void | Promise<void>
): ContextMenuItem[] {
  return [
    createColorPickerMenuItem(onColorChange),
    {
      id: "separator-1",
      label: "",
      separator: true,
    },
    createDeleteMenuItem(onDelete),
    {
      id: "separator-2",
      label: "",
      separator: true,
    },
    {
      id: "add-label",
      label: "Add Label",
      onClick: async (context: any) => {
        console.log("Add label to edge:", context.edgeId);
      },
    },
  ];
}
