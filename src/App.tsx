import "@xyflow/react/dist/style.css";
import WorkflowBuilder from "./workflow";
import { customPlugin } from "./plugins/customPlugin";

function App() {
  // New version with custom plugin demo
  // Demo: Register custom plugin với custom components và custom category
  return (
    <WorkflowBuilder
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
