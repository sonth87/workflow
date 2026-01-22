# BPM Core - Workflow Builder

## 📋 Giới thiệu

BPM Core là thư viện xây dựng workflow linh hoạt và modular cho Business Process Management (BPM), được phát triển với React và ReactFlow. Thư viện cung cấp giao diện kéo-thả trực quan để tạo, chỉnh sửa và quản lý các workflow phức tạp với hỗ trợ custom nodes, edges, validation rules và plugins.

## 🎯 Yêu cầu

### Tích hợp NPM Library

- **Node.js** >= 16.0.0
- **React** >= 18.0.0

### Tích hợp SDK

- Trình duyệt hiện đại hỗ trợ ES6+
- Không yêu cầu framework dependencies

### Yêu cầu Development

```json
{
  "node": ">=16.0.0",
  "pnpm": ">=8.0.0"
}
```

## 🚀 Tích hợp

BPM Core cung cấp **hai phương thức tích hợp** phù hợp với nhu cầu dự án của bạn:

### Phương thức 1: NPM Library (Tùy biến đầy đủ)

**Phù hợp cho:** Ứng dụng React cần tùy biến hoàn toàn và hỗ trợ TypeScript.

```bash
npm install bpm-core
# hoặc
pnpm add bpm-core
# hoặc
yarn add bpm-core
```

**Bắt đầu nhanh:**

```tsx
import { WorkflowBuilder } from "bpm-core";

function App() {
  return (
    <WorkflowBuilder
      uiConfig={{
        showToolbox: true,
        showPropertiesPanel: true,
        showMinimap: true,
        mode: "edit", // hoặc "view" cho chế độ chỉ xem
      }}
    />
  );
}
```

**Custom Layout:**

```tsx
import {
  WorkflowCore,
  Canvas,
  Toolbox,
  PropertiesPanel,
  ImportButton,
  ExportButton,
} from "bpm-core";

function CustomWorkflow() {
  return (
    <WorkflowCore>
      <div style={{ display: "flex", height: "100vh" }}>
        <aside>
          <Toolbox />
        </aside>
        <main>
          <Canvas />
        </main>
        <aside>
          <PropertiesPanel />
        </aside>
      </div>
    </WorkflowCore>
  );
}
```

### Phương thức 2: SDK Script (Cấu hình đơn giản)

**Phù hợp cho:** Tích hợp nhanh, ứng dụng non-React, hoặc prototyping.

```html
<!DOCTYPE html>
<html>
  <body>
    <div id="bpm-container"></div>

    <!-- Load SDK -->
    <script src="path/to/bpm-sdk.js"></script>

    <!-- Khởi tạo -->
    <script>
      var bpm = new BPM({
        selector: "#bpm-container",
        options: {
          ui: {
            showToolbox: true,
            showPropertiesPanel: true,
            showMinimap: true,
            mode: "edit", // hoặc "view"
          },
        },
      });
    </script>
  </body>
</html>
```

## 🏗️ System Architecture

