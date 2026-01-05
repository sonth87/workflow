/**
 * Default BPM Plugin
 * Plugin mặc định cung cấp các BPM nodes, edges, rules cơ bản
 */

import type { Plugin, PluginConfig } from "@/core/plugins/PluginManager";
import type {
  BaseNodeConfig,
  BaseEdgeConfig,
  BaseRuleConfig,
  ThemeConfig,
} from "@/core/types/base.types";
import type { ContextMenuConfig } from "@/core/registry/ContextMenuRegistry";
import type { ContextMenuContext } from "@/core/types/base.types";
import {
  NodeType,
  CategoryType,
  EdgePathType,
  EdgePathStyle,
} from "@/enum/workflow.enum";
import {
  createDefaultNodeContextMenuItems,
  createDefaultEdgeContextMenuItems,
  createNoteNodeContextMenuItems,
  createAnnotationNodeContextMenuItems,
} from "@/core/utils/contextMenuHelpers";
import { contextMenuActionsRegistry } from "@/core/registry";
import {
  Circle,
  ClipboardList,
  DiamondPlus,
  FlipVertical,
  LockOpen,
  Trash2,
} from "lucide-react";

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

const defaultNodes: PluginConfig["nodes"] = [
  // Start Events
  {
    id: NodeType.START_EVENT_DEFAULT,
    type: NodeType.START_EVENT_DEFAULT,
    name: "Start Event",
    config: {
      ...createDefaultNodeConfig(
        NodeType.START_EVENT_DEFAULT,
        CategoryType.START,
        {
          title: "Start Event",
          description: "Workflow start point",
        }
      ),
      icon: {
        type: "lucide",
        value: Circle,
        backgroundColor: "#39cc7e",
        color: "#ffffff",
      },
    },
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
    config: {
      ...createDefaultNodeConfig(NodeType.TASK_DEFAULT, CategoryType.TASK, {
        title: "Task",
        description: "Generic task",
      }),
      icon: {
        type: "lucide",
        value: ClipboardList,
        backgroundColor: "#24b0fb",
        color: "#ffffff",
      },
    },
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
    config: {
      ...createDefaultNodeConfig(
        NodeType.EXCLUSIVE_GATEWAY,
        CategoryType.GATEWAY,
        {
          title: "Exclusive Gateway",
          description: "Choose one path (XOR)",
        }
      ),
      icon: {
        type: "lucide",
        value: DiamondPlus,
        backgroundColor: "#ff9d57",
        color: "#ffffff",
      },
    },
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
    config: {
      ...createDefaultNodeConfig(NodeType.END_EVENT_DEFAULT, CategoryType.END, {
        title: "End Event",
        description: "Workflow end point",
      }),
      connectionRules: [
        {
          id: "end-event-default-connection-rule",
          name: "End Event Default Connection Rule",
          description: "Allow multiple inputs, no outputs",
          maxInputConnections: undefined, // Allow multiple inputs
          maxOutputConnections: 0,
          requiresConnection: true,
        },
      ],
    },
  },
  {
    id: NodeType.END_EVENT_SEND_SIGNAL,
    type: NodeType.END_EVENT_SEND_SIGNAL,
    name: "Send Signal End Event",
    config: {
      ...createDefaultNodeConfig(
        NodeType.END_EVENT_SEND_SIGNAL,
        CategoryType.END,
        {
          title: "Send Signal End Event",
          description: "End workflow and send signal",
        }
      ),
      connectionRules: [
        {
          id: "end-event-send-signal-connection-rule",
          name: "End Event Send Signal Connection Rule",
          description: "Allow multiple inputs, no outputs",
          maxInputConnections: undefined, // Allow multiple inputs
          maxOutputConnections: 0,
          requiresConnection: true,
        },
      ],
    },
  },

  // Note Node
  {
    id: NodeType.NOTE,
    type: NodeType.NOTE,
    name: "Note",
    config: {
      ...createDefaultNodeConfig(NodeType.NOTE, CategoryType.OTHER, {
        title: "Note",
        description: "Annotation note",
      }),
      width: 250,
      height: 200,
    },
  },
  {
    id: NodeType.ANNOTATION,
    type: NodeType.ANNOTATION,
    name: "Annotation",
    config: {
      ...createDefaultNodeConfig(NodeType.ANNOTATION, CategoryType.OTHER, {
        level: "1",
        title: "Annotation",
        description: "Annotation note",
      }),
    },
  },
  // Pool Node
  {
    id: NodeType.POOL,
    type: NodeType.POOL,
    name: "Pool",
    config: {
      ...createDefaultNodeConfig(NodeType.POOL, CategoryType.OTHER, {
        title: "Pool",
        description:
          "Container for organizing workflow elements by participant",
      }),
      nodeType: NodeType.POOL, // Store nodeType in config
      icon: {
        type: "lucide",
        value: ClipboardList,
        backgroundColor: "#3b82f6",
        color: "#ffffff",
      },
      resizable: true,
      draggable: true,
      properties: {
        isLocked: false,
        orientation: "horizontal",
        lanes: [],
      },
    },
  },
  // Lane Node
  {
    id: NodeType.LANE,
    type: NodeType.LANE,
    name: "Lane",
    config: {
      ...createDefaultNodeConfig(NodeType.LANE, CategoryType.OTHER, {
        title: "Lane",
        description: "Swimlane for organizing workflow elements by role",
      }),
      icon: {
        type: "lucide",
        value: DiamondPlus,
        backgroundColor: "#10b981",
        color: "#ffffff",
      },
      resizable: true,
      draggable: true,
      properties: {
        isLocked: false,
        orientation: "horizontal",
      },
    },
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
    id: "sequence-flow",
    type: "sequence-flow",
    name: "Sequence Flow",
    config: {
      id: "",
      source: "",
      target: "",
      type: "sequence-flow", // Registry type
      pathType: EdgePathType.Bezier, // Path rendering type
      metadata: {
        id: "sequence-flow",
        title: "Sequence Flow",
        description: "Standard BPMN sequence flow connection",
        version: "1.0.0",
      },
      pathStyle: EdgePathStyle.Solid,
      pathWidth: 2,
      animated: false,
      editable: true,
      deletable: true,
      selectable: true,
      labels: [],
      properties: {
        pathType: EdgePathType.Bezier,
        pathStyle: EdgePathStyle.Solid,
      },
      propertyDefinitions: [
        // Property
      ],
    },
  },
  {
    id: "message-flow",
    type: "message-flow",
    name: "Message Flow",
    config: {
      id: "",
      source: "",
      target: "",
      type: "message-flow",
      pathType: EdgePathType.Straight,
      metadata: {
        id: "message-flow",
        title: "Message Flow",
        description: "BPMN message flow between pools/participants",
        version: "1.0.0",
      },
      pathStyle: EdgePathStyle.Dashed,
      pathWidth: 2,
      animated: false,
      editable: true,
      deletable: true,
      selectable: true,
      labels: [],
      properties: {
        pathType: EdgePathType.Straight,
        pathStyle: EdgePathStyle.Dashed,
        messageType: "default",
      },
      propertyDefinitions: [
        {
          id: "messageType",
          name: "messageType",
          type: "select",
          label: "Message Type",
          description: "Type of message being sent",
          defaultValue: "default",
          required: false,
          order: 0,
          options: [
            { label: "Default", value: "default" },
            { label: "Email", value: "email" },
            { label: "API Call", value: "api" },
            { label: "Event", value: "event" },
          ],
        },
        {
          id: "pathType",
          name: "pathType",
          type: "select",
          label: "Path Type",
          description: "Visual rendering type",
          defaultValue: EdgePathType.Straight,
          options: [
            { label: "Bezier", value: EdgePathType.Bezier },
            { label: "Straight", value: EdgePathType.Straight },
            { label: "Step", value: EdgePathType.Step },
          ],
        },
      ],
    },
  },
  {
    id: "association",
    type: "association",
    name: "Association",
    config: {
      id: "",
      source: "",
      target: "",
      type: "association",
      pathType: EdgePathType.Straight,
      metadata: {
        id: "association",
        title: "Association",
        description: "BPMN association for artifacts and annotations",
        version: "1.0.0",
      },
      pathStyle: EdgePathStyle.Dotted,
      pathWidth: 1.5,
      animated: false,
      editable: true,
      deletable: true,
      selectable: true,
      labels: [],
      properties: {
        pathType: EdgePathType.Straight,
        pathStyle: EdgePathStyle.Dotted,
        direction: "none",
      },
      propertyDefinitions: [
        {
          id: "direction",
          name: "direction",
          type: "select",
          label: "Direction",
          description: "Association direction",
          defaultValue: "none",
          options: [
            { label: "None", value: "none" },
            { label: "One Way", value: "one" },
            { label: "Both Ways", value: "both" },
          ],
        },
        {
          id: "pathType",
          type: "select",
          label: "Path Type",
          description: "Visual rendering type",
          defaultValue: EdgePathType.Straight,
          options: [
            { label: "Bezier", value: EdgePathType.Bezier },
            { label: "Straight", value: EdgePathType.Straight },
            { label: "Step", value: EdgePathType.Step },
          ],
        },
      ],
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
  {
    id: "pool-lane-containment",
    type: "validation",
    name: "Pool/Lane Containment Rule",
    config: {
      id: "pool-lane-containment",
      name: "Pool/Lane Containment Rule",
      description:
        "Lane cannot contain Pool or other Lanes. Pool can contain Lanes.",
      type: "validation",
      enabled: true,
      priority: 3,
      scope: "node",
      condition: (context: any) => {
        const { node, nodes } = context;

        // If this is a Pool or Lane trying to be a child of a Lane
        if (node.type === NodeType.POOL || node.type === NodeType.LANE) {
          if (node.parentId) {
            const parent = nodes.find(
              (n: BaseNodeConfig) => n.id === node.parentId
            );
            if (parent && parent.type === NodeType.LANE) {
              // Pool/Lane cannot be inside a Lane
              return false;
            }
          }
        }

        return true;
      },
      action: (context: any) => {
        console.warn(
          "Validation failed: Pool/Lane cannot be placed inside a Lane"
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
          const action =
            contextMenuActionsRegistry.getAction("changeNodeColor");
          if (action && context.nodeId) {
            action(context.nodeId, paletteId);
          }
        },
        // On border style change
        async (borderStyle: string, context: ContextMenuContext) => {
          const action = contextMenuActionsRegistry.getAction(
            "changeNodeBorderStyle"
          );
          if (action && context.nodeId) {
            action(context.nodeId, borderStyle);
          }
        },
        // On delete
        async (context: ContextMenuContext) => {
          const action = contextMenuActionsRegistry.getAction("deleteNode");
          if (action && context.nodeId) {
            action(context.nodeId);
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
          const action =
            contextMenuActionsRegistry.getAction("changeEdgeColor");
          if (action && context.edgeId) {
            action(context.edgeId, paletteId);
          }
        },
        // On path type change
        async (pathType: string, context: ContextMenuContext) => {
          const action = contextMenuActionsRegistry.getAction("changePathType");
          if (action && context.edgeId) {
            action(context.edgeId, pathType);
          }
        },
        // On path style change
        async (pathStyle: string, context: ContextMenuContext) => {
          const action = contextMenuActionsRegistry.getAction(
            "changeEdgePathStyle"
          );
          if (action && context.edgeId) {
            action(context.edgeId, pathStyle);
          }
        },
        // On animation change
        async (animated: boolean, context: ContextMenuContext) => {
          const action = contextMenuActionsRegistry.getAction(
            "changeEdgeAnimation"
          );
          if (action && context.edgeId) {
            action(context.edgeId, animated);
          }
        },
        // On add label
        async (
          position: "start" | "center" | "end",
          context: ContextMenuContext
        ) => {
          const action = contextMenuActionsRegistry.getAction("addEdgeLabel");
          if (action && context.edgeId) {
            action(context.edgeId, position);
          }
        },
        // On delete
        async (context: ContextMenuContext) => {
          const action = contextMenuActionsRegistry.getAction("deleteEdge");
          if (action && context.edgeId) {
            action(context.edgeId);
          }
        }
      ),
    },
  },
  {
    id: "canvas-context-menu",
    type: "context-menu",
    name: "Canvas Context Menu",
    config: {
      id: "canvas-context-menu",
      name: "Canvas Context Menu",
      targetType: "canvas",
      items: [
        {
          id: "add-node",
          label: "Add Node",
          icon: "",
          onClick: async () => {
            console.log("Add node action triggered");
          },
          children: [
            {
              id: "add-start-node",
              label: "Add Start Node",
              icon: "○",
              onClick: async (context: ContextMenuContext) => {
                console.log("Add Start Node clicked", context);
              },
              children: [
                {
                  id: "add-api-start-event",
                  label: "API Start Event",
                  icon: "▷",
                  onClick: async (context: ContextMenuContext) => {
                    console.log("Add API Start Event clicked", context);
                  },
                },
              ],
            },
            {
              id: "add-task-node",
              label: "Add Task Node",
              icon: "□",
              onClick: async (context: ContextMenuContext) => {
                console.log("Add Task Node clicked", context);
              },
            },
          ],
        },
      ],
    },
  },
  {
    id: "note-node-context-menu",
    type: "context-menu",
    name: "Note Node Context Menu",
    config: {
      id: "note-node-context-menu",
      name: "Note Node Context Menu",
      targetType: "node",
      targetNodeTypes: ["note"],
      items: createNoteNodeContextMenuItems(
        // On color change
        async (color: string, context: ContextMenuContext) => {
          // For note nodes, update data.color directly
          const action = contextMenuActionsRegistry.getAction("updateNodeData");
          if (action && context.nodeId) {
            action(context.nodeId, { color });
          }
        }
      ),
    },
  },
  {
    id: "annotation-node-context-menu",
    type: "context-menu",
    name: "Annotation Node Context Menu",
    config: {
      id: "annotation-node-context-menu",
      name: "Annotation Node Context Menu",
      targetType: "node",
      targetNodeTypes: ["annotation"],
      items: createAnnotationNodeContextMenuItems(
        // On color change
        async (color: string, context: ContextMenuContext) => {
          // For annotation nodes, update data.textColor directly
          const action = contextMenuActionsRegistry.getAction("updateNodeData");
          if (action && context.nodeId) {
            action(context.nodeId, { textColor: color });
          }
        }
      ),
    },
  },
  {
    id: "pool-lane-context-menu",
    type: "context-menu",
    name: "Pool/Lane Context Menu",
    config: {
      id: "pool-lane-context-menu",
      name: "Pool/Lane Context Menu",
      targetType: "node",
      targetNodeTypes: ["pool", "lane"],
      items: [
        {
          id: "toggle-lock",
          label: "Toggle Lock Mode",
          icon: { type: "lucide", value: LockOpen },
          onClick: async (context: ContextMenuContext) => {
            const action =
              contextMenuActionsRegistry.getAction("updateNodeData");
            if (action && context.nodeId && context.node) {
              const currentLockState = context.node.data?.isLocked ?? false;
              action(context.nodeId, { isLocked: !currentLockState });
            }
          },
        },
        {
          id: "switch-orientation",
          label: "Switch Orientation",
          icon: { type: "lucide", value: FlipVertical },
          onClick: async (context: ContextMenuContext) => {
            const action =
              contextMenuActionsRegistry.getAction("updateNodeData");
            if (action && context.nodeId && context.node) {
              const currentOrientation =
                context.node.data?.orientation || "horizontal";
              const newOrientation =
                currentOrientation === "horizontal" ? "vertical" : "horizontal";
              action(context.nodeId, { orientation: newOrientation });
            }
          },
        },
        {
          id: "separator-1",
          label: "",
          separator: true,
        },
        {
          id: "delete-pool-lane",
          label: "Delete",
          icon: { type: "lucide", value: Trash2, color: "red" },
          onClick: async (context: ContextMenuContext) => {
            const action = contextMenuActionsRegistry.getAction("deleteNode");
            if (action && context.nodeId) {
              action(context.nodeId);
            }
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
