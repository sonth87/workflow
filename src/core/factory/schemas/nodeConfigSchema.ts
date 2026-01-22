/**
 * JSON Schemas for Node Configuration
 * Định nghĩa Zod schemas để validate JSON config khi user tích hợp
 */

import { z } from "zod";
import { BaseNodeType } from "../../nodes/BaseNodeDefinitions";

/**
 * Multilingual text schema
 * Supports three formats:
 * 1. Plain string (used as-is or as translation key)
 * 2. Nested multilingual object: { en: "English", vi: "Vietnamese" }
 * 3. Translation key string (will be resolved at runtime via TranslationRegistry)
 */
export const MultilingualTextSchema = z.union([
  z.string(), // Can be plain text or translation key
  z
    .record(z.string(), z.string())
    .refine(obj => Object.keys(obj).length > 0 && "en" in obj, {
      message: "Multilingual text must include at least 'en' (English) key",
    }),
]);

/**
 * Icon configuration schema
 */
export const IconConfigSchema = z.object({
  type: z.enum(["lucide", "custom", "svg", "url"]),
  value: z.union([z.string(), z.any()]),
  color: z.string().optional(),
  backgroundColor: z.string().optional(),
});

/**
 * Visual configuration schema
 */
export const VisualConfigSchema = z.object({
  backgroundColor: z.string().optional(),
  borderColor: z.string().optional(),
  borderStyle: z.enum(["solid", "dashed", "dotted"]).optional(),
  borderWidth: z.number().optional(),
  ringColor: z.string().optional(),
  textColor: z.string().optional(),
  descriptionColor: z.string().optional(),
  iconBackgroundColor: z.string().optional(),
  iconColor: z.string().optional(),
});

/**
 * Property field option schema
 */
export const PropertyFieldOptionSchema = z.object({
  label: MultilingualTextSchema,
  value: z.union([z.string(), z.number(), z.boolean()]),
  description: MultilingualTextSchema.optional(),
  disabled: z.boolean().optional(),
});

/**
 * Property definition schema
 */
export const PropertyDefinitionSchema = z.object({
  id: z.string(),
  name: z.string(),
  label: MultilingualTextSchema,
  type: z.enum([
    "text",
    "number",
    "textarea",
    "boolean",
    "select",
    "multiselect",
    "color",
    "json",
    "date",
    "slider",
    "custom",
  ]),
  required: z.boolean().optional(),
  defaultValue: z.any().optional(),
  placeholder: MultilingualTextSchema.optional(),
  description: MultilingualTextSchema.optional(),
  group: z.string().optional(),
  order: z.number().optional(),
  options: z.array(PropertyFieldOptionSchema).optional(),
  validation: z
    .object({
      pattern: z.string().optional(),
      min: z.number().optional(),
      max: z.number().optional(),
      minLength: z.number().optional(),
      maxLength: z.number().optional(),
      message: MultilingualTextSchema.optional(),
    })
    .optional(),
});

/**
 * Property group schema
 */
export const PropertyGroupSchema = z.object({
  id: z.string(),
  label: MultilingualTextSchema,
  description: MultilingualTextSchema.optional(),
  icon: z.string().optional(),
  order: z.number().optional(),
});

/**
 * Connection rules schema
 */
export const ConnectionRulesSchema = z.object({
  maxInputConnections: z.number().optional(),
  maxOutputConnections: z.number().optional(),
  allowedSources: z.array(z.string()).optional(),
  allowedTargets: z.array(z.string()).optional(),
});

/**
 * Context menu item action schema
 */
export const ContextMenuActionSchema = z.object({
  type: z.enum(["event", "function", "navigate", "modal", "api"]),
  event: z.string().optional(),
  function: z.string().optional(),
  url: z.string().optional(),
  payload: z.record(z.string(), z.unknown()).optional(),
});

/**
 * Context menu item schema
 */
export const ContextMenuItemSchema: z.ZodType<{
  id: string;
  label: string | Record<string, string>;
  icon?: string;
  action?: Record<string, unknown>;
  condition?: Record<string, unknown>;
  submenu?: unknown[];
  separator?: boolean;
  disabled?: boolean;
}> = z.lazy(() =>
  z.object({
    id: z.string(),
    label: MultilingualTextSchema,
    icon: z.string().optional(),
    action: ContextMenuActionSchema.optional(),
    condition: z
      .object({
        field: z.string(),
        operator: z.enum(["equals", "notEquals", "includes", "notIncludes"]),
        value: z.any(),
      })
      .optional(),
    submenu: z.array(ContextMenuItemSchema).optional(),
    separator: z.boolean().optional(),
    disabled: z.boolean().optional(),
  })
);

