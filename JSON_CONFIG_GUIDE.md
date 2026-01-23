# JSON Configuration Guide for BPM Workflow

This guide explains how to configure nodes, edges, and properties in this workflow library. The system is designed to be highly dynamic, allowing you to define new behaviors and UI elements entirely through configuration.

## Table of Contents
1. [Node Configuration](#node-configuration)
2. [Inheritance System](#inheritance-system)
3. [Property Definitions](#property-definitions)
4. [Conditional Visibility](#conditional-visibility)
5. [Localization](#localization)

---

## Node Configuration

A node is defined by a `NodeType` and a configuration object.

```typescript
{
  id: "my-custom-node",
  type: "custom-node",
  name: "My Custom Node",
  extends: "base-node", // Optional: Inherit from another node
  config: {
    category: "task",
    metadata: {
      title: "My Node Title",
      description: "Description of what this node does"
    },
    icon: {
      type: "lucide",
      value: "Activity", // Lucide icon name or component
      backgroundColor: "#3b82f6",
      color: "#ffffff"
    },
    propertyDefinitions: [
      // ... field definitions
    ]
  }
}
```

## Inheritance System

The `extends` property allows you to create specialized nodes based on existing ones.

- **Deep Merging**: The system merges `propertyDefinitions`, `visualConfig`, and `metadata`.
- **Overrides**: Properties defined in the child node override those in the parent.
- **Example**: `Timer Start Event` extends `Start Event`. It inherits the green circle icon but adds timer-specific fields.

## Property Definitions

Each field in the Properties Panel is defined in the `propertyDefinitions` array.

| Property | Type | Description |
| :--- | :--- | :--- |
| `id` | `string` | Unique ID of the field (used in data storage). |
| `type` | `string` | UI component: `text`, `number`, `select`, `multiselect`, `switch`, `date`, `logic`, `expression`. |
| `label` | `string` | Translation key or static string. |
| `group` | `string` | Grouping in UI: `basic`, `config`, `advanced`, `appearance`. |
| `defaultValue` | `any` | Initial value. |
| `options` | `array` | For `select` or `multiselect` (e.g., `[{label: 'A', value: 'a'}]`). |
| `validation` | `ZodSchema` | Optional Zod schema for validation. |

### Special Field Types
- **`logic`**: Monospaced text area for boolean logic.
- **`expression`**: Monospaced text area for data transformations.

## Conditional Visibility

You can hide or show fields based on the values of other fields using the `visible` property.

### Simple Condition
```json
"visible": { "field": "timerType", "operator": "equals", "value": "once" }
```

### Advanced Operators
- `equals` / `===`
- `notEquals` / `!==`
- `includes` / `contains`
- `regex` (value is a string pattern)
- `in` / `notIn` (value is an array)

### Logical Operators (AND/OR)
```json
"visible": {
  "or": [
    { "field": "status", "operator": "equals", "value": "active" },
    { "field": "type", "operator": "in", "value": ["admin", "super"] }
  ]
}
```

## Localization

Always use translation keys for labels and descriptions.

- Keys starting with `ui.` are general UI elements.
- Keys starting with `plugin.default.` are specific to the BPM plugin.
- New keys should be added to `src/translations/plugins.vi.json` and `src/translations/plugins.en.json`.

Example:
```json
"label": "ui.properties.timerType"
```
