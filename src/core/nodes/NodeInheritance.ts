/**
 * Node Inheritance System
 * Hệ thống cho phép các custom nodes kế thừa từ base nodes
 */

import type {
  BaseNodeConfig,
  NodeVisualConfig,
  PropertyDefinition,
  ConnectionRule,
} from "../types/base.types";
import {
  type BaseNodeType,
  getBaseNodeDefinition,
  isBaseNodeType,
} from "./BaseNodeDefinitions";

/**
 * Merge visual configs
 */
export function mergeVisualConfigs(
  base?: NodeVisualConfig,
  override?: NodeVisualConfig
): NodeVisualConfig | undefined {
  if (!base && !override) return undefined;
  if (!base) return override;
  if (!override) return base;

  return {
    ...base,
    ...override,
  };
}

/**
 * Merge properties
 */
export function mergeProperties(
  base: Record<string, unknown>,
  override: Record<string, unknown>
): Record<string, unknown> {
  return {
    ...base,
    ...override,
  };
}

/**
 * Merge property definitions
 */
export function mergePropertyDefinitions(
  base: Array<Record<string, unknown>>,
  override: Array<Record<string, unknown>>
): Array<Record<string, unknown>> {
  const merged = [...base];
  const baseIds = new Set(base.map(prop => prop.id));

  // Add override properties that don't exist in base
  override.forEach(prop => {
    if (!baseIds.has(prop.id)) {
      merged.push(prop);
    } else {
      // Replace existing property
      const index = merged.findIndex(p => p.id === prop.id);
      if (index >= 0) {
        merged[index] = { ...merged[index], ...prop };
      }
    }
  });

  return merged;
}

/**
 * Merge connection rules
 */
export function mergeConnectionRules(
  base?: Record<string, unknown>,
  override?: Record<string, unknown>
): Record<string, unknown> {
  if (!base && !override) return {};
  if (!base) return override || {};
  if (!override) return base;

  return {
    ...base,
    ...override,
  };
}

/**
 * Merge context menu items
 */
export function mergeContextMenuItems(
  base: Array<Record<string, unknown>> = [],
  override: Array<Record<string, unknown>> = []
): Array<Record<string, unknown>> {
  return [...base, ...override];
}

/**
 * Create inherited node config from base
 */
export function createInheritedNodeConfig(
  baseType: BaseNodeType | string,
  overrides: Partial<BaseNodeConfig> & {
    type: string;
    metadata: {
      id: string;
      title: string;
      description?: string;
      version?: string;
    };
  }
): BaseNodeConfig | null {
  const baseDefinition = getBaseNodeDefinition(baseType);

  if (!baseDefinition) {
    console.error(`Base node type "${baseType}" not found`);
    return null;
  }

  // Merge configurations
  const mergedConfig: BaseNodeConfig = {
    id: overrides.id || "",
    type: overrides.type,
    position: overrides.position || { x: 0, y: 0 },
    data: overrides.data || {},
    nodeType: overrides.type,
    category: overrides.category || baseDefinition.category,
    metadata: {
      id: overrides.metadata.id,
      title: overrides.metadata.title,
      description: overrides.metadata.description,
      version: overrides.metadata.version || "1.0.0",
    },
    visualConfig: mergeVisualConfigs(
      baseDefinition.visualConfig,
      overrides.visualConfig
    ),
    properties: mergeProperties(
      baseDefinition.defaultProperties,
      overrides.properties || {}
    ),
    propertyDefinitions: mergePropertyDefinitions(
      baseDefinition.propertyDefinitions,
      overrides.propertyDefinitions || []
    ) as unknown as PropertyDefinition[],
    connectionRules: mergeConnectionRules(
      baseDefinition.connectionRules as unknown as Record<string, unknown>,
      overrides.connectionRules as unknown as Record<string, unknown>
    ) as unknown as ConnectionRule[],
    collapsible: overrides.collapsible ?? true,
    collapsed: overrides.collapsed ?? false,
    editable: overrides.editable ?? true,
    deletable: overrides.deletable ?? true,
    connectable: overrides.connectable ?? true,
    draggable: overrides.draggable ?? true,
    icon: overrides.icon,
    validationRules: overrides.validationRules,
  };

  return mergedConfig;
}

/**
 * Validate inheritance
 */
export function validateInheritance(
  nodeType: string,
  extendsFrom: string
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!nodeType) {
    errors.push("Node type is required");
  }

  if (!extendsFrom) {
    errors.push("Base type (extends) is required");
  }

  if (extendsFrom && !isBaseNodeType(extendsFrom)) {
    errors.push(
      `Invalid base type: "${extendsFrom}". Must be one of: start, end, task, gateway, event, annotation, pool, note`
    );
  }

  if (nodeType === extendsFrom) {
    errors.push("Node type cannot be the same as base type");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
