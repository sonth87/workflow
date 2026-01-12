/**
 * Custom Node Factory
 * Factory để tạo và register custom nodes từ JSON configuration
 * Đây là interface chính cho phép tích hợp bằng JSON thuần túy
 */

import type { CategoryType } from "../../enum/workflow.enum";
import type { PropertyFieldType } from "../properties/types/propertyDefinition";
import type {
  PropertyDefinition,
  ConnectionRule,
  NodeVisualConfig,
  IconConfig,
  ContextMenuItem,
} from "../types/base.types";
import { nodeRegistry } from "../registry/NodeRegistry";
import { propertyRegistry } from "../properties";
import { contextMenuRegistry } from "../registry/ContextMenuRegistry";
import { globalEventBus } from "../events/EventBus";
import { createInheritedNodeConfig } from "../nodes/NodeInheritance";
import {
  CustomNodeJSONSchema,
  type CustomNodeJSON,
  type PropertyDefinitionJSON,
  type ContextMenuItemJSON,
  type EventTriggerJSON,
} from "./schemas/nodeConfigSchema";
import type { PropertyGroupDefinition } from "../properties/types/propertyDefinition";
import * as LucideIcons from "lucide-react";

/**
 * Batch result interface
 */
export interface BatchResult {
  success: number;
  failed: number;
  errors: Array<{ nodeId: string; error: string }>;
}

/**
 * Validation result interface
 */
export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

/**
 * Convert icon config from JSON to IconConfig
 * Handles lucide icon names by converting to React components
 */
function convertIconConfig(
  iconJson: Record<string, unknown> | undefined
): IconConfig | undefined {
  if (!iconJson) return undefined;

  const iconType = iconJson.type as string;
  const iconValue = iconJson.value;

  let convertedValue = iconValue;

  // Convert lucide icon name to React component
  if (iconType === "lucide" && typeof iconValue === "string") {
    // Get the lucide icon component by name
    const IconComponent = (LucideIcons as Record<string, unknown>)[iconValue];
    if (IconComponent) {
      convertedValue = IconComponent;
    } else {
      console.warn(`Lucide icon "${iconValue}" not found. Using fallback.`);
      // Fallback to a default icon
      convertedValue = LucideIcons.CircleDot;
    }
  }

  return {
    type: iconType as IconConfig["type"],
    value: convertedValue,
    color: iconJson.color as string | undefined,
    backgroundColor: iconJson.backgroundColor as string | undefined,
  } as IconConfig;
}

/**
 * Convert JSON property definition to internal format
 */
function convertPropertyDefinition(
  prop: PropertyDefinitionJSON
): Record<string, unknown> {
  return {
    id: prop.id,
    name: prop.name,
    label: prop.label,
    type: prop.type,
    required: prop.required || false,
    defaultValue: prop.defaultValue,
    placeholder: prop.placeholder,
    description: prop.description,
    group: prop.group || "custom",
    order: prop.order || 0,
    options: prop.options
      ? prop.options.map(opt => ({
          label: opt.label,
          value: opt.value,
        }))
      : undefined,
  };
}

/**
 * Convert JSON property definitions to property groups
 */
function convertToPropertyGroups(
  properties: PropertyDefinitionJSON[] = [],
  groups: Array<Record<string, unknown>> = []
): PropertyGroupDefinition[] {
  // Group properties by group field
  const groupMap = new Map<string, PropertyDefinitionJSON[]>();

  properties.forEach(prop => {
    const groupId = prop.group || "custom";
    if (!groupMap.has(groupId)) {
      groupMap.set(groupId, []);
    }
    const group = groupMap.get(groupId);
    if (group) {
      group.push(prop);
    }
  });

  // Create property groups
  const propertyGroups: PropertyGroupDefinition[] = [];

  groupMap.forEach((props, groupId) => {
    // Find group definition
    const groupDef = groups.find(g => g.id === groupId);

    propertyGroups.push({
      id: groupId,
      label:
        (groupDef &&
        typeof groupDef === "object" &&
        "label" in groupDef &&
        typeof groupDef.label === "string"
          ? groupDef.label
          : null) || groupId.charAt(0).toUpperCase() + groupId.slice(1),
      description:
        groupDef &&
        typeof groupDef === "object" &&
        "description" in groupDef &&
        typeof groupDef.description === "string"
          ? groupDef.description
          : undefined,
      icon:
        groupDef && typeof groupDef === "object" && "icon" in groupDef
          ? (groupDef.icon as React.ComponentType)
          : undefined,
      order:
        (groupDef &&
        typeof groupDef === "object" &&
        "order" in groupDef &&
        typeof groupDef.order === "number"
          ? groupDef.order
          : null) || (groupId === "basic" ? 1 : groupId === "custom" ? 90 : 99),
      fields: props.map(prop => ({
        id: prop.id,
        label: prop.label,
        type: prop.type as PropertyFieldType,
        defaultValue: prop.defaultValue,
        required: prop.required || false,
        placeholder: prop.placeholder,
        helpText: prop.description,
        options: prop.options
          ? {
              options: prop.options.map(opt => ({
                label: opt.label,
                value: opt.value,
              })),
            }
          : undefined,
        order: prop.order || 0,
        group: groupId,
      })),
    });
  });

  return propertyGroups;
}

