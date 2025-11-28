import { NodeType } from '@/enum/workflow.enum'
import type { WorkflowNode } from '@/types/workflow.type'
import { Settings, ChevronLeft, ChevronRight } from 'lucide-react'
import { useState } from 'react'
import TaskConfig from './config/TaskConfig'
import GatewayConfig from './config/GatewayConfig'

interface ConfigPanelProps {
  selectedNode?: WorkflowNode
}

export function ConfigPanel({ selectedNode }: ConfigPanelProps) {
  const [isOpen, setIsOpen] = useState(true)

  const renderConfigContent = () => {
    if (!selectedNode) {
      return <p className='text-xs text-muted-foreground'>Select a node to configure</p>
    }

    switch (selectedNode.type) {
      case NodeType.TASK:
        return <TaskConfig />
      case NodeType.EXCLUSIVE_GATEWAY:
        return <GatewayConfig />
      default:
        return (
          <p className='text-xs text-muted-foreground'>
            No configuration available for this node type
          </p>
        )
    }
  }

  return (
    <>
      {isOpen && (
        <aside className='w-80 h-full border border-border/50 bg-card/95 backdrop-blur-sm p-4 overflow-y-auto rounded-xl shadow-xl flex flex-col animate-in slide-in-from-right duration-200'>
          <div className='flex items-center justify-between shrink-0 mb-4'>
            <h2 className='text-sm font-semibold uppercase tracking-wide text-foreground/80'>
              Configuration
            </h2>
            <div className='p-2 bg-primary/10 rounded-lg'>
              <Settings size={16} className='text-primary' />
            </div>
          </div>

          <div className='space-y-4 flex-1 overflow-y-auto pr-1'>{renderConfigContent()}</div>
        </aside>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        className='absolute -left-2 top-1/2 -translate-y-1/2 z-30 w-6 h-16 bg-background/95 backdrop-blur-sm border border-border rounded-l-lg shadow-md hover:w-8 hover:bg-primary/10 hover:border-primary transition-all duration-200 group flex items-center justify-center'
        title={isOpen ? 'Hide Config Panel' : 'Show Config Panel'}
      >
        {isOpen ? (
          <ChevronRight
            size={14}
            className='text-muted-foreground group-hover:text-primary transition-colors'
          />
        ) : (
          <ChevronLeft
            size={14}
            className='text-muted-foreground group-hover:text-primary transition-colors'
          />
        )}
      </button>
    </>
  )
}
