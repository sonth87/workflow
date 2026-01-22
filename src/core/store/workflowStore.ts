/**
 * Workflow Store using Zustand
 * Central state management cho toàn bộ workflow
 */

import type { Viewport } from "@xyflow/react";
import { create } from "zustand";
import { globalEventBus, WorkflowEventTypes } from "../events/EventBus";
import { expressionEvaluator } from "../utils/ExpressionEvaluator";
import type { BaseEdgeConfig, BaseNodeConfig } from "../types/base.types";
import type { ValidationError } from "../validation/ValidationEngine";
import { DEFAULT_LAYOUT_DIRECTION } from "../../workflow/constants/common";

export interface WorkflowState {
  // Workflow metadata
  workflowId: string | null;
  workflowName: string;
  workflowDescription: string;

  // Nodes and edges
  nodes: BaseNodeConfig[];
  edges: BaseEdgeConfig[];

  // Selection
  selectedNodeId: string | null;
  selectedEdgeId: string | null;

  // Viewport
  viewport: Viewport;

  // Validation
  validationErrors: ValidationError[];

  // History
  history: {
    past: Array<{ nodes: BaseNodeConfig[]; edges: BaseEdgeConfig[] }>;
    future: Array<{ nodes: BaseNodeConfig[]; edges: BaseEdgeConfig[] }>;
  };

  // UI state
  layoutDirection: "horizontal" | "vertical";
  compactView: boolean;
  panelStates: {
    toolbox: boolean;
    properties: boolean;
    validation: boolean;
  };

  // Loading states
  isLoading: boolean;
  isSaving: boolean;

  // Simulation state
  simulation: {
    active: boolean;
    currentNodeId: string | null;
    variables: Record<string, unknown>;
    history: string[];
  };

  // Clipboard
  clipboard: {
    nodes: BaseNodeConfig[];
    edges: BaseEdgeConfig[];
  } | null;
}

export interface WorkflowActions {
  // Workflow actions
  setWorkflowName: (name: string) => void;
  setWorkflowDescription: (description: string) => void;
  loadWorkflow: (workflow: Partial<WorkflowState>) => void;
  clearWorkflow: () => void;

  // Node actions
  addNode: (node: BaseNodeConfig) => void;
  updateNode: (nodeId: string, updates: Partial<BaseNodeConfig>) => void;
  deleteNode: (nodeId: string) => void;
  setNodes: (nodes: BaseNodeConfig[]) => void;

  // Edge actions
  addEdge: (edge: BaseEdgeConfig) => void;
  updateEdge: (edgeId: string, updates: Partial<BaseEdgeConfig>) => void;
  deleteEdge: (edgeId: string) => void;
  setEdges: (edges: BaseEdgeConfig[]) => void;

  // Selection actions
  selectNode: (nodeId: string | null) => void;
  clearNodeSelection: () => void;
  selectEdge: (edgeId: string | null) => void;
  clearEdgeSelection: () => void;
  clearSelection: () => void;

  // Viewport actions
  setViewport: (viewport: Viewport) => void;

  // Validation actions
  setValidationErrors: (errors: ValidationError[]) => void;
  clearValidationErrors: () => void;

  // History actions
  undo: () => void;
  redo: () => void;
  saveToHistory: () => void;

  // UI actions
  setLayoutDirection: (direction: "horizontal" | "vertical") => void;
  toggleCompactView: () => void;
  togglePanel: (panel: keyof WorkflowState["panelStates"]) => void;
  setLoading: (isLoading: boolean) => void;
  setSaving: (isSaving: boolean) => void;

  // Simulation actions
  startSimulation: (startNodeId?: string) => void;
  stopSimulation: () => void;
  stepSimulation: () => void;
  setSimulationVariable: (name: string, value: unknown) => void;

  // Clipboard actions
  copyNodesToClipboard: (
    nodes: BaseNodeConfig[],
    edges: BaseEdgeConfig[]
  ) => void;
  getClipboard: () => {
    nodes: BaseNodeConfig[];
    edges: BaseEdgeConfig[];
  } | null;
  clearClipboard: () => void;
}

