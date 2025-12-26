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
export interface ContextMenuConfig {
  id: string;
  name: string;
  description?: string;
  targetType: "node" | "edge" | "canvas" | "all";
  targetNodeTypes?: string[]; // Specific node types
  targetEdgeTypes?: string[]; // Specific edge types
  items: ContextMenuItem[];
  [key: string]: unknown;
}

export class ContextMenuRegistry extends BaseRegistry<ContextMenuConfig> {
  constructor() {
    super("ContextMenuRegistry");
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
          specificItems.push(...config.items);
          return;
        }
        if (targetType === "edge" && config.targetEdgeTypes) {
          if (!config.targetEdgeTypes.includes(specificType)) {
            return;
          }
          // This is a specific menu for this edge type
          specificItems.push(...config.items);
          return;
        }
      }

      // General menu (no specific types or no specific type provided)
      generalItems.push(...config.items);
    });

    // Return specific items if available, otherwise general items
    return specificItems.length > 0 ? specificItems : generalItems;
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
