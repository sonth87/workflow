import type { StateCreator } from "zustand";
import type { WorkflowState, WorkflowActions } from "../workflowStore";
import { globalEventBus, WorkflowEventTypes } from "../../events/EventBus";
import { expressionEvaluator } from "../../utils/ExpressionEvaluator";

export interface SimulationSlice {
  simulation: {
    active: boolean;
    currentNodeId: string | null;
    variables: Record<string, unknown>;
    history: string[];
  };
  startSimulation: (startNodeId?: string) => void;
  stopSimulation: () => void;
  stepSimulation: () => void;
  setSimulationVariable: (name: string, value: unknown) => void;
}

export const createSimulationSlice: StateCreator<
  WorkflowState & WorkflowActions,
  [],
  [],
  SimulationSlice
> = (set, get) => ({
  simulation: {
    active: false,
    currentNodeId: null,
    variables: {},
    history: [],
  },

  startSimulation: startNodeId => {
    const { nodes } = get();
    // If no startNodeId, find the first Start Event
    const startNode = startNodeId
      ? nodes.find(n => n.id === startNodeId)
      : nodes.find(n => n.category === "start");

    if (!startNode) {
      alert("No start node found for simulation");
      return;
    }

    set({
      simulation: {
        active: true,
        currentNodeId: startNode.id,
        variables: {},
        history: [startNode.id],
      },
    });
    globalEventBus.emit(WorkflowEventTypes.WORKFLOW_LOADED, {
      simulation: true,
    });
  },

  stopSimulation: () => {
    set({
      simulation: {
        active: false,
        currentNodeId: null,
        variables: {},
        history: [],
      },
    });
  },

  stepSimulation: () => {
    const { simulation, nodes, edges } = get();
    if (!simulation.active || !simulation.currentNodeId) return;

    const currentNode = nodes.find(n => n.id === simulation.currentNodeId);
    if (!currentNode) return;

    // 1. Evaluate logic of current node (if any)
    const nodeVariables = { ...simulation.variables };
    if (currentNode.properties?.script) {
      try {
        const result = expressionEvaluator.evaluateScript(
          currentNode.properties.script as string,
          nodeVariables
        );
        if (typeof result === "object" && result !== null) {
          Object.assign(nodeVariables, result);
        }
      } catch (err) {
        console.error("Simulation script error:", err);
      }
    }

    // 2. Find outgoing edges
    const outgoingEdges = edges.filter(e => e.source === currentNode.id);

    if (outgoingEdges.length === 0) {
      // End of process
      set(state => ({
        simulation: {
          ...state.simulation,
          currentNodeId: null,
          variables: nodeVariables,
        },
      }));
      return;
    }

    // 3. Choose path
    let nextNodeId: string | null = null;

    // If gateway, evaluate conditions
    if (currentNode.category === "gateway") {
      for (const edge of outgoingEdges) {
        const condition = edge.properties?.condition || edge.condition;
        if (condition) {
          try {
            const isMet = expressionEvaluator.evaluateExpression(
              condition as string,
              nodeVariables
            );
            if (isMet) {
              nextNodeId = edge.target;
              break;
            }
          } catch (err) {
            console.error("Condition evaluation error:", err);
          }
        }
      }

      // If no condition met, look for default flow
      if (!nextNodeId) {
        const defaultEdge = outgoingEdges.find(
          e => e.properties?.isDefault || e.data?.isDefault
        );
        if (defaultEdge) nextNodeId = defaultEdge.target;
      }
    } else {
      // Simple task/event - take the first edge (usually BPMN only has 1 outgoing from tasks)
      nextNodeId = outgoingEdges[0].target;
    }

    if (nextNodeId) {
      set(state => ({
        simulation: {
          ...state.simulation,
          currentNodeId: nextNodeId,
          variables: nodeVariables,
          history: [...state.simulation.history, nextNodeId as string],
        },
      }));
    } else {
      // Stuck or end
      set(state => ({
        simulation: {
          ...state.simulation,
          currentNodeId: null,
          variables: nodeVariables,
        },
      }));
    }
  },

  setSimulationVariable: (name, value) => {
    set(state => ({
      simulation: {
        ...state.simulation,
        variables: {
          ...state.simulation.variables,
          [name]: value,
        },
      },
    }));
  },
});
