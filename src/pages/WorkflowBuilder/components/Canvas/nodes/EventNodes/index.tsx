import { Handle, Position } from '@xyflow/react'
import type { CustomNodeProps } from '..'
import { handleStyle } from '../styles'

export function StartEventNode({ data, sourcePosition = Position.Bottom }: CustomNodeProps) {
  return (
    <>
      <div className='text-xs font-semibold text-center'>▶ {data.label}</div>
      <Handle type='source' position={sourcePosition} id='out' className={handleStyle} />
    </>
  )
}

export function EndEventNode({ data, targetPosition = Position.Top }: CustomNodeProps) {
  return (
    <>
      <div className='text-xs font-semibold text-center'>◼ {data.label}</div>
      <Handle type='target' position={targetPosition} id='in' className={handleStyle} />
    </>
  )
}
