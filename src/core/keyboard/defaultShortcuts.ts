/**
 * Default Keyboard Shortcuts
 * Định nghĩa các phím tắt mặc định của ứng dụng
 */

import type { KeyboardShortcut, ShortcutContext } from "./types";

/**
 * Default keyboard shortcuts configuration
 */
export const defaultShortcuts: KeyboardShortcut[] = [
  // ==================== EDITING ====================
  {
    id: "delete-selection",
    keys: ["Delete", "Backspace"],
    description: "Delete selected nodes and edges",
    category: "editing",
    handler: (context: ShortcutContext) => {
      const { selectedNodes, selectedEdges } = context;

      // Get IDs to delete
      const nodeIdsToDelete = selectedNodes
        .filter(node => node.data?.deletable !== false)
        .map(node => node.id);

      const edgeIdsToDelete = selectedEdges
        .filter(edge => edge.data?.deletable !== false)
        .map(edge => edge.id);

      // Trigger deletion through store
      if (nodeIdsToDelete.length > 0 || edgeIdsToDelete.length > 0) {
        // This will be handled by the hook
        return true;
      }

      return false;
    },
  },

  // ==================== HISTORY ====================
  {
    id: "undo",
    keys: ["Cmd+Z", "Ctrl+Z"],
    description: "Undo last action",
    category: "history",
    handler: () => {
      console.log("🔄 Undo action");
      // TODO: Implement undo functionality
      return true;
    },
  },
  {
    id: "redo",
    keys: ["Cmd+Y", "Ctrl+Y", "Cmd+Shift+Z", "Ctrl+Shift+Z"],
    description: "Redo last undone action",
    category: "history",
    handler: () => {
      console.log("🔄 Redo action");
      // TODO: Implement redo functionality
      return true;
    },
  },

  // ==================== VIEW - ZOOM ====================
  {
    id: "zoom-in",
    keys: ["Cmd+=", "Ctrl+=", "Cmd++", "Ctrl++"],
    description: "Zoom in",
    category: "view",
    handler: (context: ShortcutContext) => {
      const { reactFlowInstance } = context;
      if (reactFlowInstance) {
        reactFlowInstance.zoomIn({ duration: 200 });
      }
      return true;
    },
  },
  {
    id: "zoom-out",
    keys: ["Cmd+-", "Ctrl+-"],
    description: "Zoom out",
    category: "view",
    handler: (context: ShortcutContext) => {
      const { reactFlowInstance } = context;
      if (reactFlowInstance) {
        reactFlowInstance.zoomOut({ duration: 200 });
      }
      return true;
    },
  },
  {
    id: "zoom-reset",
    keys: ["Cmd+0", "Ctrl+0"],
    description: "Reset zoom to 100%",
    category: "view",
    handler: (context: ShortcutContext) => {
      const { reactFlowInstance } = context;
      if (reactFlowInstance) {
        reactFlowInstance.setViewport(
          { x: 0, y: 0, zoom: 1 },
          { duration: 200 }
        );
      }
      return true;
    },
  },
  {
    id: "fit-view",
    keys: ["f", "F"],
    description: "Fit view to show all nodes",
    category: "view",
    handler: (context: ShortcutContext) => {
      const { reactFlowInstance } = context;
      if (reactFlowInstance) {
        reactFlowInstance.fitView({ padding: 0.2, duration: 200 });
      }
      return true;
    },
  },
  {
    id: "center-view",
    keys: ["Cmd+r", "Ctrl+r"],
    description: "Reset view and center canvas",
    category: "view",
    handler: (context: ShortcutContext) => {
      const { reactFlowInstance } = context;
      if (reactFlowInstance) {
        reactFlowInstance.fitView({ padding: 0.2, duration: 200 });
      }
      return true;
    },
  },

  // ==================== SELECTION ====================
  {
    id: "select-all",
    keys: ["Cmd+a", "Ctrl+a"],
    description: "Select all nodes",
    category: "selection",
    handler: () => {
      console.log("📦 Select all nodes");
      // This will be handled by the hook
      return true;
    },
  },
  {
    id: "deselect-all",
    keys: ["Escape"],
    description: "Clear selection",
    category: "selection",
    handler: () => {
      console.log("❌ Clear selection");
      // This will be handled by the hook
      return true;
    },
  },

  // ==================== MODE ====================
  {
    id: "select-mode",
    keys: ["v", "V"],
    description: "Switch to select mode",
    category: "mode",
    handler: () => {
      console.log("👆 Select mode activated");
      // TODO: Implement mode switching
      return true;
    },
  },
  {
    id: "pan-mode",
    keys: ["h", "H"],
    description: "Switch to pan mode",
    category: "mode",
    handler: () => {
      console.log("✋ Pan mode activated");
      // TODO: Implement mode switching
      return true;
    },
  },

  // ==================== NAVIGATION ====================
  {
    id: "fullscreen",
    keys: ["F11"],
    description: "Toggle fullscreen mode",
    category: "navigation",
    preventDefault: false, // Let browser handle F11
    handler: () => {
      // Browser will handle this
      return false;
    },
  },

  // ==================== UTILITY ====================
  {
    id: "copy",
    keys: ["Cmd+c", "Ctrl+c"],
    description: "Copy selected nodes",
    category: "editing",
    handler: (context: ShortcutContext) => {
      const { selectedNodes } = context;
      if (selectedNodes.length > 0) {
        console.log("📋 Copy nodes:", selectedNodes.length);
        return true;
      }
      return false;
    },
  },
  {
    id: "paste",
    keys: ["Cmd+v", "Ctrl+v"],
    description: "Paste copied nodes",
    category: "editing",
    handler: () => {
      console.log("📋 Paste nodes");
      return true;
    },
  },
  {
    id: "cut",
    keys: ["Cmd+x", "Ctrl+x"],
    description: "Cut selected nodes",
    category: "editing",
    handler: (context: ShortcutContext) => {
      const { selectedNodes } = context;
      if (selectedNodes.length > 0) {
        console.log("✂️ Cut nodes:", selectedNodes.length);
        return true;
      }
      return false;
    },
  },
  {
    id: "duplicate",
    keys: ["Cmd+d", "Ctrl+d"],
    description: "Duplicate selected nodes",
    category: "editing",
    handler: (context: ShortcutContext) => {
      const { selectedNodes } = context;
      if (selectedNodes.length > 0) {
        console.log("📑 Duplicate nodes:", selectedNodes.length);
        return true;
      }
      return false;
    },
  },
];