/**
 * Event trigger schema
 */
export const EventTriggerSchema = z.object({
  on: z.string(),
  action: z.enum(["emit", "call"]),
  event: z.string().optional(),
  function: z.string().optional(),
  payload: z.record(z.string(), z.unknown()).optional(),
  condition: z
    .object({
      property: z.string(),
      operator: z.enum(["equals", "notEquals", "includes", "notIncludes"]),
      value: z.any(),
    })
    .optional(),
});

/**
 * Custom Node JSON Schema
 * Schema chính để validate JSON config khi tích hợp
 */
export const CustomNodeJSONSchema = z.object({
  // Required fields
  id: z.string().min(1, "Node ID is required"),
  extends: z.enum([
    BaseNodeType.START,
    BaseNodeType.END,
    BaseNodeType.TASK,
    BaseNodeType.GATEWAY,
    BaseNodeType.EVENT,
    BaseNodeType.ANNOTATION,
    BaseNodeType.POOL,
    BaseNodeType.NOTE,
  ]),
  name: MultilingualTextSchema,

  // Optional fields
  description: MultilingualTextSchema.optional(),
  category: z.string().optional(),
  icon: IconConfigSchema.optional(),
  visualConfig: VisualConfigSchema.optional(),

  // Properties
  properties: z.array(PropertyDefinitionSchema).optional(),
  propertyGroups: z.array(PropertyGroupSchema).optional(),
  defaultProperties: z.record(z.string(), z.unknown()).optional(),

  // Connection rules
  connectionRules: ConnectionRulesSchema.optional(),

  // Context menu
  contextMenuItems: z.array(ContextMenuItemSchema).optional(),
  disableDefaultContextMenu: z
    .array(
      z.enum([
        "change-type",
        "properties",
        "appearance",
        "duplicate",
        "delete",
        "all",
      ])
    )
    .optional(),

  // Event triggers
  eventTriggers: z.array(EventTriggerSchema).optional(),

  // Hooks
  hooks: z
    .object({
      onCreated: z.string().optional(),
      onUpdated: z.string().optional(),
      onDeleted: z.string().optional(),
      onPropertyChanged: z.string().optional(),
    })
    .optional(),

  // Behavior
  collapsible: z.boolean().optional(),
  editable: z.boolean().optional(),
  deletable: z.boolean().optional(),
  connectable: z.boolean().optional(),
  draggable: z.boolean().optional(),
});

/**
 * Plugin JSON Schema
 */
export const PluginJSONSchema = z.object({
  metadata: z.object({
    id: z.string().min(1, "Plugin ID is required"),
    name: MultilingualTextSchema,
    version: z.string().default("1.0.0"),
    description: MultilingualTextSchema.optional(),
    author: z.string().optional(),
    dependencies: z.array(z.string()).optional(),
  }),
  nodes: z.array(CustomNodeJSONSchema).optional(),
  categories: z
    .array(
      z.object({
        id: z.string(),
        name: MultilingualTextSchema,
        icon: z.string().optional(),
        description: MultilingualTextSchema.optional(),
        order: z.number().optional(),
        separator: z
          .object({
            show: z.boolean().optional(),
            color: z.string().optional(),
            style: z.enum(["line", "spacer"]).optional(),
          })
          .optional(),
      })
    )
    .optional(),
});

/**
 * Type exports
 */
export type CustomNodeJSON = z.infer<typeof CustomNodeJSONSchema>;
export type PluginJSON = z.infer<typeof PluginJSONSchema>;
export type PropertyDefinitionJSON = z.infer<typeof PropertyDefinitionSchema>;
export type ContextMenuItemJSON = z.infer<typeof ContextMenuItemSchema>;
export type EventTriggerJSON = z.infer<typeof EventTriggerSchema>;
export type IconConfigJSON = z.infer<typeof IconConfigSchema>;
export type VisualConfigJSON = z.infer<typeof VisualConfigSchema>;
