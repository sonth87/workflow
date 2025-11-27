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
  data: { label: string }
  isConnecting?: boolean
  selected?: boolean
  sourcePosition?: Position
  targetPosition?: Position
}

// Wrap all nodes with BaseNode
const wrapWithBaseNode = (Component: React.ComponentType<CustomNodeProps>) => {
  return (props: CustomNodeProps) => (
    <BaseNode {...props}>
      <Component {...props} />
    </BaseNode>
  )
}

export const nodeTypes = {
  [NodeType.START_EVENT]: wrapWithBaseNode(StartEventNode),
  [NodeType.END_EVENT]: wrapWithBaseNode(EndEventNode),
  [NodeType.TASK]: wrapWithBaseNode(TaskNode),
  [NodeType.SERVICE_TASK]: wrapWithBaseNode(ServiceTaskNode),
  [NodeType.NOTIFICATION]: wrapWithBaseNode(NotificationNode),
  [NodeType.TIME_DELAY]: wrapWithBaseNode(TimeDelayNode),
  [NodeType.EXCLUSIVE_GATEWAY]: wrapWithBaseNode(ExclusiveGatewayNode),
  [NodeType.PARALLEL_GATEWAY]: wrapWithBaseNode(ParallelGatewayNode),
  [NodeType.PARALLEL_GATEWAY_JOIN]: wrapWithBaseNode(ParallelGatewayJoinNode),
  [NodeType.SUBFLOW]: wrapWithBaseNode(SubflowNode),
  [NodeType.POOL]: PoolNode,
  [NodeType.NOTE]: NoteNode,
}
