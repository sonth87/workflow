/**
 * Context Menu Registry
 * Registry để quản lý context menus cho nodes và edges
 */

import type { ContextMenuItem, ContextMenuContext } from "../types/base.types";
import { BaseRegistry } from "./BaseRegistry";

/**
 * @properties ContextMenuConfig
 * Định nghĩa cấu hình cho một context menu
 * - id: Định danh duy nhất cho context menu
 * - name: Tên hiển thị của context menu
 * - description: Mô tả ngắn về context menu
 * - targetType: Xác định đối tượng chính mà menu áp dụng khi right-click (node, edge, canvas, all)
 * - targetNodeTypes: (chỉ khi targetType là "node"): Lọc thêm loại node cụ thể mà menu áp dụng (note, task, pool, ...)
 * - targetEdgeTypes: (chỉ khi targetType là "edge"): Lọc thêm loại edge cụ thể mà menu áp dụng (sequenceFlow, messageFlow, ...)
 * - items: Mảng các mục menu (ContextMenuItem)
 */
export type DisableDefaultMenuItem =
  | "change-type"
  | "properties"
  | "appearance"
  | "duplicate"
  | "delete"
  | "all";

export interface ContextMenuConfig {
  id: string;
  name: string;
  description?: string;
  targetType: "node" | "edge" | "canvas" | "all";
  targetNodeTypes?: string[]; // Specific node types
  targetEdgeTypes?: string[]; // Specific edge types
  items: ContextMenuItem[];
  disableDefaultItems?: DisableDefaultMenuItem[]; // Disable specific default menu items
  [key: string]: unknown;
}

export class ContextMenuRegistry extends BaseRegistry<ContextMenuConfig> {
  constructor() {
    super("ContextMenuRegistry");
  }

  /**
   * Clean up orphan separators from menu items
   * Remove separators at start/end and duplicate separators
   */
  private cleanupSeparators(items: ContextMenuItem[]): ContextMenuItem[] {
    if (items.length === 0) return items;

    let result = [...items];

    // Remove separators at the beginning
    while (result.length > 0 && result[0].separator) {
      result.shift();
    }

    // Remove separators at the end
    while (result.length > 0 && result[result.length - 1].separator) {
      result.pop();
    }

    // Remove consecutive separators (keep only one)
    result = result.filter((item, index, array) => {
      if (!item.separator) return true;

      // Keep separator only if previous item is not a separator
      const prevItem = array[index - 1];
      return prevItem && !prevItem.separator;
    });

    return result;
  }

  /**
   * Merge custom context menu items with base/default items
   * Insert custom items before Properties/Appearance/Duplicate/Delete
   * Filter out disabled default items
   */
  private mergeContextMenuItems(
    baseItems: ContextMenuItem[],
    customItems: ContextMenuItem[],
    disableDefaultItems?: DisableDefaultMenuItem[]
  ): ContextMenuItem[] {
    if (customItems.length === 0) {
      return baseItems;
    }

    if (baseItems.length === 0) {
      return customItems;
    }

    // Filter out disabled items from base items
    let filteredBaseItems = baseItems;
    if (disableDefaultItems && disableDefaultItems.length > 0) {
      // Map disable items to their corresponding menu item IDs
      const disabledIds = new Set<string>();

      disableDefaultItems.forEach(disableItem => {
        if (disableItem === "all") {
          // Disable all default items
          disabledIds.add("change-type");
          disabledIds.add("properties");
          disabledIds.add("appearance");
          disabledIds.add("duplicate");
          disabledIds.add("delete");
        } else {
          disabledIds.add(disableItem);
        }
      });

      // First pass: Remove disabled items
      filteredBaseItems = baseItems.filter(item => {
        return !disabledIds.has(item.id);
      });

      // Second pass: Clean up orphan separators
      filteredBaseItems = this.cleanupSeparators(filteredBaseItems);
    }

    // Find the index to insert custom items (before "properties" item)
    const propertiesIndex = filteredBaseItems.findIndex(
      item => item.id === "properties"
    );

    if (propertiesIndex === -1) {
      // If no properties item found, append custom items at the end
      return [...filteredBaseItems, ...customItems];
    }

    // Insert custom items before properties
    const result = [...filteredBaseItems];

    // Check if there's already a separator before properties
    const hasSeparatorBefore =
      propertiesIndex > 0 && result[propertiesIndex - 1]?.separator;

    if (!hasSeparatorBefore) {
      // Add separator before custom items
      result.splice(propertiesIndex, 0, {
        id: `separator-custom-${Date.now()}`,
        label: "",
        separator: true,
      });
    }

    // Insert custom items after the separator, before properties
    result.splice(
      propertiesIndex + (hasSeparatorBefore ? 0 : 1),
      0,
      ...customItems
    );

    // Add separator after custom items
    result.splice(
      propertiesIndex + customItems.length + (hasSeparatorBefore ? 0 : 1),
      0,
      {
        id: `separator-custom-after-${Date.now()}`,
        label: "",
        separator: true,
      }
    );

    // Final cleanup of separators
    return this.cleanupSeparators(result);
  }

