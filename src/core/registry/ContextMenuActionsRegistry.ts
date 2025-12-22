/**
 * Context Menu Actions Registry
 * Stores global actions that can be used by context menus
 */

interface ContextMenuActions {
  // Node actions
  changeNodeColor?: (nodeId: string, paletteId: string) => void;
  changeNodeBorderStyle?: (nodeId: string, borderStyle: string) => void;
  deleteNode?: (nodeId: string) => void;
  duplicateNode?: (nodeId: string) => void;
  toggleNodeCollapse?: (nodeId: string, collapsed: boolean) => void;
  selectNode?: (nodeId: string) => void;

  // Edge actions
  changeEdgeColor?: (edgeId: string, paletteId: string) => void;
  changePathType?: (edgeId: string, pathType: string) => void;
  changeEdgePathStyle?: (edgeId: string, pathStyle: string) => void;
  changeEdgeAnimation?: (edgeId: string, animated: boolean) => void;
  addEdgeLabel?: (edgeId: string, position: "start" | "center" | "end") => void;
  deleteEdge?: (edgeId: string) => void;
  selectEdge?: (edgeId: string) => void;

  // Extensible for custom actions
  [key: string]: any;
}

class ContextMenuActionsRegistry {
  private actions: ContextMenuActions = {};

  /**
   * Register actions
   */
  registerActions(actions: Partial<ContextMenuActions>) {
    this.actions = { ...this.actions, ...actions };
  }

  /**
   * Get all actions
   */
  getActions(): ContextMenuActions {
    return this.actions;
  }

  /**
   * Get specific action
   */
  getAction(actionName: string): any {
    return this.actions[actionName];
  }

  /**
   * Clear all actions
   */
  clearActions() {
    this.actions = {};
  }
}

export const contextMenuActionsRegistry = new ContextMenuActionsRegistry();
