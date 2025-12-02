import { NodeType } from '@/enum/workflow.enum'
import { StartEventNode, EndEventNode } from './EventNodes'
import {
  TaskNode,
  ServiceTaskNode,
  NotificationNode,
  TimeDelayNode,
  SubflowNode,
} from './TaskNodes'
import { ExclusiveGatewayNode, ParallelGatewayNode, ParallelGatewayJoinNode } from './GatewayNodes'
import { PoolNode } from './PoolNode'
import { NoteNode } from './NoteNode'
import BaseNode from './BaseNode'
import type { Position } from '@xyflow/react'

// Export shared styles
export { nodeStyle, handleStyle } from './styles'

export interface CustomNodeProps {
  id: string
  type?: NodeType
  data: { label: string }
  isConnecting?: boolean
  selected?: boolean
  sourcePosition?: Position
  targetPosition?: Position
}

// Wrap all nodes with BaseNode
const wrapWithBaseNode = (Component: React.ComponentType<CustomNodeProps>, nodeType: NodeType) => {
  return (props: CustomNodeProps) => (
    <BaseNode {...props} type={nodeType}>
      <Component {...props} />
    </BaseNode>
  )
}

export const nodeTypes = {
  [NodeType.START_EVENT_DEFAULT]: wrapWithBaseNode(StartEventNode, NodeType.START_EVENT_DEFAULT),
  [NodeType.END_EVENT_DEFAULT]: wrapWithBaseNode(EndEventNode, NodeType.END_EVENT_DEFAULT),
  [NodeType.END_EVENT_SEND_SIGNAL]: wrapWithBaseNode(EndEventNode, NodeType.END_EVENT_SEND_SIGNAL),
  [NodeType.TASK_DEFAULT]: wrapWithBaseNode(TaskNode, NodeType.TASK_DEFAULT),
  [NodeType.SERVICE_TASK]: wrapWithBaseNode(ServiceTaskNode, NodeType.SERVICE_TASK),
  [NodeType.NOTIFICATION]: wrapWithBaseNode(NotificationNode, NodeType.NOTIFICATION),
  [NodeType.TIME_DELAY]: wrapWithBaseNode(TimeDelayNode, NodeType.TIME_DELAY),
  [NodeType.EXCLUSIVE_GATEWAY]: wrapWithBaseNode(ExclusiveGatewayNode, NodeType.EXCLUSIVE_GATEWAY),
  [NodeType.PARALLEL_GATEWAY]: wrapWithBaseNode(ParallelGatewayNode, NodeType.PARALLEL_GATEWAY),
  [NodeType.PARALLEL_GATEWAY_JOIN]: wrapWithBaseNode(
    ParallelGatewayJoinNode,
    NodeType.PARALLEL_GATEWAY_JOIN
  ),
  [NodeType.SUBFLOW]: wrapWithBaseNode(SubflowNode, NodeType.SUBFLOW),
  [NodeType.POOL]: PoolNode,
  [NodeType.NOTE]: NoteNode,
}
