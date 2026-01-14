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
  createCategory(
    CategoryType.START,
    { en: "Start Events", vi: "Sự kiện bắt đầu" },
    {
      description: {
        en: "Start events for workflows",
        vi: "Các sự kiện bắt đầu workflow",
      },
      order: 1,
    }
  ),
  createCategory(
    CategoryType.TASK,
    { en: "Tasks", vi: "Nhiệm vụ" },
    {
      description: {
        en: "Task types in workflows",
        vi: "Các loại nhiệm vụ trong workflow",
      },
      order: 2,
    }
  ),
  createCategory(
    CategoryType.GATEWAY,
    { en: "Gateways", vi: "Cổng quyết định" },
    {
      description: {
        en: "Decision points in workflows",
        vi: "Các điểm quyết định trong workflow",
      },
      order: 3,
    }
  ),
  createCategory(
    CategoryType.END,
    { en: "End Events", vi: "Sự kiện kết thúc" },
    {
      description: {
        en: "Workflow end events",
        vi: "Các sự kiện kết thúc workflow",
      },
      order: 4,
    }
  ),
  createCategory(
    CategoryType.IMMEDIATE,
    { en: "Immediate", vi: "Tức thì" },
    {
      description: { en: "Immediate events", vi: "Các sự kiện tức thì" },
      order: 5,
      separator: { show: true, style: "line", color: "#e5e7eb" },
    }
  ),
  createCategory(
    CategoryType.OTHER,
    { en: "Other", vi: "Khác" },
    {
      description: { en: "Other nodes", vi: "Các nodes khác" },
      order: 6,
    }
  ),
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
          title: { en: "Start Event", vi: "Sự kiện bắt đầu" },
          description: {
            en: "Workflow start point",
            vi: "Điểm bắt đầu của workflow",
          },
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
        title: { en: "API Start Event", vi: "Sự kiện bắt đầu từ API" },
        description: {
          en: "Start workflow via API",
          vi: "Bắt đầu workflow thông qua API",
        },
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
        title: {
          en: "Timer Start Event",
          vi: "Sự kiện bắt đầu theo lịch biểu",
        },
        description: {
          en: "Start workflow on schedule",
          vi: "Bắt đầu workflow theo lịch biểu",
        },
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
        title: { en: "Web Start Event", vi: "Sự kiện bắt đầu từ web" },
        description: {
          en: "Start workflow from web",
          vi: "Bắt đầu workflow từ web",
        },
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
        title: {
          en: "Receive Signal Start Event",
          vi: "Sự kiện bắt đầu khi nhận tín hiệu",
        },
        description: {
          en: "Start workflow on signal receipt",
          vi: "Bắt đầu workflow khi nhận được tín hiệu",
        },
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
        title: { en: "Task", vi: "Nhiệm vụ" },
        description: { en: "Generic task", vi: "Nhiệm vụ chung" },
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
      title: { en: "User Task", vi: "Nhiệm vụ của người dùng" },
      description: {
        en: "Task requiring user interaction",
        vi: "Nhiệm vụ yêu cầu tương tác với người dùng",
      },
    }),
  },
  {
    id: NodeType.TASK_SYSTEM,
    type: NodeType.TASK_SYSTEM,
    name: "System Task",
    config: createDefaultNodeConfig(NodeType.TASK_SYSTEM, CategoryType.TASK, {
      title: { en: "System Task", vi: "Nhiệm vụ hệ thống" },
      description: {
        en: "Automated system task",
        vi: "Nhiệm vụ hệ thống tự động",
      },
    }),
  },
  {
    id: NodeType.TASK_SCRIPT,
    type: NodeType.TASK_SCRIPT,
    name: "Script Task",
    config: createDefaultNodeConfig(NodeType.TASK_SCRIPT, CategoryType.TASK, {
      title: { en: "Script Task", vi: "Nhiệm vụ tập lệnh" },
      description: { en: "Execute script", vi: "Thực thi tập lệnh" },
    }),
  },
  {
    id: NodeType.SERVICE_TASK,
    type: NodeType.SERVICE_TASK,
    name: "Service Task",
    config: createDefaultNodeConfig(NodeType.SERVICE_TASK, CategoryType.TASK, {
      title: { en: "Service Task", vi: "Nhiệm vụ dịch vụ" },
      description: {
        en: "Service integration task",
        vi: "Nhiệm vụ tích hợp dịch vụ",
      },
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
          title: { en: "Exclusive Gateway", vi: "Cổng độc quyền" },
          description: {
            en: "Choose one path (XOR)",
            vi: "Chọn một đường dẫn (XOR)",
          },
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
        title: { en: "Parallel Gateway", vi: "Cổng song song" },
        description: {
          en: "Execute all paths (AND)",
          vi: "Thực thi tất cả các đường dẫn (AND)",
        },
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
        title: { en: "Event Based Gateway", vi: "Cổng dựa trên sự kiện" },
        description: { en: "Wait for events", vi: "Chờ đợi các sự kiện" },
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
          title: { en: "Immediate Email", vi: "Email tức thì" },
          description: {
            en: "Trigger immediately based on email",
            vi: "Kích hoạt tức thì dựa trên email",
          },
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
          title: {
            en: "Immediate Receive Message",
            vi: "Nhận tin nhắn tức thì",
          },
          description: {
            en: "Trigger immediately based on received message",
            vi: "Kích hoạt tức thì khi nhận được tin nhắn",
          },
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
          title: { en: "Immediate Timer", vi: "Bộ định thời tức thì" },
          description: {
            en: "Trigger immediately based on timer",
            vi: "Kích hoạt tức thì dựa trên bộ định thời",
          },
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
          title: { en: "Immediate Signal", vi: "Tín hiệu tức thì" },
          description: {
            en: "Trigger immediately based on signal",
            vi: "Kích hoạt tức thì dựa trên tín hiệu",
          },
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
          title: { en: "Immediate Condition", vi: "Điều kiện tức thì" },
          description: {
            en: "Trigger immediately based on condition",
            vi: "Kích hoạt tức thì dựa trên điều kiện",
          },
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
        title: { en: "End Event", vi: "Sự kiện kết thúc" },
        description: {
          en: "Workflow end point",
          vi: "Điểm kết thúc của workflow",
        },
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
          title: {
            en: "Send Signal End Event",
            vi: "Sự kiện kết thúc gửi tín hiệu",
          },
          description: {
            en: "End workflow and send signal",
            vi: "Kết thúc workflow và gửi tín hiệu",
          },
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
        title: { en: "Note", vi: "Ghi chú" },
        description: { en: "Annotation note", vi: "Ghi chú chú thích" },
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
        title: { en: "Annotation", vi: "Chú thích" },
        description: { en: "Annotation note", vi: "Ghi chú chú thích" },
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
        title: { en: "Pool", vi: "Nhóm" },
        description: {
          en: "Container for organizing workflow elements by participant",
          vi: "Vùng chứa để tổ chức các phần tử workflow theo người tham gia",
        },
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
        title: { en: "Sequence Flow", vi: "Luồng tuần tự" },
        description: {
          en: "Standard BPMN sequence flow connection",
          vi: "Kết nối luồng tuần tự BPMN tiêu chuẩn",
        },
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
        title: { en: "Message Flow", vi: "Luồng tin nhắn" },
        description: {
          en: "BPMN message flow between pools/participants",
          vi: "Luồng tin nhắn BPMN giữa các nhóm/người tham gia",
        },
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
          label: { en: "Message Type", vi: "Loại tin nhắn" },
          description: {
            en: "Type of message being sent",
            vi: "Loại tin nhắn được gửi",
          },
          defaultValue: "default",
          required: false,
          order: 0,
          options: [
            { label: { en: "Default", vi: "Mặc định" }, value: "default" },
            { label: { en: "Email", vi: "Email" }, value: "email" },
            { label: { en: "API Call", vi: "Gọi API" }, value: "api" },
            { label: { en: "Event", vi: "Sự kiện" }, value: "event" },
          ],
        },
        {
          id: "pathType",
          name: "pathType",
          type: "select",
          label: { en: "Path Type", vi: "Loại đường dẫn" },
          description: {
            en: "Visual rendering type",
            vi: "Loại hiển thị hình ảnh",
          },
          defaultValue: EdgePathType.Straight,
          options: [
            {
              label: { en: "Bezier", vi: "Bezier" },
              value: EdgePathType.Bezier,
            },
            {
              label: { en: "Straight", vi: "Thẳng" },
              value: EdgePathType.Straight,
            },
            { label: { en: "Step", vi: "Bước" }, value: EdgePathType.Step },
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
        title: { en: "Association", vi: "Liên kết" },
        description: {
          en: "BPMN association for artifacts and annotations",
          vi: "Liên kết BPMN cho các hiện vật và chú thích",
        },
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
          label: { en: "Direction", vi: "Hướng" },
          description: { en: "Association direction", vi: "Hướng liên kết" },
          defaultValue: "none",
          options: [
            { label: { en: "None", vi: "Không" }, value: "none" },
            { label: { en: "One Way", vi: "Một chiều" }, value: "one" },
            { label: { en: "Both Ways", vi: "Hai chiều" }, value: "both" },
          ],
        },
        {
          id: "pathType",
          type: "select",
          label: { en: "Path Type", vi: "Loại đường dẫn" },
          description: {
            en: "Visual rendering type",
            vi: "Loại hiển thị hình ảnh",
          },
          defaultValue: EdgePathType.Straight,
          options: [
            {
              label: { en: "Bezier", vi: "Bezier" },
              value: EdgePathType.Bezier,
            },
            {
              label: { en: "Straight", vi: "Thẳng" },
              value: EdgePathType.Straight,
            },
            { label: { en: "Step", vi: "Bước" }, value: EdgePathType.Step },
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
          label: { en: "Add Node", vi: "Thêm nút" },
          icon: "",
          onClick: async () => {
            console.log("Add node action triggered");
          },
          children: [
            {
              id: "add-start-node",
              label: { en: "Add Start Node", vi: "Thêm nút bắt đầu" },
              icon: "○",
              onClick: async (context: ContextMenuContext) => {
                console.log("Add Start Node clicked", context);
              },
              children: [
                {
                  id: "add-api-start-event",
                  label: { en: "API Start Event", vi: "Sự kiện bắt đầu API" },
                  icon: "▷",
                  onClick: async (context: ContextMenuContext) => {
                    console.log("Add API Start Event clicked", context);
                  },
                },
              ],
            },
            {
              id: "add-task-node",
              label: { en: "Add Task Node", vi: "Thêm nút nhiệm vụ" },
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
          label: { en: "Add Lane", vi: "Thêm làn đường" },
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
          label: { en: "Toggle Lock Mode", vi: "Bật/tắt chế độ khóa" },
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
          label: { en: "Switch Orientation", vi: "Chuyển hướng" },
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
          label: { en: "Appearance", vi: "Giao diện" },
          icon: {
            type: "lucide",
            value: Highlighter,
          },
          children: [
            {
              id: "color-submenu",
              label: { en: "Change Color", vi: "Thay đổi màu sắc" },
              icon: { type: "lucide", value: Palette },
              children: [
                {
                  id: "color-yellow",
                  label: { en: "Yellow", vi: "Vàng" },
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
                  label: { en: "Blue", vi: "Xanh" },
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
                  label: { en: "Green", vi: "Xanh lá" },
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
                  label: { en: "Pink", vi: "Hồng" },
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
                  label: { en: "Purple", vi: "Tím" },
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
                  label: { en: "Orange", vi: "Cam" },
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
                  label: { en: "Gray", vi: "Xám" },
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
          label: { en: "Delete Pool", vi: "Xóa nhóm" },
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
  },
  async initialize() {
    console.log("Default BPM Plugin initialized");
  },
};
