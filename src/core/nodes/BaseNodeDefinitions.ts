/**
 * Base Node Definitions
 * Định nghĩa 8 base node types với cấu hình mặc định
 * Các custom nodes sẽ kế thừa từ các base nodes này
 */

import type { NodeVisualConfig } from "../types/base.types";
import { CategoryType } from "@/enum/workflow.enum";

/**
 * Base node type identifiers
 */
export enum BaseNodeType {
  START = "start",
  END = "end",
  TASK = "task",
  GATEWAY = "gateway",
  EVENT = "event",
  ANNOTATION = "annotation",
  POOL = "pool",
  NOTE = "note",
}

/**
 * Default visual configurations for base nodes
 */
const baseVisualConfigs: Record<BaseNodeType, NodeVisualConfig> = {
  [BaseNodeType.START]: {
    // backgroundColor: "#f0fdf4",
    // borderColor: "#22c55e",
    // borderStyle: "solid",
    // borderWidth: 2,
    // ringColor: "rgba(34, 197, 94, 0.25)",
    // textColor: "#14532d",
    // descriptionColor: "#16a34a",
    // iconBackgroundColor: "#dcfce7",
    // iconColor: "#16a34a",
  },
  [BaseNodeType.END]: {
    // backgroundColor: "#fef2f2",
    // borderColor: "#ef4444",
    // borderStyle: "solid",
    // borderWidth: 2,
    // ringColor: "rgba(239, 68, 68, 0.25)",
    // textColor: "#7f1d1d",
    // descriptionColor: "#dc2626",
    // iconBackgroundColor: "#fee2e2",
    // iconColor: "#dc2626",
  },
  [BaseNodeType.TASK]: {
    // backgroundColor: "#eff6ff",
    // borderColor: "#3b82f6",
    // borderStyle: "solid",
    // borderWidth: 2,
    // ringColor: "rgba(59, 130, 246, 0.25)",
    // textColor: "#1e3a8a",
    // descriptionColor: "#2563eb",
    // iconBackgroundColor: "#dbeafe",
    // iconColor: "#2563eb",
  },
  [BaseNodeType.GATEWAY]: {
    // backgroundColor: "#fef3c7",
    // borderColor: "#f59e0b",
    // borderStyle: "solid",
    // borderWidth: 2,
    // ringColor: "rgba(245, 158, 11, 0.25)",
    // textColor: "#78350f",
    // descriptionColor: "#d97706",
    // iconBackgroundColor: "#fef3c7",
    // iconColor: "#d97706",
  },
  [BaseNodeType.EVENT]: {
    // backgroundColor: "#faf5ff",
    // borderColor: "#a855f7",
    // borderStyle: "solid",
    // borderWidth: 2,
    // ringColor: "rgba(168, 85, 247, 0.25)",
    // textColor: "#581c87",
    // descriptionColor: "#9333ea",
    // iconBackgroundColor: "#f3e8ff",
    // iconColor: "#9333ea",
  },
  [BaseNodeType.ANNOTATION]: {
    // backgroundColor: "#ffffff",
    // borderColor: "#9ca3af",
    // borderStyle: "dashed",
    // borderWidth: 1,
    // ringColor: "rgba(156, 163, 175, 0.15)",
    // textColor: "#374151",
    // descriptionColor: "#6b7280",
    // iconBackgroundColor: "#f3f4f6",
    // iconColor: "#6b7280",
  },
  [BaseNodeType.POOL]: {
    // backgroundColor: "#f8fafc",
    // borderColor: "#64748b",
    // borderStyle: "solid",
    // borderWidth: 2,
    // ringColor: "rgba(100, 116, 139, 0.15)",
    // textColor: "#1e293b",
    // descriptionColor: "#475569",
    // iconBackgroundColor: "#e2e8f0",
    // iconColor: "#475569",
  },
  [BaseNodeType.NOTE]: {
    // backgroundColor: "#fffbeb",
    // borderColor: "#fbbf24",
    // borderStyle: "solid",
    // borderWidth: 1,
    // ringColor: "rgba(251, 191, 36, 0.15)",
    // textColor: "#78350f",
    // descriptionColor: "#d97706",
    // iconBackgroundColor: "#fef3c7",
    // iconColor: "#d97706",
  },
};

