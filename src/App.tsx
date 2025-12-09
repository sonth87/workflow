import { ReactFlowProvider } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import OldWorkflowBuilder from "./pages/WorkflowBuilder";
import NewWorkflowBuilder from "./workflow";
import dataBpm from "./pages/WorkflowBuilder/data/bpm.json";
import type { DynamicWorkflowDefinition } from "./types/dynamic-bpm.type";

function App() {
  const fakeDataBpm = dataBpm as DynamicWorkflowDefinition;

  // Check URL to determine which version to render
  const isOldVersion = window.location.search.includes("old");

  if (isOldVersion) {
    // Old version (existing code)
    return (
      <ReactFlowProvider>
        <OldWorkflowBuilder dynamicBpm={fakeDataBpm} />
      </ReactFlowProvider>
    );
  }

  // New version (using core architecture)
  return <NewWorkflowBuilder />;
}

export default App;
