import "@xyflow/react/dist/style.css";
import WorkflowBuilder from "./workflow";
import { customPlugin } from "./plugins/customPlugin";
import { aiMLPlugin } from "./plugins/aiMLPlugin";
// import { defaultBpmPlugin } from "./plugins/defaultBpmPlugin";

function App() {
  return (
    <WorkflowBuilder
      pluginOptions={{
        // Enable default BPM plugin (mặc định là true)
        enableDefaultPlugin: true,

        // Auto-activate plugins sau khi install (mặc định là true)
        autoActivate: true,

        // Danh sách custom plugins
        // plugins: [customPlugin, aiMLPlugin],
      }}
    />
  );
}

export default App;
