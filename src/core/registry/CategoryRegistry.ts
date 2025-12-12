/**
 * Category Registry
 * Quản lý các categories cho Toolbox
 */

import { BaseRegistry } from "./BaseRegistry";
import { CategoryType } from "@/enum/workflow.enum";
import type { ReactNode } from "react";

/**
 * Category configuration interface
 */
export interface CategoryConfig {
  id: string;
  name: string;
  categoryType: CategoryType | string; // Allow custom category types from plugins
  isOpen?: boolean;
  icon?: ReactNode;
  description?: string;
  order?: number; // Display order in toolbox
  [key: string]: unknown;
}

/**
 * Category Registry
 */
export class CategoryRegistry extends BaseRegistry<CategoryConfig> {
  constructor() {
    super("CategoryRegistry");
  }

  /**
   * Get categories sorted by order
   */
  getAllSorted() {
    return this.getAll().sort((a, b) => {
      const orderA = a.config.order ?? 999;
      const orderB = b.config.order ?? 999;
      return orderA - orderB;
    });
  }

  /**
   * Get category by categoryType
   */
  getByCategoryType(categoryType: string) {
    return this.getAll().find(
      item => item.config.categoryType === categoryType
    );
  }

  /**
   * Check if categoryType exists
   */
  hasCategoryType(categoryType: string): boolean {
    return this.getByCategoryType(categoryType) !== undefined;
  }
}

// Global category registry instance
export const categoryRegistry = new CategoryRegistry();
