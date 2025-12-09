/**
 * Validation Engine
 * Dynamic validation engine với extensible rules
 */

import type {
  BaseNodeConfig,
  BaseEdgeConfig,
  ValidationRule,
} from "../types/base.types";
import { ruleRegistry } from "../registry/RuleRegistry";
import { globalEventBus, WorkflowEventTypes } from "../events/EventBus";

export interface ValidationError {
  id: string;
  type: "error" | "warning" | "info";
  message: string;
  nodeId?: string;
  edgeId?: string;
  field?: string;
  code?: string;
  [key: string]: unknown;
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationError[];
}

export class ValidationEngine {
  /**
   * Validate a single node
   */
  async validateNode(node: BaseNodeConfig): Promise<ValidationResult> {
    const errors: ValidationError[] = [];
    const warnings: ValidationError[] = [];

    // Validate required fields
    if (!node.id) {
      errors.push({
        id: `${node.id}-no-id`,
        type: "error",
        message: "Node must have an id",
        nodeId: node.id,
      });
    }

    if (!node.nodeType) {
      errors.push({
        id: `${node.id}-no-type`,
        type: "error",
        message: "Node must have a type",
        nodeId: node.id,
      });
    }

    // Validate properties based on property definitions
    if (node.propertyDefinitions) {
      for (const propDef of node.propertyDefinitions) {
        const value = node.properties?.[propDef.id];

        // Check required
        if (
          propDef.required &&
          (value === undefined || value === null || value === "")
        ) {
          errors.push({
            id: `${node.id}-${propDef.id}-required`,
            type: "error",
            message: `${propDef.label} is required`,
            nodeId: node.id,
            field: propDef.id,
          });
        }

        // Run validation rules
        if (propDef.validation && value !== undefined && value !== null) {
          for (const rule of propDef.validation) {
            const isValid = await this.validateRule(rule, value, node);
            if (!isValid) {
              errors.push({
                id: `${node.id}-${propDef.id}-${rule.id}`,
                type: "error",
                message: rule.message,
                nodeId: node.id,
                field: propDef.id,
                code: rule.type,
              });
            }
          }
        }
      }
    }

    // Run custom validation rules from node config
    if (node.validationRules) {
      for (const rule of node.validationRules) {
        const isValid = await this.validateRule(rule, node, node);
        if (!isValid) {
          errors.push({
            id: `${node.id}-${rule.id}`,
            type: "error",
            message: rule.message,
            nodeId: node.id,
            code: rule.type,
          });
        }
      }
    }

    // Execute global validation rules for nodes
    const globalRules = ruleRegistry.getRulesByScope("node");
    for (const rule of globalRules) {
      if (rule.enabled) {
        const result = await ruleRegistry.executeRule(rule.id, { node });
        if (!result) {
          errors.push({
            id: `${node.id}-${rule.id}`,
            type: "error",
            message: rule.description || "Validation failed",
            nodeId: node.id,
          });
        }
      }
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
    };
  }

  /**
   * Validate a single edge
   */
  async validateEdge(
    edge: BaseEdgeConfig,
    sourceNode?: BaseNodeConfig,
    targetNode?: BaseNodeConfig
  ): Promise<ValidationResult> {
    const errors: ValidationError[] = [];
    const warnings: ValidationError[] = [];

    // Basic validation
    if (!edge.source) {
      errors.push({
        id: `${edge.id}-no-source`,
        type: "error",
        message: "Edge must have a source",
        edgeId: edge.id,
      });
    }

    if (!edge.target) {
      errors.push({
        id: `${edge.id}-no-target`,
        type: "error",
        message: "Edge must have a target",
        edgeId: edge.id,
      });
    }

    // Validate connection rules from source node
    if (sourceNode?.connectionRules) {
      for (const rule of sourceNode.connectionRules) {
        if (rule.validate) {
          const result = rule.validate(
            sourceNode,
            targetNode!,
            edge.sourceHandle,
            edge.targetHandle
          );

          if (typeof result === "boolean" && !result) {
            errors.push({
              id: `${edge.id}-connection-${rule.id}`,
              type: "error",
              message: rule.description || "Connection not allowed",
              edgeId: edge.id,
            });
          } else if (typeof result === "object" && !result.valid) {
            errors.push({
              id: `${edge.id}-connection-${rule.id}`,
              type: "error",
              message: result.message || "Connection not allowed",
              edgeId: edge.id,
            });
          }
        }
      }
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
    };
  }

  /**
   * Validate entire workflow
   */
  async validateWorkflow(
    nodes: BaseNodeConfig[],
    edges: BaseEdgeConfig[]
  ): Promise<ValidationResult> {
    const allErrors: ValidationError[] = [];
    const allWarnings: ValidationError[] = [];

    // Validate all nodes
    for (const node of nodes) {
      const result = await this.validateNode(node);
      allErrors.push(...result.errors);
      allWarnings.push(...result.warnings);
    }

    // Validate all edges
    for (const edge of edges) {
      const sourceNode = nodes.find(n => n.id === edge.source);
      const targetNode = nodes.find(n => n.id === edge.target);

      const result = await this.validateEdge(edge, sourceNode, targetNode);
      allErrors.push(...result.errors);
      allWarnings.push(...result.warnings);
    }

    // Execute global workflow validation rules
    const globalRules = ruleRegistry.getRulesByScope("workflow");
    for (const rule of globalRules) {
      if (rule.enabled) {
        const result = await ruleRegistry.executeRule(rule.id, {
          nodes,
          edges,
        });
        if (!result) {
          allErrors.push({
            id: rule.id,
            type: "error",
            message: rule.description || "Workflow validation failed",
          });
        }
      }
    }

    // Emit validation event
    globalEventBus.emit(WorkflowEventTypes.WORKFLOW_VALIDATED, {
      valid: allErrors.length === 0,
      errors: allErrors,
      warnings: allWarnings,
    });

    return {
      valid: allErrors.length === 0,
      errors: allErrors,
      warnings: allWarnings,
    };
  }

  /**
   * Validate a single rule
   */
  private async validateRule(
    rule: ValidationRule,
    value: unknown,
    context: unknown
  ): Promise<boolean> {
    if (rule.validator) {
      return await rule.validator(value, context);
    }

    // Built-in validators
    switch (rule.type) {
      case "required":
        return value !== undefined && value !== null && value !== "";

      case "min":
        if (typeof value === "number" && typeof rule.value === "number") {
          return value >= rule.value;
        }
        if (typeof value === "string" && typeof rule.value === "number") {
          return value.length >= rule.value;
        }
        return true;

      case "max":
        if (typeof value === "number" && typeof rule.value === "number") {
          return value <= rule.value;
        }
        if (typeof value === "string" && typeof rule.value === "number") {
          return value.length <= rule.value;
        }
        return true;

      case "pattern":
        if (typeof value === "string" && typeof rule.value === "string") {
          const regex = new RegExp(rule.value);
          return regex.test(value);
        }
        return true;

      default:
        console.warn(`Unknown validation rule type: ${rule.type}`);
        return true;
    }
  }
}

// Global validation engine instance
export const validationEngine = new ValidationEngine();
