/**
 * Property Definition Types
 * Định nghĩa type system cho property configuration
 */

import type { BaseNodeConfig, BaseEdgeConfig } from "@/core/types/base.types";
import type { MultilingualTextType } from "@/types/dynamic-bpm.type";
import type { ZodType } from "zod";
import type React from "react";

/**
 * Các loại field hỗ trợ
 */
export type PropertyFieldType =
  | "text"
  | "number"
  | "textarea"
  | "boolean"
  | "select"
  | "multiselect"
  | "color"
  | "json"
  | "date"
  | "slider"
  | "custom";

/**
 * Entity có thể là Node hoặc Edge
 */
export type PropertyEntity = BaseNodeConfig | BaseEdgeConfig;

/**
 * Điều kiện để hiển thị/disable field
 */
export type PropertyCondition =
  | ((entity: PropertyEntity) => boolean)
  | {
      field: string;
      operator: "equals" | "notEquals" | "includes" | "notIncludes" | "custom";
      value: unknown;
      customCheck?: (fieldValue: unknown, entity: PropertyEntity) => boolean;
    };

/**
 * Options cho select, multiselect, radio
 */
export interface FieldOption {
  label: MultilingualTextType | string;
  value: string | number | boolean;
  description?: MultilingualTextType | string;
  icon?: React.ComponentType;
  disabled?: boolean;
}

/**
 * Configuration cho các field types khác nhau
 */
export interface FieldOptions {
  // For select, multiselect
  options?: FieldOption[];

  // For number, slider
  min?: number;
  max?: number;
  step?: number;

  // For text, textarea
  maxLength?: number;
  minLength?: number;
  pattern?: string;

  // For multiselect
  multiple?: boolean;
  maxItems?: number;

  // For date
  minDate?: Date;
  maxDate?: Date;
  format?: string;

  // Custom options
  [key: string]: unknown;
}

/**
 * Custom renderer cho field
 */
export type PropertyRenderer = (props: {
  definition: PropertyFieldDefinition;
  value: unknown;
  onChange: (value: unknown) => void;
  entity: PropertyEntity;
  errors?: ValidationError[];
}) => React.ReactElement;

/**
 * Validation error
 */
export interface ValidationError {
  field: string;
  message: string;
  code?: string;
}

/**
 * Validation warning
 */
export interface ValidationWarning {
  field: string;
  message: string;
}

/**
 * Định nghĩa một field trong property panel
 */
export interface PropertyFieldDefinition {
  id: string; // Unique ID của field
  label: MultilingualTextType | string; // Label hiển thị
  type: PropertyFieldType; // Loại field

  // Value configuration
  defaultValue?: unknown;
  placeholder?: MultilingualTextType | string;
  helpText?: MultilingualTextType | string; // Tooltip hoặc help text

  // Behavior
  required?: boolean;
  readonly?: boolean;
  disabled?: PropertyCondition;
  visible?: PropertyCondition;

  // Validation
  validation?: ZodType; // Zod schema cho validation

  // Field-specific options
  options?: FieldOptions;

  // Custom rendering
  customRenderer?: PropertyRenderer;

  // Metadata
  order?: number; // Thứ tự hiển thị trong group
  group?: string; // Group ID (nếu không có sẽ dùng group mặc định)
}

/**
 * Định nghĩa một nhóm properties (Tab)
 */
export interface PropertyGroupDefinition {
  id: string; // Unique ID của group/tab
  label: MultilingualTextType | string; // Label hiển thị trên tab
  description?: MultilingualTextType | string; // Mô tả group
  icon?: React.ComponentType<{ className?: string }>; // Icon cho tab

  // Behavior
  order: number; // Thứ tự hiển thị tab
  visible?: PropertyCondition; // Điều kiện hiển thị tab
  collapsible?: boolean; // Có thể collapse không (nếu không dùng tabs)
  defaultCollapsed?: boolean;

  // Fields trong group
  fields: PropertyFieldDefinition[];

  // Metadata
  metadata?: Record<string, unknown>;
}

/**
 * Configuration cho một loại Node
 */
export interface NodePropertyConfiguration {
  nodeType: string;
  propertyGroups: PropertyGroupDefinition[];
}

/**
 * Configuration cho một loại Edge
 */
export interface EdgePropertyConfiguration {
  edgeType: string;
  propertyGroups: PropertyGroupDefinition[];
}

/**
 * Kết quả khi evaluate condition
 */
export interface ConditionResult {
  visible: boolean;
  disabled: boolean;
  reason?: string;
}

/**
 * Context khi render property field
 */
export interface PropertyFieldContext {
  entity: PropertyEntity;
  allValues: Record<string, unknown>; // Tất cả values hiện tại
  errors: ValidationError[];
  warnings: ValidationWarning[];
  isValidating: boolean;
}
