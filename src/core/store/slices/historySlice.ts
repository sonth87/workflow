import type { StateCreator } from "zustand";
import type { WorkflowState, WorkflowActions } from "../workflowStore";
import type { BaseNodeConfig, BaseEdgeConfig } from "../../types/base.types";

export interface HistorySlice {
  history: {
    past: Array<{ nodes: BaseNodeConfig[]; edges: BaseEdgeConfig[] }>;
    future: Array<{ nodes: BaseNodeConfig[]; edges: BaseEdgeConfig[] }>;
  };
  undo: () => void;
  redo: () => void;
  saveToHistory: () => void;
}

export const createHistorySlice: StateCreator<
  WorkflowState & WorkflowActions,
  [],
  [],
  HistorySlice
> = set => ({
  history: {
    past: [],
    future: [],
  },

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
});
