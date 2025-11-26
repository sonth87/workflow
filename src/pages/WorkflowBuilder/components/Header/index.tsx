import { Play, Redo2, Save, Undo2 } from 'lucide-react'

interface HeaderProps {
  workflowName: string
  onWorkflowNameChange: (name: string) => void
  onUndo: () => void
  onRedo: () => void
  onRun: () => void
  onSave: () => void
}

export function Header({
  workflowName,
  onWorkflowNameChange,
  onUndo,
  onRedo,
  onRun,
  onSave,
}: HeaderProps) {
  return (
    <header className='w-full border border-border bg-card px-6 py-3 shadow-md rounded-lg'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-4'>
          <input
            type='text'
            value={workflowName}
            onChange={(e) => onWorkflowNameChange(e.target.value)}
            className='bg-transparent px-3 py-2 text-lg font-semibold outline-none'
          />
        </div>

        <div className='flex items-center gap-2'>
          <button
            title='Undo'
            onClick={onUndo}
            className='rounded p-2 hover:bg-muted'
          >
            <Undo2 size={18} />
          </button>
          <button
            title='Redo'
            onClick={onRedo}
            className='rounded p-2 hover:bg-muted'
          >
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

          <button
            title='Save'
            onClick={onSave}
            className='flex items-center gap-2 rounded bg-primary px-3 py-2 text-primary-foreground hover:opacity-90'
          >
            <Save size={16} />
            Save
          </button>
        </div>
      </div>
    </header>
  )
}
