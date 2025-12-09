/**
 * Theme Registry
 * Registry để quản lý themes và color palettes
 */

import type { ThemeConfig, ColorPalette } from "../types/base.types";
import { BaseRegistry } from "./BaseRegistry";
import { DEFAULT_COLOR_PALETTES } from "../constants/colorPalettes";

export class ThemeRegistry extends BaseRegistry<ThemeConfig> {
  private currentTheme: string = "default";
  private colorPalettes: Map<string, ColorPalette> = new Map();

  constructor() {
    super("ThemeRegistry");
    this.initializeColorPalettes();
  }

  /**
   * Initialize default color palettes
   */
  private initializeColorPalettes(): void {
    DEFAULT_COLOR_PALETTES.forEach(palette => {
      this.colorPalettes.set(palette.id, palette);
    });
  }

  /**
   * Register a color palette
   */
  registerColorPalette(palette: ColorPalette): void {
    this.colorPalettes.set(palette.id, palette);
  }

  /**
   * Get a color palette by id
   */
  getColorPalette(id: string): ColorPalette | undefined {
    return this.colorPalettes.get(id);
  }

  /**
   * Get all color palettes
   */
  getAllColorPalettes(): ColorPalette[] {
    return Array.from(this.colorPalettes.values());
  }

  /**
   * Remove a color palette
   */
  removeColorPalette(id: string): boolean {
    return this.colorPalettes.delete(id);
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
