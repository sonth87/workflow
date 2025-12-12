/**
 * Workflow Store using Zustand
 * Central state management cho toàn bộ workflow
 */

import type { Viewport } from "@xyflow/react";
import { create } from "zustand";
import { globalEventBus, WorkflowEventTypes } from "../events/EventBus";
import type { BaseEdgeConfig, BaseNodeConfig } from "../types/base.types";
import type { ValidationError } from "../validation/ValidationEngine";

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
  panelStates: {
    toolbox: boolean;
    properties: boolean;
    validation: boolean;
  };

  // Loading states
  isLoading: boolean;
  isSaving: boolean;
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
  togglePanel: (panel: keyof WorkflowState["panelStates"]) => void;
  setLoading: (isLoading: boolean) => void;
  setSaving: (isSaving: boolean) => void;
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
  layoutDirection: "vertical",
  panelStates: {
    toolbox: true,
    properties: true,
    validation: true,
  },
  isLoading: false,
  isSaving: false,
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
      set(state => ({ nodes: [...state.nodes, node] }));
      globalEventBus.emit(WorkflowEventTypes.NODE_ADDED, { node });
    },

    updateNode: (nodeId, updates) => {
      get().saveToHistory();
      set(state => ({
        nodes: state.nodes.map(node =>
          node.id === nodeId ? { ...node, ...updates } : node
        ),
      }));
      globalEventBus.emit(WorkflowEventTypes.NODE_UPDATED, { nodeId, updates });
    },

    deleteNode: nodeId => {
      get().saveToHistory();
      set(state => ({
        nodes: state.nodes.filter(node => node.id !== nodeId),
        edges: state.edges.filter(
          edge => edge.source !== nodeId && edge.target !== nodeId
        ),
      }));
      globalEventBus.emit(WorkflowEventTypes.NODE_DELETED, { nodeId });
    },

    setNodes: nodes => {
      set({ nodes });
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
  })
);
