import { NodeType } from '@/enum/workflow.enum'
import { Handle, Position } from '@xyflow/react'

export interface CustomNodeProps {
  id: string
  data: { label: string }
  isConnecting?: boolean
  selected?: boolean
  sourcePosition?: Position
  targetPosition?: Position
}

const nodeStyle =
  'rounded-lg border-2 bg-card text-foreground p-3 min-w-[120px] transition-all duration-200 hover:shadow-lg cursor-pointer group'
const handleStyle =
  'w-2 h-2 border-1 !rounded-full transition-all duration-100 !bg-primary group-hover:opacity-100 group-hover:!w-3 group-hover:!h-3 '

export function StartEventNode({ data, sourcePosition = Position.Bottom }: CustomNodeProps) {
  return (
    <div className={`${nodeStyle} border-success`}>
      <div className='text-xs font-semibold text-center'>▶ {data.label}</div>
      <Handle type='source' position={sourcePosition} id='out' className={handleStyle} />
    </div>
  )
}

export function EndEventNode({ data, targetPosition = Position.Top }: CustomNodeProps) {
  return (
    <div className={`${nodeStyle} border-error`}>
      <div className='text-xs font-semibold text-center'>◼ {data.label}</div>
      <Handle type='target' position={targetPosition} id='in' className={handleStyle} />
    </div>
  )
}

export function TaskNode({
  data,
  isConnecting,
  sourcePosition = Position.Bottom,
  targetPosition = Position.Top,
}: CustomNodeProps) {
  return (
    <div className={`${nodeStyle} border-primary`}>
      <div className='text-xs font-semibold'>👤 Task</div>
      <div className='text-xs text-muted-foreground truncate'>{data.label}</div>
      <Handle
        type='target'
        position={targetPosition}
        id='in'
        isConnectable={!isConnecting}
        className={handleStyle}
      />
      <Handle
        type='source'
        position={sourcePosition}
        id='out'
        isConnectable={!isConnecting}
        className={handleStyle}
      />
    </div>
  )
}

export function ServiceTaskNode({
  data,
  isConnecting,
  sourcePosition = Position.Bottom,
  targetPosition = Position.Top,
}: CustomNodeProps) {
  return (
    <div className={`${nodeStyle} border-secondary`}>
      <div className='text-xs font-semibold'>⚙️ Service</div>
      <div className='text-xs text-muted-foreground truncate'>{data.label}</div>
      <Handle
        type='target'
        position={targetPosition}
        id='in'
        isConnectable={!isConnecting}
        className={handleStyle}
      />
      <Handle
        type='source'
        position={sourcePosition}
        id='out'
        isConnectable={!isConnecting}
        className={handleStyle}
      />
    </div>
  )
}

export function NotificationNode({
  data,
  isConnecting,
  sourcePosition = Position.Bottom,
  targetPosition = Position.Top,
}: CustomNodeProps) {
  return (
    <div className={`${nodeStyle} border-warning`}>
      <div className='text-xs font-semibold'>🔔 Notification</div>
      <div className='text-xs text-muted-foreground truncate'>{data.label}</div>
      <Handle
        type='target'
        position={targetPosition}
        id='in'
        isConnectable={!isConnecting}
        className={handleStyle}
      />
      <Handle
        type='source'
        position={sourcePosition}
        id='out'
        isConnectable={!isConnecting}
        className={handleStyle}
      />
    </div>
  )
}

export function TimeDelayNode({
  data,
  isConnecting,
  sourcePosition = Position.Bottom,
  targetPosition = Position.Top,
}: CustomNodeProps) {
  return (
    <div className={`${nodeStyle} border-input`}>
      <div className='text-xs font-semibold'>⏱️ Timer</div>
      <div className='text-xs text-muted-foreground truncate'>{data.label}</div>
      <Handle
        type='target'
        position={targetPosition}
        id='in'
        isConnectable={!isConnecting}
        className={handleStyle}
      />
      <Handle
        type='source'
        position={sourcePosition}
        id='out'
        isConnectable={!isConnecting}
        className={handleStyle}
      />
    </div>
  )
}

