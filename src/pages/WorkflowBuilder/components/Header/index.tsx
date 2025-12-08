import { useTheme } from '@/hooks/useTheme'
import {
  ArrowRightLeft,
  ArrowUpDown,
  Monitor,
  Moon,
  Play,
  Redo2,
  Save,
  Sun,
  Undo2,
} from 'lucide-react'

export type LayoutDirection = 'vertical' | 'horizontal'

interface HeaderProps {
  workflowName: string
  onWorkflowNameChange: (name: string) => void
  onUndo: () => void
  onRedo: () => void
  onRun: () => void
  onSave: () => void
  layoutDirection: LayoutDirection
  onLayoutDirectionChange: (direction: LayoutDirection) => void
  
}

export function Header({
  workflowName,
  onWorkflowNameChange,
  onUndo,
  onRedo,
  onRun,
  onSave,
  layoutDirection,
  onLayoutDirectionChange,
}: HeaderProps) {
  const { theme, setLightMode, setDarkMode, setSystemMode } = useTheme()

  return (
    <header className='w-full bg-card p-3'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-3'>
          <div className=''>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='27'
              height='27'
              viewBox='0 0 27 27'
              fill='none'
            >
              <path
                fill-rule='evenodd'
                clip-rule='evenodd'
                d='M18.667 26.6665C23.0853 26.6665 26.667 23.0848 26.667 18.6665L26.667 7.99984C26.667 3.58156 23.0853 -0.000161171 18.667 -0.000161171L8.00033 -0.000161171C3.58205 -0.000161171 0.00032711 3.58156 0.00032711 7.99984L0.00032711 18.6665C0.00032711 23.0848 3.58205 26.6665 8.00033 26.6665L18.667 26.6665ZM18.3337 16.5039C17.1685 16.9157 16.3337 18.027 16.3337 19.3332C16.3337 20.99 17.6768 22.3332 19.3337 22.3332C20.9905 22.3332 22.3337 20.99 22.3337 19.3332C22.3337 18.027 21.4989 16.9157 20.3337 16.5039V14.6665C20.3337 13.3778 19.289 12.3332 18.0003 12.3332H14.3337V10.1625C15.4989 9.75063 16.3337 8.63939 16.3337 7.33317C16.3337 5.67632 14.9905 4.33317 13.3337 4.33317C11.6768 4.33317 10.3337 5.67632 10.3337 7.33317C10.3337 8.63939 11.1685 9.75063 12.3337 10.1625V12.3332H8.66699C7.37833 12.3332 6.33366 13.3778 6.33366 14.6665V16.5039C5.16847 16.9157 4.33366 18.027 4.33366 19.3332C4.33366 20.99 5.67681 22.3332 7.33366 22.3332C8.99051 22.3332 10.3337 20.99 10.3337 19.3332C10.3337 18.027 9.49885 16.9157 8.33366 16.5039V14.6665C8.33366 14.4824 8.4829 14.3332 8.66699 14.3332H13.3353H18.0003C18.1844 14.3332 18.3337 14.4824 18.3337 14.6665V16.5039ZM19.3337 18.3332C18.7814 18.3332 18.3337 18.7809 18.3337 19.3332C18.3337 19.8855 18.7814 20.3332 19.3337 20.3332C19.8859 20.3332 20.3337 19.8855 20.3337 19.3332C20.3337 18.7809 19.8859 18.3332 19.3337 18.3332ZM7.33366 18.3332C6.78138 18.3332 6.33366 18.7809 6.33366 19.3332C6.33366 19.8855 6.78138 20.3332 7.33366 20.3332C7.88594 20.3332 8.33366 19.8855 8.33366 19.3332C8.33366 18.7809 7.88594 18.3332 7.33366 18.3332ZM13.3337 8.33317C13.8859 8.33317 14.3337 7.88546 14.3337 7.33317C14.3337 6.78089 13.8859 6.33317 13.3337 6.33317C12.7814 6.33317 12.3337 6.78089 12.3337 7.33317C12.3337 7.88546 12.7814 8.33317 13.3337 8.33317Z'
                fill='#24B0FB'
              />
            </svg>
          </div>
          <input
            type='text'
            value={workflowName}
            onChange={(e) => onWorkflowNameChange(e.target.value)}
            className='bg-transparent py-2 text-lg font-semibold outline-none'
          />
        </div>

        <div className='flex items-center gap-2'>
          {/* Theme Switcher */}
          <div className='flex items-center gap-1 rounded border border-border bg-muted p-1'>
            <button
              title='Light Mode'
              onClick={setLightMode}
              className={`rounded p-2 transition-colors ${
                theme === 'light' ? 'bg-primary text-primary-foreground' : 'hover:bg-background'
              }`}
            >
              <Sun size={16} />
            </button>
            <button
              title='Dark Mode'
              onClick={setDarkMode}
              className={`rounded p-2 transition-colors ${
                theme === 'dark' ? 'bg-primary text-primary-foreground' : 'hover:bg-background'
              }`}
            >
              <Moon size={16} />
            </button>
            <button
              title='System Mode'
              onClick={setSystemMode}
              className={`rounded p-2 transition-colors ${
                theme === 'system' ? 'bg-primary text-primary-foreground' : 'hover:bg-background'
              }`}
            >
              <Monitor size={16} />
            </button>
          </div>

          <div className='mx-1 h-6 w-px bg-border' />

          {/* Layout Direction */}
          <div className='flex items-center gap-1 rounded border border-border bg-muted p-1'>
            <button
              title='Vertical Layout (Top to Bottom)'
              onClick={() => onLayoutDirectionChange('vertical')}
              className={`rounded p-2 transition-colors ${
                layoutDirection === 'vertical'
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-background'
              }`}
            >
              <ArrowUpDown size={16} />
            </button>
            <button
              title='Horizontal Layout (Left to Right)'
              onClick={() => onLayoutDirectionChange('horizontal')}
              className={`rounded p-2 transition-colors ${
                layoutDirection === 'horizontal'
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-background'
              }`}
            >
              <ArrowRightLeft size={16} />
            </button>
          </div>

          <div className='mx-1 h-6 w-px bg-border' />

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
