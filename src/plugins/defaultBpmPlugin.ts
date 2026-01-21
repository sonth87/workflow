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
import type { CategoryConfig } from "@/core/registry/CategoryRegistry";
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
  BaseNodeType,
  getBaseNodeDefinition,
} from "@/core/nodes/BaseNodeDefinitions";
import {
  AlarmClock,
  Circle,
  ClipboardList,
  DiamondPlus,
  FlipVertical,
  Highlighter,
  ListCheck,
  LockOpen,
  Mail,
  Palette,
  PanelTopBottomDashed,
  Plus,
  Radio,
  Trash2,
} from "lucide-react";

// Import plugin translations
import pluginTranslationsEn from "@/translations/plugins.en.json";
import pluginTranslationsVi from "@/translations/plugins.vi.json";

// ============================================
// Default Node Configurations
// ============================================

/**
 * Helper to get visual config from base node type
 */
const getBaseVisualConfig = (baseType: BaseNodeType) => {
  const baseDef = getBaseNodeDefinition(baseType);
  return baseDef?.visualConfig;
};

const createDefaultNodeConfig = (
  nodeType: NodeType,
  category: CategoryType,
  metadata: Partial<BaseNodeConfig["metadata"]>,
  baseType?: BaseNodeType
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
  visualConfig: baseType ? getBaseVisualConfig(baseType) : undefined,
  collapsible: true,
  collapsed: false,
  editable: true,
  deletable: true,
  connectable: true,
  draggable: true,
  propertyDefinitions: [],
  properties: {},
});

// ============================================
// Helper: Create Category Configuration
// ============================================

const createCategory = (
  categoryType: CategoryType | string,
  name: string | { [key: string]: string },
  overrides: Partial<CategoryConfig> = {}
) => {
  const id = `category-${categoryType}`;
  const config: CategoryConfig = {
    id,
    name,
    categoryType: categoryType as CategoryType,
    isOpen: true,
    ...overrides,
  };
  return { id, type: categoryType, name, config };
};

// ============================================
// Default Categories Configurations
// ============================================

