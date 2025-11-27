import { Handle, Position } from '@xyflow/react'
import { nodeStyle, handleStyle } from '../styles'
import type { CustomNodeProps } from '..'

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
