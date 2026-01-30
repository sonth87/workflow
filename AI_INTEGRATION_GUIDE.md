# AI Integration Guide for BPM Core

This guide is designed for AI Agents (and developers building AI features) to understand how to interact with the BPM Core library to programmatically generate workflows.

## 1. Mental Model

To the AI, a workflow is a directed graph consisting of **Nodes** (activities, events, gateways) and **Edges** (sequence flows).

- **Registry:** The source of truth for what blocks are available. You generally query the `NodeRegistry` to see available `types`.
- **Workflow State:** A JSON object containing arrays of `nodes` and `edges`.

## 2. Generating a Workflow

To generate a workflow, the AI must produce a JSON object with the following structure:

```json
{
  "nodes": [
    {
      "id": "node_1",
      "type": "start-event",
      "position": { "x": 0, "y": 0 },
      "data": { "label": "Start" },
      "properties": {}
    },
    {
      "id": "node_2",
      "type": "user-task",
      "position": { "x": 200, "y": 0 },
      "data": { "label": "Review Application" },
      "properties": {
        "assignee": "manager",
        "priority": "high"
      }
    }
  ],
  "edges": [
    {
      "id": "edge_1",
      "source": "node_1",
      "target": "node_2",
      "type": "sequence-flow"
    }
  ]
}
```

### Key Rules for Generation

1.  **IDs:** Must be unique strings. Using UUIDs or simple `node_${index}` is acceptable.
2.  **Types:** Must match a key in the `NodeRegistry` (e.g., `start-event`, `user-task`, `exclusive-gateway`).
3.  **Position:** Required `x` and `y`. If unknown, generate logic structure first and use an auto-layout utility.
4.  **Properties:** Specific to the `type`. Refer to the **Capabilities Schema** to know which properties are valid for each node type.

## 3. Capabilities Schema (Context for AI)

Before generating, the AI should be provided with the "Capabilities Schema". This is a JSON description of all registered nodes.

*Note: A utility `getRegistryCapabilities()` is available in `src/core/utils/aiUtils.ts` to generate this.*

**Format of Capabilities Schema:**
```json
{
  "nodeTypes": [
    {
      "type": "user-task",
      "description": "A task assigned to a human user",
      "category": "Task",
      "properties": [
        { "name": "assignee", "type": "string", "description": "User ID to assign" },
        { "name": "dueDate", "type": "date", "description": "Deadline" }
      ]
    }
    // ... other nodes
  ]
}
```

## 4. Integration Steps

1.  **User Prompt:** "Create a leave request process where a manager approves."
2.  **Context Loading:** Fetch the *Capabilities Schema*.
3.  **LLM Generation:** Send [Prompt + Schema] to LLM. Request JSON output.
4.  **Parsing & Validation:** Parse the JSON. Ensure `source` and `target` in edges refer to existing `id`s in nodes.
5.  **State Update:** Call `workflowStore.getState().setNodes(nodes)` and `setEdges(edges)`.

## 5. Common Pitfalls

- **Gateways:** Exclusive Gateways (XOR) usually split the flow. Ensure the edges coming out of a gateway have `properties.condition` set (except for the default path).
- **Start/End:** Most valid BPMN processes need at least one `start-event` and one `end-event`.
- **Orphan Nodes:** Ensure all nodes (except Start/End) are connected.
