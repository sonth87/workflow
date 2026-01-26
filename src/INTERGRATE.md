# BPM Core - Hướng Dẫn Tích Hợp

## 📦 Tổng Quan

BPM Core hỗ trợ 2 phương thức tích hợp:

| Phương thức       | Sử dụng                           | Tùy chỉnh     |
| ----------------- | --------------------------------- | ------------- |
| **SDK**           | Tích hợp nhanh vào bất kỳ web app | Cấu hình JSON |
| **React Library** | Kiểm soát đầy đủ UI/logic         | Hoàn toàn     |

---

## 🔨 Build

### Build React Library

```bash
pnpm build:lib
```

Output: `lib-dist/` (bao gồm .js, .css, .d.ts)

### Build SDK

```bash
pnpm build:sdk
```

Output: `sdk-dist/bpm-sdk.js` (standalone script)

---

## 📘 Phương Thức 1: SDK Integration

### Cài Đặt

Không cần cài đặt, chỉ cần include script:

```html
<!DOCTYPE html>
<html>
  <head>
    <title>BPM Workflow</title>
  </head>
  <body>
    <div id="bpm-container"></div>
    <script src="bpm-sdk.js"></script>
    <script>
      var bpm = new BPM({
        selector: "#bpm-container",
        options: {
          /* ... */
        },
      });
    </script>
  </body>
</html>
```

### Khởi Tạo & Cấu Hình

```javascript
var bpm = new BPM({
  selector: "#bpm-container", // hoặc HTMLElement

  options: {
    // Cấu hình plugin
    pluginOptions: {
      enableDefaultPlugin: true,
      autoActivate: true,
      plugins: [], // Custom plugins
    },

    // Cấu hình UI
    ui: {
      mode: "edit", // 'edit' hoặc 'view' (read-only)
      showHeader: true,
      showImportExport: true,
      showThemeToggle: true,
      showLayoutControls: true,
      showToolbox: true,
      showPropertiesPanel: true,
      showValidationPanel: true,
      showToolbar: true,
      showZoomControls: true,
      showMinimap: true,
      showRunButton: true,
    },

    // Cấu hình language
    language: "vi", // 'en', 'vi'

    // Cấu hình custom nodes (inline)
    customNodes: [
      {
        id: "emailTask",
        extends: "task",
        name: { en: "Send Email", vi: "Gửi Email" },
        category: "communication",
        icon: {
          type: "lucide",
          value: "Mail",
          color: "#fff",
          backgroundColor: "#3b82f6",
        },
        properties: [
          {
            id: "to",
            label: { en: "To", vi: "Tới" },
            type: "text",
            required: true,
          },
          {
            id: "subject",
            label: { en: "Subject", vi: "Tiêu đề" },
            type: "text",
            required: true,
          },
          {
            id: "body",
            label: { en: "Body", vi: "Nội dung" },
            type: "textarea",
            required: true,
          },
          {
            id: "onSuccess",
            label: { en: "On Success Logic", vi: "Logic khi thành công" },
            type: "logic",
          },
        ],
      },
    ],

    // Load custom nodes từ URL
    customNodesUrl: "https://api.example.com/nodes.json",

    // Load plugin từ URL
    pluginUrls: ["https://api.example.com/plugin.json"],
  },

  // Callbacks
  onReady: function () {
    console.log("BPM đã sẵn sàng!");
  },

  onError: function (error) {
    console.error("Lỗi:", error);
  },
});
```

### API Methods

