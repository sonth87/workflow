/**
 * Core Base Types for Dynamic Workflow System
 * Định nghĩa các interface cơ bản cho hệ thống workflow động
 */

import type { CategoryType, NodeType } from "@/enum/workflow.enum";
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
  borderStyle?: "solid" | "dashed" | "dotted" | "double";
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
 * Visual configuration cho Node
 * Centralized styling configuration that can be provided by plugins
 */
export interface NodeVisualConfig {
  // Colors
  backgroundColor?: string;
  borderColor?: string;
  ringColor?: string;
  textColor?: string;
  descriptionColor?: string;

  // Icon styling
  iconBackgroundColor?: string;
  iconColor?: string;

  // Border styling
  borderWidth?: number;
  borderStyle?: "solid" | "dashed" | "dotted" | "double";
  borderRadius?: number;

  // Additional styles
  opacity?: number;
  boxShadow?: string;

  // Custom CSS
  customStyles?: CSSProperties;

  [key: string]: unknown;
}

/**
 * Visual configuration cho Edge
 * Centralized styling configuration that can be provided by plugins
 */
export interface EdgeVisualConfig {
  // Stroke/Path styling
  strokeColor?: string;
  strokeWidth?: number;
  strokeStyle?: "solid" | "dashed" | "dotted" | "double";

  // Selection/Highlight
  selectedStrokeColor?: string;
  selectedStrokeWidth?: number;

  // Arrow/Marker styling
  markerColor?: string;
  markerSize?: number;

  // Label styling
  labelBackgroundColor?: string;
  labelTextColor?: string;
  labelBorderColor?: string;

  // Animation
  animated?: boolean;
  animationDuration?: number;

  // Additional styles
  opacity?: number;

  // Custom CSS
  customStyles?: CSSProperties;

  [key: string]: unknown;
}

/**
 * Color Palette Definition
 * Reusable color schemes for nodes and edges
 */
export interface ColorPalette {
  id: string;
  name: string;
  description?: string;

  // Primary colors
  primary: string;
  secondary?: string;
  accent?: string;

  // Semantic colors
  success?: string;
  warning?: string;
  error?: string;
  info?: string;

  // UI colors
  background?: string;
  foreground?: string;
  border?: string;
  muted?: string;

  // Additional custom colors
  [key: string]: string | undefined;
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
  value: string | ReactNode | React.ComponentType<any>; // Icon name (lucide) hoặc URL (image) hoặc ReactNode
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
  icon?: IconConfig | string; // Có thể là IconConfig hoặc string (emoji/text)
  color?: string; // Màu sắc để hiển thị (cho color picker)
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
  nodeType: NodeType | string; // 'start', 'end', 'task', 'gateway', etc.
  category: CategoryType | string; // 'event', 'task', 'gateway', 'annotation', etc.

  // Input/Output definitions
  inputs?: IODefinition[];
  outputs?: IODefinition[];

  // Visual & Styling
  icon?: IconConfig;
  visualConfig?: NodeVisualConfig; // New: Centralized visual configuration
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
 * Edge path type union - Kiểu đường vẽ (rendering type), có thể mở rộng bởi plugins
 */
export type EdgePathTypeValue =
  | "default"
  | "straight"
  | "step"
  | "smoothstep"
  | "bezier"
  | "simplebezier"
  | string; // Allow custom path types from plugins

/**
 * Base Edge Configuration - Core interface cho tất cả edge types
 */
export interface BaseEdgeConfig extends Edge {
  // Thông tin cơ bản
  metadata: BaseMetadata;

  // Path rendering type (Bezier, Straight, Step)
  pathType: EdgePathTypeValue;

  // Visual & Styling
  visualConfig?: EdgeVisualConfig; // New: Centralized visual configuration
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
// Pool & Lane Types
// ============================================

/**
 * Orientation for Pool/Lane display
 */
export type PoolLaneOrientation = "horizontal" | "vertical";

/**
 * Lane configuration within a Pool
 */
export interface LaneConfig {
  id: string; // Unique identifier for this lane section
  label: string; // Display label for the lane
  size?: number; // Size in pixels (width for vertical, height for horizontal)
  minSize?: number; // Minimum size constraint
}

/**
 * Pool Node Data - Container that can have multiple lanes
 */
export interface PoolNodeData extends BaseNodeConfig {
  nodeType: "pool";
  // Pool specific properties
  isLocked?: boolean; // Lock mode - nodes cannot escape pool
  orientation?: PoolLaneOrientation; // horizontal or vertical layout
  lanes?: LaneConfig[]; // Array of lane configurations (sections within the pool)
  color?: string; // Background color for the pool
  minWidth?: number;
  minHeight?: number;
  resizable?: boolean;
}

/**
 * Lane Node Data - DEPRECATED
 * Lanes are now rendered as sections within Pool component
 * @deprecated Use Pool with LaneConfig sections instead
 */
export interface LaneNodeData extends BaseNodeConfig {
  nodeType: "lane";
  // Lane specific properties
  isLocked?: boolean; // Lock mode - nodes cannot escape lane
  orientation?: PoolLaneOrientation; // horizontal or vertical layout
  parentPoolId?: string; // Reference to parent pool if inside pool
  minWidth?: number;
  minHeight?: number;
  resizable?: boolean;
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
