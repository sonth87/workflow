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

export interface BaseNode {
  id: string
  type: NodeType
  label: string
  position: Position

  // Optional metadata
  sla?: string
  loop?: boolean
  dataMapping?: DataMapping
}

export interface TaskNode extends BaseNode {
  type: NodeType.TASK
  role: RoleType | string
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

export interface WorkflowEdge {
  id?: string
  source: string
  target: string
  condition?: string
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

export interface WorkflowDefinition {
  id: string
  name: string
  version: string

  metadata?: Record<string, any>

  nodes: WorkflowNode[]
  edges: WorkflowEdge[]
}
