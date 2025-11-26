import { ReactFlow, Background, Controls } from '@xyflow/react'

interface CanvasProps {
  children?: React.ReactNode
}

interface CanvasProps {
  children?: React.ReactNode
}

export function Canvas({ children }: CanvasProps) {
  return (
    <main className='absolute inset-0 w-full h-full overflow-hidden bg-background'>
      {children || (
        <ReactFlow fitView>
          <Background />
          <Controls position='bottom-center' orientation='horizontal' />
        </ReactFlow>
      )}
    </main>
  )
}
