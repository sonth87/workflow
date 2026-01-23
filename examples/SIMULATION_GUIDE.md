# BPM Core - Simulation Engine Guide

BPM Core includes a built-in simulation engine that allows you to test your workflow logic directly in the browser.

## 🚀 How to use Simulation

1.  Click the **Simulate** button in the header.
2.  The workflow will transition into simulation mode.
3.  The active node will be highlighted with an orange glow.
4.  Visited nodes will be highlighted with a green border.
5.  Use the **Next Step** button in the control bar to advance the process.
6.  The **Variable Counter** shows how many system variables are currently set.

## 📝 Configuring Logic

The simulation engine uses the `variables` object to store state.

### 1. Script Tasks (Logic Editor)

Use Script Tasks to manipulate data. Scripts have access to the `variables` object.

**Example Script:**
```javascript
variables.requestAmount = 1500;
variables.priority = variables.requestAmount > 1000 ? 'high' : 'low';
```

### 2. Exclusive Gateways (Expression Editor)

Gateways use expressions on their outgoing `Sequence Flow` edges to decide which path to take.

**Edge 1 Condition:**
```javascript
variables.priority === 'high'
```

**Edge 2 Condition:**
```javascript
variables.priority === 'low'
```

### 3. Default Flows

If no conditions are met at a gateway, the engine will look for an edge marked as **Default Flow**. You can set this in the Edge properties.

## 🔍 Under the hood

The `ExpressionEvaluator` runs your code in a isolated function:
```javascript
const fn = new Function("variables", ..., script_body);
fn(current_variables, ...);
```

This ensures that the simulation doesn't interfere with the builder's internal state while providing a flexible way to test business logic.