```
┌────────────────────────────────────────────────────────────────────┐
│                        External Systems                           │
│  (BPM, CRM, ERP, Payment Gateway, Custom Business Logic...)       │
└────────────────────────────────────────────────────────────────────┘
                                ↓
                        Plugin Interface
                                ↓
┌────────────────────────────────────────────────────────────────────┐
│                      APPLICATION LAYER                            │
│ ┌────────────┐  ┌──────────────────┐  ┌─────────────────────────┐  │
│ │  Toolbox   │  │   Main Canvas    │  │   Properties Panel      ││
│ │  Sidebar   │  │   (ReactFlow)    │  │   + Validation Panel    ││
│ │            │  │                  │  │                         ││
│ │ - Node     │  │ - Drag & Drop    │  │ - Dynamic Forms         ││
│ │   List     │  │ - Zoom/Pan       │  │ - Property Editors      ││
│ │ - Search   │  │ - Selection      │  │ - Validation Errors     ││
│ │ - Filter   │  │ - Context Menu   │  │ - Context Actions       ││
│ └────────────┘  └──────────────────┘  └─────────────────────────┘│
└────────────────────────────────────────────────────────────────────┘
                                ↓
┌────────────────────────────────────────────────────────────────────┐
│                    CORE BUSINESS LAYER                             │
│                                                                    │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │              Workflow Engine Core                            │ │
│  │                                                              │ │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐  │ │
│  │  │   Zustand    │  │  Event Bus   │  │   Validation     │  │ │
│  │  │   Store      │  │   System     │  │   Engine         │  │ │
│  │  │              │  │              │  │                  │  │ │
│  │  │ - State      │  │ - Emit       │  │ - Node Rules     │  │ │
│  │  │ - Actions    │  │ - Subscribe  │  │ - Edge Rules     │  │ │
│  │  │ - History    │  │ - Unsubscribe│  │ - Workflow Rules │  │ │
│  │  │ - Selectors  │  │ - Events     │  │ - Custom Validators││ │
│  │  └──────────────┘  └──────────────┘  └──────────────────┘  │ │
│  └──────────────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────────────┘
                                ↓
┌────────────────────────────────────────────────────────────────────┐
│              REGISTRY & CONFIGURATION LAYER                        │
│                                                                    │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐  ┌──────────┐ ┌─────────┐│
│  │   Node   │ │   Edge   │ │   Rule   │ │  Theme   │ │ Context ││
│  │ Registry │ │ Registry │ │ Registry │ │ Registry │ │  Menu   ││
│  │          │ │          │ │          │ │          │ │ Registry││
│  │ - CRUD   │ │ - CRUD   │ │ - CRUD   │ │ - CRUD   │ │ - CRUD  ││
│  │ - Search │ │ - Search │ │ - Execute│ │ - Apply  │ │ - Render││
│  │ - Filter │ │ - Filter │ │ - Filter │ │ - Switch │ │ - Action││
│  └──────────┘ └──────────┘ └──────────┘  └──────────┘ └─────────┘│
│                                                                    │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │                    Plugin Manager                           │ │
│  │                                                             │ │
│  │  - Install/Uninstall Plugins                                │ │
│  │  - Activate/Deactivate Plugins                              │ │
│  │  - Dependency Management                                    │ │
│  │  - Lifecycle Hooks                                          │ │
│  └──────────────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────────────┘
```

## 📚 Registry System

Hệ thống BPM Core sử dụng Registry Pattern để quản lý các thành phần có thể mở rộng. Dưới đây là các loại registry chính:

### 🔹 NodeRegistry

**Mục đích:** Quản lý tất cả các loại nodes trong workflow (Start Events, Tasks, Gateways, End Events, v.v.)

**Chức năng:**

- Đăng ký node types từ plugins
- Tạo node instances với cấu hình mặc định
- Validate cấu hình node
- Lọc nodes theo category

**Sử dụng:**

```typescript
import { nodeRegistry } from "@/core/registry";

// Lấy node config
const nodeConfig = nodeRegistry.get("taskDefault");

// Tạo node mới
const newNode = nodeRegistry.createNode("taskUser", { x: 100, y: 200 });

// Lấy tất cả nodes theo category
const startEvents = nodeRegistry.getByCategory("start");
```

### 🔹 EdgeRegistry

**Mục đích:** Quản lý các loại edges (connections) trong workflow

**Các loại edge:**

- **`sequence-flow`** - Kết nối tuần tự trong cùng một process (nét liền)
- **`message-flow`** - Kết nối message giữa các pools khác nhau (nét đứt)
- **`association`** - Liên kết artifacts/annotations (nét chấm)

**Path Rendering Types:**

- **`bezier`** - Đường cong mượt
- **`straight`** - Đường thẳng
- **`step`** - Đường bậc thang

**Sử dụng:**

```typescript
import { edgeRegistry } from "@/core/registry";

// Tạo sequence flow
const edge = edgeRegistry.createEdge("sequence-flow", "node1", "node2", {
  pathType: "bezier",
  pathStyle: "solid",
});
```

### 🔹 RuleRegistry

