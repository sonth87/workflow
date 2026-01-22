/**
 * Plugin JSON Loader
 * Load và convert plugin configuration từ JSON
 */

import type { Plugin } from "../plugins/PluginManager";
import type { MultilingualText } from "../types/base.types";
import { CustomNodeFactory } from "./CustomNodeFactory";
import { categoryRegistry } from "../registry/CategoryRegistry";
import { PluginJSONSchema, type PluginJSON } from "./schemas/nodeConfigSchema";

/**
 * Validation result interface
 */
export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

/**
 * Plugin JSON Loader
 */
export class PluginJSONLoader {
  /**
   * Validate plugin JSON configuration
   */
  static validatePlugin(config: unknown): ValidationResult {
    try {
      PluginJSONSchema.parse(config);
      return { valid: true, errors: [] };
    } catch (error: unknown) {
      const errors = (
        error as {
          errors?: Array<{ path: Array<string | number>; message: string }>;
        }
      ).errors?.map(e => `${e.path.join(".")}: ${e.message}`) || [
        error instanceof Error ? error.message : "Unknown error",
      ];
      return { valid: false, errors };
    }
  }

  /**
   * Load plugin from JSON configuration
   */
  static loadPlugin(config: PluginJSON): Plugin {
    // Validate config
    const validation = this.validatePlugin(config);
    if (!validation.valid) {
      throw new Error(
        `Invalid plugin configuration: ${validation.errors.join(", ")}`
      );
    }

    // Create plugin object
    const plugin: Plugin = {
      metadata: {
        id: config.metadata.id,
        name: config.metadata.name as string,
        version: config.metadata.version || "1.0.0",
        description: config.metadata.description as string | undefined,
        author: config.metadata.author,
        dependencies: config.metadata.dependencies,
      },
      config: {
        nodes: [],
        categories: [],
      },
      initialize: async () => {
        // Initializing plugin successfully
        // Plugin: ${config.metadata.id}

        // Register categories first
        if (config.categories) {
          config.categories.forEach(category => {
            categoryRegistry.register({
              id: category.id,
              type: category.id,
              name: category.name as MultilingualText,
              config: {
                id: category.id,
                name: category.name as MultilingualText,
                categoryType: category.id,
                isOpen: true,
                icon: category.icon,
                description: category.description as
                  | MultilingualText
                  | undefined,
                order: category.order || 999,
              },
            });
          });
        }

        // Register nodes using CustomNodeFactory
        if (config.nodes) {
          const result = CustomNodeFactory.registerMany(config.nodes);
          if (result.failed > 0) {
            console.warn(
              `[PluginJSONLoader] ${result.failed} nodes failed to load:`,
              result.errors
            );
          }
          // Successfully loaded plugin nodes
        }
      },
    };

    return plugin;
  }

  /**
   * Load plugin from JSON string
   */
  static loadPluginFromJSON(jsonString: string): Plugin {
    try {
      const config = JSON.parse(jsonString) as PluginJSON;
      return this.loadPlugin(config);
    } catch (error: unknown) {
      throw new Error(
        `Failed to parse plugin JSON: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  }

  /**
   * Load plugin from URL
   */
  static async loadPluginFromURL(url: string): Promise<Plugin> {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch plugin: ${response.statusText}`);
      }
      const config = (await response.json()) as PluginJSON;
      return this.loadPlugin(config);
    } catch (error: unknown) {
      throw new Error(
        `Failed to load plugin from URL: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  }

  /**
   * Load multiple plugins from JSON configs
   */
  static loadPlugins(configs: PluginJSON[]): Plugin[] {
    return configs.map(config => this.loadPlugin(config));
  }
}
