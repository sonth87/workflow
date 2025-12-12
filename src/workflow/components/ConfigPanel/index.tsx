import { CategoryType } from '@/enum/workflow.enum'
import type { WorkflowEdge, WorkflowNode } from '@/types/workflow.type'
import { X } from 'lucide-react'
import EdgeConfig from './config/EdgeConfig'
import GatewayConfig from './config/GatewayConfig'
import TaskConfig from './config/TaskConfig'
import { memo } from 'react'

interface ConfigPanelProps {
  selectedNode?: WorkflowNode
  selectedEdge?: WorkflowEdge
  onClose?: () => void
}

function ConfigPanel({ selectedNode, selectedEdge, onClose }: ConfigPanelProps) {
  const renderConfigNodeContent = () => {
    if (!selectedNode) {
      return <p className='text-xs text-muted-foreground'>Select a node to configure</p>
    }

    switch (selectedNode?.category_type) {
      case CategoryType.TASK:
        return <TaskConfig key={selectedNode.id} taskNode={selectedNode} />
      case CategoryType.GATEWAY:
        return <GatewayConfig key={selectedNode.id} />
      default:
        return (
          <p className='text-xs text-muted-foreground'>
            No configuration available for this node type
          </p>
        )
    }
  }

  const renderConfigEdgeContent = () => {
    if (!selectedEdge) {
      return <p className='text-xs text-muted-foreground'>Select an edge to configure</p>
    }
    return <EdgeConfig key={selectedEdge.id} edgeData={selectedEdge} />
  }

  return (
    <aside className='w-80 h-full border border-border/50 bg-card/95 backdrop-blur-sm overflow-y-auto rounded-xl shadow-xl flex flex-col animate-in slide-in-from-right duration-200'>
      <div className='flex items-center justify-between px-4 py-3 border-b border-border'>
        <h2 className='text-sm font-semibold uppercase tracking-wide text-foreground/80'>
          Configuration
        </h2>
        <button onClick={() => onClose?.()} className='p-2 rounded-lg hover:bg-foreground/10'>
          <X size={16} />
        </button>
      </div>

      <div className='p-4'>
        {selectedNode && (
          <div className='space-y-4 flex-1 overflow-y-auto pr-1'>{renderConfigNodeContent()}</div>
        )}
        {selectedEdge && (
          <div className='space-y-4 flex-1 overflow-y-auto pr-1'>{renderConfigEdgeContent()}</div>
        )}
      </div>
    </aside>
  )
}

export default memo(ConfigPanel)
