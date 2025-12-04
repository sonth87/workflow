import { EdgeType } from '@/enum/workflow.enum'
import { BaseEdge, EdgeLabelRenderer, getSmoothStepPath, type EdgeProps } from '@xyflow/react'

export function SmoothEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  markerEnd,
  style,
  label,
  selected,
}: EdgeProps) {
  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  })

  return (
    <>
      <defs>
        <marker
          id={`arrow-selected-${id}`}
          markerWidth='12.5'
          markerHeight='12.5'
          viewBox='-10 -10 20 20'
          orient='auto'
          refX='0'
          refY='0'
        >
          <polyline
            stroke='#3b82f6'
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='1'
            fill='#3b82f6'
            points='-5,-4 0,0 -5,4 -5,-4'
          />
        </marker>
      </defs>

      <BaseEdge
        path={edgePath}
        markerEnd={selected ? `url(#arrow-selected-${id})` : markerEnd}
        style={{
          strokeWidth: selected ? 3 : 2,
          stroke: selected ? '#3b82f6' : undefined,
          transition: 'stroke-width 0.2s ease, stroke 0.2s ease',
          ...style,
        }}
        interactionWidth={20}
      />

      {/* Invisible path for double-click */}
      <path
        d={edgePath}
        fill='none'
        stroke='transparent'
        strokeWidth={20}
        style={{ cursor: 'pointer' }}
        pointerEvents='stroke'
      />

      <EdgeLabelRenderer>
        {label && (
          <div
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              pointerEvents: 'all',
            }}
            className='nodrag nopan'
          >
            <div className='px-2 py-1 text-xs bg-primaryA-200 text-primaryA-500 border rounded-full cursor-pointer hover:bg-accent transition-colors'>
              {label}
            </div>
          </div>
        )}
      </EdgeLabelRenderer>
    </>
  )
}

export const edgeTypes = {
  [EdgeType.SmoothStep]: SmoothEdge,
  [EdgeType.Default]: SmoothEdge,
  [EdgeType.Straight]: SmoothEdge,
  [EdgeType.Bezier]: SmoothEdge,
}
