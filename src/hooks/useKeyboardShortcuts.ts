/**
 * useKeyboardShortcuts Hook
 * React hook để sử dụng keyboard shortcuts trong components
 */

import { useEffect, useCallback } from "react";
import { useReactFlow, type Node, type Edge } from "@xyflow/react";
import { keyboardRegistry } from "@/core/keyboard/KeyboardShortcutsRegistry";
import { defaultShortcuts } from "@/core/keyboard/defaultShortcuts";
import type { ShortcutContext } from "@/core/keyboard/types";

/**
 * Context for keyboard shortcut handlers
 */
export interface KeyboardShortcutHandlers {
  onDeleteSelection?: (nodeIds: string[], edgeIds: string[]) => void;
  onSelectAll?: () => void;
  onClearSelection?: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
  onCopy?: (nodes: Node[]) => void;
  onPaste?: () => void;
  onCut?: (nodes: Node[]) => void;
  onDuplicate?: (nodes: Node[]) => void;
}

/**
 * Options for keyboard shortcuts
 */
export interface UseKeyboardShortcutsOptions {
  enabled?: boolean;
  handlers?: KeyboardShortcutHandlers;
  customShortcuts?: any[];
}

/**
 * Hook to manage keyboard shortcuts
 */
export function useKeyboardShortcuts(
  nodes: Node[],
  edges: Edge[],
  options: UseKeyboardShortcutsOptions = {}
) {
  const { enabled = true, handlers = {}, customShortcuts = [] } = options;
  const reactFlowInstance = useReactFlow();

  // Register default shortcuts on mount
  useEffect(() => {
    // Clear existing shortcuts
    keyboardRegistry.clear();

    // Register default shortcuts
    defaultShortcuts.forEach(shortcut => {
      keyboardRegistry.register(shortcut);
    });

    // Register custom shortcuts
    customShortcuts.forEach(shortcut => {
      keyboardRegistry.register(shortcut);
    });

    return () => {
      keyboardRegistry.clear();
    };
  }, [customShortcuts]);

  // Handle keyboard events
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!enabled) return;

      // Get selected nodes and edges
      const selectedNodes = nodes.filter(node => node.selected);
      const selectedEdges = edges.filter(edge => edge.selected);

      // Build context
      const context: ShortcutContext = {
        nodes,
        edges,
        selectedNodes,
        selectedEdges,
        reactFlowInstance,
        event,
      };

      // Find matching shortcut
      const shortcut = keyboardRegistry.findShortcut(event);
      if (!shortcut) return;

      // Handle specific shortcuts with custom handlers
      switch (shortcut.id) {
        case "delete-selection":
          if (handlers.onDeleteSelection) {
            const nodeIdsToDelete = selectedNodes
              .filter(node => node.data?.deletable !== false)
              .map(node => node.id);

            const edgeIdsToDelete = selectedEdges
              .filter(edge => edge.data?.deletable !== false)
              .map(edge => edge.id);

            if (nodeIdsToDelete.length > 0 || edgeIdsToDelete.length > 0) {
              handlers.onDeleteSelection(nodeIdsToDelete, edgeIdsToDelete);
            }
          }
          break;

        case "select-all":
          if (handlers.onSelectAll) {
            handlers.onSelectAll();
          }
          break;

        case "deselect-all":
          if (handlers.onClearSelection) {
            handlers.onClearSelection();
          }
          break;

        case "undo":
          if (handlers.onUndo) {
            handlers.onUndo();
          }
          break;

        case "redo":
          if (handlers.onRedo) {
            handlers.onRedo();
          }
          break;

        case "copy":
          if (handlers.onCopy && selectedNodes.length > 0) {
            handlers.onCopy(selectedNodes);
          }
          break;

        case "paste":
          if (handlers.onPaste) {
            handlers.onPaste();
          }
          break;

        case "cut":
          if (handlers.onCut && selectedNodes.length > 0) {
            handlers.onCut(selectedNodes);
          }
          break;

        case "duplicate":
          if (handlers.onDuplicate && selectedNodes.length > 0) {
            handlers.onDuplicate(selectedNodes);
          }
          break;

        default:
          // Execute default handler for other shortcuts
          shortcut.handler(context);
          break;
      }

      // Prevent default if specified
      if (shortcut.preventDefault) {
        event.preventDefault();
      }

      // Stop propagation if specified
      if (shortcut.stopPropagation) {
        event.stopPropagation();
      }
    },
    [enabled, nodes, edges, reactFlowInstance, handlers]
  );

  // Register event listener
  useEffect(() => {
    if (!enabled) return;

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [enabled, handleKeyDown]);

  // Return registry for advanced usage
  return {
    registry: keyboardRegistry,
    platform: keyboardRegistry.getPlatform(),
    isMac: keyboardRegistry.isMac(),
  };
}
