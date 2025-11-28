import type { Node } from '@xyflow/react'
import type { HttpMethod, NodeType, NotificationChannel, RoleType } from '../enum/workflow.enum'

export interface Position {
  x: number
  y: number
}
export interface ApiConfig {
  url: string
  method: HttpMethod
  auth?: 'service_account' | 'jwt' | 'none'
}

export interface DataMapping {
  input?: string[]
  output?: string[]
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

export interface BaseNode extends Omit<Node, 'data'> {
  id: string
  type: NodeType
  label: string
  position: Position

  // Optional metadata
  sla?: string
  loop?: boolean
  dataMapping?: DataMapping

  // Validation rules for connections
  connectionRules?: ConnectionRule
  data: Record<string, unknown> & {
    label?: string
  }
}

export interface TaskNode extends BaseNode {
  type: NodeType.TASK
  role?: RoleType | string
  form?: {
    fields: Array<{
      key: string
      label: string
      type: 'text' | 'textarea' | 'number' | 'select' | 'date'
      options?: string[]
    }>
  }
}

export interface ServiceTaskNode extends BaseNode {
  type: NodeType.SERVICE_TASK
  api: ApiConfig
}

export interface TimeDelayNode extends BaseNode {
  type: NodeType.TIME_DELAY
  duration: string // "2h", "30m", "1d"
}

export interface ExclusiveGatewayNode extends BaseNode {
  type: NodeType.EXCLUSIVE_GATEWAY
}

export interface ParallelGatewayNode extends BaseNode {
  type: NodeType.PARALLEL_GATEWAY
}

export interface ParallelGatewayJoinNode extends BaseNode {
  type: NodeType.PARALLEL_GATEWAY_JOIN
}

export interface SubflowNode extends BaseNode {
  type: NodeType.SUBFLOW
  subflowId: string
}

export interface NotificationNode extends BaseNode {
  type: NodeType.NOTIFICATION
  channel: NotificationChannel
  template: string // template ID
}

export interface StartEventNode extends BaseNode {
  type: NodeType.START_EVENT
}

export interface EndEventNode extends BaseNode {
  type: NodeType.END_EVENT
}

export interface PoolNode extends BaseNode {
  type: NodeType.POOL
  layout: 'horizontal' | 'vertical' // horizontal: 1 row + many columns, vertical: 1 column + many rows
  lanes: Array<{ id: string; label: string; size: number }> // size = width for horizontal, height for vertical
}

export interface NoteNode extends BaseNode {
  type: NodeType.NOTE
  content: string
  color?: 'yellow' | 'blue' | 'green' | 'pink' | 'purple' | 'orange'
  fontSize?: 'sm' | 'base' | 'lg'
}

export interface WorkflowEdge {
  id?: string
  source: string
  target: string
  sourceHandle?: string // For nodes with multiple output handles
  targetHandle?: string // For nodes with multiple input handles
  condition?: string // Condition expression for conditional edges
  label?: string // Display label for the edge
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
