import { Handle, Position } from '@xyflow/react'
import { nodeStyle, handleStyle } from '../styles'
import type { CustomNodeProps } from '..'

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
