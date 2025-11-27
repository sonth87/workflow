import type { Edge, Node } from '@xyflow/react'
import {
  Background,
  ConnectionLineType,
  Controls,
  ReactFlow,
  SelectionMode,
  useReactFlow,
  type Connection,
  type EdgeChange,
  type NodeChange,
} from '@xyflow/react'
import { useCallback } from 'react'
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

      console.log('Dropped node type:', nodeType, 'at position:', centeredPosition)
      onNodeDrop?.(nodeType, centeredPosition)
    },
    [screenToFlowPosition, onNodeDrop]
  )

  return (
    <main
      className='absolute inset-0 w-full h-full overflow-hidden bg-background'
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
          onConnect={onConnect}
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
          className='
            [&_.react-flow__edge]:transition-all!
            [&_.react-flow__edge]:duration-300!
            [&_.react-flow__node.selected]:shadow-[0_0_0_3px_hsl(var(--primary))]!
            [&_.react-flow__node.selected_.react-flow__handle]:opacity-100!
            [&_.react-flow__node.selected_.react-flow__handle]:w-3!
            [&_.react-flow__node.selected_.react-flow__handle]:h-3!
            [&_.react-flow__node.selected_.react-flow__handle]:bg-primary!
            [&_.react-flow__node.selected_.react-flow__handle]:border-primary!
          '
        >
          <Background gap={15} />
          <Controls position='bottom-right' showInteractive={false} />
        </ReactFlow>
      )}
    </main>
  )
}