**Mục đích:** Quản lý các validation rules và business rules

**Các loại rules:**

- **Validation Rules** - Kiểm tra tính hợp lệ của workflow
- **Business Rules** - Logic nghiệp vụ tùy chỉnh
- **Connection Rules** - Quy tắc kết nối giữa các nodes

**Sử dụng:**

```typescript
import { ruleRegistry } from "@/core/registry";

// Đăng ký rule mới
ruleRegistry.register({
  id: "custom-rule",
  type: "validation",
  name: "Custom Validation",
  config: {
    enabled: true,
    scope: "workflow",
    condition: context => {
      /* validation logic */
    },
  },
});

// Thực thi rules
const results = ruleRegistry.executeRules("validation", workflowContext);
```

### 🔹 ThemeRegistry

**Mục đích:** Quản lý themes và color palettes

**Chức năng:**

- Đăng ký themes tùy chỉnh
- Chuyển đổi themes động
- Quản lý color palettes cho nodes và edges

**Sử dụng:**

```typescript
import { themeRegistry } from "@/core/registry";

// Đăng ký theme mới
themeRegistry.register({
  id: "dark-theme",
  name: "Dark Theme",
  config: {
    colors: {
      primary: "#1e40af",
      secondary: "#64748b",
      // ...
    },
  },
});
```

### 🔹 ContextMenuRegistry

**Mục đích:** Quản lý context menus cho nodes, edges, và canvas

**Chức năng:**

- Đăng ký menu items động
- Submenu và nested menus
- Context-aware actions

**Sử dụng:**

```typescript
import { contextMenuRegistry } from "@/core/registry";

// Lấy menu items cho node
const nodeMenuItems = contextMenuRegistry.getMenuItemsForNode("taskUser", {
  nodeId: "node-123",
});

// Đăng ký menu mới
contextMenuRegistry.register({
  id: "custom-menu",
  name: "Custom Menu",
  config: {
    targetType: "node",
    items: [
      /* menu items */
    ],
  },
});
```

### 🔹 CategoryRegistry

**Mục đích:** Quản lý categories để phân loại nodes

**Categories mặc định:**

- `start` - Start Events
- `end` - End Events
- `task` - Tasks
- `gateway` - Gateways
- `subflow` - Subprocesses
- `custom` - Custom nodes

**Sử dụng:**

```typescript
import { categoryRegistry } from "@/core/registry";

// Thêm category mới
categoryRegistry.register({
  id: "integration",
  name: "Integration",
  config: {
    metadata: {
      title: "Integration Nodes",
      description: "Third-party integrations",
      icon: "🔌",
    },
  },
});
```

### 🔹 ContextMenuActionsRegistry

**Mục đích:** Quản lý các actions được trigger từ context menu

**Actions có sẵn:**

- `changeNodeColor` - Đổi màu node
- `changeNodeBorderStyle` - Đổi kiểu viền node
- `deleteNode` - Xóa node
- `changeEdgeColor` - Đổi màu edge
- `changePathType` - Đổi kiểu path rendering (bezier/straight/step)
- `changeEdgePathStyle` - Đổi style path (solid/dashed/dotted)
- `addEdgeLabel` - Thêm label cho edge

**Sử dụng:**

```typescript
import { contextMenuActionsRegistry } from "@/core/registry";

// Đăng ký action mới
contextMenuActionsRegistry.registerActions({
  customAction: (nodeId: string, params: any) => {
    // Custom action logic
  },
});

// Thực thi action
const action = contextMenuActionsRegistry.getAction("changeNodeColor");
if (action) {
  action("node-123", "blue-palette");
}
```

### 🔄 Registry Lifecycle

Tất cả registries đều kế thừa từ `BaseRegistry` và cung cấp các operations cơ bản:

```typescript
// CRUD Operations
registry.register(item); // Thêm item mới
registry.get(id); // Lấy item theo id
registry.getAll(); // Lấy tất cả items
registry.update(id, updates); // Cập nhật item
registry.unregister(id); // Xóa item
registry.clear(); // Xóa tất cả items

// Query Operations
registry.find(predicate); // Tìm items theo điều kiện
registry.filter(predicate); // Lọc items
registry.has(id); // Kiểm tra tồn tại
```

