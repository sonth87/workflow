'use client'

import { useReactFlow } from '@xyflow/react'
import { Hand, Minus, Plus, Maximize2, Menu } from 'lucide-react'
import { useEffect, useState } from 'react'

interface ToolbarProps {
  onMenu?: () => void
}

export function Toolbar({ onMenu }: ToolbarProps) {
  const { zoomIn, zoomOut, fitView, getZoom } = useReactFlow()
  const [displayZoom, setDisplayZoom] = useState(100)

  useEffect(() => {
    const handleZoomChange = () => {
      setDisplayZoom(Math.round(getZoom() * 100))
    }

    const interval = setInterval(handleZoomChange, 100)
    return () => clearInterval(interval)
  }, [getZoom])

  const handleZoomOut = () => {
    zoomOut({ duration: 200 })
  }

  const handleZoomIn = () => {
    zoomIn({ duration: 200 })
  }

  const handleFitView = () => {
    fitView({ padding: 0.2, duration: 200 })
  }

  return (
    <footer className='flex items-center justify-center gap-1 rounded-lg bg-card p-2 shadow-md border border-border'>
      <button title='Pan tool' className='rounded p-2 hover:bg-muted transition-colors'>
        <Hand size={18} className='text-foreground' />
      </button>

      <div className='h-6 w-px bg-border' />

      <button
        onClick={handleZoomOut}
        title='Zoom out'
        className='rounded p-2 hover:bg-muted transition-colors'
      >
        <Minus size={18} className='text-foreground' />
      </button>

      <div className='min-w-[60px] text-center px-3 py-1.5 rounded bg-muted text-sm font-medium'>
        {displayZoom}%
      </div>

      <button
        onClick={handleZoomIn}
        title='Zoom in'
        className='rounded p-2 hover:bg-muted transition-colors'
      >
        <Plus size={18} className='text-foreground' />
      </button>

      <div className='h-6 w-px bg-border' />

      <button
        onClick={handleFitView}
        title='Fit view'
        className='rounded p-2 hover:bg-muted transition-colors'
      >
        <Maximize2 size={18} className='text-foreground' />
      </button>

      <button
        onClick={onMenu}
        title='More options'
        className='rounded p-2 hover:bg-muted transition-colors'
      >
        <Menu size={18} className='text-foreground' />
      </button>
    </footer>
  )
}
