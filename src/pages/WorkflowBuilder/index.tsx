'use client'

import { NodeType } from '@/enum/workflow.enum'
import type { WorkflowNode } from '@/types/workflow.type'
import { validateWorkflow } from '@/utils/validation'
import type { Connection, Edge, Node } from '@xyflow/react'
import {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  Position,
  useReactFlow,
  useUpdateNodeInternals,
} from '@xyflow/react'
import { useCallback, useState } from 'react'
import { Canvas } from './components/Canvas'
import { ConfigPanel } from './components/ConfigPanel'
import { Header, type LayoutDirection } from './components/Header'
import { Toolbar } from './components/Toolbar'
import { Toolbox } from './components/Toolbox'
import { ValidationPanel } from './components/ValidationPanel'
import { getLayoutedElements } from './utils/layout'
import { useFlowHistory } from './hooks/useFlowHistory'

const initialNodes: WorkflowNode[] = [
  {
    id: 'start-1',
    type: NodeType.START_EVENT_DEFAULT,
    label: 'Start',
    position: { x: 250, y: 50 },
    sourcePosition: Position.Bottom,
    data: { label: 'Start' },
  },
  {
    id: 'task-1',
    type: NodeType.TASK_DEFAULT,
    label: 'Process Request',
    position: { x: 200, y: 150 },
    sourcePosition: Position.Bottom,
    targetPosition: Position.Top,
    data: { label: 'Process Request' },
  },
  {
    id: 'gateway-1',
    type: NodeType.EXCLUSIVE_GATEWAY,
    label: 'Approved?',
    position: { x: 225, y: 250 },
    sourcePosition: Position.Bottom,
    targetPosition: Position.Top,
    data: { label: 'Approved?' },
  },
  {
    id: 'task-2',
    type: NodeType.TASK_DEFAULT,
    label: 'Send Approval',
    position: { x: 100, y: 350 },
    sourcePosition: Position.Bottom,
    targetPosition: Position.Top,
    data: { label: 'Send Approval' },
  },
  {
    id: 'task-3',
    type: NodeType.TASK_DEFAULT,
    label: 'Send Rejection',
    position: { x: 300, y: 350 },
    sourcePosition: Position.Bottom,
    targetPosition: Position.Top,
    data: { label: 'Send Rejection' },
  },
  {
    id: 'end-1',
    type: NodeType.END_EVENT_DEFAULT,
    label: 'End',
    position: { x: 225, y: 450 },
    targetPosition: Position.Top,
    data: { label: 'End' },
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
    sourceHandle: 'out-1',
    target: 'task-2',
    type: 'smooth',
    animated: true,
    label: 'Yes',
  },
  {
    id: 'e3-5',
    source: 'gateway-1',
    target: 'task-3',
    sourceHandle: 'out-2',
    type: 'smooth',
    animated: false,
    label: 'No',
  },
  {
    id: 'e4-6',
    source: 'task-2',
    target: 'end-1',
    type: 'smooth',
    animated: false,
  },
  {
    id: 'e5-6',
    source: 'task-3',
    target: 'end-1',
    type: 'smooth',
    animated: false,
  },
]

export default function WorkflowBuilder() {
  const [workflowName, setWorkflowName] = useState('Untitled Workflow')
  const [selectedNode, setSelectedNode] = useState<Node>()
  const { nodes, edges, setNodes, setEdges, redo, undo } = useFlowHistory(
    initialNodes,
    initialEdges
  )
  const [layoutDirection, setLayoutDirection] = useState<LayoutDirection>('vertical')
  const [validationErrors, setValidationErrors] = useState<
    Array<{ nodeId: string; message: string; type: 'error' | 'warning' }>
  >([])

  const { fitView } = useReactFlow()
  const updateNodeInternals = useUpdateNodeInternals()

  const handleValidateWorkflow = useCallback(() => {
    const workflowNodes = nodes.map((n) => ({
      id: n.id,
      type: n.type as NodeType,
    }))
    const workflowEdges = edges.map((e) => ({
      source: e.source,
      target: e.target,
    }))

    const errors = validateWorkflow(workflowNodes, workflowEdges)
    setValidationErrors(errors)
  }, [nodes, edges])

  useCallback(() => {
    handleValidateWorkflow()
  }, [nodes, edges, handleValidateWorkflow])

  const handleRun = () => {
    handleValidateWorkflow()
    if (validationErrors.filter((e) => e.type === 'error').length > 0) {
      alert('Please fix all errors before running the workflow')
      return
    }
    console.log('Run workflow')
  }

  const handleSave = () => {
    handleValidateWorkflow()
    console.log('Save workflow:', workflowName)
    console.log('Validation errors:', validationErrors)
  }

  const handleMenu = () => {
    console.log('Menu options')
  }

  const handleNodeDrop = (nodeType: string, position: { x: number; y: number }) => {
    const isPool = nodeType === 'pool'
    const isNote = nodeType === 'note'

    const newNode: Node = {
      id: `${nodeType}-${Date.now()}`,
      type: nodeType,
      data: isPool
        ? {
            label: 'Pool',
            rows: [{ id: '1', label: 'Lane 1', height: 150 }],
            columns: [{ id: '1', label: 'Phase 1', width: 400 }],
          }
        : isNote
        ? {
            label: 'Note',
            content: 'Double click to edit note...',
            color: 'yellow',
            fontSize: 'base',
          }
        : { label: nodeType },
      position,
      sourcePosition: layoutDirection === 'vertical' ? Position.Bottom : Position.Right,
      targetPosition: layoutDirection === 'vertical' ? Position.Top : Position.Left,
      ...(isPool && {
        style: { zIndex: -1 },
        draggable: true,
        selectable: true,
      }),
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
    setSelectedNode(node)
  }, [])

  const handleEdgeClick = useCallback((_event: React.MouseEvent, edge: Edge) => {
    console.log('🚀 ~ edge:', edge)
  }, [])

  const handlePaneClick = useCallback(() => {
    setSelectedNode(undefined)
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
          onUndo={undo}
          onRedo={redo}
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
        onNodesChange={(changes) => setNodes((nds) => applyNodeChanges(changes, nds))}
        onEdgesChange={(changes) => setEdges((eds) => applyEdgeChanges(changes, eds))}
        onConnect={handleConnect}
        onNodeClick={handleNodeClick}
        onEdgeClick={handleEdgeClick}
        onPaneClick={handlePaneClick}
        layoutDirection={layoutDirection}
      />

      {selectedNode && (
        <div className='absolute top-24 right-4 bottom-20 z-10 h-[calc(100%-7rem)]'>
          <ConfigPanel selectedNode={selectedNode as WorkflowNode} />
        </div>
      )}

      <ValidationPanel
        errors={validationErrors}
        onClose={() => setValidationErrors([])}
        onNodeSelect={(nodeId) => {
          const node = nodes.find((n) => n.id === nodeId)
          setSelectedNode(node)
          if (node) {
            fitView({ nodes: [node], duration: 300, padding: 0.3 })
          }
        }}
      />

      <div className='absolute bottom-4 left-1/2 -translate-x-1/2 z-10'>
        <Toolbar onMenu={handleMenu} />
      </div>
    </div>
  )
}
