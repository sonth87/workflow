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
import type { ContextMenuContext } from "@/core/types/base.types";
import { NodeType, CategoryType, EdgeType } from "@/enum/workflow.enum";
import {
  createDefaultNodeContextMenuItems,
  createDefaultEdgeContextMenuItems,
  paletteToNodeVisualConfig,
  paletteToEdgeVisualConfig,
} from "@/core/utils/contextMenuHelpers";

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
    id: NodeType.START_EVENT_DEFAULT,
    type: NodeType.START_EVENT_DEFAULT,
    name: "Start Event",
    config: createDefaultNodeConfig(
      NodeType.START_EVENT_DEFAULT,
      CategoryType.START,
      {
        title: "Start Event",
        description: "Workflow start point",
      }
    ),
  },
  {
    id: NodeType.START_EVENT_API,
    type: NodeType.START_EVENT_API,
    name: "API Start Event",
    config: createDefaultNodeConfig(
      NodeType.START_EVENT_API,
      CategoryType.START,
      {
        title: "API Start Event",
        description: "Start workflow via API",
      }
    ),
  },
  {
    id: NodeType.START_EVENT_TIMER,
    type: NodeType.START_EVENT_TIMER,
    name: "Timer Start Event",
    config: createDefaultNodeConfig(
      NodeType.START_EVENT_TIMER,
      CategoryType.START,
      {
        title: "Timer Start Event",
        description: "Start workflow on schedule",
      }
    ),
  },
  {
    id: NodeType.START_EVENT_WEB,
    type: NodeType.START_EVENT_WEB,
    name: "Web Start Event",
    config: createDefaultNodeConfig(
      NodeType.START_EVENT_WEB,
      CategoryType.START,
      {
        title: "Web Start Event",
        description: "Start workflow from web",
      }
    ),
  },
  {
    id: NodeType.START_EVENT_RECEIVE_SIGNAL,
    type: NodeType.START_EVENT_RECEIVE_SIGNAL,
    name: "Receive Signal Start Event",
    config: createDefaultNodeConfig(
      NodeType.START_EVENT_RECEIVE_SIGNAL,
      CategoryType.START,
      {
        title: "Receive Signal Start Event",
        description: "Start workflow on signal receipt",
      }
    ),
  },

  // Tasks
  {
    id: NodeType.TASK_DEFAULT,
    type: NodeType.TASK_DEFAULT,
    name: "Task",
    config: createDefaultNodeConfig(NodeType.TASK_DEFAULT, CategoryType.TASK, {
      title: "Task",
      description: "Generic task",
    }),
  },
  {
    id: NodeType.TASK_USER,
    type: NodeType.TASK_USER,
    name: "User Task",
    config: createDefaultNodeConfig(NodeType.TASK_USER, CategoryType.TASK, {
      title: "User Task",
      description: "Task requiring user interaction",
    }),
  },
  {
    id: NodeType.TASK_SYSTEM,
    type: NodeType.TASK_SYSTEM,
    name: "System Task",
    config: createDefaultNodeConfig(NodeType.TASK_SYSTEM, CategoryType.TASK, {
      title: "System Task",
      description: "Automated system task",
    }),
  },
  {
    id: NodeType.TASK_SCRIPT,
    type: NodeType.TASK_SCRIPT,
    name: "Script Task",
    config: createDefaultNodeConfig(NodeType.TASK_SCRIPT, CategoryType.TASK, {
      title: "Script Task",
      description: "Execute script",
    }),
  },
  {
    id: NodeType.SERVICE_TASK,
    type: NodeType.SERVICE_TASK,
    name: "Service Task",
    config: createDefaultNodeConfig(NodeType.SERVICE_TASK, CategoryType.TASK, {
      title: "Service Task",
      description: "Service integration task",
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
    id: NodeType.EVENT_BASED_GATEWAY,
    type: NodeType.EVENT_BASED_GATEWAY,
    name: "Event Based Gateway",
    config: createDefaultNodeConfig(
      NodeType.EVENT_BASED_GATEWAY,
      CategoryType.GATEWAY,
      {
        title: "Event Based Gateway",
        description: "Wait for events",
      }
    ),
  },

  // End Events
  {
    id: NodeType.END_EVENT_DEFAULT,
    type: NodeType.END_EVENT_DEFAULT,
    name: "End Event",
    config: createDefaultNodeConfig(
      NodeType.END_EVENT_DEFAULT,
      CategoryType.END,
      {
        title: "End Event",
        description: "Workflow end point",
      }
    ),
  },
  {
    id: NodeType.END_EVENT_SEND_SIGNAL,
    type: NodeType.END_EVENT_SEND_SIGNAL,
    name: "Send Signal End Event",
    config: createDefaultNodeConfig(
      NodeType.END_EVENT_SEND_SIGNAL,
      CategoryType.END,
      {
        title: "Send Signal End Event",
        description: "End workflow and send signal",
      }
    ),
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
      items: createDefaultNodeContextMenuItems(
        // On color change
        async (paletteId: string, context: ContextMenuContext) => {
          if (context.node) {
            const visualConfig = paletteToNodeVisualConfig(paletteId);
            // Update node visual config
            // This will be handled by the workflow store/canvas
            console.log("Change node color to:", paletteId, visualConfig);
          }
        },
        // On delete
        async (context: ContextMenuContext) => {
          if (context.nodeId) {
            console.log("Delete node:", context.nodeId);
            // This will be handled by the workflow store/canvas
          }
        }
      ),
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
      items: createDefaultEdgeContextMenuItems(
        // On color change
        async (paletteId: string, context: ContextMenuContext) => {
          if (context.edge) {
            const visualConfig = paletteToEdgeVisualConfig(paletteId);
            console.log("Change edge color to:", paletteId, visualConfig);
            // This will be handled by the workflow store/canvas
          }
        },
        // On delete
        async (context: ContextMenuContext) => {
          if (context.edgeId) {
            console.log("Delete edge:", context.edgeId);
            // This will be handled by the workflow store/canvas
          }
        }
      ),
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