  /**
   * Get context menu items for a specific node type
   */
  getNodeContextMenu(
    nodeType: string,
    context: ContextMenuContext
  ): ContextMenuItem[] {
    return this.getContextMenuItems("node", nodeType, context);
  }

  /**
   * Get context menu items for a specific edge type
   */
  getEdgeContextMenu(
    edgeType: string,
    context: ContextMenuContext
  ): ContextMenuItem[] {
    return this.getContextMenuItems("edge", edgeType, context);
  }

  /**
   * Get canvas context menu items
   */
  getCanvasContextMenu(context: ContextMenuContext): ContextMenuItem[] {
    return this.getContextMenuItems("canvas", undefined, context);
  }

  /**
   * Get context menu items
   */
  private getContextMenuItems(
    targetType: "node" | "edge" | "canvas",
    specificType?: string,
    context?: ContextMenuContext
  ): ContextMenuItem[] {
    const specificItems: ContextMenuItem[] = [];
    const generalItems: ContextMenuItem[] = [];
    let hasSpecificMenu = false;
    let disableDefaultItems: DisableDefaultMenuItem[] | undefined;

    this.getAll().forEach(item => {
      const config = item.config;

      // Check if this menu applies to the target type
      if (config.targetType !== targetType && config.targetType !== "all") {
        return;
      }

      // Check specific types
      if (specificType) {
        if (targetType === "node" && config.targetNodeTypes) {
          if (!config.targetNodeTypes.includes(specificType)) {
            return;
          }
          // This is a specific menu for this node type
          hasSpecificMenu = true;
          specificItems.push(...config.items);
          disableDefaultItems = config.disableDefaultItems;
          return;
        }
        if (targetType === "edge" && config.targetEdgeTypes) {
          if (!config.targetEdgeTypes.includes(specificType)) {
            return;
          }
          // This is a specific menu for this edge type
          hasSpecificMenu = true;
          specificItems.push(...config.items);
          return;
        }
      }

      // General menu (no specific types or no specific type provided)
      if (!config.targetNodeTypes && !config.targetEdgeTypes) {
        generalItems.push(...config.items);
      }
    });

    // If specific items found
    if (hasSpecificMenu && specificItems.length > 0) {
      // Check if specific items already contain default menu structure
      // (by checking if Properties, Appearance, Duplicate, Delete exist)
      const hasDefaultStructure = specificItems.some(
        item =>
          item.id === "properties" ||
          item.id === "appearance" ||
          item.id === "duplicate" ||
          item.id === "delete"
      );

      if (hasDefaultStructure) {
        // Already merged, return as is
        return specificItems;
      } else {
        // Custom items only, merge with general items
        if (generalItems.length > 0) {
          return this.mergeContextMenuItems(
            generalItems,
            specificItems,
            disableDefaultItems
          );
        }
        return specificItems;
      }
    }

    // Return general items
    return generalItems;
  }

  /**
   * Execute context menu action
   */
  async executeAction(
    itemId: string,
    context: ContextMenuContext
  ): Promise<void> {
    // Find the menu item across all registered menus
    for (const registryItem of this.getAll()) {
      const menuItem = this.findMenuItem(registryItem.config.items, itemId);
      if (menuItem?.onClick) {
        await menuItem.onClick(context);
        return;
      }
    }

    console.warn(
      `Context menu item "${itemId}" not found or has no onClick handler`
    );
  }

  /**
   * Helper to find menu item recursively
   */
  private findMenuItem(
    items: ContextMenuItem[],
    id: string
  ): ContextMenuItem | undefined {
    for (const item of items) {
      if (item.id === id) {
        return item;
      }
      if (item.children) {
        const found = this.findMenuItem(item.children, id);
        if (found) return found;
      }
    }
    return undefined;
  }
}

// Global context menu registry instance
export const contextMenuRegistry = new ContextMenuRegistry();