const initialState: WorkflowState = {
  workflowId: null,
  workflowName: "Untitled Workflow",
  workflowDescription: "",
  nodes: [],
  edges: [],
  selectedNodeId: null,
  selectedEdgeId: null,
  viewport: { x: 0, y: 0, zoom: 1 },
  validationErrors: [],
  history: {
    past: [],
    future: [],
  },
  layoutDirection: DEFAULT_LAYOUT_DIRECTION,
  compactView: false,
  panelStates: {
    toolbox: true,
    properties: true,
    validation: true,
  },
  isLoading: false,
  isSaving: false,
  simulation: {
    active: false,
    currentNodeId: null,
    variables: {},
    history: [],
  },
  clipboard: null,
};

export const useWorkflowStore = create<WorkflowState & WorkflowActions>(
  (set, get) => ({
    ...initialState,

    // Workflow actions
    setWorkflowName: name => set({ workflowName: name }),

    setWorkflowDescription: description =>
      set({ workflowDescription: description }),

    loadWorkflow: workflow => {
      set({ ...workflow });
      globalEventBus.emit(WorkflowEventTypes.WORKFLOW_LOADED, workflow);
    },

    clearWorkflow: () => {
      set({ ...initialState });
      globalEventBus.emit(WorkflowEventTypes.WORKFLOW_CLEARED, {});
    },

    // Node actions
    addNode: node => {
      get().saveToHistory();
      const nodeWithZIndex =
        node.type === "note" ? { ...node, zIndex: -1 } : node;
      set(state => ({ nodes: [...state.nodes, nodeWithZIndex] }));
      globalEventBus.emit(WorkflowEventTypes.NODE_ADDED, {
        node: nodeWithZIndex,
      });
    },

    updateNode: (nodeId, updates) => {
      get().saveToHistory();
      set(state => ({
        nodes: state.nodes.map(node => {
          if (node.id === nodeId) {
            const updatedNode = { ...node, ...updates };
            if (updatedNode.type === "note") {
              updatedNode.zIndex = -1;
            }
            return updatedNode;
          }
          return node;
        }),
      }));
      globalEventBus.emit(WorkflowEventTypes.NODE_UPDATED, { nodeId, updates });
    },

    deleteNode: nodeId => {
      get().saveToHistory();
      set(state => {
        const nodeToDelete = state.nodes.find(node => node.id === nodeId);

        // If deleting a pool, also delete all child nodes
        const nodesToDelete = new Set([nodeId]);
        if (nodeToDelete?.type === "pool") {
          state.nodes.forEach(node => {
            if (node.parentId === nodeId) {
              nodesToDelete.add(node.id);
            }
          });
        }

        return {
          nodes: state.nodes.filter(node => !nodesToDelete.has(node.id)),
          edges: state.edges.filter(
            edge =>
              !nodesToDelete.has(edge.source) && !nodesToDelete.has(edge.target)
          ),
        };
      });
      globalEventBus.emit(WorkflowEventTypes.NODE_DELETED, { nodeId });
    },

    setNodes: nodes => {
      const nodesWithZIndex = nodes.map(node =>
        node.type === "note" ? { ...node, zIndex: -1 } : node
      );
      set({ nodes: nodesWithZIndex });
    },

    // Edge actions
    addEdge: edge => {
      get().saveToHistory();
      set(state => ({ edges: [...state.edges, edge] }));
      globalEventBus.emit(WorkflowEventTypes.EDGE_ADDED, { edge });
    },

    updateEdge: (edgeId, updates) => {
      get().saveToHistory();
      set(state => ({
        edges: state.edges.map(edge => {
          if (edge.id !== edgeId) return edge;

          // Deep merge data object to ensure nested properties are preserved
          const updatedEdge = {
            ...edge,
            ...updates,
            data: {
              ...edge.data,
              ...updates.data,
            },
          };

          return updatedEdge;
        }),
      }));
      globalEventBus.emit(WorkflowEventTypes.EDGE_UPDATED, { edgeId, updates });
    },

    deleteEdge: edgeId => {
      get().saveToHistory();
      set(state => ({
        edges: state.edges.filter(edge => edge.id !== edgeId),
      }));
      globalEventBus.emit(WorkflowEventTypes.EDGE_DELETED, { edgeId });
    },

    setEdges: edges => {
      set({ edges });
    },

    // Selection actions
    selectNode: nodeId => {
      set({
        selectedNodeId: nodeId,
        selectedEdgeId: null,
      });
      if (nodeId) {
        globalEventBus.emit(WorkflowEventTypes.NODE_SELECTED, { nodeId });
      }
    },

    clearNodeSelection: () => {
      set({ selectedNodeId: null });
    },

    selectEdge: edgeId => {
      set({
        selectedEdgeId: edgeId,
        selectedNodeId: null,
      });
      if (edgeId) {
        globalEventBus.emit(WorkflowEventTypes.EDGE_SELECTED, { edgeId });
      }
    },

    clearEdgeSelection: () => {
      set({ selectedEdgeId: null });
    },

    clearSelection: () => {
      set({ selectedNodeId: null, selectedEdgeId: null });
    },

    // Viewport actions
    setViewport: viewport => {
      set({ viewport });
    },

    // Validation actions
    setValidationErrors: errors => {
      set({ validationErrors: errors });
    },

    clearValidationErrors: () => {
      set({ validationErrors: [] });
    },

    // History actions
    undo: () => {
      set(state => {
        const { past, future } = state.history;
        if (past.length === 0) return state;

        const previous = past[past.length - 1];
        const newPast = past.slice(0, past.length - 1);

        return {
          ...state,
          nodes: previous.nodes,
          edges: previous.edges,
          history: {
            past: newPast,
            future: [{ nodes: state.nodes, edges: state.edges }, ...future],
          },
        };
      });
    },

    redo: () => {
      set(state => {
        const { past, future } = state.history;
        if (future.length === 0) return state;

        const next = future[0];
        const newFuture = future.slice(1);

        return {
          ...state,
          nodes: next.nodes,
          edges: next.edges,
          history: {
            past: [...past, { nodes: state.nodes, edges: state.edges }],
            future: newFuture,
          },
        };
      });
    },

    saveToHistory: () => {
      set(state => ({
        history: {
          past: [
            ...state.history.past,
            { nodes: state.nodes, edges: state.edges },
          ].slice(-50), // Keep last 50 states
          future: [],
        },
      }));
    },

    // UI actions
    setLayoutDirection: direction => {
      set({ layoutDirection: direction });
      globalEventBus.emit(WorkflowEventTypes.LAYOUT_CHANGED, { direction });
    },

    toggleCompactView: () => {
      set(state => ({ compactView: !state.compactView }));
    },

    togglePanel: panel => {
      set(state => ({
        panelStates: {
          ...state.panelStates,
          [panel]: !state.panelStates[panel],
        },
      }));
    },

    setLoading: isLoading => {
      set({ isLoading });
    },

    setSaving: isSaving => {
      set({ isSaving });
    },

    // Simulation actions
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
      globalEventBus.emit(WorkflowEventTypes.WORKFLOW_LOADED, { simulation: true });
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
          }
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
          const defaultEdge = outgoingEdges.find(e => e.properties?.isDefault || e.data?.isDefault);
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
          }
        }));
      } else {
        // Stuck or end
        set(state => ({
          simulation: {
            ...state.simulation,
            currentNodeId: null,
            variables: nodeVariables,
          }
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
          }
        }
      }));
    },

    // Clipboard actions
    copyNodesToClipboard: (nodes, edges) => {
      set({ clipboard: { nodes, edges } });
    },

    getClipboard: () => {
      return get().clipboard;
    },

    clearClipboard: () => {
      set({ clipboard: null });
    },
  })
);
