import { NodeType } from "@/enum/workflow.enum";
import type {
  ConnectionRule,
  NodeValidationRules,
} from "@/types/workflow.type";
import { nodeRegistry } from "@/core/registry/NodeRegistry";

// Default validation rules for each node type
export const DEFAULT_VALIDATION_RULES: NodeValidationRules = {
  // Start Event: Only 1 outgoing connection, no incoming
  [NodeType.START_EVENT_DEFAULT]: {
    maxOutputConnections: 1,
    maxInputConnections: 0,
    allowedTargets: [
      NodeType.TASK_DEFAULT,
      NodeType.SERVICE_TASK,
      NodeType.NOTIFICATION,
      NodeType.TIME_DELAY,
      NodeType.SUBFLOW,
    ],
    requiresConnection: true,
  },

  // End Event: Only incoming connections, no outgoing
  [NodeType.END_EVENT_DEFAULT]: {
    maxOutputConnections: 0,
    maxInputConnections: undefined, // No limit
    requiresConnection: true,
  },

  // Task: 1 input, 1 output
  [NodeType.TASK_DEFAULT]: {
    maxOutputConnections: 1,
    maxInputConnections: 1,
  },

  // Service Task: 1 input, 1 output
  [NodeType.SERVICE_TASK]: {
    maxOutputConnections: 1,
    maxInputConnections: 1,
  },

  // Notification: 1 input, 1 output
  [NodeType.NOTIFICATION]: {
    maxOutputConnections: 1,
    maxInputConnections: 1,
  },

  // Time Delay: 1 input, 1 output
  [NodeType.TIME_DELAY]: {
    maxOutputConnections: 1,
    maxInputConnections: 1,
  },

  // Exclusive Gateway: 1 input, multiple outputs (branches)
  [NodeType.EXCLUSIVE_GATEWAY]: {
    maxOutputConnections: undefined, // No limit (multiple branches)
    maxInputConnections: 1,
    requiresConnection: true,
  },

  // Parallel Gateway: 1 input, multiple outputs
  [NodeType.PARALLEL_GATEWAY]: {
    maxOutputConnections: undefined, // No limit
    maxInputConnections: 1,
    requiresConnection: true,
  },

  // Parallel Gateway Join: Multiple inputs, 1 output
  [NodeType.PARALLEL_GATEWAY_JOIN]: {
    maxOutputConnections: 1,
    maxInputConnections: undefined, // No limit
    requiresConnection: true,
  },

  // Subflow: 1 input, 1 output
  [NodeType.SUBFLOW]: {
    maxOutputConnections: 1,
    maxInputConnections: 1,
  },

  // Pool: No direct connections (container)
  [NodeType.POOL]: {
    maxOutputConnections: 0,
    maxInputConnections: 0,
  },

  // Note: No connections
  [NodeType.NOTE]: {
    maxOutputConnections: 0,
    maxInputConnections: 0,
  },

  [NodeType.ANNOTATION]: {
    maxOutputConnections: 0,
    maxInputConnections: 0,
  },
};

// Get validation rules for a specific node type
export function getNodeValidationRules(
  nodeType: NodeType | string
): ConnectionRule {
  // Try to get from node registry first (for custom nodes)
  const registeredNode = nodeRegistry.get(nodeType);
  if (registeredNode?.config?.connectionRules) {
    const rules = registeredNode.config.connectionRules;
    // Convert array format to object format if needed
    if (Array.isArray(rules) && rules.length > 0) {
      return rules[0]; // Use first rule for basic validation
    }
    return rules as ConnectionRule;
  }

  // Fallback to default rules for built-in nodes
  return DEFAULT_VALIDATION_RULES[nodeType as NodeType] || {};
}

// Validate if a connection is allowed
export function validateConnection(
  sourceType: NodeType | string,
  targetType: NodeType | string,
  existingSourceConnections: number,
  existingTargetConnections: number,
  customRules?: NodeValidationRules
): { valid: boolean; message?: string } {
  // Get rules from registry or defaults
  const sourceRules =
    (customRules && customRules[sourceType as NodeType]) ||
    getNodeValidationRules(sourceType);
  const targetRules =
    (customRules && customRules[targetType as NodeType]) ||
    getNodeValidationRules(targetType);

  // Check source max output connections
  if (
    sourceRules?.maxOutputConnections !== undefined &&
    sourceRules.maxOutputConnections >= 0 &&
    existingSourceConnections >= sourceRules.maxOutputConnections
  ) {
    return {
      valid: false,
      message: `Node can only have ${sourceRules.maxOutputConnections} outgoing connection(s)`,
    };
  }

  // Check target max input connections
  if (
    targetRules?.maxInputConnections !== undefined &&
    targetRules.maxInputConnections >= 0 &&
    existingTargetConnections >= targetRules.maxInputConnections
  ) {
    return {
      valid: false,
      message: `Node can only have ${targetRules.maxInputConnections} incoming connection(s)`,
    };
  }

  // Check allowed targets
  if (
    sourceRules?.allowedTargets &&
    !sourceRules.allowedTargets.includes(targetType as NodeType)
  ) {
    return {
      valid: false,
      message: `Cannot connect to ${targetType} node`,
    };
  }

  // Check allowed sources
  if (
    targetRules?.allowedSources &&
    !targetRules.allowedSources.includes(sourceType as NodeType)
  ) {
    return {
      valid: false,
      message: `Cannot receive connection from ${sourceType} node`,
    };
  }

  return { valid: true };
}

// Validate entire workflow
export function validateWorkflow(
  nodes: Array<{ id: string; type: NodeType | string }>,
  edges: Array<{ source: string; target: string }>
): Array<{ nodeId: string; message: string; type: "error" | "warning" }> {
  const errors: Array<{
    nodeId: string;
    message: string;
    type: "error" | "warning";
  }> = [];

  nodes.forEach(node => {
    const rules = getNodeValidationRules(node.type);
    if (!rules) return;

    const outgoingConnections = edges.filter(e => e.source === node.id).length;
    const incomingConnections = edges.filter(e => e.target === node.id).length;

    // Check required connections
    if (rules.requiresConnection) {
      if (outgoingConnections === 0 && rules.maxOutputConnections !== 0) {
        errors.push({
          nodeId: node.id,
          message: "Node requires at least one outgoing connection",
          type: "error",
        });
      }
      if (incomingConnections === 0 && rules.maxInputConnections !== 0) {
        errors.push({
          nodeId: node.id,
          message: "Node requires at least one incoming connection",
          type: "warning",
        });
      }
    }

    // Check max connections
    if (
      rules.maxOutputConnections !== undefined &&
      rules.maxOutputConnections >= 0 &&
      outgoingConnections > rules.maxOutputConnections
    ) {
      errors.push({
        nodeId: node.id,
        message: `Too many outgoing connections (max: ${rules.maxOutputConnections})`,
        type: "error",
      });
    }

    if (
      rules.maxInputConnections !== undefined &&
      rules.maxInputConnections >= 0 &&
      incomingConnections > rules.maxInputConnections
    ) {
      errors.push({
        nodeId: node.id,
        message: `Too many incoming connections (max: ${rules.maxInputConnections})`,
        type: "error",
      });
    }
  });

  return errors;
}
