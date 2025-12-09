/**
 * Core Base Types for Dynamic Workflow System
 * Định nghĩa các interface cơ bản cho hệ thống workflow động
 */

import type { Node, Edge } from "@xyflow/react";
import type { CSSProperties, ReactNode } from "react";

// ============================================
// Metadata & Configuration Types
// ============================================

/**
 * Thông tin metadata cơ bản có thể mở rộng
 */
export interface BaseMetadata {
  id: string;
  title: string;
  description?: string;
  version?: string;
  author?: string;
  createdAt?: Date;
  updatedAt?: Date;
  tags?: string[];
  [key: string]: unknown; // Cho phép các hệ thống khác thêm metadata riêng
}

/**
 * Thông tin về input/output của node
 */
export interface IODefinition {
  id: string;
  label?: string;
  type?: string; // data type: string, number, boolean, object, etc.
  required?: boolean;
  description?: string;
  position?: "top" | "right" | "bottom" | "left";
  maxConnections?: number; // Số lượng connection tối đa cho handle này
  validation?: ValidationRule[];
  [key: string]: unknown;
}

/**
 * Cấu hình style động
 */
export interface DynamicStyle {
  backgroundColor?: string;
  borderColor?: string;
  borderWidth?: number;
  borderStyle?: "solid" | "dashed" | "dotted";
  borderRadius?: number;
  width?: number | string;
  height?: number | string;
  minWidth?: number;
  minHeight?: number;
  maxWidth?: number;
  maxHeight?: number;
  padding?: number | string;
  opacity?: number;
  boxShadow?: string;
  color?: string;
  fontSize?: number;
  fontWeight?: string | number;
  [key: string]: unknown; // Custom CSS properties
}

/**
 * Theme configuration cho từng loại node/edge
 */
export interface ThemeConfig {
  name: string;
  colors: {
    primary?: string;
    secondary?: string;
    success?: string;
    warning?: string;
    error?: string;
    [key: string]: string | undefined;
  };
  styles?: DynamicStyle;
  [key: string]: unknown;
}

/**
 * Icon configuration
 */
export interface IconConfig {
  type: "lucide" | "custom" | "svg" | "image";
  value: string | ReactNode; // Icon name (lucide) hoặc URL (image) hoặc ReactNode
  color?: string;
  backgroundColor?: string;
  size?: number;
  [key: string]: unknown;
}

// ============================================
// Validation & Rules
// ============================================

/**
 * Base validation rule
 */
export interface ValidationRule {
  id: string;
  type: string; // 'required', 'min', 'max', 'pattern', 'custom', etc.
  message: string;
  value?: unknown;
  validator?: (value: unknown, context?: unknown) => boolean | Promise<boolean>;
  [key: string]: unknown;
}

/**
 * Connection validation rule
 */
export interface ConnectionRule {
  id: string;
  name: string;
  description?: string;
  // Validation cho source node
  sourceNodeTypes?: string[];
  sourceHandleTypes?: string[];
  maxOutputConnections?: number;
  // Validation cho target node
  targetNodeTypes?: string[];
  targetHandleTypes?: string[];
  maxInputConnections?: number;
  // Custom validation function
  validate?: (
    source: BaseNodeConfig,
    target: BaseNodeConfig,
    sourceHandle?: string,
    targetHandle?: string
  ) => boolean | { valid: boolean; message?: string };
  [key: string]: unknown;
}

// ============================================
// Context Menu
// ============================================

export interface ContextMenuItem {
  id: string;
  label: string;
  icon?: IconConfig;
  disabled?: boolean;
  separator?: boolean;
  children?: ContextMenuItem[];
  onClick?: (context: ContextMenuContext) => void | Promise<void>;
  visible?: (context: ContextMenuContext) => boolean;
  [key: string]: unknown;
}

export interface ContextMenuContext {
  nodeId?: string;
  edgeId?: string;
  node?: BaseNodeConfig;
  edge?: BaseEdgeConfig;
  position?: { x: number; y: number };
  [key: string]: unknown;
}

// ============================================
// Properties & Configuration
// ============================================

/**
 * Property definition cho config panel
 */
export interface PropertyDefinition {
  id: string;
  type:
    | "text"
    | "number"
    | "boolean"
    | "select"
    | "multiselect"
    | "textarea"
    | "color"
    | "date"
    | "json"
    | "custom";
  label: string;
  description?: string;
  defaultValue?: unknown;
  required?: boolean;
  visible?: boolean | ((data: unknown) => boolean);
  disabled?: boolean | ((data: unknown) => boolean);
  validation?: ValidationRule[];
  options?: Array<{ label: string; value: unknown }>; // For select/multiselect
  placeholder?: string;
  group?: string; // Để group các properties lại
  order?: number;
  customRenderer?: (props: PropertyRendererProps) => ReactNode; // Custom component
  [key: string]: unknown;
}

