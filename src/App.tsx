import { ReactFlowProvider } from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import WorkflowBuilder from './pages/WorkflowBuilder'
import dataBpm from './pages/WorkflowBuilder/data/bpm.json'
import type { DynamicWorkflowDefinition } from './types/dynamic-bpm.type'
function App() {
  const fakeDataBpm = dataBpm as DynamicWorkflowDefinition

  return (
    <ReactFlowProvider>
      <WorkflowBuilder dynamicBpm={fakeDataBpm} />
    </ReactFlowProvider>
  )
}

export default App