```javascript
// Import/Export cơ bản
bpm.import({ nodes: [...], edges: [...] });  // Import workflow từ JSON
var workflow = bpm.export();                  // Export workflow
var current = bpm.getWorkflow();              // Lấy workflow hiện tại: { nodes, edges, workflowName, workflowDescription }

// History
bpm.undo();                    // Hoàn tác thao tác cuối
bpm.redo();                    // Làm lại thao tác đã hoàn tác
var canUndo = bpm.canUndo();   // Kiểm tra có thể undo (true/false)
var canRedo = bpm.canRedo();   // Kiểm tra có thể redo (true/false)

// Theme
var theme = bpm.getTheme();    // Lấy theme hiện tại: 'light', 'dark', 'system'
bpm.setTheme('dark');          // Đặt theme: 'light' | 'dark' | 'system'
bpm.setLightMode();            // Chuyển sang chế độ sáng
bpm.setDarkMode();             // Chuyển sang chế độ tối
bpm.setSystemMode();           // Chuyển sang chế độ hệ thống (auto)
bpm.toggleTheme();             // Chuyển đổi theme: light → dark → system → light

// Language
var lang = bpm.getLanguage();              // Lấy ngôn ngữ hiện tại: 'en', 'vi'
bpm.setLanguage('vi');                     // Đặt ngôn ngữ
var available = bpm.getAvailableLanguages(); // Lấy danh sách ngôn ngữ khả dụng: ['en', 'vi', ...]

// Workflow State
var nodes = bpm.getNodes();    // Lấy danh sách nodes
var edges = bpm.getEdges();    // Lấy danh sách edges
bpm.clearWorkflow();           // Xóa toàn bộ workflow (nodes + edges)

// Import/Export
// Import từ data có sẵn (API, restore, programmatic)
bpm.importWorkflow({ nodes: [...], edges: [...] });  // Import workflow từ object có sẵn
bpm.importWorkflow(data, false);                     // Import không clear workflow hiện tại

// Upload từ file (user chọn file)
bpm.uploadWorkflow().then(function(data) {          // Mở file picker, user chọn file JSON
  console.log('Uploaded:', data);
});

// Export
var data = bpm.exportWorkflow();                     // Export workflow kèm metadata
var data = bpm.exportWorkflow(false);                // Export workflow không có metadata
bpm.downloadWorkflow('my-workflow.json');            // Tải workflow dưới dạng file JSON (auto download)

// View
var view = bpm.viewWorkflow();                       // Xem workflow hiện tại (alias của getWorkflow)

// Validation
var errors = bpm.getValidationErrors();    // Lấy danh sách lỗi validation
var hasErr = bpm.hasErrors();              // Kiểm tra có lỗi không (true/false)
bpm.validate().then(function(result) {     // Thực hiện validation workflow
  console.log('Valid:', result.valid);     // true nếu hợp lệ
  console.log('Errors:', result.errors);   // Danh sách lỗi nếu có
});

// Destroy
bpm.destroy();  // Hủy instance và cleanup

// Events
bpm.on('custom:node-created', function(event) {  // Subscribe vào event
  console.log('Node created:', event.payload);
});

bpm.on('nodes:change', function(event) {         // Lắng nghe thay đổi nodes
  console.log('Nodes changed:', event.payload);
});

bpm.emit('custom:event', { data: 'value' });    // Phát sự kiện tùy chỉnh
```

### Cấu Hình JSON Node Custom

**Inline trong options:**

```javascript
options: {
  customNodes: [
    {
      id: "httpRequest",
      extends: "task",
      name: { en: "HTTP Request", vi: "Gọi API" },
      description: { en: "Make HTTP request", vi: "Thực hiện HTTP request" },
      category: "integrations",
      icon: {
        type: "lucide",
        value: "Globe",
        color: "#ffffff",
        backgroundColor: "#10b981",
      },
      properties: [
        {
          id: "url",
          label: { en: "URL", vi: "URL" },
          type: "text",
          required: true,
          placeholder: "https://api.example.com",
        },
        {
          id: "method",
          label: { en: "Method", vi: "Phương thức" },
          type: "select",
          required: true,
          options: ["GET", "POST", "PUT", "DELETE"],
          defaultValue: "GET",
        },
        {
          id: "headers",
          label: { en: "Headers", vi: "Headers" },
          type: "json",
          defaultValue: { "Content-Type": "application/json" },
        },
        {
          id: "condition",
          label: { en: "Condition", vi: "Điều kiện" },
          type: "expression",
          placeholder: "status === 'active'",
        },
      ],
      contextMenuItems: [
        {
          id: "test-connection",
          label: { en: "Test Connection", vi: "Kiểm tra kết nối" },
          icon: "PlayCircle",
          action: "custom:test-connection",
        },
      ],
    },
  ];
}
```

**Load từ file/URL:**

```javascript
options: {
  customNodesUrl: 'https://api.example.com/nodes.json',
  pluginUrls: [
    'https://api.example.com/complete-plugin.json'
  ]
}
```

Xem chi tiết cấu trúc JSON: `examples/JSON_CONFIG_GUIDE.md`

---

## ⚛️ Phương Thức 2: React Library Integration

### Cài Đặt

```bash
npm install bpm-core
# hoặc
pnpm add bpm-core
# hoặc
yarn add bpm-core
```

Import styles:

```tsx
import "bpm-core/styles";
```

### Option A: WorkflowBuilder (UI có sẵn)

```tsx
import { WorkflowBuilder } from "bpm-core";
import "bpm-core/styles";

function App() {
  return (
    <WorkflowBuilder
      pluginOptions={{
        enableDefaultPlugin: true,
        autoActivate: true,
      }}
      uiConfig={{
        mode: "edit", // hoặc "view"
        showHeader: true,
        showImportExport: true,
        showThemeToggle: true,
        showToolbox: true,
        showPropertiesPanel: true,
        showValidationPanel: true,
        showToolbar: true,
        showZoomControls: true,
        showMinimap: true,
      }}
      language="vi" // hoặc "en"
      onReady={() => console.log("Ready!")}
    />
  );
}
```

### Option B: WorkflowCore (Custom Layout)

