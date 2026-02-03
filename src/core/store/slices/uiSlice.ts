import type { StateCreator } from "zustand";
import type { WorkflowState, WorkflowActions } from "../workflowStore";
import { globalEventBus, WorkflowEventTypes } from "../../events/EventBus";
import { DEFAULT_LAYOUT_DIRECTION } from "../../../workflow/constants/common";
import type { Viewport } from "@xyflow/react";

export interface UISlice {
  layoutDirection: "horizontal" | "vertical";
  compactView: boolean;
  panelStates: {
    toolbox: boolean;
    properties: boolean;
    validation: boolean;
  };
  isLoading: boolean;
  isSaving: boolean;
  viewport: Viewport;

  setLayoutDirection: (direction: "horizontal" | "vertical") => void;
  toggleCompactView: () => void;
  togglePanel: (panel: keyof WorkflowState["panelStates"]) => void;
  setLoading: (isLoading: boolean) => void;
  setSaving: (isSaving: boolean) => void;
  setViewport: (viewport: Viewport) => void;
}

export const createUISlice: StateCreator<
  WorkflowState & WorkflowActions,
  [],
  [],
  UISlice
> = set => ({
  layoutDirection: DEFAULT_LAYOUT_DIRECTION,
  compactView: false,
  panelStates: {
    toolbox: true,
    properties: true,
    validation: true,
  },
  isLoading: false,
  isSaving: false,
  viewport: { x: 0, y: 0, zoom: 1 },

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

  setViewport: viewport => {
    set({ viewport });
  },
});
