/**
 * Icon configuration utilities for workflow nodes
 */

import { NodeType } from "@/enum/workflow.enum";

// Import workflow icons
import EndDefault from "@/assets/workflow/end-default.svg";
import EndSendSignal from "@/assets/workflow/end-send-signal.svg";
import StartApi from "@/assets/workflow/start-api.svg";
import StartDefault from "@/assets/workflow/start-default.svg";
import StartReceiveSignal from "@/assets/workflow/start-receive-signal.svg";
import StartTimer from "@/assets/workflow/start-timer.svg";
import StartWeb from "@/assets/workflow/start-web.svg";
import TaskAi from "@/assets/workflow/task-ai.svg";
import TaskBusinessRule from "@/assets/workflow/task-businessrule.svg";
import TaskDefault from "@/assets/workflow/task-default.svg";
import TaskManual from "@/assets/workflow/task-manual.svg";
import TaskScript from "@/assets/workflow/task-script.svg";
import TaskSendNoti from "@/assets/workflow/task-sendnoti.svg";
import TaskSystem from "@/assets/workflow/task-system.svg";
import TaskUser from "@/assets/workflow/task-user.svg";

// Import gateway icons
import InclusiveGateway from "@/assets/workflow/gateway-eventbased.svg";
import ExclusiveGateway from "@/assets/workflow/gateway-exclusive.svg";
import ParallelGateway from "@/assets/workflow/gateway-parallel.svg";

// Lucide icons for nodes without custom SVG
import {
  AlarmClock,
  Bell,
  Clock,
  Cog,
  GitPullRequest,
  LayoutGrid,
  ListCheck,
  Mail,
  MessageSquareText,
  Radio,
  StickyNote,
  Workflow,
  type LucideIcon,
} from "lucide-react";

export type StartEventVariant =
  | "default"
  | "api"
  | "timer"
  | "web"
  | "receiveSignal";
export type TaskVariant =
  | "default"
  | "system"
  | "user"
  | "sendNotification"
  | "script"
  | "manual"
  | "businessRule"
  | "ai";

export type EndEventVariant = "default" | "sendSignal";

export interface IconConfig {
  icon: string | LucideIcon;
  color: string;
  bgColor: string;
  label: string;
}

// Start event variants mapping
const START_EVENT_ICONS: Record<StartEventVariant, string> = {
  default: StartDefault,
  api: StartApi,
  timer: StartTimer,
  web: StartWeb,
  receiveSignal: StartReceiveSignal,
};

const TASK_ICONS: Record<TaskVariant, string> = {
  default: TaskDefault,
  system: TaskSystem,
  user: TaskUser,
  sendNotification: TaskSendNoti,
  script: TaskScript,
  manual: TaskManual,
  businessRule: TaskBusinessRule,
  ai: TaskAi,
};

const END_EVENT_ICONS: Record<EndEventVariant, string> = {
  default: EndDefault,
  sendSignal: EndSendSignal,
};

