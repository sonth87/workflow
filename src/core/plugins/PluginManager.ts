/**
 * Plugin System
 * Hệ thống plugin cho phép external systems register custom functionality
 */

import type {
  BaseNodeConfig,
  BaseEdgeConfig,
  BaseRuleConfig,
  ThemeConfig,
} from "../types/base.types";
import type { ContextMenuConfig } from "../registry/ContextMenuRegistry";
import type { CategoryConfig } from "../registry/CategoryRegistry";
import type {
  PropertyGroupDefinition,
  PropertyFieldDefinition,
} from "../properties";
import type { PropertyDefinition } from "../types/base.types";
import { nodeRegistry } from "../registry/NodeRegistry";
import { edgeRegistry } from "../registry/EdgeRegistry";
import { ruleRegistry } from "../registry/RuleRegistry";
import { themeRegistry } from "../registry/ThemeRegistry";
import { contextMenuRegistry } from "../registry/ContextMenuRegistry";
import { categoryRegistry } from "../registry/CategoryRegistry";
import { propertyRegistry } from "../properties";
import { globalEventBus, WorkflowEventTypes } from "../events/EventBus";

/**
 * Convert propertyDefinitions array thành propertyGroups
 */
function convertPropertyDefinitionsToGroups(
  propertyDefinitions?: PropertyDefinition[]
): PropertyGroupDefinition[] {
  if (!propertyDefinitions || propertyDefinitions.length === 0) {
    return [];
  }

  // Group fields by group
  const groupsMap = new Map<string, PropertyFieldDefinition[]>();

  propertyDefinitions.forEach(propDef => {
    const groupId = propDef.group || "custom";
    if (!groupsMap.has(groupId)) {
      groupsMap.set(groupId, []);
    }

    // Convert PropertyDefinition to PropertyFieldDefinition
    const fieldDef: PropertyFieldDefinition = {
      id: propDef.id,
      label: propDef.label,
      type: propDef.type as any, // Assume compatible
      defaultValue: propDef.defaultValue,
      required: propDef.required,
      placeholder: propDef.placeholder,
      helpText: propDef.description,
      options: propDef.options
        ? {
            options: propDef.options.map(opt => ({
              label: opt.label,
              value: opt.value as string | number | boolean,
            })),
          }
        : undefined,
      order: 0, // Will be set later
      group: groupId,
    };

    groupsMap.get(groupId)!.push(fieldDef);
  });

  // Convert to PropertyGroupDefinition array
  const groups: PropertyGroupDefinition[] = [];
  let order = 1;

  groupsMap.forEach((fields, groupId) => {
    // Sort fields by order (not implemented yet, assume insertion order)
    // Set order: basic=1, custom=90, others increment
    const groupOrder =
      groupId === "basic" ? 1 : groupId === "custom" ? 90 : order++;
    groups.push({
      id: groupId,
      label: groupId.charAt(0).toUpperCase() + groupId.slice(1), // Capitalize
      order: groupOrder,
      fields,
    });
  });

  return groups;
}

/**
 * Plugin metadata
 */
export interface PluginMetadata {
  id: string;
  name: string;
  version: string;
  description?: string;
  author?: string;
  dependencies?: string[]; // Other plugin ids this plugin depends on
  [key: string]: unknown;
}

/**
 * Plugin configuration
 */
export interface PluginConfig {
  nodes?: Array<{
    id: string;
    type: string;
    name: string;
    config: BaseNodeConfig;
  }>;
  edges?: Array<{
    id: string;
    type: string;
    name: string;
    config: BaseEdgeConfig;
  }>;
  rules?: Array<{
    id: string;
    type: string;
    name: string;
    config: BaseRuleConfig;
  }>;
  themes?: Array<{
    id: string;
    type: string;
    name: string;
    config: ThemeConfig;
  }>;
  contextMenus?: Array<{
    id: string;
    type: string;
    name: string;
    config: ContextMenuConfig;
  }>;
  categories?: Array<{
    id: string;
    type: string;
    name: string;
    config: CategoryConfig;
  }>;
  [key: string]: unknown;
}

/**
 * Plugin interface
 */
export interface Plugin {
  metadata: PluginMetadata;
  config: PluginConfig;

  // Lifecycle hooks
  onInstall?: () => void | Promise<void>;
  onUninstall?: () => void | Promise<void>;
  onActivate?: () => void | Promise<void>;
  onDeactivate?: () => void | Promise<void>;

  // Custom initialization
  initialize?: () => void | Promise<void>;

  [key: string]: unknown;
}

/**
 * Plugin Manager
 */
export class PluginManager {
  private plugins: Map<string, Plugin> = new Map();
  private activePlugins: Set<string> = new Set();
  private installedPlugins: Set<string> = new Set();

  /**
   * Install a plugin
   */
  async install(plugin: Plugin): Promise<void> {
    const { id } = plugin.metadata;

    if (this.plugins.has(id)) {
      throw new Error(`Plugin "${id}" is already installed`);
    }

    // Check dependencies
    if (plugin.metadata.dependencies) {
      for (const depId of plugin.metadata.dependencies) {
        if (!this.installedPlugins.has(depId)) {
          throw new Error(
            `Plugin "${id}" requires plugin "${depId}" to be installed first`
          );
        }
      }
    }

    // Store plugin
    this.plugins.set(id, plugin);
    this.installedPlugins.add(id);

    // Call onInstall hook
    if (plugin.onInstall) {
      await plugin.onInstall();
    }

    globalEventBus.emit(WorkflowEventTypes.PLUGIN_LOADED, { plugin });
  }

