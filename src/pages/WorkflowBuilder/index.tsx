'use client'

import { useState } from 'react'
import { Canvas } from './components/Canvas'
import { ConfigPanel } from './components/ConfigPanel'
import { Header } from './components/Header'
import { Toolbox } from './components/Toolbox'
import { Toolbar } from './components/Toolbar'

export default function WorkflowBuilder() {
  const [workflowName, setWorkflowName] = useState('Untitled Workflow')
  const [selectedNode, _setSelectedNode] = useState<string | null>(null)

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
        />
      </div>

      <div className='absolute top-24 left-4 bottom-20 z-10 h-[calc(100%-7rem)]'>
        <Toolbox />
      </div>

      <Canvas />

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
