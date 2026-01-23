# Simulation & Expression Guide

This library includes a simulation engine to test workflow logic before deployment.

## How it Works

The simulation engine tracks a "current node" and evaluates outgoing edges based on process data.

### Controls
- **Simulate Button**: Toggles simulation mode.
- **Play/Pause**: Automatically step through the workflow.
- **Step Next**: Manually move to the next node.
- **Reset**: Return to the start node and clear variables.

## Expression Evaluator

The `ExpressionEvaluator` handles logic in Gateways and Edge conditions.

### Supported Syntax
- **Variables**: Access node properties using their IDs (e.g., `amount > 100`).
- **Logic**: `&&`, `||`, `!`.
- **Comparison**: `==`, `!=`, `>`, `<`, `>=`, `<=`.
- **Functions**:
  - `contains(string, search)`
  - `length(array_or_string)`

### Conditional Edges
When multiple edges leave a node (e.g., an Exclusive Gateway), each edge should have a `condition` property.

```json
{
  "id": "edge-1",
  "source": "gateway-1",
  "target": "task-A",
  "properties": {
    "condition": "status == 'approved'"
  }
}
```

If no condition evaluates to `true`, the simulation will halt unless a "Default Flow" is configured (coming soon).

## Developing Custom Rules
You can register custom evaluation logic in `RuleRegistry.ts` to extend the simulation's capabilities.
