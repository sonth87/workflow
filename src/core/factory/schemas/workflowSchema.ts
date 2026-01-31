/**
 * JSON Schemas for Complete Workflow Structure
 * Định nghĩa Zod schemas cho workflow import/export và AI generation
 */

import { z } from "zod";
import { EdgeJSONSchema } from "./edgeConfigSchema";

/**
 * Node Instance Schema for Workflow
 * Schema cho node instance trong workflow JSON (runtime representation)
 * Khác với CustomNodeJSONSchema (dùng cho plugin definition)
 */
export const NodeInstanceSchema = z.object({
  // Required fields
  id: z.string().min(1, "Node ID is required"),
  type: z.string().min(1, "Node type is required"),
  nodeType: z.string().min(1, "Node type is required"),

  // Position
  position: z.object({
    x: z.number(),
    y: z.number(),
  }),

  // Data - contains display information
  data: z
    .object({
      label: z.string().min(1, "Node label is required"),
      title: z.string().optional(),
      description: z.string().optional(),
      content: z.string().optional(), // For notes and annotations
      color: z.string().optional(), // For notes
      fontSize: z.string().optional(), // For notes
    })
    .passthrough(), // Allow additional custom fields

  // Properties - contains configuration values
  properties: z.record(z.string(), z.unknown()).optional(),

  // Layout properties
  parentId: z.string().optional(),
  width: z.number().optional(),
  height: z.number().optional(),
  zIndex: z.number().optional(),
  extent: z.string().optional(),
  expandParent: z.boolean().optional(),
});

/**
 * Workflow Metadata Schema
 */
export const WorkflowMetadataSchema = z
  .object({
    version: z.string().default("1.0.0"),
    schemaVersion: z.string().default("1.0.0"), // Schema format version for migration
    timestamp: z.string().optional(),
    author: z.string().optional(),
    tags: z.array(z.string()).optional(),
    // Allow additional metadata fields
  })
  .passthrough();

/**
 * Complete Workflow JSON Schema
 * Schema chính cho workflow export/import và AI generation output
 */
export const WorkflowJSONSchema = z.object({
  // Workflow information
  workflowName: z.string().default("Untitled Workflow"),
  workflowDescription: z.string().optional(),

  // Core workflow data
  nodes: z
    .array(NodeInstanceSchema)
    .min(1, "Workflow must have at least one node"),
  edges: z.array(EdgeJSONSchema),

  // Metadata
  metadata: WorkflowMetadataSchema.optional(),
});

/**
 * Type exports
 */
export type NodeInstanceJSON = z.infer<typeof NodeInstanceSchema>;
export type WorkflowMetadataJSON = z.infer<typeof WorkflowMetadataSchema>;
export type WorkflowJSON = z.infer<typeof WorkflowJSONSchema>;

/**
 * Helper function to validate workflow JSON
 */
export function validateWorkflowJSON(data: unknown): {
  success: boolean;
  data?: WorkflowJSON;
  errors?: string[];
} {
  const result = WorkflowJSONSchema.safeParse(data);

  if (result.success) {
    return {
      success: true,
      data: result.data,
    };
  } else {
    return {
      success: false,
      errors: result.error.issues.map(e => `${e.path.join(".")}: ${e.message}`),
    };
  }
}

/**
 * Helper function to validate with cross-node edge references
 * Ensures that all edge source/target IDs reference existing nodes
 */
export function validateWorkflowReferences(workflow: WorkflowJSON): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  const nodeIds = new Set(workflow.nodes.map(n => n.id));

  workflow.edges.forEach(edge => {
    if (!nodeIds.has(edge.source)) {
      errors.push(
        `Edge ${edge.id} references missing source node: ${edge.source}`
      );
    }
    if (!nodeIds.has(edge.target)) {
      errors.push(
        `Edge ${edge.id} references missing target node: ${edge.target}`
      );
    }
  });

  return {
    valid: errors.length === 0,
    errors,
  };
}