```tsx
import {
  WorkflowCore,
  Canvas,
  Toolbox,
  PropertiesPanel,
  ValidationPanel,
  ImportButton,
  ExportButton,
  ThemeToggle,
  UndoButton,
  RedoButton,
  ZoomInButton,
  ZoomOutButton,
} from "bpm-core";
import "bpm-core/styles";

function CustomWorkflow() {
  return (
    <WorkflowCore
      pluginOptions={{
        enableDefaultPlugin: true,
        autoActivate: true,
      }}
    >
      <div style={{ display: "flex", height: "100vh" }}>
        <header>
          <ImportButton />
          <ExportButton />
          <ThemeToggle />
        </header>

        <aside style={{ width: "300px" }}>
          <Toolbox />
        </aside>

        <main style={{ flex: 1 }}>
          <Canvas>
            <div style={{ position: "absolute", top: 16, left: 16 }}>
              <UndoButton />
              <RedoButton />
              <ZoomInButton />
              <ZoomOutButton />
            </div>
          </Canvas>
        </main>

        <aside style={{ width: "320px" }}>
          <PropertiesPanel />
          <ValidationPanel />
        </aside>
      </div>
    </WorkflowCore>
  );
}
```

### Option C: Hooks Only (Full Custom)

```tsx
import {
  WorkflowProvider,
  useWorkflow,
  useNodeActions,
  useEdgeActions,
  useWorkflowLayout,
  useWorkflowTheme,
  useLanguage,
} from "bpm-core";
import "bpm-core/styles";

function MyCustomWorkflow() {
  const { nodes, edges, onNodesChange, onEdgesChange } = useWorkflow();
  const { addNode, deleteNode } = useNodeActions();
  const { addEdge } = useEdgeActions();
  const { layout, setLayout } = useWorkflowLayout();
  const { theme, setTheme } = useWorkflowTheme();
  const { language, setLanguage, t } = useLanguage();

  // Custom implementation...
  return <div>Custom UI</div>;
}

function App() {
  return (
    <WorkflowProvider
      pluginOptions={{
        enableDefaultPlugin: true,
        autoActivate: true,
      }}
    >
      <MyCustomWorkflow />
    </WorkflowProvider>
  );
}
```

### Cấu Hình JSON Node Custom

```tsx
import { CustomNodeFactory } from "bpm-core";

// Register single node
const nodeConfig = {
  id: "emailTask",
  extends: "task",
  name: { en: "Send Email", vi: "Gửi Email" },
  properties: [
    {
      id: "to",
      label: { en: "To", vi: "Tới" },
      type: "text",
      required: true,
    },
  ],
};

CustomNodeFactory.registerFromConfig(nodeConfig);

// Load từ URL
await CustomNodeFactory.loadFromUrl("https://api.example.com/nodes.json");

// Register nhiều nodes
const nodes = [nodeConfig1, nodeConfig2];
const result = CustomNodeFactory.registerMultiple(nodes);
console.log(result); // { success: [...], failed: [...] }
```

### Load Plugin từ JSON

```tsx
import { PluginJSONLoader } from "bpm-core";

// Load plugin từ URL
const plugin = await PluginJSONLoader.loadFromUrl(
  'https://api.example.com/plugin.json'
);

// Load từ object
const pluginConfig = {
  metadata: { id: "my-plugin", name: "My Plugin" },
  categories: [...],
  nodes: [...]
};
const plugin = PluginJSONLoader.loadFromObject(pluginConfig);

// Register plugin
PluginManager.getInstance().register(plugin);
```

---

## 🌐 Cấu Hình Language

### SDK

```javascript
var bpm = new BPM({
  options: {
    language: "vi", // 'en', 'vi'
  },
});

// Đổi language runtime
bpm.setLanguage("en");
```

### React Library

```tsx
<WorkflowBuilder language="vi" />;

// Hoặc dùng hook
import { useLanguage } from "bpm-core";

function MyComponent() {
  const { language, setLanguage, t } = useLanguage();

  return <button onClick={() => setLanguage("en")}>{t("common.save")}</button>;
}
```

---

## 🧰 Tools, Hooks & Utils Exposed

### Components

```tsx
// Main Components
(WorkflowBuilder, WorkflowCore);

// Canvas & Panels
(Canvas, Toolbox, PropertiesPanel, ValidationPanel);

// Controls
(ImportButton, ExportButton, ThemeToggle, LayoutSwitcher);
(UndoButton, RedoButton, ZoomInButton, ZoomOutButton, FitViewButton);

// Others
(Header, Toolbar, OutputViewer, Run, ViewModeSwitcher, Shortcuts);
```

### Hooks

