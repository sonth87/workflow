/**
 * Workflow Store using Zustand
 * Central state management cho toàn bộ workflow
 */

import { create } from "zustand";
import { globalEventBus, WorkflowEventTypes } from "../events/EventBus";
import type { BaseEdgeConfig, BaseNodeConfig } from "../types/base.types";
import type { ValidationError } from "../validation/ValidationEngine";

// Import Slices
import {
  createSelectionSlice,
  type SelectionSlice,
} from "./slices/selectionSlice";
import {
  createSimulationSlice,
  type SimulationSlice,
} from "./slices/simulationSlice";
import { createHistorySlice, type HistorySlice } from "./slices/historySlice";
import { createUISlice, type UISlice } from "./slices/uiSlice";

export interface WorkflowState
  extends SelectionSlice, SimulationSlice, HistorySlice, UISlice {
  // Workflow metadata
  workflowId: string | null;
  workflowName: string;
  workflowDescription: string;

  // Nodes and edges
  nodes: BaseNodeConfig[];
  edges: BaseEdgeConfig[];

  // Validation
  validationErrors: ValidationError[];

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

  // Validation actions
  setValidationErrors: (errors: ValidationError[]) => void;
  clearValidationErrors: () => void;

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

export const useWorkflowStore = create<WorkflowState & WorkflowActions>(
  (set, get, api) => ({
    // Initialize Slices
    ...createSelectionSlice(set, get, api),
    ...createSimulationSlice(set, get, api),
    ...createHistorySlice(set, get, api),
    ...createUISlice(set, get, api),

    // Core Workflow State
    workflowId: null,
    workflowName: "Untitled Workflow",
    workflowDescription: "",
    nodes: [],
    edges: [],
    validationErrors: [],
    clipboard: null,

    // Workflow actions
    setWorkflowName: name => set({ workflowName: name }),

    setWorkflowDescription: description =>
      set({ workflowDescription: description }),

    loadWorkflow: workflow => {
      set({ ...workflow });
      globalEventBus.emit(WorkflowEventTypes.WORKFLOW_LOADED, workflow);
    },

    clearWorkflow: () => {
      // Clear core state
      set({
        workflowId: null,
        workflowName: "Untitled Workflow",
        workflowDescription: "",
        nodes: [],
        edges: [],
        validationErrors: [],
        clipboard: null,
      });
      // Reset slices
      get().clearSelection();
      get().stopSimulation();
      get().clearValidationErrors();
      // Reset history is tricky, we might want to keep it or clear it.
      // Usually clearWorkflow implies starting fresh.
      set({ history: { past: [], future: [] } });

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
            const updatedNode = {
              ...node,
              ...updates,
              data: updates.data
                ? { ...node.data, ...updates.data }
                : node.data,
              properties: updates.properties
                ? { ...node.properties, ...updates.properties }
                : node.properties,
            };
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

          // Deep merge data and properties to ensure nested properties are preserved
          const updatedEdge = {
            ...edge,
            ...updates,
            data: updates.data ? { ...edge.data, ...updates.data } : edge.data,
            properties: updates.properties
              ? { ...edge.properties, ...updates.properties }
              : edge.properties,
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

    // Validation actions
    setValidationErrors: errors => {
      set({ validationErrors: errors });
    },

    clearValidationErrors: () => {
      set({ validationErrors: [] });
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
