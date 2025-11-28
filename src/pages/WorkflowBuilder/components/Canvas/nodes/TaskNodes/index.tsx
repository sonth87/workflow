import { Handle, Position } from '@xyflow/react'
import type { CustomNodeProps } from '..'
import { handleStyle } from '../styles'

export function TaskNode({
  data,
  isConnecting,
  sourcePosition = Position.Bottom,
  targetPosition = Position.Top,
}: CustomNodeProps) {
  return (
    <>
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
    </>
  )
}

export function ServiceTaskNode({
  data,
  isConnecting,
  sourcePosition = Position.Bottom,
  targetPosition = Position.Top,
}: CustomNodeProps) {
  return (
    <>
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
    </>
  )
}

export function NotificationNode({
  data,
  isConnecting,
  sourcePosition = Position.Bottom,
  targetPosition = Position.Top,
}: CustomNodeProps) {
  return (
    <>
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
    </>
  )
}

export function TimeDelayNode({
  data,
  isConnecting,
  sourcePosition = Position.Bottom,
  targetPosition = Position.Top,
}: CustomNodeProps) {
  return (
    <>
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
    </>
  )
}

export function SubflowNode({
  data,
  isConnecting,
  sourcePosition = Position.Bottom,
  targetPosition = Position.Top,
}: CustomNodeProps) {
  return (
    <>
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
    </>
  )
}
