/**
 * Keyboard Shortcuts Registry
 * Quản lý tập trung các keyboard shortcuts trong ứng dụng
 */

import type {
  KeyboardShortcut,
  ShortcutCategory,
  IKeyboardShortcutsRegistry,
  Platform,
  KeyCombination,
} from "./types";

export class KeyboardShortcutsRegistry implements IKeyboardShortcutsRegistry {
  private shortcuts: Map<string, KeyboardShortcut> = new Map();
  private platform: Platform;

  constructor() {
    this.platform = this.detectPlatform();
  }

  /**
   * Detect current platform
   */
  private detectPlatform(): Platform {
    const userAgent = navigator.userAgent.toLowerCase();
    if (userAgent.includes("mac")) return "mac";
    if (userAgent.includes("win")) return "windows";
    return "linux";
  }

  /**
   * Get current platform
   */
  getPlatform(): Platform {
    return this.platform;
  }

  /**
   * Check if current platform is Mac
   */
  isMac(): boolean {
    return this.platform === "mac";
  }

  /**
   * Register a keyboard shortcut
   */
  register(shortcut: KeyboardShortcut): void {
    // Check for conflicts
    const existingShortcut = this.findConflict(shortcut);
    if (existingShortcut) {
      console.warn(
        `⚠️ Keyboard shortcut conflict detected:`,
        `"${shortcut.id}" conflicts with "${existingShortcut.id}"`
      );
    }

    // Set defaults
    const completeShortcut: KeyboardShortcut = {
      ...shortcut,
      enabled: shortcut.enabled !== false,
      preventDefault: shortcut.preventDefault !== false,
      stopPropagation: shortcut.stopPropagation ?? false,
      allowInInput: shortcut.allowInInput ?? false,
    };

    this.shortcuts.set(shortcut.id, completeShortcut);
  }

  /**
   * Unregister a keyboard shortcut
   */
  unregister(id: string): void {
    this.shortcuts.delete(id);
  }

  /**
   * Get a specific shortcut
   */
  get(id: string): KeyboardShortcut | undefined {
    return this.shortcuts.get(id);
  }

  /**
   * Get all shortcuts
   */
  getAll(): KeyboardShortcut[] {
    return Array.from(this.shortcuts.values());
  }

  /**
   * Get shortcuts by category
   */
  getByCategory(category: ShortcutCategory): KeyboardShortcut[] {
    return this.getAll().filter(s => s.category === category);
  }

  /**
   * Enable a shortcut
   */
  enable(id: string): void {
    const shortcut = this.shortcuts.get(id);
    if (shortcut) {
      shortcut.enabled = true;
    }
  }

  /**
   * Disable a shortcut
   */
  disable(id: string): void {
    const shortcut = this.shortcuts.get(id);
    if (shortcut) {
      shortcut.enabled = false;
    }
  }

  /**
   * Clear all shortcuts
   */
  clear(): void {
    this.shortcuts.clear();
  }

  /**
   * Check if element is within ReactFlow canvas
   */
  private isInReactFlowCanvas(element: HTMLElement): boolean {
    // Check if element itself or any parent has react-flow class
    let current: HTMLElement | null = element;
    while (current) {
      // Check for React Flow classes
      if (
        current.classList.contains("react-flow") ||
        current.classList.contains("react-flow__pane") ||
        current.classList.contains("react-flow__renderer") ||
        current.classList.contains("react-flow__viewport") ||
        current.hasAttribute("data-reactflow")
      ) {
        return true;
      }
      current = current.parentElement;
    }
    return false;
  }

  /**
   * Find a shortcut that matches the keyboard event
   * Prioritizes shortcuts with modifiers over simple keys
   */
  findShortcut(event: KeyboardEvent): KeyboardShortcut | undefined {
    // Skip if focus is on input/textarea (unless allowInInput is true)
    const target = event.target as HTMLElement;
    const isInput =
      target.tagName === "INPUT" ||
      target.tagName === "TEXTAREA" ||
      target.isContentEditable;

    // Only allow shortcuts when focused on ReactFlow canvas
    // This prevents shortcuts from firing when typing in properties panel or modals
    if (!this.isInReactFlowCanvas(target)) {
      return undefined;
    }

    let bestMatch: KeyboardShortcut | undefined;
    let bestMatchHasModifier = false;

    for (const shortcut of this.shortcuts.values()) {
      if (!shortcut.enabled) continue;
      if (isInput && !shortcut.allowInInput) continue;

      if (this.matchesShortcut(event, shortcut)) {
        const hasModifier = this.shortcutHasModifier(shortcut);

        // Prioritize shortcuts with modifiers over simple keys
        if (!bestMatch || (hasModifier && !bestMatchHasModifier)) {
          bestMatch = shortcut;
          bestMatchHasModifier = hasModifier;
        }
      }
    }

    return bestMatch;
  }

  /**
   * Check if a shortcut has any modifiers
   */
  private shortcutHasModifier(shortcut: KeyboardShortcut): boolean {
    const keys = Array.isArray(shortcut.keys) ? shortcut.keys : [shortcut.keys];

    for (const key of keys) {
      if (typeof key === "string") {
        if (key.includes("+")) return true;
      } else {
        if (key.ctrl || key.cmd || key.meta || key.alt || key.shift) {
          return true;
        }
      }
    }

    return false;
  }

