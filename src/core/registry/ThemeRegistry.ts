/**
 * Theme Registry
 * Registry để quản lý themes
 */

import type { ThemeConfig } from "../types/base.types";
import { BaseRegistry } from "./BaseRegistry";

export class ThemeRegistry extends BaseRegistry<ThemeConfig> {
  private currentTheme: string = "default";

  constructor() {
    super("ThemeRegistry");
  }

  /**
   * Set current theme
   */
  setCurrentTheme(themeId: string): boolean {
    if (!this.has(themeId)) {
      console.error(`Theme "${themeId}" not found in registry`);
      return false;
    }

    this.currentTheme = themeId;
    return true;
  }

  /**
   * Get current theme
   */
  getCurrentTheme(): ThemeConfig | undefined {
    return this.getConfig(this.currentTheme);
  }

  /**
   * Get current theme id
   */
  getCurrentThemeId(): string {
    return this.currentTheme;
  }

  /**
   * Get color from current theme
   */
  getColor(colorKey: string): string | undefined {
    const theme = this.getCurrentTheme();
    return theme?.colors[colorKey];
  }

  /**
   * Get style from current theme
   */
  getStyle(): Record<string, unknown> | undefined {
    const theme = this.getCurrentTheme();
    return theme?.styles;
  }
}

// Global theme registry instance
export const themeRegistry = new ThemeRegistry();