```tsx
useWorkflow(); // nodes, edges, workflow state
useNodeActions(); // addNode, deleteNode, updateNode, duplicateNode
useEdgeActions(); // addEdge, deleteEdge, updateEdge
useWorkflowLayout(); // layout, setLayout (TB/LR)
useWorkflowTheme(); // theme, setTheme (light/dark)
useLanguage(); // language, setLanguage, t (translation)
useAvailableLanguages(); // availableLanguages
useClipboard(); // handleCopy, handlePaste, handleCut
useWorkflowValidation(); // validate, validateNode, validationErrors, hasErrors
useWorkflowImportExport(); // exportWorkflow, downloadWorkflow, importWorkflow, uploadWorkflow
useWorkflowEvents(); // Listen to workflow events
useAvailableNodes(); // nodeTypes, getNodesByCategory
useTheme(); // theme, toggleTheme, setLightMode, setDarkMode, setSystemMode
useKeyboardShortcuts(); // Register keyboard shortcuts
```

### Core Classes

```tsx
import {
  CustomNodeFactory, // Register custom nodes từ JSON
  PluginJSONLoader, // Load plugin từ JSON
  PluginManager, // Quản lý plugins
  ValidationEngine, // Validation engine
  NodeRegistry, // Registry của nodes
  EventBus, // Event system
} from "bpm-core";
```

### Utils

```tsx
import { cx, getNestedValue } from "bpm-core";

// cx: merge classnames (tailwind-merge)
const className = cx("base-class", condition && "conditional-class");

// getNestedValue: get nested object value
const value = getNestedValue(obj, "path.to.property");
```

### Store Access

```tsx
import { useWorkflowStore } from "bpm-core";

function MyComponent() {
  const {
    // Workflow data
    nodes,
    edges,
    workflowName,
    workflowDescription,

    // Selection
    selectedNodeId,
    selectedEdgeId,

    // History
    history, // { past: [], future: [] }
    undo,
    redo,

    // Validation
    validationErrors,
    setValidationErrors,

    // Actions
    addNode,
    updateNode,
    deleteNode,
    addEdge,
    updateEdge,
    deleteEdge,

    // Clipboard
    clipboard,
    copyNodesToClipboard,
    getClipboard,
    clearClipboard,

    // UI State
    layoutDirection,
    compactView,
    panelStates,
    isLoading,
    isSaving,
  } = useWorkflowStore();

  // Use store state...
}
```

### Types

```tsx
import type {
  WorkflowBuilderProps,
  WorkflowCoreProps,
  PluginOptions,
  // ... và nhiều types khác
} from "bpm-core";
```

---

## 📝 Tham Số & Options Chi Tiết

### PluginOptions

```tsx
interface PluginOptions {
  enableDefaultPlugin?: boolean; // Enable default BPM nodes
  autoActivate?: boolean; // Auto activate plugins
  plugins?: Plugin[]; // Custom plugins
}
```

### UIConfig (WorkflowBuilder)

```tsx
interface UIConfig {
  // Mode
  mode?: "edit" | "view";

  // Header
  showHeader?: boolean;
  showImportExport?: boolean;
  showThemeToggle?: boolean;
  showLayoutControls?: boolean;
  showWorkflowName?: boolean;

  // Sidebars
  showToolbox?: boolean;
  showPropertiesPanel?: boolean;
  showValidationPanel?: boolean;

  // Toolbar
  showToolbar?: boolean;
  showHistoryControls?: boolean;
  showZoomControls?: boolean;
  showFitView?: boolean;

  // Canvas
  showMinimap?: boolean;
  showControls?: boolean;

  // Behavior
  showBehavior?: boolean;
  showRunButton?: boolean;
}
```

---

## 📚 Tài Liệu Tham Khảo

- **JSON Config Guide:** `examples/JSON_CONFIG_GUIDE.md`
- **Examples:** `examples/`
  - `sdk-json-example.html` - SDK với JSON config
  - `json-configs/` - Các ví dụ JSON config

---

## 🎯 Use Cases Phổ Biến

### 1. Embedded Viewer (Read-only)

```javascript
// SDK
var bpm = new BPM({
  selector: "#viewer",
  options: {
    ui: {
      mode: "view",
      showToolbox: false,
      showPropertiesPanel: false,
      showImportExport: false,
      showToolbar: true,
    },
  },
});

// React
<WorkflowBuilder
  uiConfig={{ mode: "view", showToolbox: false, showPropertiesPanel: false }}
/>;
```

### 2. Full Editor

```javascript
// Tất cả features enabled
var bpm = new BPM({
  selector: "#editor",
  options: { ui: { mode: "edit" } },
});
```

### 3. Custom Nodes với JSON

```javascript
// Load plugin với custom nodes
var bpm = new BPM({
  selector: "#container",
  options: {
    pluginUrls: ["https://api.example.com/custom-plugin.json"],
    language: "vi",
  },
});
```

---

**Version:** 0.0.0  
**Last Updated:** January 2026
