import { Handle, Position } from '@xyflow/react'
import { nodeStyle, handleStyle } from '../styles'
import type { CustomNodeProps } from '..'

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
