import { z } from "zod";

// --- Multilingual Text Schema ---
export const multilingualTextSchema = z.union([
  z.string(),
  z.record(z.string(), z.string()),
  z.record(z.string(), z.any()),
]);

// --- Base Metadata Schema ---
export const baseMetadataSchema = z.object({
  id: z.string().optional(), // Often generated
  title: multilingualTextSchema.optional(),
  description: multilingualTextSchema.optional(),
  version: z.string().optional(),
  author: z.string().optional(),
}).passthrough();

// --- Property Definition Schema ---
export const propertyDefinitionSchema = z.object({
  id: z.string(),
  type: z.enum([
    "text",
    "number",
    "boolean",
    "select",
    "multiselect",
    "textarea",
    "color",
    "date",
    "json",
    "logic",
    "expression",
    "custom",
  ]),
  label: multilingualTextSchema,
  description: multilingualTextSchema.optional(),
  defaultValue: z.any().optional(),
  required: z.boolean().optional(),
  readonly: z.boolean().optional(),
  visible: z.any().optional(), // Can be boolean or complex object
  disabled: z.any().optional(),
  options: z.array(z.object({
    label: multilingualTextSchema,
    value: z.any(),
  })).optional(),
  placeholder: multilingualTextSchema.optional(),
  group: z.string().optional(),
  order: z.number().optional(),
}).passthrough();

// --- Icon Config Schema ---
export const iconConfigSchema = z.object({
  type: z.enum(["lucide", "custom", "svg", "image"]),
  value: z.any(), // string | ReactNode
  color: z.string().optional(),
  backgroundColor: z.string().optional(),
  size: z.number().optional(),
}).passthrough();

// --- Base Node Config Schema ---
export const baseNodeConfigSchema = z.object({
  // Required for Registry items usually
  nodeType: z.string().optional(),
  category: z.string().optional(),

  metadata: baseMetadataSchema.optional(),

  icon: iconConfigSchema.optional(),

  properties: z.record(z.string(), z.any()).optional(),
  propertyDefinitions: z.array(propertyDefinitionSchema).optional(),

  // Visuals
  visualConfig: z.object({
    backgroundColor: z.string().optional(),
    borderColor: z.string().optional(),
    textColor: z.string().optional(),
  }).passthrough().optional(),

}).passthrough();


// --- Registry Item Schema ---
// This validates what plugins pass to register()
export const registryItemSchema = z.object({
  id: z.string(),
  type: z.string(),
  extends: z.string().optional(),
  name: multilingualTextSchema,
  description: multilingualTextSchema.optional(),
  category: z.string().optional(),
  icon: iconConfigSchema.optional(),
  config: baseNodeConfigSchema, // Or generic, but checking base structure helps
  metadata: z.record(z.string(), z.any()).optional(),
}).passthrough();