export function ExclusiveGatewayNode({
  isConnecting,
  sourcePosition = Position.Bottom,
  targetPosition = Position.Top,
}: CustomNodeProps) {
  // Vertical: input Top, outputs Left/Right
  // Horizontal: input Left, outputs Top/Bottom
  const isHorizontal = sourcePosition === Position.Right
  const out1Position = isHorizontal ? Position.Top : Position.Right
  const out2Position = isHorizontal ? Position.Bottom : Position.Left

  return (
    <div className={`${nodeStyle} border-accent`}>
      <div className='text-xs font-bold text-center'>◇ Decision</div>
      <Handle
        type='target'
        position={targetPosition}
        id='in'
        isConnectable={!isConnecting}
        className={handleStyle}
      />
      <Handle
        type='source'
        position={out1Position}
        id='out-1'
        isConnectable={!isConnecting}
        className={handleStyle}
      />
      <Handle
        type='source'
        position={out2Position}
        id='out-2'
        isConnectable={!isConnecting}
        className={handleStyle}
      />
    </div>
  )
}

export function ParallelGatewayNode({
  isConnecting,
  sourcePosition = Position.Bottom,
  targetPosition = Position.Top,
}: CustomNodeProps) {
  return (
    <div className={`${nodeStyle} border-chart-1`}>
      <div className='text-xs font-bold text-center'>═ Parallel</div>
      <Handle
        type='target'
        position={targetPosition}
        id='in'
        isConnectable={!isConnecting}
        className={handleStyle}
      />
      <Handle
        type='source'
        position={sourcePosition}
        id='out'
        isConnectable={!isConnecting}
        className={handleStyle}
      />
    </div>
  )
}

export function ParallelGatewayJoinNode({
  isConnecting,
  sourcePosition = Position.Bottom,
  targetPosition = Position.Top,
}: CustomNodeProps) {
  // Vertical: inputs Top/Left, output Bottom
  // Horizontal: inputs Left/Top, output Right
  const isHorizontal = sourcePosition === Position.Right
  const in2Position = isHorizontal ? Position.Top : Position.Left

  return (
    <div className={`${nodeStyle} border-chart-2`}>
      <div className='text-xs font-bold text-center'>═ Join</div>
      <Handle
        type='target'
        position={targetPosition}
        id='in-1'
        isConnectable={!isConnecting}
        className={handleStyle}
      />
      <Handle
        type='target'
        position={in2Position}
        id='in-2'
        isConnectable={!isConnecting}
        className={handleStyle}
      />
      <Handle
        type='source'
        position={sourcePosition}
        id='out'
        isConnectable={!isConnecting}
        className={handleStyle}
      />
    </div>
  )
}

export function SubflowNode({
  data,
  isConnecting,
  sourcePosition = Position.Bottom,
  targetPosition = Position.Top,
}: CustomNodeProps) {
  return (
    <div className={`${nodeStyle} border-chart-3`}>
      <div className='text-xs font-semibold'>📦 Subflow</div>
      <div className='text-xs text-muted-foreground truncate'>{data.label}</div>
      <Handle
        type='target'
        position={targetPosition}
        id='in'
        isConnectable={!isConnecting}
        className={handleStyle}
      />
      <Handle
        type='source'
        position={sourcePosition}
        id='out'
        isConnectable={!isConnecting}
        className={handleStyle}
      />
    </div>
  )
}

export const nodeTypes = {
  [NodeType.START_EVENT]: StartEventNode,
  [NodeType.END_EVENT]: EndEventNode,
  [NodeType.TASK]: TaskNode,
  [NodeType.SERVICE_TASK]: ServiceTaskNode,
  [NodeType.NOTIFICATION]: NotificationNode,
  [NodeType.TIME_DELAY]: TimeDelayNode,
  [NodeType.EXCLUSIVE_GATEWAY]: ExclusiveGatewayNode,
  [NodeType.PARALLEL_GATEWAY]: ParallelGatewayNode,
  [NodeType.PARALLEL_GATEWAY_JOIN]: ParallelGatewayJoinNode,
  [NodeType.SUBFLOW]: SubflowNode,
}
