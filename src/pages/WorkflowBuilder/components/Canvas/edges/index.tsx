import {
  BaseEdge,
  EdgeLabelRenderer,
  getSmoothStepPath,
  useReactFlow,
  type EdgeProps,
} from '@xyflow/react'
import { useState } from 'react'

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

  const { setEdges } = useReactFlow()
  const [isEditing, setIsEditing] = useState(false)
  const [labelText, setLabelText] = useState((label as string) || '')

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsEditing(true)
  }

  const handleBlur = () => {
    setIsEditing(false)
    setEdges((edges) =>
      edges.map((edge) => (edge.id === id ? { ...edge, label: labelText } : edge))
    )
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleBlur()
    } else if (e.key === 'Escape') {
      setLabelText((label as string) || '')
      setIsEditing(false)
    }
  }

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
        onDoubleClick={handleDoubleClick}
        pointerEvents='stroke'
      />

      <EdgeLabelRenderer>
        {(labelText || isEditing) && (
          <div
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              pointerEvents: 'all',
            }}
            className='nodrag nopan'
          >
            {isEditing ? (
              <input
                type='text'
                value={labelText}
                onChange={(e) => setLabelText(e.target.value)}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                autoFocus
                className='px-2 py-1 text-xs border rounded bg-background focus:outline-none focus:ring-2 focus:ring-primary'
              />
            ) : (
              <div
                onDoubleClick={(e) => {
                  e.stopPropagation()
                  setIsEditing(true)
                }}
                className='px-2 py-1 text-xs bg-background border rounded cursor-pointer hover:bg-accent transition-colors'
              >
                {labelText}
              </div>
            )}
          </div>
        )}
      </EdgeLabelRenderer>
    </>
  )
}

export const edgeTypes = {
  smooth: SmoothEdge,
}
