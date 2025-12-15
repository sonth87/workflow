/**
 * Node Registry
 * Registry để quản lý các node types
 */

import type { BaseNodeConfig } from "../types/base.types";
import { BaseRegistry } from "./BaseRegistry";

export class NodeRegistry extends BaseRegistry<BaseNodeConfig> {
  constructor() {
    super("NodeRegistry");
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
        label: item.name || "New Node",
        ...defaultConfig.data,
        ...overrides?.data,
        // Pass metadata into data so it's accessible in React components
        metadata: {
          ...defaultConfig.metadata,
          ...overrides?.metadata,
        },
      },
      metadata: {
        ...defaultConfig.metadata,
        ...overrides?.metadata,
      },
      properties: {
        ...defaultConfig.properties,
        ...overrides?.properties,
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
}

// Global node registry instance
export const nodeRegistry = new NodeRegistry();
