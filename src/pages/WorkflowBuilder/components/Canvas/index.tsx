import { NodeType } from '@/enum/workflow.enum'
import { validateConnection } from '@/utils/validation'
import type { Edge, Node } from '@xyflow/react'
import {
  Background,
  ConnectionLineType,
  ReactFlow,
  SelectionMode,
  useReactFlow,
  type Connection,
  type EdgeChange,
  type NodeChange,
} from '@xyflow/react'
import { useCallback, useEffect, useState } from 'react'
import { edgeTypes } from './edges'
import { nodeTypes } from './nodes'

interface CanvasProps {
  children?: React.ReactNode
  nodes?: Node[]
  edges?: Edge[]
  onNodeDrop?: (nodeType: string, position: { x: number; y: number }) => void
  onNodesChange?: (changes: NodeChange<Node>[]) => void
  onEdgesChange?: (changes: EdgeChange<Edge>[]) => void
  onConnect?: (connection: Connection) => void
  onNodeClick?: (event: React.MouseEvent, node: Node) => void
  onEdgeClick?: (event: React.MouseEvent, edge: Edge) => void
  onPaneClick?: () => void
  layoutDirection?: 'vertical' | 'horizontal'
}

export function Canvas({
  children,
  nodes = [],
  edges = [],
  onNodeDrop,
  onNodesChange,
  onEdgesChange,
  onConnect,
  onNodeClick,
  onEdgeClick,
  onPaneClick,
}: CanvasProps) {
  const { screenToFlowPosition } = useReactFlow()
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null)

  const handleConnect = useCallback(
    (connection: Connection) => {
      if (!connection.source || !connection.target) return

      const sourceNode = nodes.find((n) => n.id === connection.source)
      const targetNode = nodes.find((n) => n.id === connection.target)

      if (!sourceNode || !targetNode) return

      const sourceType = sourceNode.type as NodeType
      const targetType = targetNode.type as NodeType

      const existingSourceConnections = edges.filter((e) => e.source === connection.source).length
      const existingTargetConnections = edges.filter((e) => e.target === connection.target).length

      const validation = validateConnection(
        sourceType,
        targetType,
        existingSourceConnections,
        existingTargetConnections
      )

      if (!validation.valid) {
        console.warn('Connection validation failed:', validation.message)
        alert(`Cannot create connection: ${validation.message}`)
        return
      }

      onConnect?.(connection)
    },
    [nodes, edges, onConnect]
  )

  const handleDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
  }, [])

  const handleDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault()

      const nodeType = event.dataTransfer.getData('application/reactflow')
      if (!nodeType) return

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      })

      const centeredPosition = {
        x: position.x - 75,
        y: position.y - 35,
      }

      onNodeDrop?.(nodeType, centeredPosition)
    },
    [screenToFlowPosition, onNodeDrop]
  )

  useEffect(() => {
    const handleClick = () => setContextMenu(null)
    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [])

  return (
    <main
      className='absolute inset-0 w-full h-full overflow-hidden bg-whiteOpacity100'
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {children || (
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={handleConnect}
          onNodeClick={onNodeClick}
          onEdgeClick={onEdgeClick}
          onPaneClick={onPaneClick}
          defaultEdgeOptions={{
            type: 'smooth',
            animated: true,
            markerEnd: { type: 'arrowclosed' },
          }}
          connectionLineType={ConnectionLineType.SmoothStep}
          snapGrid={[15, 15]}
          selectNodesOnDrag={false}
          panOnDrag={[1, 2]}
          selectionOnDrag
          selectionMode={SelectionMode.Partial}
          reconnectRadius={20}
          fitView
          minZoom={0.2}
          maxZoom={3}
          onPaneContextMenu={(e) => {
            e.preventDefault()
            setContextMenu({
              x: e.clientX,
              y: e.clientY,
            })
          }}
        >
          <Background gap={15} />
        </ReactFlow>
      )}
      {contextMenu && (
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            position: 'fixed',
            top: contextMenu.y,
            left: contextMenu.x,
            background: '#fff',
            border: '1px solid #ccc',
            padding: 8,
            borderRadius: 6,
            zIndex: 999,
          }}
        >
          <div>Context Menu</div>
        </div>
      )}
    </main>
  )
}