export interface PropertyRendererProps {
  property: PropertyDefinition;
  value: unknown;
  onChange: (value: unknown) => void;
  error?: string;
  [key: string]: unknown;
}

// ============================================
// Base Node Configuration
// ============================================

/**
 * Base Node Configuration - Core interface cho tất cả node types
 */
export interface BaseNodeConfig extends Node {
  // Thông tin cơ bản
  metadata: BaseMetadata;

  // Node type và category
  nodeType: string; // 'start', 'end', 'task', 'gateway', etc.
  category: string; // 'event', 'task', 'gateway', 'annotation', etc.

  // Input/Output definitions
  inputs?: IODefinition[];
  outputs?: IODefinition[];

  // Visual & Styling
  icon?: IconConfig;
  style?: DynamicStyle;
  theme?: string; // Reference đến theme trong ThemeRegistry
  collapsible?: boolean;
  collapsed?: boolean;

  // Properties & Configuration
  properties?: Record<string, unknown>; // Runtime values
  propertyDefinitions?: PropertyDefinition[]; // Schema cho properties panel

  // Validation
  validationRules?: ValidationRule[];
  connectionRules?: ConnectionRule[];

  // Context Menu
  contextMenu?: ContextMenuItem[];

  // Custom data từ external systems
  customData?: Record<string, unknown>;

  // Behavior
  editable?: boolean;
  deletable?: boolean;
  connectable?: boolean;
  draggable?: boolean;

  [key: string]: unknown; // Cho phép extension tùy ý
}

// ============================================
// Base Edge Configuration
// ============================================

export interface EdgeLabel {
  text: string;
  position: "start" | "center" | "end"; // Vị trí label trên edge
  style?: DynamicStyle;
  [key: string]: unknown;
}

export interface EdgeAnimation {
  enabled: boolean;
  duration?: number; // ms
  direction?: "forward" | "backward" | "both";
  [key: string]: unknown;
}

/**
 * Base Edge Configuration - Core interface cho tất cả edge types
 */
export interface BaseEdgeConfig extends Edge {
  // Thông tin cơ bản
  metadata: BaseMetadata;

  // Edge type
  edgeType: string; // 'default', 'smoothstep', 'step', 'straight', 'bezier', 'custom'

  // Visual & Styling
  labels?: EdgeLabel[]; // Nhiều labels cho start, center, end
  style?: DynamicStyle;
  pathStyle?: "solid" | "dashed" | "dotted";
  pathWidth?: number;
  markerStart?: string; // Arrow marker at start
  markerEnd?: string; // Arrow marker at end

  // Animation
  animation?: EdgeAnimation;

  // Conditional logic
  condition?: string; // Expression để evaluate khi nào edge này được follow

  // Properties & Configuration
  properties?: Record<string, unknown>;
  propertyDefinitions?: PropertyDefinition[];

  // Context Menu
  contextMenu?: ContextMenuItem[];

  // Custom data từ external systems
  customData?: Record<string, unknown>;

  // Behavior
  editable?: boolean;
  deletable?: boolean;
  selectable?: boolean;

  [key: string]: unknown;
}

// ============================================
// Rule Configuration
// ============================================

export interface BaseRuleConfig {
  id: string;
  name: string;
  description?: string;
  type: "validation" | "connection" | "execution" | "custom";
  enabled: boolean;
  priority?: number; // Thứ tự thực thi của rule
  scope?: "global" | "node" | "edge" | "workflow"; // Phạm vi áp dụng

  // Rule logic
  condition?: string | ((context: unknown) => boolean);
  action?: (context: unknown) => void | Promise<void>;

  // Configuration
  properties?: Record<string, unknown>;
  propertyDefinitions?: PropertyDefinition[];

  [key: string]: unknown;
}

// ============================================
// Registry Item Types
// ============================================

/**
 * Item trong registry cần có metadata và configuration
 */
export interface RegistryItem<T = unknown> {
  id: string;
  type: string;
  name: string;
  description?: string;
  category?: string;
  icon?: IconConfig;
  config: T;
  metadata?: Record<string, unknown>;
  [key: string]: unknown;
}

// ============================================
// Event System Types
// ============================================

export interface WorkflowEvent<T = unknown> {
  type: string;
  timestamp: Date;
  payload: T;
  source?: string;
  [key: string]: unknown;
}

export type EventListener<T = unknown> = (event: WorkflowEvent<T>) => void;

export interface EventSubscription {
  unsubscribe: () => void;
}
