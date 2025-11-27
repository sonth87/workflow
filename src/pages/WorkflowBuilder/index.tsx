'use client'

import type { Connection, Edge, Node } from '@xyflow/react'
import {
  addEdge,
  Position,
  useEdgesState,
  useNodesState,
  useReactFlow,
  useUpdateNodeInternals,
} from '@xyflow/react'
import { useCallback, useState } from 'react'
import { Canvas } from './components/Canvas'
import { ConfigPanel } from './components/ConfigPanel'
import { Header, type LayoutDirection } from './components/Header'
import { Toolbar } from './components/Toolbar'
import { Toolbox } from './components/Toolbox'
import { getLayoutedElements } from './utils/layout'

const initialNodes: Node[] = [
  {
    id: 'start-1',
    type: 'startEvent',
    data: { label: 'Start' },
    position: { x: 250, y: 50 },
    sourcePosition: Position.Bottom,
  },
  {
    id: 'task-1',
    type: 'task',
    data: { label: 'Process Request' },
    position: { x: 200, y: 150 },
    sourcePosition: Position.Bottom,
    targetPosition: Position.Top,
  },
  {
    id: 'gateway-1',
    type: 'exclusiveGateway',
    data: { label: 'Approved?' },
    position: { x: 225, y: 250 },
    sourcePosition: Position.Bottom,
    targetPosition: Position.Top,
  },
  {
    id: 'task-2',
    type: 'task',
    data: { label: 'Send Approval' },
    position: { x: 100, y: 350 },
    sourcePosition: Position.Bottom,
    targetPosition: Position.Top,
  },
  {
    id: 'task-3',
    type: 'task',
    data: { label: 'Send Rejection' },
    position: { x: 300, y: 350 },
    sourcePosition: Position.Bottom,
    targetPosition: Position.Top,
  },
  {
    id: 'end-1',
    type: 'endEvent',
    data: { label: 'End' },
    position: { x: 225, y: 450 },
    targetPosition: Position.Top,
  },
]

const initialEdges: Edge[] = [
  {
    id: 'e1-2',
    source: 'start-1',
    target: 'task-1',
    type: 'smooth',
    animated: true,
  },
  {
    id: 'e2-3',
    source: 'task-1',
    target: 'gateway-1',
    type: 'smooth',
    animated: true,
  },
  {
    id: 'e3-4',
    source: 'gateway-1',
    target: 'task-2',
    type: 'smooth',
    animated: true,
    label: 'Yes',
  },
  {
    id: 'e3-5',
    source: 'gateway-1',
    target: 'task-3',
    type: 'smooth',
    animated: true,
    label: 'No',
  },
  {
    id: 'e4-6',
    source: 'task-2',
    target: 'end-1',
    type: 'smooth',
    animated: true,
  },
  {
    id: 'e5-6',
    source: 'task-3',
    target: 'end-1',
    type: 'smooth',
    animated: true,
  },
]

export default function WorkflowBuilder() {
  const [workflowName, setWorkflowName] = useState('Untitled Workflow')
  const [selectedNode, setSelectedNode] = useState<string | null>(null)
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>(initialEdges)
  const [layoutDirection, setLayoutDirection] = useState<LayoutDirection>('vertical')

  const { fitView } = useReactFlow()
  const updateNodeInternals = useUpdateNodeInternals()

  const handleUndo = () => {
    console.log('Undo action')
  }

  const handleRedo = () => {
    console.log('Redo action')
  }

  const handleRun = () => {
    console.log('Run workflow')
  }

  const handleSave = () => {
    console.log('Save workflow:', workflowName)
  }

  const handleMenu = () => {
    console.log('Menu options')
  }

  const handleNodeDrop = (nodeType: string, position: { x: number; y: number }) => {
    const newNode: Node = {
      id: `${nodeType}-${Date.now()}`,
      type: nodeType,
      data: { label: nodeType },
      position,
      sourcePosition: layoutDirection === 'vertical' ? Position.Bottom : Position.Right,
      targetPosition: layoutDirection === 'vertical' ? Position.Top : Position.Left,
    }
    setNodes((nds) => [...nds, newNode])
  }

  const handleConnect = useCallback(
    (connection: Connection) => {
      setEdges((eds) =>
        addEdge(
          {
            ...connection,
            type: 'smooth',
            animated: true,
          },
          eds
        )
      )
    },
    [setEdges]
  )

  const handleNodeClick = useCallback((_event: React.MouseEvent, node: Node) => {
    console.log('🚀 ~ node:', node)
    setSelectedNode(node.id)
  }, [])

  const handleEdgeClick = useCallback((_event: React.MouseEvent, edge: Edge) => {
    console.log('🚀 ~ edge:', edge)
  }, [])

  const handlePaneClick = useCallback(() => {
    setSelectedNode(null)
  }, [])

  const handleChangeLayoutDirection = (direction: LayoutDirection) => {
    setLayoutDirection(direction)

    const { nodes: layoutedNodes } = getLayoutedElements(nodes, edges, direction)

    setNodes(layoutedNodes)

    setTimeout(() => {
      layoutedNodes.forEach((n) => updateNodeInternals(n.id))
      fitView({ padding: 0.2, duration: 300, maxZoom: 1 })
    }, 100)
  }

  return (
    <div className='relative h-screen w-screen bg-background overflow-hidden'>
      <div className='absolute top-4 left-4 right-4 z-10'>
        <Header
          workflowName={workflowName}
          onWorkflowNameChange={setWorkflowName}
          onUndo={handleUndo}
          onRedo={handleRedo}
          onRun={handleRun}
          onSave={handleSave}
          layoutDirection={layoutDirection}
          onLayoutDirectionChange={handleChangeLayoutDirection}
        />
      </div>

      <div className='absolute top-24 left-4 bottom-20 z-10 h-[calc(100%-7rem)]'>
        <Toolbox />
      </div>

      <Canvas
        nodes={nodes}
        edges={edges}
        onNodeDrop={handleNodeDrop}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={handleConnect}
        onNodeClick={handleNodeClick}
        onEdgeClick={handleEdgeClick}
        onPaneClick={handlePaneClick}
        layoutDirection={layoutDirection}
      />

      <div className='absolute top-24 right-4 bottom-20 z-10 h-[calc(100%-7rem)]'>
        <ConfigPanel selectedNode={selectedNode} />
      </div>

      {/* Toolbar - Center bottom */}
      <div className='absolute bottom-4 left-1/2 -translate-x-1/2 z-10'>
        <Toolbar onMenu={handleMenu} />
      </div>
    </div>
  )
}
