/**
 * Default BPM Plugin
 * Plugin mặc định cung cấp các BPM nodes, edges, rules cơ bản
 */

import type { Plugin } from "@/core/plugins/PluginManager";
import type {
  BaseNodeConfig,
  BaseEdgeConfig,
  BaseRuleConfig,
  ThemeConfig,
} from "@/core/types/base.types";
import type { ContextMenuConfig } from "@/core/registry/ContextMenuRegistry";
import { NodeType, CategoryType, EdgeType } from "@/enum/workflow.enum";

// ============================================
// Default Node Configurations
// ============================================

const createDefaultNodeConfig = (
  nodeType: NodeType,
  category: CategoryType,
  metadata: Partial<BaseNodeConfig["metadata"]>
): BaseNodeConfig => ({
  id: "",
  type: nodeType,
  position: { x: 0, y: 0 },
  data: {},
  nodeType,
  category: category,
  metadata: {
    id: nodeType,
    title: metadata.title || nodeType,
    description: metadata.description,
    version: "1.0.0",
  },
  collapsible: true,
  collapsed: false,
  editable: true,
  deletable: true,
  connectable: true,
  draggable: true,
  propertyDefinitions: [],
  properties: {},
});

const defaultNodes: Array<{
  id: string;
  type: string;
  name: string;
  config: BaseNodeConfig;
}> = [
  // Start Events
  {
    id: NodeType.START_EVENT,
    type: NodeType.START_EVENT,
    name: "Start Event",
    config: createDefaultNodeConfig(NodeType.START_EVENT, CategoryType.START, {
      title: "Start Event",
      description: "Workflow start point",
    }),
  },
  {
    id: NodeType.MESSAGE_START_EVENT,
    type: NodeType.MESSAGE_START_EVENT,
    name: "Message Start Event",
    config: createDefaultNodeConfig(
      NodeType.MESSAGE_START_EVENT,
      CategoryType.START,
      {
        title: "Message Start Event",
        description: "Start workflow on message receipt",
      }
    ),
  },
  {
    id: NodeType.TIMER_START_EVENT,
    type: NodeType.TIMER_START_EVENT,
    name: "Timer Start Event",
    config: createDefaultNodeConfig(
      NodeType.TIMER_START_EVENT,
      CategoryType.START,
      {
        title: "Timer Start Event",
        description: "Start workflow on schedule",
      }
    ),
  },

  // Tasks
  {
    id: NodeType.TASK,
    type: NodeType.TASK,
    name: "Task",
    config: createDefaultNodeConfig(NodeType.TASK, CategoryType.TASK, {
      title: "Task",
      description: "Generic task",
    }),
  },
  {
    id: NodeType.USER_TASK,
    type: NodeType.USER_TASK,
    name: "User Task",
    config: createDefaultNodeConfig(NodeType.USER_TASK, CategoryType.TASK, {
      title: "User Task",
      description: "Task requiring user interaction",
    }),
  },
  {
    id: NodeType.SERVICE_TASK,
    type: NodeType.SERVICE_TASK,
    name: "Service Task",
    config: createDefaultNodeConfig(NodeType.SERVICE_TASK, CategoryType.TASK, {
      title: "Service Task",
      description: "Automated service task",
    }),
  },
  {
    id: NodeType.SCRIPT_TASK,
    type: NodeType.SCRIPT_TASK,
    name: "Script Task",
    config: createDefaultNodeConfig(NodeType.SCRIPT_TASK, CategoryType.TASK, {
      title: "Script Task",
      description: "Execute script",
    }),
  },

  // Gateways
  {
    id: NodeType.EXCLUSIVE_GATEWAY,
    type: NodeType.EXCLUSIVE_GATEWAY,
    name: "Exclusive Gateway",
    config: createDefaultNodeConfig(
      NodeType.EXCLUSIVE_GATEWAY,
      CategoryType.GATEWAY,
      {
        title: "Exclusive Gateway",
        description: "Choose one path (XOR)",
      }
    ),
  },
  {
    id: NodeType.PARALLEL_GATEWAY,
    type: NodeType.PARALLEL_GATEWAY,
    name: "Parallel Gateway",
    config: createDefaultNodeConfig(
      NodeType.PARALLEL_GATEWAY,
      CategoryType.GATEWAY,
      {
        title: "Parallel Gateway",
        description: "Execute all paths (AND)",
      }
    ),
  },
  {
    id: NodeType.INCLUSIVE_GATEWAY,
    type: NodeType.INCLUSIVE_GATEWAY,
    name: "Inclusive Gateway",
    config: createDefaultNodeConfig(
      NodeType.INCLUSIVE_GATEWAY,
      CategoryType.GATEWAY,
      {
        title: "Inclusive Gateway",
        description: "Execute one or more paths (OR)",
      }
    ),
  },

  // End Events
  {
    id: NodeType.END_EVENT,
    type: NodeType.END_EVENT,
    name: "End Event",
    config: createDefaultNodeConfig(NodeType.END_EVENT, CategoryType.END, {
      title: "End Event",
      description: "Workflow end point",
    }),
  },
];

// ============================================
// Default Edge Configurations
// ============================================

