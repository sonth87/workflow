/**
 * Node Registry
 * Registry để quản lý các node types
 */

import type { BaseNodeConfig, RegistryItem } from "../types/base.types";
import { BaseRegistry } from "./BaseRegistry";

export class NodeRegistry extends BaseRegistry<BaseNodeConfig> {
  constructor() {
    super("NodeRegistry");
  }

  /**
   * Get node item (với inheritance)
   */
  get(id: string): RegistryItem<BaseNodeConfig> | undefined {
    return this.getWithInheritance(id);
  }

  /**
   * Internal get với circular check
   */
  private getWithInheritance(
    id: string,
    visited: Set<string> = new Set()
  ): RegistryItem<BaseNodeConfig> | undefined {
    const item = super.get(id);
    if (!item || !item.extends) {
      return item;
    }

    if (visited.has(id)) {
      console.error(`Circular inheritance detected for node type "${id}"`);
      return item;
    }

    visited.add(id);

    // Resolve inheritance
    const parentItem = this.getWithInheritance(item.extends, visited);
    if (!parentItem) {
      console.warn(`Parent node type "${item.extends}" not found for "${id}"`);
      return item;
    }

    // Merge parent config with current config
    return {
      ...parentItem,
      ...item,
      category: item.category || parentItem.category,
      icon: this.mergeIcons(parentItem.icon, item.icon),
      config: this.mergeConfigs(parentItem.config, item.config),
      metadata: { ...parentItem.metadata, ...item.metadata },
    };
  }

  /**
   * Override getAll to support inheritance for all items
   */
  getAll(): RegistryItem<BaseNodeConfig>[] {
    return super.getAll().map(item => this.get(item.id)!);
  }

  /**
   * Merge two node configurations
   */
  private mergeConfigs(
    parent: BaseNodeConfig,
    child: BaseNodeConfig
  ): BaseNodeConfig {
    return {
      ...parent,
      ...child,
      category: child.category || parent.category,
      icon: this.mergeIcons(parent.icon, child.icon),
      visualConfig: {
        ...(parent.visualConfig || {}),
        ...(child.visualConfig || {}),
      },
      metadata: {
        ...(parent.metadata || {}),
        ...(child.metadata || {}),
      },
      data: {
        ...(parent.data || {}),
        ...(child.data || {}),
      },
      properties: {
        ...(parent.properties || {}),
        ...(child.properties || {}),
      },
      propertyDefinitions: this.mergePropertyDefinitions(
        parent.propertyDefinitions,
        child.propertyDefinitions
      ),
      connectionRules: this.mergeConnectionRules(
        parent.connectionRules,
        child.connectionRules
      ),
    };
  }

  /**
   * Merge two icons
   */
  private mergeIcons(parent?: any, child?: any): any {
    if (!parent) return child;
    if (!child) return parent;

    return {
      ...parent,
      ...child,
    };
  }

  private mergePropertyDefinitions(
    parent?: any[],
    child?: any[]
  ): any[] | undefined {
    if (!parent) return child;
    if (!child) return parent;

    const merged = [...parent];
    child.forEach(childProp => {
      const index = merged.findIndex(p => p.id === childProp.id);
      if (index > -1) {
        merged[index] = { ...merged[index], ...childProp };
      } else {
        merged.push(childProp);
      }
    });
    return merged;
  }

  private mergeConnectionRules(
    parent?: any[],
    child?: any[]
  ): any[] | undefined {
    if (!parent) return child;
    if (!child) return parent;
    // For connection rules, we might want to combine them or override.
    // Usually, we combine them.
    return [...parent, ...child];
  }

  /**
   * Get node renderer component
   */
  getRenderer(nodeType: string): React.ComponentType<any> | undefined {
    const item = this.get(nodeType);
    return (item?.config as any)?.renderer;
  }

  /**
   * Create node instance với default values
   */
  createNode(
    nodeType: string,
    overrides?: Partial<BaseNodeConfig>
  ): BaseNodeConfig | null {
    const item = this.get(nodeType);
    if (!item) {
      console.error(`Node type "${nodeType}" not found in registry`);
      return null;
    }

    const defaultConfig = item.config;

    return {
      ...defaultConfig,
      ...overrides,
      id: overrides?.id || `${nodeType}-${Date.now()}`,
      data: {
        ...defaultConfig.data,
        ...overrides?.data,
        // Use metadata.title (translation key) instead of item.name (English text)
        label:
          defaultConfig.metadata?.title ||
          item.name ||
          overrides?.data?.label ||
          "New Node",
        // Pass metadata into data so it's accessible in React components
        metadata: {
          ...defaultConfig.metadata,
          ...(overrides?.data?.metadata || {}),
        },
        // Pass icon into data for rendering
        icon: defaultConfig.icon,
        // Pass visualConfig into data
        visualConfig: defaultConfig.visualConfig,
      },
      metadata: {
        ...defaultConfig.metadata,
        ...overrides?.metadata,
      },
      properties: {
        ...defaultConfig.properties,
        ...overrides?.properties,
        // Use metadata.title (translation key) for properties label as well
        label:
          defaultConfig.metadata?.title ||
          item.name ||
          overrides?.properties?.label ||
          "New Node",
      },
    } as BaseNodeConfig;
  }

  /**
   * Validate node configuration
   */
  validateNode(node: BaseNodeConfig): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!node.id) {
      errors.push("Node id is required");
    }

    if (!node.nodeType) {
      errors.push("Node type is required");
    }

    if (!this.has(node.nodeType)) {
      errors.push(`Node type "${node.nodeType}" is not registered`);
    }

    // Validate required properties
    if (node.propertyDefinitions) {
      node.propertyDefinitions.forEach(propDef => {
        if (propDef.required && !node.properties?.[propDef.id]) {
          errors.push(`Property "${propDef.label}" is required`);
        }
      });
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Get nodes by category - override to check config.category
   */
  getByCategory(category: string): RegistryItem<BaseNodeConfig>[] {
    return this.getAll().filter(item => {
      // Check both item.category and item.config.category
      return item.category === category || item.config?.category === category;
    });
  }
}

// Global node registry instance
export const nodeRegistry = new NodeRegistry();
