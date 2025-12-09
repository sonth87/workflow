/**
 * Workflow Store using Zustand
 * Central state management cho toàn bộ workflow
 */

import { create } from "zustand";
import type { Node, Edge, Viewport } from "@xyflow/react";
import type { BaseNodeConfig, BaseEdgeConfig } from "../types/base.types";
import type { ValidationError } from "../validation/ValidationEngine";
import { globalEventBus, WorkflowEventTypes } from "../events/EventBus";

export interface WorkflowState {
  // Workflow metadata
  workflowId: string | null;
  workflowName: string;
  workflowDescription: string;

  // Nodes and edges
  nodes: BaseNodeConfig[];
  edges: BaseEdgeConfig[];

  // Selection
  selectedNodeIds: string[];
  selectedEdgeIds: string[];

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
  selectNode: (nodeId: string) => void;
  selectNodes: (nodeIds: string[]) => void;
  deselectNode: (nodeId: string) => void;
  clearNodeSelection: () => void;
  selectEdge: (edgeId: string) => void;
  selectEdges: (edgeIds: string[]) => void;
  deselectEdge: (edgeId: string) => void;
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
  selectedNodeIds: [],
  selectedEdgeIds: [],
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
      get().saveToHistory();
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
        edges: state.edges.map(edge =>
          edge.id === edgeId ? { ...edge, ...updates } : edge
        ),
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
      get().saveToHistory();
      set({ edges });
    },

    // Selection actions
    selectNode: nodeId => {
      set(state => ({
        selectedNodeIds: [...state.selectedNodeIds, nodeId],
        selectedEdgeIds: [],
      }));
      globalEventBus.emit(WorkflowEventTypes.NODE_SELECTED, { nodeId });
    },

    selectNodes: nodeIds => {
      set({ selectedNodeIds: nodeIds, selectedEdgeIds: [] });
    },

    deselectNode: nodeId => {
      set(state => ({
        selectedNodeIds: state.selectedNodeIds.filter(id => id !== nodeId),
      }));
      globalEventBus.emit(WorkflowEventTypes.NODE_DESELECTED, { nodeId });
    },

    clearNodeSelection: () => {
      set({ selectedNodeIds: [] });
    },

    selectEdge: edgeId => {
      set(state => ({
        selectedEdgeIds: [...state.selectedEdgeIds, edgeId],
        selectedNodeIds: [],
      }));
      globalEventBus.emit(WorkflowEventTypes.EDGE_SELECTED, { edgeId });
    },

    selectEdges: edgeIds => {
      set({ selectedEdgeIds: edgeIds, selectedNodeIds: [] });
    },

    deselectEdge: edgeId => {
      set(state => ({
        selectedEdgeIds: state.selectedEdgeIds.filter(id => id !== edgeId),
      }));
      globalEventBus.emit(WorkflowEventTypes.EDGE_DESELECTED, { edgeId });
    },

    clearEdgeSelection: () => {
      set({ selectedEdgeIds: [] });
    },

    clearSelection: () => {
      set({ selectedNodeIds: [], selectedEdgeIds: [] });
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