const defaultEdges: Array<{
  id: string;
  type: string;
  name: string;
  config: BaseEdgeConfig;
}> = [
  {
    id: EdgeType.Default,
    type: EdgeType.Default,
    name: "Default Edge",
    config: {
      id: "",
      source: "",
      target: "",
      type: EdgeType.Default,
      edgeType: EdgeType.Default,
      metadata: {
        id: EdgeType.Default,
        title: "Default Edge",
        description: "Standard connection",
        version: "1.0.0",
      },
      pathStyle: "solid",
      pathWidth: 2,
      animated: false,
      editable: true,
      deletable: true,
      selectable: true,
      labels: [],
      properties: {},
      propertyDefinitions: [
        {
          id: "label",
          type: "text",
          label: "Label",
          description: "Edge label",
          defaultValue: "",
        },
        {
          id: "condition",
          type: "text",
          label: "Condition",
          description: "Conditional expression",
          defaultValue: "",
        },
      ],
    },
  },
  {
    id: EdgeType.SmoothStep,
    type: EdgeType.SmoothStep,
    name: "Smooth Step Edge",
    config: {
      id: "",
      source: "",
      target: "",
      type: EdgeType.SmoothStep,
      edgeType: EdgeType.SmoothStep,
      metadata: {
        id: EdgeType.SmoothStep,
        title: "Smooth Step Edge",
        description: "Smooth step connection",
        version: "1.0.0",
      },
      pathStyle: "solid",
      pathWidth: 2,
      animated: false,
      editable: true,
      deletable: true,
      selectable: true,
      labels: [],
      properties: {},
      propertyDefinitions: [],
    },
  },
];

// ============================================
// Default Rules
// ============================================

const defaultRules: Array<{
  id: string;
  type: string;
  name: string;
  config: BaseRuleConfig;
}> = [
  {
    id: "require-start-node",
    type: "validation",
    name: "Require Start Node",
    config: {
      id: "require-start-node",
      name: "Require Start Node",
      description: "Workflow must have at least one start node",
      type: "validation",
      enabled: true,
      priority: 1,
      scope: "workflow",
      condition: (context: any) => {
        const { nodes } = context;
        return nodes.some(
          (n: BaseNodeConfig) => n.category === CategoryType.START
        );
      },
    },
  },
  {
    id: "require-end-node",
    type: "validation",
    name: "Require End Node",
    config: {
      id: "require-end-node",
      name: "Require End Node",
      description: "Workflow must have at least one end node",
      type: "validation",
      enabled: true,
      priority: 2,
      scope: "workflow",
      condition: (context: any) => {
        const { nodes } = context;
        return nodes.some(
          (n: BaseNodeConfig) => n.category === CategoryType.END
        );
      },
    },
  },
];

// ============================================
// Default Theme
// ============================================

const defaultThemes: Array<{
  id: string;
  type: string;
  name: string;
  config: ThemeConfig;
}> = [
  {
    id: "default",
    type: "theme",
    name: "Default Theme",
    config: {
      name: "Default Theme",
      colors: {
        primary: "#3b82f6",
        secondary: "#64748b",
        success: "#22c55e",
        warning: "#f59e0b",
        error: "#ef4444",
      },
      styles: {
        borderRadius: 8,
        borderWidth: 2,
        padding: 16,
      },
    },
  },
];

// ============================================
// Default Context Menus
// ============================================

const defaultContextMenus: Array<{
  id: string;
  type: string;
  name: string;
  config: ContextMenuConfig;
}> = [
  {
    id: "node-context-menu",
    type: "context-menu",
    name: "Node Context Menu",
    config: {
      id: "node-context-menu",
      name: "Node Context Menu",
      targetType: "node",
      items: [
        {
          id: "delete-node",
          label: "Delete",
          onClick: async context => {
            console.log("Delete node:", context.nodeId);
          },
        },
        {
          id: "duplicate-node",
          label: "Duplicate",
          onClick: async context => {
            console.log("Duplicate node:", context.nodeId);
          },
        },
        {
          id: "separator-1",
          label: "",
          separator: true,
        },
        {
          id: "collapse-node",
          label: "Collapse",
          onClick: async context => {
            console.log("Collapse node:", context.nodeId);
          },
          visible: context => !context.node?.collapsed,
        },
        {
          id: "expand-node",
          label: "Expand",
          onClick: async context => {
            console.log("Expand node:", context.nodeId);
          },
          visible: context => context.node?.collapsed === true,
        },
      ],
    },
  },
  {
    id: "edge-context-menu",
    type: "context-menu",
    name: "Edge Context Menu",
    config: {
      id: "edge-context-menu",
      name: "Edge Context Menu",
      targetType: "edge",
      items: [
        {
          id: "delete-edge",
          label: "Delete",
          onClick: async context => {
            console.log("Delete edge:", context.edgeId);
          },
        },
        {
          id: "add-label",
          label: "Add Label",
          onClick: async context => {
            console.log("Add label to edge:", context.edgeId);
          },
        },
      ],
    },
  },
];

// ============================================
// Plugin Definition
// ============================================

export const defaultBpmPlugin: Plugin = {
  metadata: {
    id: "default-bpm-plugin",
    name: "Default BPM Plugin",
    version: "1.0.0",
    description: "Default BPMN 2.0 nodes, edges, and rules",
    author: "BPM Core Team",
  },
  config: {
    nodes: defaultNodes,
    edges: defaultEdges,
    rules: defaultRules,
    themes: defaultThemes,
    contextMenus: defaultContextMenus,
  },
  async initialize() {
    console.log("Default BPM Plugin initialized");
  },
};