const defaultCategories: PluginConfig["categories"] = [
  createCategory(CategoryType.START, "plugin.default.category.start.name", {
    description: "plugin.default.category.start.description",
    order: 1,
  }),
  createCategory(CategoryType.TASK, "plugin.default.category.task.name", {
    description: "plugin.default.category.task.description",
    order: 2,
  }),
  createCategory(CategoryType.GATEWAY, "plugin.default.category.gateway.name", {
    description: "plugin.default.category.gateway.description",
    order: 3,
  }),
  createCategory(CategoryType.END, "plugin.default.category.end.name", {
    description: "plugin.default.category.end.description",
    order: 4,
  }),
  createCategory(
    CategoryType.IMMEDIATE,
    "plugin.default.category.immediate.name",
    {
      description: "plugin.default.category.immediate.description",
      order: 5,
      separator: { show: true, style: "line", color: "#e5e7eb" },
    }
  ),
  createCategory(CategoryType.OTHER, "plugin.default.category.other.name", {
    description: "plugin.default.category.other.description",
    order: 6,
  }),
];

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
          title: "plugin.default.startEventDefault.title",
          description: "plugin.default.startEventDefault.description",
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
        title: "plugin.default.startEventApi.title",
        description: "plugin.default.startEventApi.description",
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
        title: "plugin.default.startEventTimer.title",
        description: "plugin.default.startEventTimer.description",
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
        title: "plugin.default.startEventWeb.title",
        description: "plugin.default.startEventWeb.description",
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
        title: "plugin.default.startEventReceiveSignal.title",
        description: "plugin.default.startEventReceiveSignal.description",
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
        title: "plugin.default.taskDefault.title",
        description: "plugin.default.taskDefault.description",
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
      title: "plugin.default.taskUser.title",
      description: "plugin.default.taskUser.description",
    }),
  },
  {
    id: NodeType.TASK_SYSTEM,
    type: NodeType.TASK_SYSTEM,
    name: "System Task",
    config: createDefaultNodeConfig(NodeType.TASK_SYSTEM, CategoryType.TASK, {
      title: "plugin.default.taskSystem.title",
      description: "plugin.default.taskSystem.description",
    }),
  },
  {
    id: NodeType.TASK_SCRIPT,
    type: NodeType.TASK_SCRIPT,
    name: "Script Task",
    config: createDefaultNodeConfig(NodeType.TASK_SCRIPT, CategoryType.TASK, {
      title: "plugin.default.taskScript.title",
      description: "plugin.default.taskScript.description",
    }),
  },
  {
    id: NodeType.SERVICE_TASK,
    type: NodeType.SERVICE_TASK,
    name: "Service Task",
    config: createDefaultNodeConfig(NodeType.SERVICE_TASK, CategoryType.TASK, {
      title: "plugin.default.serviceTask.title",
      description: "plugin.default.serviceTask.description",
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
          title: "plugin.default.exclusiveGateway.title",
          description: "plugin.default.exclusiveGateway.description",
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
        title: "plugin.default.parallelGateway.title",
        description: "plugin.default.parallelGateway.description",
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
        title: "plugin.default.eventBasedGateway.title",
        description: "plugin.default.eventBasedGateway.description",
      }
    ),
  },

  // Immediate Events
  {
    id: NodeType.IMMEDIATE_EMAIL,
    type: NodeType.IMMEDIATE_EMAIL,
    name: "Immediate Email",
    config: {
      ...createDefaultNodeConfig(
        NodeType.IMMEDIATE_EMAIL,
        CategoryType.IMMEDIATE,
        {
          title: "plugin.default.immediateEmail.title",
          description: "plugin.default.immediateEmail.description",
        },
        BaseNodeType.IMMEDIATE // Tự động lấy visual config từ base IMMEDIATE
      ),
      icon: {
        type: "lucide",
        value: Mail,
      },
    },
  },
  {
    id: NodeType.IMMEDIATE_RECEIVE_MESSAGE,
    type: NodeType.IMMEDIATE_RECEIVE_MESSAGE,
    name: "Immediate Receive Message",
    config: {
      ...createDefaultNodeConfig(
        NodeType.IMMEDIATE_RECEIVE_MESSAGE,
        CategoryType.IMMEDIATE,
        {
          title: "plugin.default.immediateReceiveMessage.title",
          description: "plugin.default.immediateReceiveMessage.description",
        },
        BaseNodeType.IMMEDIATE
      ),
      icon: {
        type: "lucide",
        value: Mail,
      },
    },
  },
  {
    id: NodeType.IMMEDIATE_TIMER,
    type: NodeType.IMMEDIATE_TIMER,
    name: "Immediate Timer",
    config: {
      ...createDefaultNodeConfig(
        NodeType.IMMEDIATE_TIMER,
        CategoryType.IMMEDIATE,
        {
          title: "plugin.default.immediateTimer.title",
          description: "plugin.default.immediateTimer.description",
        },
        BaseNodeType.IMMEDIATE
      ),
      icon: {
        type: "lucide",
        value: AlarmClock,
      },
    },
  },
  {
    id: NodeType.IMMEDIATE_SIGNAL,
    type: NodeType.IMMEDIATE_SIGNAL,
    name: "Immediate Signal",
    config: {
      ...createDefaultNodeConfig(
        NodeType.IMMEDIATE_SIGNAL,
        CategoryType.IMMEDIATE,
        {
          title: "plugin.default.immediateSignal.title",
          description: "plugin.default.immediateSignal.description",
        },
        BaseNodeType.IMMEDIATE
      ),
      icon: {
        type: "lucide",
        value: Radio,
      },
    },
  },
  {
    id: NodeType.IMMEDIATE_CONDITION,
    type: NodeType.IMMEDIATE_CONDITION,
    name: "Immediate Condition",
    config: {
      ...createDefaultNodeConfig(
        NodeType.IMMEDIATE_CONDITION,
        CategoryType.IMMEDIATE,
        {
          title: "plugin.default.immediateCondition.title",
          description: "plugin.default.immediateCondition.description",
        },
        BaseNodeType.IMMEDIATE
      ),
      icon: {
        type: "lucide",
        value: ListCheck,
      },
    },
  },

  // End Events
  {
    id: NodeType.END_EVENT_DEFAULT,
    type: NodeType.END_EVENT_DEFAULT,
    name: "End Event",
    config: {
      ...createDefaultNodeConfig(NodeType.END_EVENT_DEFAULT, CategoryType.END, {
        title: "plugin.default.endEventDefault.title",
        description: "plugin.default.endEventDefault.description",
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
          title: "plugin.default.endEventSendSignal.title",
          description: "plugin.default.endEventSendSignal.description",
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
        title: "plugin.default.note.title",
        description: "plugin.default.note.description",
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
        title: "plugin.default.annotation.title",
        description: "plugin.default.annotation.description",
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
        title: "plugin.default.pool.title",
        description: "plugin.default.pool.description",
      }),
      nodeType: NodeType.POOL, // Store nodeType in config
      icon: {
        type: "lucide",
        value: PanelTopBottomDashed,
        backgroundColor: "#3b82f6",
        color: "#ffffff",
      },
      resizable: true,
      draggable: true,
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
        title: "plugin.default.edge.sequenceFlow.title",
        description: "plugin.default.edge.sequenceFlow.description",
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
        title: "plugin.default.edge.messageFlow.title",
        description: "plugin.default.edge.messageFlow.description",
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
          label: "plugin.default.edge.property.messageType.label",
          description: "plugin.default.edge.property.messageType.description",
          defaultValue: "default",
          required: false,
          order: 0,
          options: [
            {
              label: "plugin.default.edge.property.messageType.option.default",
              value: "default",
            },
            {
              label: "plugin.default.edge.property.messageType.option.email",
              value: "email",
            },
            {
              label: "plugin.default.edge.property.messageType.option.api",
              value: "api",
            },
            {
              label: "plugin.default.edge.property.messageType.option.event",
              value: "event",
            },
          ],
        },
        {
          id: "pathType",
          name: "pathType",
          type: "select",
          label: "plugin.default.edge.property.pathType.label",
          description: "plugin.default.edge.property.pathType.description",
          defaultValue: EdgePathType.Straight,
          options: [
            {
              label: "plugin.default.edge.property.pathType.option.bezier",
              value: EdgePathType.Bezier,
            },
            {
              label: "plugin.default.edge.property.pathType.option.straight",
              value: EdgePathType.Straight,
            },
            {
              label: "plugin.default.edge.property.pathType.option.step",
              value: EdgePathType.Step,
            },
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
        title: "plugin.default.edge.association.title",
        description: "plugin.default.edge.association.description",
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
          label: "plugin.default.edge.property.direction.label",
          description: "plugin.default.edge.property.direction.description",
          defaultValue: "none",
          options: [
            {
              label: "plugin.default.edge.property.direction.option.none",
              value: "none",
            },
            {
              label: "plugin.default.edge.property.direction.option.one",
              value: "one",
            },
            {
              label: "plugin.default.edge.property.direction.option.both",
              value: "both",
            },
          ],
        },
        {
          id: "pathType",
          type: "select",
          label: "plugin.default.edge.property.pathType.label",
          description: "plugin.default.edge.property.pathType.description",
          defaultValue: EdgePathType.Straight,
          options: [
            {
              label: "plugin.default.edge.property.pathType.option.bezier",
              value: EdgePathType.Bezier,
            },
            {
              label: "plugin.default.edge.property.pathType.option.straight",
              value: EdgePathType.Straight,
            },
            {
              label: "plugin.default.edge.property.pathType.option.step",
              value: EdgePathType.Step,
            },
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

        // If this is a Pool trying to be a child (Pools cannot be nested)
        if (node.type === NodeType.POOL) {
          if (node.parentId) {
            const parent = nodes.find(
              (n: BaseNodeConfig) => n.id === node.parentId
            );
            if (parent && parent.type === NodeType.POOL) {
              // Pool cannot be inside another Pool
              return false;
            }
          }
        }

        return true;
      },
      action: (context: any) => {
        console.warn(
          "Validation failed: Pool cannot be nested inside another Pool"
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
        },
        // On type change
        async (targetNodeType: string, context: ContextMenuContext) => {
          const action =
            contextMenuActionsRegistry.getAction("convertNodeType");
          if (action && context.nodeId) {
            action(context.nodeId, targetNodeType);
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
          label: "common.contextMenu.addNode",
          icon: "",
          onClick: async () => {
            console.log("Add node action triggered");
          },
          children: [
            {
              id: "add-start-node",
              label: "common.contextMenu.addStartNode",
              icon: "○",
              onClick: async (context: ContextMenuContext) => {
                console.log("Add Start Node clicked", context);
              },
              children: [
                {
                  id: "add-api-start-event",
                  label: "common.contextMenu.apiStartEvent",
                  icon: "▷",
                  onClick: async (context: ContextMenuContext) => {
                    console.log("Add API Start Event clicked", context);
                  },
                },
              ],
            },
            {
              id: "add-task-node",
              label: "common.contextMenu.addTaskNode",
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
          id: "add-lane",
          label: "common.contextMenu.addLane",
          icon: { type: "lucide", value: Plus },
          onClick: async (context: ContextMenuContext) => {
            const action =
              contextMenuActionsRegistry.getAction("updateNodeData");
            if (action && context.nodeId && context.node) {
              const currentLanes =
                (context.node.data?.lanes as Array<{
                  id: string;
                  label: string;
                }>) || [];
              const newLane = {
                id: `lane-${Date.now()}`,
                label: `Lane ${currentLanes.length + 1}`,
              };
              action(context.nodeId, { lanes: [...currentLanes, newLane] });
            }
          },
          visible: (context: ContextMenuContext) =>
            context.node?.type === "pool",
        },
        {
          id: "separator-colors",
          label: "",
          separator: true,
        },
        {
          id: "toggle-lock",
          label: "common.contextMenu.toggleLockMode",
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
          label: "common.contextMenu.switchOrientation",
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
          id: "appearance",
          label: "common.contextMenu.appearance",
          icon: {
            type: "lucide",
            value: Highlighter,
          },
          children: [
            {
              id: "color-submenu",
              label: "common.contextMenu.changeColor",
              icon: { type: "lucide", value: Palette },
              children: [
                {
                  id: "color-yellow",
                  label: "common.contextMenu.yellow",
                  color: "#fde68a",
                  onClick: async (context: ContextMenuContext) => {
                    const action =
                      contextMenuActionsRegistry.getAction("updateNodeData");
                    if (action && context.nodeId) {
                      action(context.nodeId, { color: "yellow" });
                    }
                  },
                },
                {
                  id: "color-blue",
                  label: "common.contextMenu.blue",
                  color: "#bfdbfe",
                  onClick: async (context: ContextMenuContext) => {
                    const action =
                      contextMenuActionsRegistry.getAction("updateNodeData");
                    if (action && context.nodeId) {
                      action(context.nodeId, { color: "blue" });
                    }
                  },
                },
                {
                  id: "color-green",
                  label: "common.contextMenu.green",
                  color: "#d9f99d",
                  onClick: async (context: ContextMenuContext) => {
                    const action =
                      contextMenuActionsRegistry.getAction("updateNodeData");
                    if (action && context.nodeId) {
                      action(context.nodeId, { color: "green" });
                    }
                  },
                },
                {
                  id: "color-pink",
                  label: "common.contextMenu.pink",
                  color: "#fecdd3",
                  onClick: async (context: ContextMenuContext) => {
                    const action =
                      contextMenuActionsRegistry.getAction("updateNodeData");
                    if (action && context.nodeId) {
                      action(context.nodeId, { color: "pink" });
                    }
                  },
                },
                {
                  id: "color-purple",
                  label: "common.contextMenu.purple",
                  color: "#ddd6fe",
                  onClick: async (context: ContextMenuContext) => {
                    const action =
                      contextMenuActionsRegistry.getAction("updateNodeData");
                    if (action && context.nodeId) {
                      action(context.nodeId, { color: "purple" });
                    }
                  },
                },
                {
                  id: "color-orange",
                  label: "common.contextMenu.orange",
                  color: "#fed7aa",
                  onClick: async (context: ContextMenuContext) => {
                    const action =
                      contextMenuActionsRegistry.getAction("updateNodeData");
                    if (action && context.nodeId) {
                      action(context.nodeId, { color: "orange" });
                    }
                  },
                },
                {
                  id: "color-gray",
                  label: "common.contextMenu.gray",
                  color: "#e4e4e7",
                  onClick: async (context: ContextMenuContext) => {
                    const action =
                      contextMenuActionsRegistry.getAction("updateNodeData");
                    if (action && context.nodeId) {
                      action(context.nodeId, { color: "gray" });
                    }
                  },
                },
              ],
            },
          ],
          visible: (context: ContextMenuContext) =>
            context.node?.type === "pool",
        },
        {
          id: "separator-appearance",
          label: "",
          separator: true,
        },
        {
          id: "delete-pool-lane",
          label: "common.contextMenu.deletePool",
          icon: { type: "lucide", value: Trash2, color: "red" },
          onClick: async (context: ContextMenuContext) => {
            const action = contextMenuActionsRegistry.getAction(
              "deletePoolWithConfirmation"
            );
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
    categories: defaultCategories,
    contextMenus: defaultContextMenus,
    translations: {
      en: pluginTranslationsEn as Record<string, string>,
      vi: pluginTranslationsVi as Record<string, string>,
    },
  },
  async initialize() {
    console.log("Default BPM Plugin initialized");
  },
};
