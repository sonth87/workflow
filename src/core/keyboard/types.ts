/**
 * Keyboard Shortcuts System Types
 * Định nghĩa các types cho hệ thống keyboard shortcuts
 */

import type { Node, Edge } from "@xyflow/react";

/**
 * Platform detection
 */
export type Platform = "mac" | "windows" | "linux";

/**
 * Modifier keys
 */
export type ModifierKey = "ctrl" | "cmd" | "alt" | "shift" | "meta";

/**
 * Keyboard shortcut category
 */
export type ShortcutCategory =
  | "editing"
  | "navigation"
  | "view"
  | "selection"
  | "history"
  | "mode"
  | "custom";

/**
 * Context passed to shortcut handlers
 */
export interface ShortcutContext {
  nodes: Node[];
  edges: Edge[];
  selectedNodes: Node[];
  selectedEdges: Edge[];
  reactFlowInstance?: any;
  event: KeyboardEvent;
}

/**
 * Shortcut handler function
 */
export type ShortcutHandler = (context: ShortcutContext) => void | boolean;

/**
 * Key combination definition
 */
export interface KeyCombination {
  key: string;
  ctrl?: boolean;
  cmd?: boolean;
  alt?: boolean;
  shift?: boolean;
  meta?: boolean;
}

/**
 * Keyboard shortcut definition
 */
export interface KeyboardShortcut {
  id: string;
  keys: string | string[] | KeyCombination[];
  description: string;
  category: ShortcutCategory;
  handler: ShortcutHandler;
  enabled?: boolean;
  preventDefault?: boolean;
  stopPropagation?: boolean;
  allowInInput?: boolean; // Allow shortcut to work when input/textarea is focused
}

/**
 * Shortcut registration options
 */
export interface ShortcutOptions {
  enabled?: boolean;
  preventDefault?: boolean;
  stopPropagation?: boolean;
  allowInInput?: boolean;
}

/**
 * Keyboard shortcuts registry interface
 */
export interface IKeyboardShortcutsRegistry {
  register(shortcut: KeyboardShortcut): void;
  unregister(id: string): void;
  get(id: string): KeyboardShortcut | undefined;
  getAll(): KeyboardShortcut[];
  getByCategory(category: ShortcutCategory): KeyboardShortcut[];
  enable(id: string): void;
  disable(id: string): void;
  clear(): void;
  findShortcut(event: KeyboardEvent): KeyboardShortcut | undefined;
}
