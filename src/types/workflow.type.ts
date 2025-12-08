import type { Edge, Node } from '@xyflow/react'
import type { CategoryType, EdgeType, HttpMethod, NodeType } from '../enum/workflow.enum'
import type { InputComponent } from './dynamic-bpm.type'

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
  category_type: CategoryType
  label: string
  position: Position

  // Validation rules for connections
  connectionRules?: ConnectionRule
}

export type BaseConfig = Omit<BaseNode, 'data'>

export interface CommonConfig {
  category_type?: CategoryType
  label?: string
  nodeType: NodeType
  form_configs?: {
    fields: InputComponent[]
  }
}

export type DynamicConfig = Record<string, unknown> & CommonConfig

export interface TaskNode extends BaseConfig {
  category_type: CategoryType.TASK
  data: DynamicConfig
}

export interface StartNode extends BaseConfig {
  category_type: CategoryType.START
  data: DynamicConfig
}

export interface GateWayNode extends BaseConfig {
  category_type: CategoryType.GATEWAY
  data: DynamicConfig
}

export interface EndNode extends BaseConfig {
  category_type: CategoryType.END
  data: DynamicConfig
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

export type WorkflowNode = StartNode | EndNode | TaskNode | GateWayNode

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
