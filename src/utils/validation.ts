import { NodeType } from '@/enum/workflow.enum'
import type { ConnectionRule, NodeValidationRules } from '@/types/workflow.type'

// Default validation rules for each node type
export const DEFAULT_VALIDATION_RULES: NodeValidationRules = {
  // Start Event: Only 1 outgoing connection, no incoming
  [NodeType.START_EVENT]: {
    maxOutputConnections: 1,
    maxInputConnections: 0,
    allowedTargets: [
      NodeType.TASK,
      NodeType.SERVICE_TASK,
      NodeType.NOTIFICATION,
      NodeType.TIME_DELAY,
      NodeType.SUBFLOW,
    ],
    requiresConnection: true,
  },

  // End Event: Only incoming connections, no outgoing
  [NodeType.END_EVENT]: {
    maxOutputConnections: 0,
    maxInputConnections: undefined, // No limit
    requiresConnection: true,
  },

  // Task: 1 input, 1 output
  [NodeType.TASK]: {
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
}

// Get validation rules for a specific node type
export function getNodeValidationRules(nodeType: NodeType): ConnectionRule {
  return DEFAULT_VALIDATION_RULES[nodeType] || {}
}

// Validate if a connection is allowed
export function validateConnection(
  sourceType: NodeType,
  targetType: NodeType,
  existingSourceConnections: number,
  existingTargetConnections: number,
  customRules?: NodeValidationRules
): { valid: boolean; message?: string } {
  const sourceRules = customRules?.[sourceType] || DEFAULT_VALIDATION_RULES[sourceType]
  const targetRules = customRules?.[targetType] || DEFAULT_VALIDATION_RULES[targetType]

  // Check source max output connections
  if (
    sourceRules?.maxOutputConnections !== undefined &&
    existingSourceConnections >= sourceRules.maxOutputConnections
  ) {
    return {
      valid: false,
      message: `Node can only have ${sourceRules.maxOutputConnections} outgoing connection(s)`,
    }
  }

  // Check target max input connections
  if (
    targetRules?.maxInputConnections !== undefined &&
    existingTargetConnections >= targetRules.maxInputConnections
  ) {
    return {
      valid: false,
      message: `Node can only have ${targetRules.maxInputConnections} incoming connection(s)`,
    }
  }

  // Check allowed targets
  if (sourceRules?.allowedTargets && !sourceRules.allowedTargets.includes(targetType)) {
    return {
      valid: false,
      message: `Cannot connect to ${targetType} node`,
    }
  }

  // Check allowed sources
  if (targetRules?.allowedSources && !targetRules.allowedSources.includes(sourceType)) {
    return {
      valid: false,
      message: `Cannot receive connection from ${sourceType} node`,
    }
  }

  return { valid: true }
}

// Validate entire workflow
export function validateWorkflow(
  nodes: Array<{ id: string; type: NodeType }>,
  edges: Array<{ source: string; target: string }>
): Array<{ nodeId: string; message: string; type: 'error' | 'warning' }> {
  const errors: Array<{ nodeId: string; message: string; type: 'error' | 'warning' }> = []

  nodes.forEach((node) => {
    const rules = DEFAULT_VALIDATION_RULES[node.type]
    if (!rules) return

    const outgoingConnections = edges.filter((e) => e.source === node.id).length
    const incomingConnections = edges.filter((e) => e.target === node.id).length

    // Check required connections
    if (rules.requiresConnection) {
      if (outgoingConnections === 0 && rules.maxOutputConnections !== 0) {
        errors.push({
          nodeId: node.id,
          message: 'Node requires at least one outgoing connection',
          type: 'error',
        })
      }
      if (incomingConnections === 0 && rules.maxInputConnections !== 0) {
        errors.push({
          nodeId: node.id,
          message: 'Node requires at least one incoming connection',
          type: 'warning',
        })
      }
    }

    // Check max connections
    if (rules.maxOutputConnections !== undefined && outgoingConnections > rules.maxOutputConnections) {
      errors.push({
        nodeId: node.id,
        message: `Too many outgoing connections (max: ${rules.maxOutputConnections})`,
        type: 'error',
      })
    }

    if (rules.maxInputConnections !== undefined && incomingConnections > rules.maxInputConnections) {
      errors.push({
        nodeId: node.id,
        message: `Too many incoming connections (max: ${rules.maxInputConnections})`,
        type: 'error',
      })
    }
  })

  return errors
}
