import { ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'
import { NodeType } from '@/enum/workflow.enum'

interface NodeItem {
  type: NodeType
  label: string
  icon?: string
}

interface NodeCategory {
  name: string
  isOpen: boolean
  nodes: NodeItem[]
}

interface ToolboxProps {
  categories?: NodeCategory[]
  onCategoryToggle?: (index: number) => void
}

const DEFAULT_CATEGORIES: NodeCategory[] = [
  {
    name: 'Event',
    isOpen: true,
    nodes: [
      { type: NodeType.START_EVENT, label: 'Start Event' },
      { type: NodeType.END_EVENT, label: 'End Event' },
    ],
  },
  {
    name: 'Task',
    isOpen: true,
    nodes: [
      { type: NodeType.TASK, label: 'Human Task' },
      { type: NodeType.SERVICE_TASK, label: 'Service Task' },
      { type: NodeType.NOTIFICATION, label: 'Notification' },
      { type: NodeType.TIME_DELAY, label: 'Time Delay' },
    ],
  },
  {
    name: 'Gateway',
    isOpen: false,
    nodes: [
      { type: NodeType.EXCLUSIVE_GATEWAY, label: 'Exclusive Gateway' },
      { type: NodeType.PARALLEL_GATEWAY, label: 'Parallel Gateway' },
      { type: NodeType.PARALLEL_GATEWAY_JOIN, label: 'Parallel Join' },
    ],
  },
  {
    name: 'Advanced',
    isOpen: false,
    nodes: [{ type: NodeType.SUBFLOW, label: 'Subflow' }],
  },
]

export function Toolbox({ categories, onCategoryToggle }: ToolboxProps) {
  const [localCategories, setLocalCategories] = useState<NodeCategory[]>(
    categories || DEFAULT_CATEGORIES
  )

  const handleToggle = (index: number) => {
    if (onCategoryToggle) {
      onCategoryToggle(index)
    } else {
      setLocalCategories((prev) =>
        prev.map((cat, i) => (i === index ? { ...cat, isOpen: !cat.isOpen } : cat))
      )
    }
  }

  const handleDragStart = (e: React.DragEvent, nodeType: NodeType) => {
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('application/reactflow', nodeType)
  }

  return (
    <aside className='w-64 h-full border border-border bg-card p-4 overflow-y-auto rounded-lg shadow-md flex flex-col'>
      <h2 className='mb-4 text-sm font-semibold uppercase tracking-wide shrink-0'>Node Types</h2>

      <div className='space-y-2 flex-1 overflow-y-auto'>
        {localCategories.map((category, index) => (
          <div key={category.name} className='rounded border border-border overflow-hidden'>
            <button
              onClick={() => handleToggle(index)}
              className='flex w-full items-center justify-between bg-muted px-3 py-2 hover:bg-input transition-colors'
            >
              <span className='text-sm font-medium'>{category.name}</span>
              {category.isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>

            {category.isOpen && (
              <div className='space-y-1 border-t border-border p-2 bg-background/50'>
                {category.nodes.map((node) => (
                  <div
                    key={node.type}
                    draggable
                    onDragStart={(e) => handleDragStart(e, node.type)}
                    className='rounded bg-card border border-border px-3 py-2 text-xs cursor-move hover:bg-primary/10 hover:border-primary transition-all'
                  >
                    {node.label}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </aside>
  )
}