### 🔌 Plugin Integration

Plugins có thể đăng ký items vào bất kỳ registry nào:

```typescript
export const customPlugin: Plugin = {
  metadata: {
    id: "custom-plugin",
    name: "Custom Plugin",
    version: "1.0.0",
  },
  config: {
    nodes: [
      /* custom nodes */
    ],
    edges: [
      /* custom edges */
    ],
    rules: [
      /* custom rules */
    ],
    themes: [
      /* custom themes */
    ],
    contextMenus: [
      /* custom menus */
    ],
  },
  async initialize() {
    console.log("Custom plugin initialized");
  },
};
```

## Properties Panel

┌─────────────────────────────────────────────────────────────┐
│ PropertiesPanel (UI Layer) │
├─────────────────────────────────────────────────────────────┤
│ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ │
│ │ Tab 1 │ │ Tab 2 │ │ Tab 3 │ │
│ │ (Basic) │ │ (Advanced) │ │ (Styling) │ │
│ └─────────────┘ └─────────────┘ └─────────────┘ │
│ │
│ ┌───────────────────────────────────────────────┐ │
│ │ Property Group Renderer │ │
│ │ ┌─────────────────────────────────────────┐ │ │
│ │ │ Dynamic Field Renderer │ │ │
│ │ │ - TextInput, NumberInput, etc. │ │ │
│ │ │ - Conditional rendering │ │ │
│ │ │ - Validation feedback │ │ │
│ │ └─────────────────────────────────────────┘ │ │
│ └───────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
↕ Two-way binding
┌─────────────────────────────────────────────────────────────┐
│ Property Schema Layer (Configuration) │
├─────────────────────────────────────────────────────────────┤
│ - PropertyGroupDefinition[] │
│ - PropertyFieldDefinition[] │
│ - Validation Schema (Zod) │
│ - Conditional Logic │
└─────────────────────────────────────────────────────────────┘
↕ Data sync
┌─────────────────────────────────────────────────────────────┐
│ Data Layer (Store & Sync) │
├─────────────────────────────────────────────────────────────┤
│ - useWorkflowStore (Zustand) │
│ - Property Sync Handlers │
│ - Validation Engine │
└─────────────────────────────────────────────────────────────┘

## 🎮 Simulation & Execution Logic

BPM Core tích hợp trình mô phỏng (Simulation Engine) cho phép chạy thử quy trình ngay trong trình thiết kế.

### 🔹 Cơ chế hoạt động

1.  **Expression Evaluator**: Sử dụng một engine an toàn để đánh giá các biểu thức JavaScript (ES6+).
2.  **Workflow Simulation State**: Quản lý trạng thái thực thi (active node, variables, history) trong Zustand store.
3.  **Path Selection**:
    *   Tự động di chuyển qua các Tasks/Events thông thường.
    *   Đánh giá điều kiện (`condition`) trên các luồng rẽ nhánh (`Sequence Flow`) tại các Gateway để quyết định hướng đi.
    *   Hỗ trợ luồng mặc định (`Default Flow`) nếu không có điều kiện nào thỏa mãn.

### 🔹 Cách cấu hình Logic

*   **Script Task**: Sử dụng field `script` (Logic editor) để thay đổi biến hệ thống.
    *   *Ví dụ:* `variables.amount = 500; variables.status = 'pending';`
*   **Gateway / Sequence Flow**: Sử dụng field `condition` (Expression editor) để rẽ nhánh.
    *   *Ví dụ:* `variables.amount > 1000`

### 🔹 Trình soạn thảo chuyên nghiệp

Hệ thống cung cấp các bộ soạn thảo chuyên dụng:
*   **Logic Editor**: Hỗ trợ viết script đa dòng với font monospaced và giao diện IDE thu nhỏ.
*   **Expression Editor**: Chuyên dụng cho các công thức logic một dòng, hỗ trợ cú pháp `f(x) = ...`.