// Node type to icon configuration
const NODE_ICON_CONFIG: Record<NodeType | string, IconConfig> = {
  [NodeType.START_EVENT]: {
    icon: StartDefault,
    color: "#39CC7E",
    bgColor: "#E8F8EF",
    label: "Start",
  },
  [NodeType.START_EVENT_DEFAULT]: {
    icon: StartDefault,
    color: "#39CC7E",
    bgColor: "#E8F8EF",
    label: "Start",
  },
  [NodeType.START_EVENT_API]: {
    icon: StartApi,
    color: "#39CC7E",
    bgColor: "#E8F8EF",
    label: "Start",
  },
  [NodeType.START_EVENT_TIMER]: {
    icon: StartTimer,
    color: "#39CC7E",
    bgColor: "#E8F8EF",
    label: "Start",
  },
  [NodeType.START_EVENT_WEB]: {
    icon: StartWeb,
    color: "#39CC7E",
    bgColor: "#E8F8EF",
    label: "Start",
  },
  [NodeType.START_EVENT_RECEIVE_SIGNAL]: {
    icon: StartReceiveSignal,
    color: "#39CC7E",
    bgColor: "#E8F8EF",
    label: "Start",
  },
  [NodeType.END_EVENT_DEFAULT]: {
    icon: END_EVENT_ICONS.default,
    color: "#FF6262",
    bgColor: "#FFEBEB",
    label: "End",
  },
  [NodeType.END_EVENT_SEND_SIGNAL]: {
    icon: END_EVENT_ICONS.sendSignal,
    color: "#FF6262",
    bgColor: "#FFEBEB",
    label: "End",
  },
  [NodeType.TASK_DEFAULT]: {
    icon: TASK_ICONS.default,
    color: "#3B82F6",
    bgColor: "#EFF6FF",
    label: "Task",
  },
  [NodeType.TASK_SYSTEM]: {
    icon: TASK_ICONS.system,
    color: "#3B82F6",
    bgColor: "#EFF6FF",
    label: "Task",
  },
  [NodeType.TASK_USER]: {
    icon: TASK_ICONS.user,
    color: "#3B82F6",
    bgColor: "#EFF6FF",
    label: "Task",
  },
  [NodeType.TASK_SEND_NOTIFICATION]: {
    icon: TASK_ICONS.sendNotification,
    color: "#3B82F6",
    bgColor: "#EFF6FF",
    label: "Task",
  },
  [NodeType.TASK_SCRIPT]: {
    icon: TASK_ICONS.script,
    color: "#3B82F6",
    bgColor: "#EFF6FF",
    label: "Task",
  },
  [NodeType.TASK_MANUAL]: {
    icon: TASK_ICONS.manual,
    color: "#3B82F6",
    bgColor: "#EFF6FF",
    label: "Task",
  },
  [NodeType.TASK_BUSINESS_RULE]: {
    icon: TASK_ICONS.businessRule,
    color: "#3B82F6",
    bgColor: "#EFF6FF",
    label: "Task",
  },
  [NodeType.TASK_AI]: {
    icon: TASK_ICONS.ai,
    color: "#3B82F6",
    bgColor: "#EFF6FF",
    label: "Task",
  },
  [NodeType.SERVICE_TASK]: {
    icon: Cog,
    color: "#8B5CF6",
    bgColor: "#F3E8FF",
    label: "Service Task",
  },
  [NodeType.NOTIFICATION]: {
    icon: Bell,
    color: "#F59E0B",
    bgColor: "#FEF3C7",
    label: "Notification",
  },
  [NodeType.TIME_DELAY]: {
    icon: Clock,
    color: "#06B6D4",
    bgColor: "#E0F7FA",
    label: "Time Delay",
  },
  [NodeType.EXCLUSIVE_GATEWAY]: {
    icon: ExclusiveGateway,
    color: "#EC4899",
    bgColor: "#FCE7F3",
    label: "Exclusive Gateway",
  },
  [NodeType.PARALLEL_GATEWAY]: {
    icon: ParallelGateway,
    color: "#10B981",
    bgColor: "#D1FAE5",
    label: "Parallel Gateway",
  },
  [NodeType.INCLUSIVE_GATEWAY]: {
    icon: InclusiveGateway,
    color: "#14B8A6",
    bgColor: "#CCFBF1",
    label: "Inclusive Gateway",
  },
  [NodeType.PARALLEL_GATEWAY_JOIN]: {
    icon: GitPullRequest,
    color: "#10B981",
    bgColor: "#D1FAE5",
    label: "Parallel Gateway Join",
  },
  [NodeType.SUBFLOW]: {
    icon: Workflow,
    color: "#6366F1",
    bgColor: "#E0E7FF",
    label: "Subflow",
  },
  [NodeType.POOL]: {
    icon: LayoutGrid,
    color: "#64748B",
    bgColor: "#F1F5F9",
    label: "Pool",
  },
  [NodeType.NOTE]: {
    icon: StickyNote,
    color: "#FBBF24",
    bgColor: "#FEF9C3",
    label: "Note",
  },
  [NodeType.ANNOTATION]: {
    icon: MessageSquareText,
    color: "#FBBF24",
    bgColor: "#FEF9C3",
    label: "Annotation",
  },
  // Immediate nodes
  [NodeType.IMMEDIATE_EMAIL]: {
    icon: Mail,
    color: "#FFFFFF",
    bgColor: "#FFD67A",
    label: "Immediate Email",
  },
  [NodeType.IMMEDIATE_RECEIVE_MESSAGE]: {
    icon: Mail,
    color: "#FFFFFF",
    bgColor: "#FFD67A",
    label: "Immediate Receive Message",
  },
  [NodeType.IMMEDIATE_TIMER]: {
    icon: AlarmClock,
    color: "#FFFFFF",
    bgColor: "#FFD67A",
    label: "Immediate Timer",
  },
  [NodeType.IMMEDIATE_SIGNAL]: {
    icon: Radio,
    color: "#FFFFFF",
    bgColor: "#FFD67A",
    label: "Immediate Signal",
  },
  [NodeType.IMMEDIATE_CONDITION]: {
    icon: ListCheck,
    color: "#FFFFFF",
    bgColor: "#FFD67A",
    label: "Immediate Condition",
  },
};

export function getIconConfig(
  type: NodeType,
  startVariant?: StartEventVariant
): IconConfig {
  const config =
    NODE_ICON_CONFIG[type] || NODE_ICON_CONFIG[NodeType.TASK_DEFAULT];

  if (type === NodeType.START_EVENT_DEFAULT && startVariant) {
    return {
      ...config,
      icon: START_EVENT_ICONS[startVariant] || START_EVENT_ICONS.default,
    };
  }

  return config;
}
