import type { StateCreator } from "zustand";
import type { WorkflowState, WorkflowActions } from "../workflowStore";
import { globalEventBus, WorkflowEventTypes } from "../../events/EventBus";

export interface SelectionSlice {
  selectedNodeId: string | null;
  selectedEdgeId: string | null;
  selectNode: (nodeId: string | null) => void;
  clearNodeSelection: () => void;
  selectEdge: (edgeId: string | null) => void;
  clearEdgeSelection: () => void;
  clearSelection: () => void;
}

export const createSelectionSlice: StateCreator<
  WorkflowState & WorkflowActions,
  [],
  [],
  SelectionSlice
> = (set) => ({
  selectedNodeId: null,
  selectedEdgeId: null,

  selectNode: (nodeId) => {
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

  selectEdge: (edgeId) => {
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
});
