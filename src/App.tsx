import { ReactFlowProvider } from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import WorkflowBuilder from './pages/WorkflowBuilder'

function App() {
  return (
    <>
      <ReactFlowProvider>
        <WorkflowBuilder />
      </ReactFlowProvider>
    </>
  )
}

export default App