  /**
   * Check if event matches shortcut definition
   */
  private matchesShortcut(
    event: KeyboardEvent,
    shortcut: KeyboardShortcut
  ): boolean {
    const { keys } = shortcut;

    // Handle array of keys or key combinations
    if (Array.isArray(keys)) {
      for (const key of keys) {
        if (typeof key === "string") {
          if (this.matchesSimpleKey(event, key)) return true;
        } else {
          if (this.matchesKeyCombination(event, key)) return true;
        }
      }
      return false;
    }

    // Handle single key
    if (typeof keys === "string") {
      return this.matchesSimpleKey(event, keys);
    }

    return false;
  }

  /**
   * Check if event matches a simple key (e.g., "Delete", "Escape")
   */
  private matchesSimpleKey(event: KeyboardEvent, key: string): boolean {
    // Check for modifier + key combinations (e.g., "Cmd+Z", "Ctrl+Y")
    if (key.includes("+")) {
      return this.matchesKeyCombinationString(event, key);
    }

    // Simple key match
    return event.key === key;
  }

  /**
   * Check if event matches a key combination string (e.g., "Cmd+Z")
   */
  private matchesKeyCombinationString(
    event: KeyboardEvent,
    combination: string
  ): boolean {
    const parts = combination.toLowerCase().split("+");
    const key = parts[parts.length - 1];
    const modifiers = parts.slice(0, -1);

    // Check if the main key matches (case insensitive)
    if (event.key.toLowerCase() !== key) return false;

    // Platform-specific modifier mapping
    const hasCtrl = event.ctrlKey;
    const hasCmd = event.metaKey;
    const hasAlt = event.altKey;
    const hasShift = event.shiftKey;

    // Count expected modifiers
    let expectedCtrlOrCmd = false;
    let expectedAlt = false;
    let expectedShift = false;

    // Check modifiers
    for (const modifier of modifiers) {
      switch (modifier) {
        case "ctrl":
          expectedCtrlOrCmd = true;
          // On Mac, Cmd can substitute Ctrl, on others Ctrl is required
          if (this.isMac()) {
            if (!hasCmd && !hasCtrl) return false;
          } else {
            if (!hasCtrl) return false;
          }
          break;
        case "cmd":
        case "meta":
          expectedCtrlOrCmd = true;
          // On Mac, Cmd is required, on others Ctrl can substitute
          if (this.isMac()) {
            if (!hasCmd) return false;
          } else {
            if (!hasCtrl && !hasCmd) return false;
          }
          break;
        case "alt":
          expectedAlt = true;
          if (!hasAlt) return false;
          break;
        case "shift":
          expectedShift = true;
          if (!hasShift) return false;
          break;
      }
    }

    // Check that no extra modifiers are pressed
    // Allow Ctrl/Cmd to be used interchangeably based on platform
    const hasCtrlOrCmd = hasCtrl || hasCmd;
    if (hasCtrlOrCmd && !expectedCtrlOrCmd) return false;
    if (hasAlt && !expectedAlt) return false;
    if (hasShift && !expectedShift) return false;

    return true;
  }

  /**
   * Check if event matches a key combination object
   */
  private matchesKeyCombination(
    event: KeyboardEvent,
    combination: KeyCombination
  ): boolean {
    // Check main key
    if (event.key !== combination.key) return false;

    // Check modifiers
    if (combination.ctrl && !event.ctrlKey) return false;
    if (combination.cmd && !event.metaKey) return false;
    if (combination.meta && !event.metaKey) return false;
    if (combination.alt && !event.altKey) return false;
    if (combination.shift && !event.shiftKey) return false;

    return true;
  }

  /**
   * Find if there's a conflict with existing shortcuts
   */
  private findConflict(
    shortcut: KeyboardShortcut
  ): KeyboardShortcut | undefined {
    const keys = Array.isArray(shortcut.keys) ? shortcut.keys : [shortcut.keys];

    for (const existingShortcut of this.shortcuts.values()) {
      if (existingShortcut.id === shortcut.id) continue;

      const existingKeys = Array.isArray(existingShortcut.keys)
        ? existingShortcut.keys
        : [existingShortcut.keys];

      // Check for any key overlap
      for (const key1 of keys) {
        for (const key2 of existingKeys) {
          if (this.keysEqual(key1, key2)) {
            return existingShortcut;
          }
        }
      }
    }

    return undefined;
  }

  /**
   * Check if two key definitions are equal
   */
  private keysEqual(
    key1: string | KeyCombination,
    key2: string | KeyCombination
  ): boolean {
    if (typeof key1 === "string" && typeof key2 === "string") {
      return key1.toLowerCase() === key2.toLowerCase();
    }

    if (typeof key1 === "object" && typeof key2 === "object") {
      return (
        key1.key === key2.key &&
        key1.ctrl === key2.ctrl &&
        key1.cmd === key2.cmd &&
        key1.alt === key2.alt &&
        key1.shift === key2.shift &&
        key1.meta === key2.meta
      );
    }

    return false;
  }

  /**
   * Get human-readable shortcut string
   */
  getShortcutString(shortcut: KeyboardShortcut): string {
    const keys = Array.isArray(shortcut.keys) ? shortcut.keys : [shortcut.keys];
    return keys
      .map(key => {
        if (typeof key === "string") {
          // Replace Cmd with ⌘ on Mac, Ctrl on others
          if (key.includes("Cmd") || key.includes("cmd")) {
            return this.isMac()
              ? key.replace(/Cmd|cmd/gi, "⌘")
              : key.replace(/Cmd|cmd/gi, "Ctrl");
          }
          return key;
        }
        return key.key;
      })
      .join(" or ");
  }
}

// Global singleton instance
export const keyboardRegistry = new KeyboardShortcutsRegistry();
