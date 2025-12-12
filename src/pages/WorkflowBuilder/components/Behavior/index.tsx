import { Play, Redo2, Undo2 } from 'lucide-react'

export type LayoutDirection = 'vertical' | 'horizontal'

interface BehaviorProps {
  workflowName: string
  onWorkflowNameChange: (name: string) => void
  onUndo: () => void
  onRedo: () => void
  onRun: () => void
}

export function Behavior({
  workflowName,
  onWorkflowNameChange,
  onUndo,
  onRedo,
  onRun,
}: BehaviorProps) {
  return (
    <header className='w-full bg-card p-3'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-3'>
          <input
            type='text'
            value={workflowName}
            onChange={(e) => onWorkflowNameChange(e.target.value)}
            className='bg-transparent py-2 text-lg font-semibold outline-none'
          />
        </div>

        <div className='flex items-center gap-2'>
          {/* Theme Switcher */}

          <button title='Undo' onClick={onUndo} className='rounded p-2 hover:bg-muted'>
            <Undo2 size={18} />
          </button>
          <button title='Redo' onClick={onRedo} className='rounded p-2 hover:bg-muted'>
            <Redo2 size={18} />
          </button>

          <div className='mx-1 h-6 w-px bg-border' />

          <button
            title='Run'
            onClick={onRun}
            className='flex items-center gap-2 rounded bg-success px-3 py-2 text-success-foreground hover:opacity-90'
          >
            <Play size={16} />
            Run
          </button>
        </div>
      </div>
    </header>
  )
}
