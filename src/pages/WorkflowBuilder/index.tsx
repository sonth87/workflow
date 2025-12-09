'use client'

import { EdgeType, NodeType } from '@/enum/workflow.enum'
import type { BaseNode, WorkflowEdge, WorkflowNode } from '@/types/workflow.type'
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
import ConfigPanel from './components/ConfigPanel'
import { Header, type LayoutDirection } from './components/Header'
import { Toolbar } from './components/Toolbar'
import { Toolbox } from './components/Toolbox'
import { ValidationPanel } from './components/ValidationPanel'
import { useFlowHistory } from './hooks/useFlowHistory'
import { getLayoutedElements } from './utils/layout'
import type { DynamicWorkflowDefinition } from '@/types/dynamic-bpm.type'

interface Props {
  dynamicBpm?: DynamicWorkflowDefinition
}

export default function WorkflowBuilder(props: Props) {
  const { dynamicBpm } = props
  const [workflowName, setWorkflowName] = useState('Untitled Workflow')
  const [selectedNode, setSelectedNode] = useState<Node>()
  const [selectedEdge, setSelectedEdge] = useState<Edge>()
  const { nodes, edges, setNodes, setEdges, redo, undo } = useFlowHistory([], [])
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
    console.log('Save workflow:', workflowName, nodes, edges)
    console.log('Validation errors:', validationErrors)
  }

  const handleMenu = () => {
    console.log('Menu options')
  }

  const handleNodeDrop = (nodeType: NodeType, position: { x: number; y: number }) => {
    const nodeConfig = dynamicBpm?.nodes?.find((n) => n.nodeType === nodeType)

    const newNode: BaseNode = {
      id: `${nodeType}-${Date.now()}`,
      type: nodeType,
      data: {
        category_type: nodeConfig?.category_type!,
        label: nodeConfig?.data?.label || nodeConfig?.label || 'New Node',
        ...nodeConfig?.data,
      },
      position,
      category_type: nodeConfig?.category_type!,
      label: nodeConfig?.label!,
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
            type: EdgeType.SmoothStep,
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
    setSelectedEdge(undefined)
  }, [])

  const handleEdgeClick = useCallback((_event: React.MouseEvent, edge: Edge) => {
    setSelectedEdge(edge)
    setSelectedNode(undefined)
  }, [])

  const handlePaneClick = useCallback(() => {
    setSelectedNode(undefined)
    setSelectedEdge(undefined)
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
    <div className='flex flex-col h-screen w-screen'>
      <div className=''>
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
      <div className='relative h-screen w-screen bg-background overflow-hidden'>
        <div className='absolute top-4 left-4 bottom-20 z-10 h-[calc(100%-2rem)]'>
          <Toolbox dynamicBpm={dynamicBpm} />
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
          <div className='absolute top-4 right-4 bottom-20 z-10 h-[calc(100%-2rem)]'>
            <ConfigPanel
              selectedNode={selectedNode as WorkflowNode}
              onClose={() => setSelectedNode(undefined)}
            />
          </div>
        )}

        {selectedEdge && (
          <div className='absolute top-4 right-4 bottom-20 z-10 h-[calc(100%-2rem)]'>
            <ConfigPanel
              selectedEdge={selectedEdge as WorkflowEdge}
              onClose={() => setSelectedEdge(undefined)}
            />
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
    </div>
  )
}