/**
 * Convert JSON context menu items to internal format
 */
function convertContextMenuItems(
  items: ContextMenuItemJSON[] = []
): Array<Record<string, unknown>> {
  return items.map(item => ({
    id: item.id,
    label: item.label,
    icon: item.icon,
    action: item.action
      ? async (context: Record<string, unknown>) => {
          const action = item.action;
          if (
            action &&
            action.type === "event" &&
            action.event &&
            typeof action.event === "string"
          ) {
            globalEventBus.emit(action.event, {
              context,
              payload: action.payload,
            });
          }
          // Thêm các action types khác ở đây
        }
      : undefined,
    condition: item.condition
      ? (context: Record<string, unknown>) => {
          const condition = item.condition;
          if (!condition) return true;

          const field =
            typeof condition.field === "string" ? condition.field : "";
          const contextNode = (
            context as { node?: { properties?: Record<string, unknown> } }
          ).node;
          const fieldValue = contextNode?.properties?.[field];
          switch (condition.operator) {
            case "equals":
              return fieldValue === condition.value;
            case "notEquals":
              return fieldValue !== condition.value;
            case "includes":
              return Array.isArray(fieldValue)
                ? fieldValue.includes(condition.value)
                : false;
            case "notIncludes":
              return Array.isArray(fieldValue)
                ? !fieldValue.includes(condition.value)
                : true;
            default:
              return true;
          }
        }
      : undefined,
    submenu: item.submenu
      ? convertContextMenuItems(
          item.submenu as Array<{
            id: string;
            label: string;
            icon?: string;
            action?: Record<string, unknown>;
            condition?: Record<string, unknown>;
            submenu?: unknown[];
            separator?: boolean;
            disabled?: boolean;
          }>
        )
      : undefined,
    separator: item.separator,
    disabled: item.disabled,
  }));
}

/**
 * Register event triggers for a node
 */
function registerEventTriggers(
  nodeType: string,
  triggers: EventTriggerJSON[] = []
): void {
  triggers.forEach(trigger => {
    globalEventBus.on(trigger.on, event => {
      // Check condition if exists
      if (trigger.condition) {
        const node = (event.payload as Record<string, unknown>)?.node as {
          properties?: Record<string, unknown>;
        };
        if (!node) return;

        const propValue = node.properties?.[trigger.condition.property];
        let conditionMet = false;

        switch (trigger.condition.operator) {
          case "equals":
            conditionMet = propValue === trigger.condition.value;
            break;
          case "notEquals":
            conditionMet = propValue !== trigger.condition.value;
            break;
          case "includes":
            conditionMet = Array.isArray(propValue)
              ? propValue.includes(trigger.condition.value)
              : false;
            break;
          case "notIncludes":
            conditionMet = Array.isArray(propValue)
              ? !propValue.includes(trigger.condition.value)
              : true;
            break;
        }

        if (!conditionMet) return;
      }

      // Execute action
      if (trigger.action === "emit" && trigger.event) {
        globalEventBus.emit(trigger.event, trigger.payload || {});
      }
    });
  });
}

/**
 * Custom Node Factory
 */
export class CustomNodeFactory {
  /**
   * Validate JSON configuration
   */
  static validateConfig(config: unknown): ValidationResult {
    try {
      CustomNodeJSONSchema.parse(config);
      return { valid: true, errors: [] };
    } catch (error: unknown) {
      const errors = (
        error as {
          errors?: Array<{ path: Array<string | number>; message: string }>;
        }
      ).errors?.map(e => `${e.path.join(".")}: ${e.message}`) || [
        (error as Error).message,
      ];
      return { valid: false, errors };
    }
  }

