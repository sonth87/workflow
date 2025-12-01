import { NodeType } from '@/enum/workflow.enum'

// Import workflow icons
import StartDefault from '@/assets/workflow/start-default.svg'
import StartApi from '@/assets/workflow/start-api.svg'
import StartTimer from '@/assets/workflow/start-timer.svg'
import StartWeb from '@/assets/workflow/start-web.svg'
import StartReceiveSignal from '@/assets/workflow/start-receive-signal.svg'

// Lucide icons for nodes without custom SVG
import {
  CircleStop,
  ClipboardList,
  Cog,
  Bell,
  Clock,
  GitBranch,
  GitMerge,
  GitPullRequest,
  Workflow,
  LayoutGrid,
  StickyNote,
  type LucideIcon,
} from 'lucide-react'

export type StartEventVariant = 'default' | 'api' | 'timer' | 'web' | 'receive-signal'

export interface IconConfig {
  icon: string | LucideIcon
  color: string
  bgColor: string
  label: string
}

// Start event variants mapping
const START_EVENT_ICONS: Record<StartEventVariant, string> = {
  default: StartDefault,
  api: StartApi,
  timer: StartTimer,
  web: StartWeb,
  'receive-signal': StartReceiveSignal,
}

// Node type to icon configuration
const NODE_ICON_CONFIG: Record<NodeType, IconConfig> = {
  [NodeType.START_EVENT]: {
    icon: StartDefault,
    color: '#39CC7E',
    bgColor: '#E8F8EF',
    label: 'Start',
  },
  [NodeType.END_EVENT]: {
    icon: CircleStop,
    color: '#FF6262',
    bgColor: '#FFEBEB',
    label: 'End',
  },
  [NodeType.TASK]: {
    icon: ClipboardList,
    color: '#3B82F6',
    bgColor: '#EFF6FF',
    label: 'Task',
  },
  [NodeType.SERVICE_TASK]: {
    icon: Cog,
    color: '#8B5CF6',
    bgColor: '#F3E8FF',
    label: 'Service Task',
  },
  [NodeType.NOTIFICATION]: {
    icon: Bell,
    color: '#F59E0B',
    bgColor: '#FEF3C7',
    label: 'Notification',
  },
  [NodeType.TIME_DELAY]: {
    icon: Clock,
    color: '#06B6D4',
    bgColor: '#E0F7FA',
    label: 'Time Delay',
  },
  [NodeType.EXCLUSIVE_GATEWAY]: {
    icon: GitBranch,
    color: '#EC4899',
    bgColor: '#FCE7F3',
    label: 'Exclusive Gateway',
  },
  [NodeType.PARALLEL_GATEWAY]: {
    icon: GitMerge,
    color: '#10B981',
    bgColor: '#D1FAE5',
    label: 'Parallel Gateway',
  },
  [NodeType.PARALLEL_GATEWAY_JOIN]: {
    icon: GitPullRequest,
    color: '#14B8A6',
    bgColor: '#CCFBF1',
    label: 'Parallel Join',
  },
  [NodeType.SUBFLOW]: {
    icon: Workflow,
    color: '#6366F1',
    bgColor: '#E0E7FF',
    label: 'Subflow',
  },
  [NodeType.POOL]: {
    icon: LayoutGrid,
    color: '#64748B',
    bgColor: '#F1F5F9',
    label: 'Pool',
  },
  [NodeType.NOTE]: {
    icon: StickyNote,
    color: '#FBBF24',
    bgColor: '#FEF9C3',
    label: 'Note',
  },
}

/**
 * Get icon configuration for a node type
 * @param type - NodeType
 * @param startVariant - Optional variant for START_EVENT (default, api, timer, web, receive-signal)
 */
export function getIconConfig(type: NodeType, startVariant?: StartEventVariant): IconConfig {
  const config = NODE_ICON_CONFIG[type] || NODE_ICON_CONFIG[NodeType.TASK]

  // Handle start event variants
  if (type === NodeType.START_EVENT && startVariant) {
    return {
      ...config,
      icon: START_EVENT_ICONS[startVariant] || START_EVENT_ICONS.default,
    }
  }

  return config
}

export default getIconConfig
