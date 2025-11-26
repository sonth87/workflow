import { ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'

interface NodeCategory {
  name: string
  isOpen: boolean
}

interface ToolboxProps {
  categories?: NodeCategory[]
  onCategoryToggle?: (index: number) => void
}

export function Toolbox({ categories, onCategoryToggle }: ToolboxProps) {
  const [localCategories, setLocalCategories] = useState<NodeCategory[]>(
    categories || [
      { name: 'Trigger', isOpen: true },
      { name: 'Action', isOpen: true },
      { name: 'Decision', isOpen: false },
      { name: 'Logic', isOpen: false },
    ]
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

  return (
    <aside className='w-64 h-full border border-border bg-card p-4 overflow-y-auto rounded-lg shadow-md flex flex-col'>
      <h2 className='mb-4 text-sm font-semibold uppercase tracking-wide shrink-0'>Node Types</h2>

      <div className='space-y-2 flex-1 overflow-y-auto'>
        {localCategories.map((category, index) => (
          <div key={category.name} className='rounded border border-border'>
            <button
              onClick={() => handleToggle(index)}
              className='flex w-full items-center justify-between bg-muted px-3 py-2 hover:bg-input rounded-t'
            >
              <span className='text-sm font-medium'>{category.name}</span>
              {category.isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>

            {category.isOpen && (
              <div className='space-y-1 border-t border-border p-2'>
                <div className='rounded bg-primary/10 p-2 text-center text-xs text-primary'>
                  Node Items
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </aside>
  )
}
