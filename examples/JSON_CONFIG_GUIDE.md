# BPM Core - JSON Configuration Guide

Complete guide for integrating BPM Core using JSON configuration.

## Overview

BPM Core now supports **pure JSON configuration**, allowing you to:

- Define custom nodes without writing TypeScript/JavaScript code
- Configure properties, context menus, and event triggers using JSON
- Load configurations from files or URLs
- Build complete workflow plugins using JSON

## Quick Start

### 1. NPM Library Integration

```typescript
import { CustomNodeFactory } from "bpm-core";

// Define node configuration as JSON
const nodeConfig = {
  id: "sendEmailTask",
  extends: "task",
  name: "Send Email",
  description: "Send email notification",
  properties: [
    {
      id: "to",
      label: "To",
      type: "text",
      required: true,
    },
  ],
};

// Register the node
CustomNodeFactory.registerFromConfig(nodeConfig);
```

### 2. SDK Integration

```html
<div id="bpm-container"></div>
<script src="bpm-sdk.js"></script>
<script>
  var bpm = new BPM({
    selector: '#bpm-container',
    options: {
      // Inline JSON config
      customNodes: [
        {
          id: "sendEmailTask",
          extends: "task",
          name: "Send Email",
          properties: [...]
        }
      ],
      // Or load from URL
      customNodesUrl: 'https://example.com/nodes.json',
      pluginUrls: [
        'https://example.com/plugin.json'
      ]
    }
  });

  // Subscribe to events
  bpm.on('custom:node-created', function(event) {
    console.log('Node created:', event.payload);
  });
</script>
```

## JSON Schema Reference

### Base Node Definition

```json
{
  "id": "string (required)",
  "extends": "start|end|task|gateway|event|annotation|pool|note (required)",
  "name": "string (required)",
  "description": "string (optional)",
  "category": "string (optional)",
  "icon": { IconConfig },
  "visualConfig": { VisualConfig },
  "properties": [ PropertyDefinition ],
  "propertyGroups": [ PropertyGroup ],
  "defaultProperties": { object },
  "connectionRules": { ConnectionRules },
  "contextMenuItems": [ ContextMenuItem ],
  "eventTriggers": [ EventTrigger ],
  "hooks": { Hooks },
  "collapsible": boolean,
  "editable": boolean,
  "deletable": boolean,
  "connectable": boolean,
  "draggable": boolean
}
```

### Property Definition

```json
{
  "id": "string (required)",
  "name": "string (required)",
  "label": "string (required)",
  "type": "text|number|textarea|boolean|select|multiselect|color|json|date|slider (required)",
  "required": boolean,
  "defaultValue": any,
  "placeholder": "string",
  "description": "string",
  "group": "string",
  "order": number,
  "options": [
    {
      "label": "string",
      "value": "string|number|boolean",
      "description": "string",
      "disabled": boolean
    }
  ],
  "validation": {
    "pattern": "string (regex)",
    "min": number,
    "max": number,
    "minLength": number,
    "maxLength": number,
    "message": "string"
  }
}
```

### Context Menu Item

```json
{
  "id": "string (required)",
  "label": "string (required)",
  "icon": "string (lucide icon name)",
  "action": {
    "type": "event|function|navigate|modal|api",
    "event": "string (event name)",
    "function": "string (function name)",
    "url": "string",
    "payload": { object }
  },
  "condition": {
    "field": "string (property field)",
    "operator": "equals|notEquals|includes|notIncludes",
    "value": any
  },
  "submenu": [ ContextMenuItem ],
  "separator": boolean,
  "disabled": boolean
}
```

### Event Trigger

```json
{
  "on": "string (event name, e.g., 'node:added')",
  "action": "emit|call",
  "event": "string (event to emit)",
  "function": "string (function to call)",
  "payload": { object },
  "condition": {
    "property": "string",
    "operator": "equals|notEquals|includes|notIncludes",
    "value": any
  }
}
```

## Complete Examples

### Email Notification Node

