/**
 * Event Bus System
 * Hệ thống event bus cho phép các components giao tiếp với nhau
 */

import type {
  EventListener,
  WorkflowEvent,
  EventSubscription,
} from "../types/base.types";

export class EventBus {
  private listeners: Map<string, Set<EventListener>> = new Map();

  /**
   * Subscribe to an event
   */
  on<T = unknown>(
    eventType: string,
    listener: EventListener<T>
  ): EventSubscription {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, new Set());
    }

    this.listeners.get(eventType)!.add(listener as EventListener);

    return {
      unsubscribe: () => this.off(eventType, listener),
    };
  }

  /**
   * Subscribe to an event once
   */
  once<T = unknown>(
    eventType: string,
    listener: EventListener<T>
  ): EventSubscription {
    const onceListener: EventListener = event => {
      listener(event as WorkflowEvent<T>);
      this.off(eventType, onceListener);
    };

    return this.on(eventType, onceListener);
  }

  /**
   * Unsubscribe from an event
   */
  off<T = unknown>(eventType: string, listener: EventListener<T>): void {
    const listeners = this.listeners.get(eventType);
    if (listeners) {
      listeners.delete(listener as EventListener);
      if (listeners.size === 0) {
        this.listeners.delete(eventType);
      }
    }
  }

  /**
   * Emit an event
   */
  emit<T = unknown>(eventType: string, payload: T, source?: string): void {
    const event: WorkflowEvent<T> = {
      type: eventType,
      timestamp: new Date(),
      payload,
      source,
    };

    const listeners = this.listeners.get(eventType);
    if (listeners) {
      listeners.forEach(listener => {
        try {
          listener(event);
        } catch (error) {
          console.error(`Error in event listener for ${eventType}:`, error);
        }
      });
    }
  }

  /**
   * Clear all listeners for a specific event type or all events
   */
  clear(eventType?: string): void {
    if (eventType) {
      this.listeners.delete(eventType);
    } else {
      this.listeners.clear();
    }
  }

  /**
   * Get number of listeners for an event
   */
  listenerCount(eventType: string): number {
    return this.listeners.get(eventType)?.size || 0;
  }

  /**
   * Get all event types
   */
  getEventTypes(): string[] {
    return Array.from(this.listeners.keys());
  }
}

// Global event bus instance
export const globalEventBus = new EventBus();

// Event types constants
export const WorkflowEventTypes = {
  // Node events
  NODE_ADDED: "node:added",
  NODE_UPDATED: "node:updated",
  NODE_DELETED: "node:deleted",
  NODE_SELECTED: "node:selected",
  NODE_DESELECTED: "node:deselected",
  NODE_COLLAPSED: "node:collapsed",
  NODE_EXPANDED: "node:expanded",

  // Edge events
  EDGE_ADDED: "edge:added",
  EDGE_UPDATED: "edge:updated",
  EDGE_DELETED: "edge:deleted",
  EDGE_SELECTED: "edge:selected",
  EDGE_DESELECTED: "edge:deselected",

  // Workflow events
  WORKFLOW_LOADED: "workflow:loaded",
  WORKFLOW_SAVED: "workflow:saved",
  WORKFLOW_VALIDATED: "workflow:validated",
  WORKFLOW_EXECUTED: "workflow:executed",
  WORKFLOW_CLEARED: "workflow:cleared",

  // Validation events
  VALIDATION_ERROR: "validation:error",
  VALIDATION_WARNING: "validation:warning",
  VALIDATION_SUCCESS: "validation:success",

  // Layout events
  LAYOUT_CHANGED: "layout:changed",
  ZOOM_CHANGED: "zoom:changed",

  // Registry events
  REGISTRY_ITEM_REGISTERED: "registry:item:registered",
  REGISTRY_ITEM_UNREGISTERED: "registry:item:unregistered",

  // Plugin events
  PLUGIN_LOADED: "plugin:loaded",
  PLUGIN_UNLOADED: "plugin:unloaded",
} as const;

export type WorkflowEventType =
  (typeof WorkflowEventTypes)[keyof typeof WorkflowEventTypes];