/**
 * Base node definition interface
 */
export interface BaseNodeDefinition {
  type: BaseNodeType;
  category: CategoryType;
  defaultProperties: Record<string, unknown>;
  visualConfig: NodeVisualConfig;
  connectionRules: {
    maxInputConnections?: number;
    maxOutputConnections?: number;
    allowedSources?: string[];
    allowedTargets?: string[];
  };
  propertyDefinitions: Array<{
    id: string;
    name: string;
    label: string;
    type: string;
    required?: boolean;
    defaultValue?: unknown;
    group?: string;
    order?: number;
  }>;
  contextMenuItems?: Array<{
    id: string;
    label: string;
    icon?: string;
    action?: string;
  }>;
}

/**
 * Base node definitions
 */
export const baseNodeDefinitions: Record<BaseNodeType, BaseNodeDefinition> = {
  [BaseNodeType.START]: {
    type: BaseNodeType.START,
    category: CategoryType.START,
    defaultProperties: {
      label: "Start",
      description: "Start event",
    },
    visualConfig: baseVisualConfigs[BaseNodeType.START],
    connectionRules: {
      maxInputConnections: 0,
      maxOutputConnections: 1,
    },
    propertyDefinitions: [
      {
        id: "label",
        name: "label",
        label: "Label",
        type: "text",
        required: true,
        defaultValue: "Start",
        group: "basic",
        order: 1,
      },
      {
        id: "description",
        name: "description",
        label: "Description",
        type: "textarea",
        required: false,
        defaultValue: "",
        group: "basic",
        order: 2,
      },
    ],
  },

  [BaseNodeType.END]: {
    type: BaseNodeType.END,
    category: CategoryType.END,
    defaultProperties: {
      label: "End",
      description: "End event",
    },
    visualConfig: baseVisualConfigs[BaseNodeType.END],
    connectionRules: {
      maxInputConnections: -1, // unlimited
      maxOutputConnections: 0,
    },
    propertyDefinitions: [
      {
        id: "label",
        name: "label",
        label: "Label",
        type: "text",
        required: true,
        defaultValue: "End",
        group: "basic",
        order: 1,
      },
      {
        id: "description",
        name: "description",
        label: "Description",
        type: "textarea",
        required: false,
        defaultValue: "",
        group: "basic",
        order: 2,
      },
    ],
  },

  [BaseNodeType.TASK]: {
    type: BaseNodeType.TASK,
    category: CategoryType.TASK,
    defaultProperties: {
      label: "Task",
      description: "Generic task",
      assignee: "",
      priority: "medium",
    },
    visualConfig: baseVisualConfigs[BaseNodeType.TASK],
    connectionRules: {
      maxInputConnections: -1,
      maxOutputConnections: -1,
    },
    propertyDefinitions: [
      {
        id: "label",
        name: "label",
        label: "Label",
        type: "text",
        required: true,
        defaultValue: "Task",
        group: "basic",
        order: 1,
      },
      {
        id: "description",
        name: "description",
        label: "Description",
        type: "textarea",
        required: false,
        defaultValue: "",
        group: "basic",
        order: 2,
      },
      {
        id: "assignee",
        name: "assignee",
        label: "Assignee",
        type: "text",
        required: false,
        defaultValue: "",
        group: "config",
        order: 3,
      },
      {
        id: "priority",
        name: "priority",
        label: "Priority",
        type: "select",
        required: false,
        defaultValue: "medium",
        group: "config",
        order: 4,
      },
    ],
  },

  [BaseNodeType.GATEWAY]: {
    type: BaseNodeType.GATEWAY,
    category: CategoryType.GATEWAY,
    defaultProperties: {
      label: "Gateway",
      description: "Decision gateway",
      gatewayType: "exclusive",
    },
    visualConfig: baseVisualConfigs[BaseNodeType.GATEWAY],
    connectionRules: {
      maxInputConnections: -1,
      maxOutputConnections: -1,
    },
    propertyDefinitions: [
      {
        id: "label",
        name: "label",
        label: "Label",
        type: "text",
        required: true,
        defaultValue: "Gateway",
        group: "basic",
        order: 1,
      },
      {
        id: "description",
        name: "description",
        label: "Description",
        type: "textarea",
        required: false,
        defaultValue: "",
        group: "basic",
        order: 2,
      },
      {
        id: "gatewayType",
        name: "gatewayType",
        label: "Gateway Type",
        type: "select",
        required: true,
        defaultValue: "exclusive",
        group: "config",
        order: 3,
      },
    ],
  },

  [BaseNodeType.EVENT]: {
    type: BaseNodeType.EVENT,
    category: CategoryType.OTHER,
    defaultProperties: {
      label: "Event",
      description: "Intermediate event",
      eventType: "message",
    },
    visualConfig: baseVisualConfigs[BaseNodeType.EVENT],
    connectionRules: {
      maxInputConnections: -1,
      maxOutputConnections: -1,
    },
    propertyDefinitions: [
      {
        id: "label",
        name: "label",
        label: "Label",
        type: "text",
        required: true,
        defaultValue: "Event",
        group: "basic",
        order: 1,
      },
      {
        id: "description",
        name: "description",
        label: "Description",
        type: "textarea",
        required: false,
        defaultValue: "",
        group: "basic",
        order: 2,
      },
      {
        id: "eventType",
        name: "eventType",
        label: "Event Type",
        type: "select",
        required: true,
        defaultValue: "message",
        group: "config",
        order: 3,
      },
    ],
  },

  [BaseNodeType.ANNOTATION]: {
    type: BaseNodeType.ANNOTATION,
    category: CategoryType.OTHER,
    defaultProperties: {
      label: "Annotation",
      text: "",
    },
    visualConfig: baseVisualConfigs[BaseNodeType.ANNOTATION],
    connectionRules: {
      maxInputConnections: 0,
      maxOutputConnections: 0,
    },
    propertyDefinitions: [
      {
        id: "text",
        name: "text",
        label: "Text",
        type: "textarea",
        required: false,
        defaultValue: "",
        group: "basic",
        order: 1,
      },
    ],
  },

  [BaseNodeType.POOL]: {
    type: BaseNodeType.POOL,
    category: CategoryType.OTHER,
    defaultProperties: {
      label: "Pool",
      description: "Container for process elements",
    },
    visualConfig: baseVisualConfigs[BaseNodeType.POOL],
    connectionRules: {
      maxInputConnections: 0,
      maxOutputConnections: 0,
    },
    propertyDefinitions: [
      {
        id: "label",
        name: "label",
        label: "Label",
        type: "text",
        required: true,
        defaultValue: "Pool",
        group: "basic",
        order: 1,
      },
      {
        id: "description",
        name: "description",
        label: "Description",
        type: "textarea",
        required: false,
        defaultValue: "",
        group: "basic",
        order: 2,
      },
    ],
  },

  [BaseNodeType.NOTE]: {
    type: BaseNodeType.NOTE,
    category: CategoryType.OTHER,
    defaultProperties: {
      label: "Note",
      text: "",
    },
    visualConfig: baseVisualConfigs[BaseNodeType.NOTE],
    connectionRules: {
      maxInputConnections: 0,
      maxOutputConnections: 0,
    },
    propertyDefinitions: [
      {
        id: "text",
        name: "text",
        label: "Text",
        type: "textarea",
        required: false,
        defaultValue: "",
        group: "basic",
        order: 1,
      },
    ],
  },
};

/**
 * Get base node definition by type
 */
export function getBaseNodeDefinition(
  type: BaseNodeType | string
): BaseNodeDefinition | null {
  return baseNodeDefinitions[type as BaseNodeType] || null;
}

/**
 * Check if a node type is a base node
 */
export function isBaseNodeType(type: string): type is BaseNodeType {
  return Object.values(BaseNodeType).includes(type as BaseNodeType);
}

/**
 * Get all base node types
 */
export function getAllBaseNodeTypes(): BaseNodeType[] {
  return Object.values(BaseNodeType);
}
