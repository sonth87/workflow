/**
 * JSON Schemas for Edge Configuration
 * Định nghĩa Zod schemas để validate JSON config cho edges
 */

import { z } from "zod";

/**
 * Edge Label Schema
 * Định nghĩa cho labels trên edges
 */
export const EdgeLabelSchema = z.object({
  text: z.string(),
  position: z.enum(["start", "center", "end"]),
  style: z.record(z.string(), z.unknown()).optional(),
});

/**
 * Edge Data Schema
 * Structure cho edge.data field trong workflow JSON
 */
export const EdgeDataSchema = z.object({
  pathType: z
    .enum([
      "bezier",
      "straight",
      "step",
      "smoothstep",
      "simplebezier",
      "default",
    ])
    .optional()
    .default("bezier"),
  pathStyle: z.enum(["solid", "dashed", "dotted"]).optional().default("solid"),
  labels: z.array(EdgeLabelSchema).optional(),
  "start-label": z.string().optional(),
  "center-label": z.string().optional(),
  "end-label": z.string().optional(),
});

/**
 * Edge Properties Schema
 * Structure cho edge.properties field
 */
export const EdgePropertiesSchema = z.object({
  pathType: z
    .enum([
      "bezier",
      "straight",
      "step",
      "smoothstep",
      "simplebezier",
      "default",
    ])
    .optional(),
  pathStyle: z.enum(["solid", "dashed", "dotted"]).optional(),
  condition: z.string().optional(), // For conditional flows from gateways
  "start-label": z.string().optional(),
  "center-label": z.string().optional(),
  "end-label": z.string().optional(),
  isDefault: z.boolean().optional(), // Default flow from gateway
  messageType: z.string().optional(), // For message flows
  direction: z.string().optional(), // For association edges
});

/**
 * Complete Edge JSON Schema
 * Schema cho edge instance trong workflow JSON export/import
 */
export const EdgeJSONSchema = z.object({
  id: z.string().min(1, "Edge ID is required"),
  source: z.string().min(1, "Source node ID is required"),
  target: z.string().min(1, "Target node ID is required"),
  type: z.string().default("sequence-flow"),
  data: EdgeDataSchema.optional(),
  properties: EdgePropertiesSchema.optional(),
  sourceHandle: z.string().optional(),
  targetHandle: z.string().optional(),
  animated: z.boolean().optional().default(false),
  label: z.string().optional(),
});

/**
 * Type exports
 */
export type EdgeLabelJSON = z.infer<typeof EdgeLabelSchema>;
export type EdgeDataJSON = z.infer<typeof EdgeDataSchema>;
export type EdgePropertiesJSON = z.infer<typeof EdgePropertiesSchema>;
export type EdgeJSON = z.infer<typeof EdgeJSONSchema>;
