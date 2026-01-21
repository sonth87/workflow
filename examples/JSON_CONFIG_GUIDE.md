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
  "label": "string OR MultilingualText (required)",
  "type": "text|number|textarea|boolean|select|multiselect|color|json|date|slider (required)",
  "required": boolean,
  "defaultValue": any,
  "placeholder": "string OR MultilingualText",
  "description": "string OR MultilingualText",
  "group": "string",
  "order": number,
  "options": [
    {
      "label": "string OR MultilingualText",
      "value": "string|number|boolean",
      "description": "string OR MultilingualText",
      "disabled": boolean
    }
  ],
  "validation": {
    "pattern": "string (regex)",
    "min": number,
    "max": number,
    "minLength": number,
    "maxLength": number,
    "message": "string OR MultilingualText"
  }
}
```

### MultilingualText Format

All text fields (`label`, `placeholder`, `description`, `name`) support multilingual format:

```json
// Simple string (works, but not translatable)
"label": "Email Address"

// Multilingual object (recommended)
"label": {
  "en": "Email Address",
  "vi": "Địa chỉ Email",
  "fr": "Adresse e-mail"
}
```

**Requirements:**

- Must include at least the `"en"` (English) key
- Can include any language codes you need
- The system automatically detects and displays available languages
- Falls back to English if the current language is not available

### Context Menu Item

```json
{
  "id": "string (required)",
  "label": "string OR MultilingualText (required)",
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

## 🌍 Multilingual Support

### Overview

BPM Core supports **two translation formats**:

1. **Flat Key-Based Format** (Recommended) - Use translation keys with separate language files
2. **Nested Format** (Legacy) - Embed all languages in config

**⭐ The flat format is strongly recommended** for better scalability, smaller payloads, and easier maintenance.

**📖 See [TRANSLATION_SYSTEM_GUIDE.md](../readme/TRANSLATION_SYSTEM_GUIDE.md) for comprehensive documentation on the new flat translation system.**

### Nested Format (Original)

All text fields support multilingual objects with language codes as keys.

#### Supported Fields

- Node `name` and `description`
- Plugin metadata `name` and `description`
- Category `name` and `description`
- Property `label`, `placeholder`, `description`
- Property option `label` and `description`
- Validation `message`
- Context menu `label`
- Property group `label` and `description`

#### Basic Usage

Instead of a simple string, provide an object with language codes as keys:

```json
{
  "name": {
    "en": "Send Email",
    "vi": "Gửi Email",
    "fr": "Envoyer un e-mail",
    "de": "E-Mail senden"
  }
}
```

### Flat Format (New - Recommended for Scale)

Use translation keys instead of nested objects:

```json
{
  "name": "sendEmailTask.name",
  "description": "sendEmailTask.description"
}
```

Then provide separate translation files:

**en.json:**

```json
{
  "sendEmailTask.name": "Send Email",
  "sendEmailTask.description": "Send email notification"
}
```

**vi.json:**

```json
{
  "sendEmailTask.name": "Gửi Email",
  "sendEmailTask.description": "Gửi thông báo email"
}
```

**Benefits:**

- ✅ 90% smaller payload (load only active language)
- ✅ Easy to add new languages
- ✅ Better separation of concerns
- ✅ Translator-friendly format

**See [TRANSLATION_SYSTEM_GUIDE.md](../readme/TRANSLATION_SYSTEM_GUIDE.md) for complete usage examples.**

### Complete Example (Flat Format - Recommended)

```json
{
  "id": "customNotification",
  "extends": "task",
  "name": "customNotification.name",
  "description": "customNotification.description",
  "properties": [
    {
      "id": "recipient",
      "name": "recipient",
      "label": "customNotification.properties.recipient.label",
      "type": "text",
      "required": true,
      "placeholder": "customNotification.properties.recipient.placeholder",
      "description": "customNotification.properties.recipient.description"
    },
    {
      "id": "type",
      "name": "type",
      "label": "customNotification.properties.type.label",
      "type": "select",
      "options": [
        {
          "label": "customNotification.properties.type.options.email",
          "value": "email"
        },
        {
          "label": "customNotification.properties.type.options.sms",
          "value": "sms"
        }
      ]
    }
  ],
  "propertyGroups": [
    {
      "id": "recipient-info",
      "label": "customNotification.groups.recipientInfo"
    }
  ],
  "contextMenuItems": [
    {
      "id": "test-notification",
      "label": "customNotification.contextMenu.test",
      "icon": "Send"
    }
  ]
}
```

**Translation files:**

**en.json:**

```json
{
  "customNotification.name": "Custom Notification",
  "customNotification.description": "Send customized notifications to users",
  "customNotification.properties.recipient.label": "Recipient",
  "customNotification.properties.recipient.placeholder": "Enter recipient email",
  "customNotification.properties.recipient.description": "Email address of the recipient",
  "customNotification.properties.type.label": "Notification Type",
  "customNotification.properties.type.options.email": "Email",
  "customNotification.properties.type.options.sms": "SMS",
  "customNotification.groups.recipientInfo": "Recipient Information",
  "customNotification.contextMenu.test": "Send Test Notification"
}
```

**vi.json:**

```json
{
  "customNotification.name": "Thông báo tùy chỉnh",
  "customNotification.description": "Gửi thông báo tùy chỉnh cho người dùng",
  "customNotification.properties.recipient.label": "Người nhận",
  "customNotification.properties.recipient.placeholder": "Nhập email người nhận",
  "customNotification.properties.recipient.description": "Địa chỉ email của người nhận",
  "customNotification.properties.type.label": "Loại thông báo",
  "customNotification.properties.type.options.email": "Email",
  "customNotification.properties.type.options.sms": "Tin nhắn",
  "customNotification.groups.recipientInfo": "Thông tin người nhận",
  "customNotification.contextMenu.test": "Gửi thông báo thử"
}
```

### Legacy: Complete Multilingual Example (Nested Format)

> ⚠️ **Note:** This format still works but is **not recommended** for new projects. Use the flat format above for better scalability.

```json
{
  "id": "customNotification",
  "extends": "task",
  "name": {
    "en": "Custom Notification",
    "vi": "Thông báo tùy chỉnh",
    "fr": "Notification personnalisée"
  },
  "description": {
    "en": "Send customized notifications to users",
    "vi": "Gửi thông báo tùy chỉnh cho người dùng",
    "fr": "Envoyer des notifications personnalisées aux utilisateurs"
  },
  "properties": [
    {
      "id": "recipient",
      "name": "recipient",
      "label": {
        "en": "Recipient",
        "vi": "Người nhận",
        "fr": "Destinataire"
      },
      "type": "text",
      "required": true,
      "placeholder": {
        "en": "Enter recipient email",
        "vi": "Nhập email người nhận",
        "fr": "Entrez l'e-mail du destinataire"
      },
      "description": {
        "en": "Email address of the recipient",
        "vi": "Địa chỉ email của người nhận",
        "fr": "Adresse e-mail du destinataire"
      }
    },
    {
      "id": "type",
      "name": "type",
      "label": {
        "en": "Notification Type",
        "vi": "Loại thông báo",
        "fr": "Type de notification"
      },
      "type": "select",
      "options": [
        {
          "label": {
            "en": "Email",
            "vi": "Email",
            "fr": "E-mail"
          },
          "value": "email"
        },
        {
          "label": {
            "en": "SMS",
            "vi": "Tin nhắn",
            "fr": "SMS"
          },
          "value": "sms"
        }
      ]
    }
  ],
  "propertyGroups": [
    {
      "id": "recipient-info",
      "label": {
        "en": "Recipient Information",
        "vi": "Thông tin người nhận",
        "fr": "Informations sur le destinataire"
      }
    }
  ],
  "contextMenuItems": [
    {
      "id": "test-notification",
      "label": {
        "en": "Send Test Notification",
        "vi": "Gửi thông báo thử",
        "fr": "Envoyer une notification de test"
      },
      "icon": "Send"
    }
  ]
}
```

### Migration Helper

If you have existing JSON configs with English-only strings, here's a helper function to convert them:

```javascript
function convertToMultilingual(config, targetLanguages = ["en"]) {
  // Helper to wrap string in multilingual object
  function wrapText(text) {
    if (typeof text !== "string") return text;
    const result = {};
    targetLanguages.forEach(lang => {
      result[lang] = text; // You can translate these manually later
    });
    return result;
  }

  // Convert node name and description
  if (config.name) config.name = wrapText(config.name);
  if (config.description) config.description = wrapText(config.description);

  // Convert properties
  if (config.properties) {
    config.properties.forEach(prop => {
      if (prop.label) prop.label = wrapText(prop.label);
      if (prop.placeholder) prop.placeholder = wrapText(prop.placeholder);
      if (prop.description) prop.description = wrapText(prop.description);

      // Convert options
      if (prop.options) {
        prop.options.forEach(opt => {
          if (opt.label) opt.label = wrapText(opt.label);
          if (opt.description) opt.description = wrapText(opt.description);
        });
      }
    });
  }

  // Convert property groups
  if (config.propertyGroups) {
    config.propertyGroups.forEach(group => {
      if (group.label) group.label = wrapText(group.label);
      if (group.description) group.description = wrapText(group.description);
    });
  }

  // Convert context menu items
  if (config.contextMenuItems) {
    config.contextMenuItems.forEach(item => {
      if (item.label) item.label = wrapText(item.label);
    });
  }

  return config;
}

// Usage
const oldConfig = {
  name: "Send Email",
  description: "Send email notification",
  properties: [{ id: "to", label: "To", type: "text" }],
};

const newConfig = convertToMultilingual(oldConfig, ["en", "vi", "fr"]);
console.log(JSON.stringify(newConfig, null, 2));
```

### Best Practices

1. **Always include English**: The `en` key is required as a fallback
2. **Be consistent**: Use the same language codes across all your configs
3. **Keep it concise**: Translations should fit in the UI comfortably
4. **Use native speakers**: Get proper translations from native speakers
5. **Test thoroughly**: Switch between languages to ensure all text displays correctly

### Fallback Behavior

The system uses this fallback chain:

1. Current selected language (e.g., `fr`)
2. English (`en`)
3. First available language in the object
4. The multilingual object itself (as last resort)

Example:

```json
{
  "label": {
    "en": "Submit",
    "vi": "Gửi",
    "fr": "Soumettre"
  }
}
```

- User selects `fr` → displays "Soumettre"
- User selects `de` (not available) → displays "Submit" (fallback to `en`)
- User selects language before any node loads → displays "Submit"

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
