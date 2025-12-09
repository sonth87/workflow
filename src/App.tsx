import { ReactFlowProvider } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import OldWorkflowBuilder from "./pages/WorkflowBuilder";
import NewWorkflowBuilder from "./workflow";
import dataBpm from "./workflow/data/bpm.json";
import type { DynamicWorkflowDefinition } from "./types/dynamic-bpm.type";
import { customPlugin } from "./plugins/customPlugin";

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

  // New version with custom plugin demo
  // Demo: Register custom plugin với custom components và custom category
  return (
    <NewWorkflowBuilder
      pluginOptions={{
        // Enable default BPM plugin (mặc định là true)
        enableDefaultPlugin: true,

        // Auto-activate plugins sau khi install (mặc định là true)
        autoActivate: true,

        // Danh sách custom plugins
        plugins: [customPlugin],
      }}
    />
  );
}

export default App;