  /**
   * Uninstall a plugin
   */
  async uninstall(pluginId: string): Promise<void> {
    const plugin = this.plugins.get(pluginId);
    if (!plugin) {
      throw new Error(`Plugin "${pluginId}" is not installed`);
    }

    // Deactivate if active
    if (this.activePlugins.has(pluginId)) {
      await this.deactivate(pluginId);
    }

    // Call onUninstall hook
    if (plugin.onUninstall) {
      await plugin.onUninstall();
    }

    // Unregister all plugin resources
    this.unregisterPluginResources(plugin);

    // Remove plugin
    this.plugins.delete(pluginId);
    this.installedPlugins.delete(pluginId);

    globalEventBus.emit(WorkflowEventTypes.PLUGIN_UNLOADED, { pluginId });
  }

  /**
   * Activate a plugin
   */
  async activate(pluginId: string): Promise<void> {
    const plugin = this.plugins.get(pluginId);
    if (!plugin) {
      throw new Error(`Plugin "${pluginId}" is not installed`);
    }

    if (this.activePlugins.has(pluginId)) {
      console.warn(`Plugin "${pluginId}" is already active`);
      return;
    }

    // Register plugin resources
    this.registerPluginResources(plugin);

    // Call initialize
    if (plugin.initialize) {
      await plugin.initialize();
    }

    // Call onActivate hook
    if (plugin.onActivate) {
      await plugin.onActivate();
    }

    this.activePlugins.add(pluginId);
  }

  /**
   * Deactivate a plugin
   */
  async deactivate(pluginId: string): Promise<void> {
    const plugin = this.plugins.get(pluginId);
    if (!plugin) {
      throw new Error(`Plugin "${pluginId}" is not installed`);
    }

    if (!this.activePlugins.has(pluginId)) {
      console.warn(`Plugin "${pluginId}" is not active`);
      return;
    }

    // Call onDeactivate hook
    if (plugin.onDeactivate) {
      await plugin.onDeactivate();
    }

    // Unregister plugin resources
    this.unregisterPluginResources(plugin);

    this.activePlugins.delete(pluginId);
  }

  /**
   * Register plugin resources to registries
   */
  private registerPluginResources(plugin: Plugin): void {
    const { config } = plugin;

    // Register categories first (before nodes)
    if (config.categories) {
      categoryRegistry.registerMany(config.categories);
    }

    // Register nodes
    if (config.nodes) {
      nodeRegistry.registerMany(config.nodes);

      // Register property configurations for nodes that have propertyDefinitions
      config.nodes.forEach(node => {
        if (node.config.propertyDefinitions) {
          const propertyGroups = convertPropertyDefinitionsToGroups(
            node.config.propertyDefinitions
          );
          propertyRegistry.registerNodeConfig({
            nodeType: node.type,
            propertyGroups,
          });
        }
      });
    }

    // Register edges
    if (config.edges) {
      edgeRegistry.registerMany(config.edges);
    }

    // Register rules
    if (config.rules) {
      ruleRegistry.registerMany(config.rules);
    }

    // Register themes
    if (config.themes) {
      themeRegistry.registerMany(config.themes);
    }

    // Register context menus
    if (config.contextMenus) {
      contextMenuRegistry.registerMany(config.contextMenus);
    }
  }

  /**
   * Unregister plugin resources from registries
   */
  private unregisterPluginResources(plugin: Plugin): void {
    const { config } = plugin;

    // Unregister nodes
    if (config.nodes) {
      config.nodes.forEach(node => nodeRegistry.unregister(node.id));
      // Unregister property configurations
      config.nodes.forEach(node => {
        if (node.config.propertyDefinitions) {
          propertyRegistry.unregisterNodeConfig(node.type);
        }
      });
    }

    // Unregister edges
    if (config.edges) {
      config.edges.forEach(edge => edgeRegistry.unregister(edge.id));
    }

    // Unregister rules
    if (config.rules) {
      config.rules.forEach(rule => ruleRegistry.unregister(rule.id));
    }

    // Unregister themes
    if (config.themes) {
      config.themes.forEach(theme => themeRegistry.unregister(theme.id));
    }

    // Unregister context menus
    if (config.contextMenus) {
      config.contextMenus.forEach(menu =>
        contextMenuRegistry.unregister(menu.id)
      );
    }

    // Unregister categories
    if (config.categories) {
      config.categories.forEach(category =>
        categoryRegistry.unregister(category.id)
      );
    }
  }

  /**
   * Get plugin
   */
  getPlugin(pluginId: string): Plugin | undefined {
    return this.plugins.get(pluginId);
  }

  /**
   * Get all plugins
   */
  getAllPlugins(): Plugin[] {
    return Array.from(this.plugins.values());
  }

  /**
   * Get active plugins
   */
  getActivePlugins(): Plugin[] {
    return Array.from(this.activePlugins)
      .map(id => this.plugins.get(id))
      .filter(Boolean) as Plugin[];
  }

  /**
   * Check if plugin is installed
   */
  isInstalled(pluginId: string): boolean {
    return this.installedPlugins.has(pluginId);
  }

  /**
   * Check if plugin is active
   */
  isActive(pluginId: string): boolean {
    return this.activePlugins.has(pluginId);
  }
}

// Global plugin manager instance
export const pluginManager = new PluginManager();
