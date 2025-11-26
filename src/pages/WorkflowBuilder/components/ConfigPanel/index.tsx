import { Settings } from 'lucide-react'

interface ConfigPanelProps {
  selectedNode?: string | null
}

export function ConfigPanel({ selectedNode }: ConfigPanelProps) {
  return (
    <aside className='w-80 h-full border border-border bg-card p-4 overflow-y-auto rounded-lg shadow-md flex flex-col'>
      <div className='flex items-center justify-between shrink-0'>
        <h2 className='text-sm font-semibold uppercase tracking-wide'>Configuration</h2>
        <Settings size={16} className='text-muted-foreground' />
      </div>

      <div className='mt-4 space-y-4 flex-1 overflow-y-auto'>
        {selectedNode ? (
          <div className='rounded border border-border bg-muted/50 p-3'>
            <p className='text-sm font-medium'>Node: {selectedNode}</p>
            <div className='mt-3 space-y-2 text-xs text-muted-foreground'>
              <p>Configuration options will appear here</p>
            </div>
          </div>
        ) : (
          <div className='rounded border border-border bg-muted/50 p-3 text-center text-xs text-muted-foreground'>
            Select a node to configure
          </div>
        )}
      </div>
    </aside>
  )
}
