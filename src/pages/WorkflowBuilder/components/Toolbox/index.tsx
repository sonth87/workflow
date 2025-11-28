import { ChevronDown, ChevronUp, ChevronLeft, ChevronRight } from 'lucide-react'
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
    nodes: [
      { type: NodeType.SUBFLOW, label: 'Subflow' },
      { type: NodeType.POOL, label: 'Pool / Region' },
      { type: NodeType.NOTE, label: 'Note' },
    ],
  },
]

export function Toolbox({ categories, onCategoryToggle }: ToolboxProps) {
  const [isOpen, setIsOpen] = useState(true)
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
    <>
      {isOpen && (
        <aside className='w-64 h-full border border-border/50 bg-card/95 backdrop-blur-sm p-4 overflow-y-auto rounded-xl shadow-xl flex flex-col animate-in slide-in-from-left duration-200'>
          <h2 className='mb-4 text-sm font-semibold uppercase tracking-wide shrink-0 text-foreground/80'>
            Node Types
          </h2>

          <div className='space-y-2 flex-1 overflow-y-auto pr-1'>
            {localCategories.map((category, index) => (
              <div
                key={category.name}
                className='rounded-lg border border-border/50 overflow-hidden bg-background/50 backdrop-blur-sm'
              >
                <button
                  onClick={() => handleToggle(index)}
                  className='flex w-full items-center justify-between bg-muted/50 px-3 py-2.5 hover:bg-muted transition-all duration-150 group'
                >
                  <span className='text-sm font-medium group-hover:text-primary transition-colors'>
                    {category.name}
                  </span>
                  {category.isOpen ? (
                    <ChevronUp
                      size={16}
                      className='text-muted-foreground group-hover:text-primary transition-colors'
                    />
                  ) : (
                    <ChevronDown
                      size={16}
                      className='text-muted-foreground group-hover:text-primary transition-colors'
                    />
                  )}
                </button>

                {category.isOpen && (
                  <div className='space-y-1.5 border-t border-border/50 p-2 bg-background/30'>
                    {category.nodes.map((node) => (
                      <div
                        key={node.type}
                        draggable
                        onDragStart={(e) => handleDragStart(e, node.type)}
                        className='rounded-lg bg-card/80 backdrop-blur-sm border border-border/50 px-3 py-2.5 text-xs font-medium cursor-move hover:bg-primary/10 hover:border-primary hover:shadow-md hover:scale-[1.02] active:scale-95 transition-all duration-150'
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
      )}

      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className='absolute -right-2 top-1/2 -translate-y-1/2 z-30 w-6 h-16 bg-background/95 backdrop-blur-sm border border-border rounded-r-lg shadow-md hover:w-8 hover:bg-primary/10 hover:border-primary transition-all duration-200 group flex items-center justify-center'
        title={isOpen ? 'Hide Toolbox' : 'Show Toolbox'}
      >
        {isOpen ? (
          <ChevronLeft
            size={14}
            className='text-muted-foreground group-hover:text-primary transition-colors'
          />
        ) : (
          <ChevronRight
            size={14}
            className='text-muted-foreground group-hover:text-primary transition-colors'
          />
        )}
      </button>
    </>
  )
}
