import type { Edge, Node } from '@xyflow/react'
import type {
  EdgeType,
  HttpMethod,
  NodeType,
  NotificationChannel,
  RoleType,
} from '../enum/workflow.enum'

export interface Position {
  x: number
  y: number
}
export interface ApiConfig {
  url: string
  method: HttpMethod
  auth?: 'service_account' | 'jwt' | 'none'
}

// Connection validation rules
export interface ConnectionRule {
  // Maximum number of outgoing connections allowed
  maxOutputConnections?: number
  // Maximum number of incoming connections allowed
  maxInputConnections?: number
  // Allowed target node types for outgoing connections
  allowedTargets?: NodeType[]
  // Allowed source node types for incoming connections
  allowedSources?: NodeType[]
  // Whether the node requires at least one connection
  requiresConnection?: boolean
}

export interface BaseNode extends Node {
  id: string
  type: NodeType
  label: string
  position: Position

  // Validation rules for connections
  connectionRules?: ConnectionRule
}

export type BaseConfig = Omit<BaseNode, 'data'>

export interface TaskNode extends BaseConfig {
  type: NodeType.TASK_DEFAULT
  role?: RoleType | string
  data: {
    form?: {
      fields: Array<{
        key: string
        label: string
        type: 'text' | 'textarea' | 'number' | 'select' | 'date'
        options?: string[]
      }>
    }
    label?: string
  }
}

export interface ServiceTaskNode extends BaseConfig {
  type: NodeType.SERVICE_TASK
  data: {
    api: ApiConfig
    label?: string
  }
}

export interface TimeDelayNode extends BaseConfig {
  type: NodeType.TIME_DELAY
  data: {
    duration: string // "2h", "30m", "1d"
    label?: string
  }
}

export interface ExclusiveGatewayNode extends BaseConfig {
  type: NodeType.EXCLUSIVE_GATEWAY
  data: {
    label?: string
  }
}

export interface ParallelGatewayNode extends BaseConfig {
  type: NodeType.PARALLEL_GATEWAY
  data: {
    label?: string
  }
}

export interface ParallelGatewayJoinNode extends BaseConfig {
  type: NodeType.PARALLEL_GATEWAY_JOIN
  data: {
    label?: string
  }
}

export interface SubflowNode extends BaseConfig {
  type: NodeType.SUBFLOW
  data: {
    label?: string
    subflowId: string
  }
}

export interface NotificationNode extends BaseConfig {
  type: NodeType.NOTIFICATION
  data: {
    label?: string
    channel: NotificationChannel
    template: string // template ID
  }
}

export interface StartEventNode extends BaseConfig {
  type: NodeType.START_EVENT_DEFAULT
  data: {
    label?: string
  }
}

export interface EndEventNode extends BaseConfig {
  type: NodeType.END_EVENT_DEFAULT
  data: {
    label?: string
  }
}

export interface PoolNode extends BaseConfig {
  type: NodeType.POOL
  data: {
    layout: 'horizontal' | 'vertical' // horizontal: 1 row + many columns, vertical: 1 column + many rows
    lanes: Array<{ id: string; label: string; size: number }> // size = width for horizontal, height for vertical
    label?: string
  }
}

export interface NoteNode extends BaseConfig {
  type: NodeType.NOTE
  data: {
    label?: string
    content: string
    color?: 'yellow' | 'blue' | 'green' | 'pink' | 'purple' | 'orange'
    fontSize?: 'sm' | 'base' | 'lg'
  }
}

export interface WorkflowEdge extends Edge {
  id: string
  source: string // id node nguồn
  sourceHandle?: string // id handle nguồn (out-1 hoặc out-2)

  target: string // id node đích
  targetHandle?: string // id handle input node B hoặc C
  condition?: string // Condition expression for conditional edges

  label?: string // Display label for the edge
  type?: EdgeType
}

// Validation result for connections
export interface ValidationResult {
  valid: boolean
  message?: string
  type?: 'error' | 'warning'
}

// Helper type for node validation rules by type
export type NodeValidationRules = {
  [K in NodeType]?: ConnectionRule
}

export type WorkflowNode =
  | StartEventNode
  | EndEventNode
  | TaskNode
  | ServiceTaskNode
  | NotificationNode
  | TimeDelayNode
  | ExclusiveGatewayNode
  | ParallelGatewayNode
  | ParallelGatewayJoinNode
  | SubflowNode
  | PoolNode
  | NoteNode

export interface WorkflowDefinition {
  id: string
  name: string
  version: string

  metadata?: Record<string, any>

  nodes: WorkflowNode[]
  edges: WorkflowEdge[]

  // Global validation rules that override node-specific rules
  validationRules?: NodeValidationRules
}