  /**
   * Register a single custom node from JSON config
   */
  static registerFromConfig(config: CustomNodeJSON): void {
    // Validate config
    const validation = this.validateConfig(config);
    if (!validation.valid) {
      throw new Error(
        `Invalid node configuration: ${validation.errors.join(", ")}`
      );
    }

    // Create inherited node config
    const nodeConfig = createInheritedNodeConfig(config.extends, {
      id: "",
      type: config.id,
      metadata: {
        id: config.id,
        title: config.name,
        description: config.description,
        version: "1.0.0",
      },
      category: config.category as CategoryType,
      visualConfig: config.visualConfig as NodeVisualConfig,
      properties: config.defaultProperties || {},
      propertyDefinitions: (config.properties?.map(convertPropertyDefinition) ||
        []) as unknown as PropertyDefinition[],
      connectionRules: config.connectionRules as unknown as ConnectionRule[],
      icon: convertIconConfig(config.icon as Record<string, unknown>),
      collapsible: config.collapsible,
      editable: config.editable,
      deletable: config.deletable,
      connectable: config.connectable,
      draggable: config.draggable,
    });

    if (!nodeConfig) {
      throw new Error(`Failed to create node config for "${config.id}"`);
    }

    // Register node in registry
    nodeRegistry.register({
      id: config.id,
      type: config.id,
      name: config.name,
      config: nodeConfig,
    });

    // Register property groups if properties exist
    if (config.properties && config.properties.length > 0) {
      const propertyGroups = convertToPropertyGroups(
        config.properties,
        config.propertyGroups
      );
      propertyRegistry.registerNodeConfig({
        nodeType: config.id,
        propertyGroups,
      });
    }

    // Register context menu items if exist
    if (config.contextMenuItems && config.contextMenuItems.length > 0) {
      const menuItems = convertContextMenuItems(config.contextMenuItems);
      contextMenuRegistry.register({
        id: `${config.id}-context-menu`,
        type: config.id,
        name: `${config.name} Context Menu`,
        config: {
          id: `${config.id}-context-menu`,
          name: `${config.name} Context Menu`,
          targetType: "node",
          targetNodeTypes: [config.id],
          items: menuItems as ContextMenuItem[],
        },
      });
    }

    // Register event triggers if exist
    if (config.eventTriggers && config.eventTriggers.length > 0) {
      registerEventTriggers(config.id, config.eventTriggers);
    }

    // Register hooks if exist
    if (config.hooks) {
      const hooks = config.hooks;
      if (hooks.onCreated) {
        const eventName = hooks.onCreated;
        globalEventBus.on("node:created", event => {
          const node = (event.payload as Record<string, unknown>)
            ?.node as Record<string, unknown>;
          if (node?.type === config.id) {
            globalEventBus.emit(eventName, { node });
          }
        });
      }
      if (hooks.onUpdated) {
        const eventName = hooks.onUpdated;
        globalEventBus.on("node:updated", event => {
          const node = (event.payload as Record<string, unknown>)
            ?.node as Record<string, unknown>;
          if (node?.type === config.id) {
            globalEventBus.emit(eventName, { node });
          }
        });
      }
      if (hooks.onDeleted) {
        const eventName = hooks.onDeleted;
        globalEventBus.on("node:deleted", event => {
          const node = (event.payload as Record<string, unknown>)
            ?.node as Record<string, unknown>;
          if (node?.type === config.id) {
            globalEventBus.emit(eventName, { node });
          }
        });
      }
      if (hooks.onPropertyChanged) {
        const eventName = hooks.onPropertyChanged;
        globalEventBus.on("property:changed", event => {
          const node = (event.payload as Record<string, unknown>)
            ?.node as Record<string, unknown>;
          if (node?.type === config.id) {
            globalEventBus.emit(eventName, event.payload);
          }
        });
      }
    }

    // Registered custom node successfully
  }

  /**
   * Register multiple nodes from JSON configs
   */
  static registerMany(configs: CustomNodeJSON[]): BatchResult {
    const result: BatchResult = {
      success: 0,
      failed: 0,
      errors: [],
    };

    configs.forEach(config => {
      try {
        this.registerFromConfig(config);
        result.success++;
      } catch (error: unknown) {
        result.failed++;
        result.errors.push({
          nodeId: config.id,
          error: error instanceof Error ? error.message : "Unknown error",
        });
      }
    });

    return result;
  }

  /**
   * Load nodes from JSON string
   */
  static loadFromJSON(jsonString: string): BatchResult {
    try {
      const configs = JSON.parse(jsonString);
      if (!Array.isArray(configs)) {
        throw new Error("JSON must be an array of node configurations");
      }
      return this.registerMany(configs);
    } catch (error: unknown) {
      return {
        success: 0,
        failed: 1,
        errors: [
          {
            nodeId: "unknown",
            error: error instanceof Error ? error.message : "Unknown error",
          },
        ],
      };
    }
  }

  /**
   * Load nodes from URL
   */
  static async loadFromURL(url: string): Promise<BatchResult> {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.statusText}`);
      }
      const configs = await response.json();
      if (!Array.isArray(configs)) {
        throw new Error("Response must be an array of node configurations");
      }
      return this.registerMany(configs);
    } catch (error: unknown) {
      return {
        success: 0,
        failed: 1,
        errors: [
          {
            nodeId: "unknown",
            error: error instanceof Error ? error.message : "Unknown error",
          },
        ],
      };
    }
  }
}