See: `/examples/json-configs/email-node.json`

```json
{
  "id": "sendEmailTask",
  "extends": "task",
  "name": "Send Email",
  "description": "Send email notification to specified recipients",
  "icon": {
    "type": "lucide",
    "value": "Mail",
    "color": "#ffffff",
    "backgroundColor": "#e74c3c"
  },
  "properties": [
    {
      "id": "to",
      "label": "To",
      "type": "text",
      "required": true,
      "group": "email"
    },
    {
      "id": "subject",
      "label": "Subject",
      "type": "text",
      "required": true,
      "group": "email"
    },
    {
      "id": "body",
      "label": "Body",
      "type": "textarea",
      "required": true,
      "group": "email"
    }
  ],
  "propertyGroups": [
    {
      "id": "email",
      "label": "Email Configuration",
      "icon": "Mail",
      "order": 1
    }
  ],
  "contextMenuItems": [
    {
      "id": "test-email",
      "label": "Send Test Email",
      "icon": "Send",
      "action": {
        "type": "event",
        "event": "custom:send-test-email"
      }
    }
  ]
}
```

### HTTP Request Node

See: `/examples/json-configs/http-request-node.json`

### Complete Plugin

See: `/examples/json-configs/complete-plugin.json`

## API Reference

### CustomNodeFactory

```typescript
// Register single node
CustomNodeFactory.registerFromConfig(config: CustomNodeJSON): void

// Register multiple nodes
CustomNodeFactory.registerMany(configs: CustomNodeJSON[]): BatchResult

// Load from JSON string
CustomNodeFactory.loadFromJSON(jsonString: string): BatchResult

// Load from URL
CustomNodeFactory.loadFromURL(url: string): Promise<BatchResult>

// Validate config
CustomNodeFactory.validateConfig(config: unknown): ValidationResult
```

### PluginJSONLoader

```typescript
// Load plugin
PluginJSONLoader.loadPlugin(config: PluginJSON): Plugin

// Load from JSON string
PluginJSONLoader.loadPluginFromJSON(jsonString: string): Plugin

// Load from URL
PluginJSONLoader.loadPluginFromURL(url: string): Promise<Plugin>

// Validate plugin
PluginJSONLoader.validatePlugin(config: unknown): ValidationResult
```

## Built-in Events

You can subscribe to these events in your custom nodes:

### Node Events

- `node:added` - Node added to workflow
- `node:updated` - Node updated
- `node:deleted` - Node deleted
- `node:selected` - Node selected
- `property:changed` - Node property changed

### Workflow Events

- `workflow:loaded` - Workflow loaded
- `workflow:saved` - Workflow saved
- `workflow:validated` - Workflow validated

### Custom Events

- Use `custom:*` namespace for your custom events
- Example: `custom:email-sent`, `custom:api-called`

## Best Practices

1. **Use meaningful IDs**: Node IDs should be unique and descriptive
2. **Group properties**: Organize properties into logical groups
3. **Validate early**: Use the validation API before registering
4. **Handle errors**: Always check `BatchResult` for failures
5. **Event naming**: Use descriptive event names with namespace
6. **Context menus**: Keep menu hierarchies shallow (max 2 levels)

## TypeScript Support

Full TypeScript definitions are available:

```typescript
import type {
  CustomNodeJSON,
  PluginJSON,
  PropertyDefinitionJSON,
  ContextMenuItemJSON,
} from "bpm-core";
```

## Migration from Code to JSON

If you have existing TypeScript/JavaScript node definitions, you can easily convert them to JSON by removing code logic and using event triggers instead.

Before (TypeScript):

```typescript
const node = {
  // ... config
  onClick: () => {
    console.log("Clicked");
  },
};
```

After (JSON):

```json
{
  "contextMenuItems": [
    {
      "id": "click-action",
      "label": "Click",
      "action": {
        "type": "event",
        "event": "custom:node-clicked"
      }
    }
  ]
}
```

Then subscribe to the event in your application code.
