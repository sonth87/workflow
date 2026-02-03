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
3.  **Position:** Required `x` and `y`. Incremental positioning (e.g., x + 200) is a good baseline strategy.
4.  **Properties:** Specific to the `type`. Refer to the **Capabilities Schema** to know which properties are valid for each node type.

## 3. Capabilities Schema (Context for AI)

Before generating, the AI should be provided with the "Capabilities Schema". This is a JSON description of all registered nodes.

_Note: A utility `getRegistryCapabilities()` is available in `src/core/utils/aiUtils.ts` to generate this._

**Format of Capabilities Schema:**

```json
{
  "nodeTypes": [
    {
      "type": "user-task",
      "description": "A task assigned to a human user",
      "category": "Task",
      "properties": [
        {
          "name": "assignee",
          "type": "string",
          "description": "User ID to assign"
        },
        { "name": "dueDate", "type": "date", "description": "Deadline" }
      ]
    }
    // ... other nodes
  ]
}
```

## 4. Real AI Integration (LLM)

The system now supports real-time generation using LLMs (OpenAI, Gemini).

### Configuration

Users must configure their API Key in the UI (Settings in AI Modal). This key is stored in `localStorage`.

### Prompt Engineering

The `AIService` constructs a prompt that includes:

1.  **System Prompt:** Defines the role, rules, and includes the `Capabilities Schema` (Context).
2.  **User Prompt:** The specific request (e.g., "Leave request process").

### Validation

The output from the LLM is parsed and validated by `validateGeneratedWorkflow`:

- Checks if node types exist in registry.
- Checks if edges connect existing nodes.
- Checks for basic BPMN rules (e.g., presence of Start Event).

## 5. Integration Steps

1.  **User Prompt:** "Create a leave request process where a manager approves."
2.  **Context Loading:** Fetch the _Capabilities Schema_.
3.  **LLM Generation:** Send [System Prompt + User Prompt] to LLM. Request JSON output.
4.  **Parsing & Validation:**
    - Parse JSON.
    - Run `validateGeneratedWorkflow`.
    - If invalid, throw error (or retry).
5.  **State Update:** Call `workflowStore.getState().setNodes(nodes)` and `setEdges(edges)`.

## 6. Common Pitfalls

- **Gateways:** Exclusive Gateways (XOR) usually split the flow. Ensure the edges coming out of a gateway have `properties.condition` set (except for the default path).
- **Start/End:** Most valid BPMN processes need at least one `start-event` and one `end-event`.
- **Orphan Nodes:** Ensure all nodes (except Start/End) are connected.
