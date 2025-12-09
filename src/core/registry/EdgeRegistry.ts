/**
 * Edge Registry
 * Registry để quản lý các edge types
 */

import type { BaseEdgeConfig } from "../types/base.types";
import { BaseRegistry } from "./BaseRegistry";

export class EdgeRegistry extends BaseRegistry<BaseEdgeConfig> {
  constructor() {
    super("EdgeRegistry");
  }

  /**
   * Get edge renderer component
   */
  getRenderer(edgeType: string): React.ComponentType<any> | undefined {
    const item = this.get(edgeType);
    return (item?.config as any)?.renderer;
  }

  /**
   * Create edge instance với default values
   */
  createEdge(
    edgeType: string,
    source: string,
    target: string,
    overrides?: Partial<BaseEdgeConfig>
  ): BaseEdgeConfig | null {
    const item = this.get(edgeType);
    if (!item) {
      console.error(`Edge type "${edgeType}" not found in registry`);
      return null;
    }

    const defaultConfig = item.config;

    return {
      ...defaultConfig,
      ...overrides,
      id: overrides?.id || `${source}-${target}-${Date.now()}`,
      source,
      target,
      metadata: {
        ...defaultConfig.metadata,
        ...overrides?.metadata,
      },
      properties: {
        ...defaultConfig.properties,
        ...overrides?.properties,
      },
    } as BaseEdgeConfig;
  }

  /**
   * Validate edge configuration
   */
  validateEdge(edge: BaseEdgeConfig): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!edge.id) {
      errors.push("Edge id is required");
    }

    if (!edge.source) {
      errors.push("Edge source is required");
    }

    if (!edge.target) {
      errors.push("Edge target is required");
    }

    if (!edge.edgeType) {
      errors.push("Edge type is required");
    }

    if (!this.has(edge.edgeType)) {
      errors.push(`Edge type "${edge.edgeType}" is not registered`);
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }
}

// Global edge registry instance
export const edgeRegistry = new EdgeRegistry();
