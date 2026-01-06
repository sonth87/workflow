# Workflow Module - New Architecture

Thư mục này chứa implementation mới sử dụng Core Architecture.

## 📁 Structure

```
workflow/
├── index.tsx                    # Main entry point
├── context/
│   └── WorkflowProvider.tsx     # Context provider + initialization
├── components/
│   ├── Canvas.tsx               # Main canvas (ReactFlow)
│   ├── Toolbox.tsx              # Node toolbox sidebar
│   ├── PropertiesPanel.tsx      # Dynamic properties panel
│   ├── Header.tsx               # Top header with actions
│   └── ValidationPanel.tsx      # Validation errors panel
└── hooks/
    └── useWorkflow.ts           # Custom workflow hooks
```

## 🚀 Usage

### Development

```bash
# Run new version (default)
pnpm dev
```

### Differences from Old Implementation

| Feature          | Old (`/pages/WorkflowBuilder`) | New (`/workflow`) |
| ---------------- | ------------------------------ | ----------------- |
| State Management | useState                       | Zustand Store     |
| Node Config      | Props/JSON                     | Node Registry     |
| Validation       | Static functions               | Validation Engine |
| Events           | Props drilling                 | Event Bus         |
| Extensibility    | Hard-coded                     | Plugin System     |

## 🎯 Key Features

### 1. WorkflowProvider

Automatically initializes the core system:

- Installs default BPM plugin
- Activates plugin
- Shows loading state
- Handles errors

```tsx
<WorkflowProvider>
  <YourComponent />
</WorkflowProvider>
```

### 2. Custom Hooks

**useNodeOperations:**

```tsx
const { createNode, updateNodeProperties, deleteNode } = useNodeOperations();

// Create a node
createNode("task", { x: 100, y: 100 }, { name: "My Task" });
```

**useWorkflowValidation:**

```tsx
const { validate, validationErrors, hasErrors } = useWorkflowValidation();

// Validate workflow
await validate();
```

**useAvailableNodes:**

```tsx
const { nodeTypes, getNodesByCategory } = useAvailableNodes();

// Get all task nodes
const taskNodes = getNodesByCategory("task");
```

### 3. Components

All components are connected to the Zustand store and use registries:

- **Canvas**: ReactFlow integration with store
- **Toolbox**: Auto-populated from NodeRegistry
- **PropertiesPanel**: Dynamic forms from propertyDefinitions
- **ValidationPanel**: Shows errors from ValidationEngine

## 🔧 Extending

### Add Custom Node

Create a plugin and install it in `WorkflowProvider`:

```tsx
// customPlugin.ts
export const customPlugin: Plugin = {
  metadata: {
    id: "my-plugin",
    name: "My Plugin",
    version: "1.0.0",
  },
  config: {
    nodes: [
      {
        id: "custom-task",
        type: "custom-task",
        name: "Custom Task",
        config: {
          // ... node config
        },
      },
    ],
  },
};

// In WorkflowProvider.tsx
await pluginManager.install(customPlugin);
await pluginManager.activate("my-plugin");
```

### Add Custom Validation

```tsx
import { ruleRegistry } from "@/core/registry/RuleRegistry";

ruleRegistry.register({
  id: "my-rule",
  type: "validation",
  name: "My Rule",
  config: {
    id: "my-rule",
    name: "My Custom Rule",
    type: "validation",
    enabled: true,
    scope: "workflow",
    condition: context => {
      // Your validation logic
      return true;
    },
  },
});
```

### Listen to Events

```tsx
import { useWorkflowEvents } from "./hooks/useWorkflow";
import { WorkflowEventTypes } from "@/core/events/EventBus";

useWorkflowEvents(WorkflowEventTypes.NODE_ADDED, event => {
  console.log("Node added:", event.payload);
});
```

## 📝 Migration Checklist

- [x] WorkflowProvider with initialization
- [x] Canvas using workflowStore
- [x] Toolbox using nodeRegistry
- [x] PropertiesPanel with dynamic forms
- [x] Header with undo/redo
- [x] ValidationPanel
- [x] Custom hooks
- [x] Routing setup (dev vs dev:old)
- [ ] Node renderers migration
- [ ] Edge renderers migration
- [ ] Context menus UI
- [ ] Theme switcher

## 🐛 Debugging

### Check if Core is Initialized

```tsx
import { pluginManager } from "@/core/plugins/PluginManager";

console.log("Plugins:", pluginManager.getAllPlugins());
console.log("Active:", pluginManager.getActivePlugins());
```

### Check Registry Content

```tsx
import { nodeRegistry } from "@/core/registry/NodeRegistry";

console.log("Node types:", nodeRegistry.getAll());
console.log("Categories:", nodeRegistry.getCategories());
```

### Monitor Events

```tsx
import { globalEventBus } from "@/core/events/EventBus";

// Log all events
globalEventBus.getEventTypes().forEach(type => {
  globalEventBus.on(type, event => {
    console.log(`[${type}]`, event.payload);
  });
});
```

## 📚 Related Documentation

- [Core Architecture](../ARCHITECTURE.md)
- [Plugin System](../ARCHITECTURE.md#plugin-system)
- [Usage Examples](../src/examples/usage-example.ts)
- [Migration Guide](../MIGRATION_GUIDE.md)
