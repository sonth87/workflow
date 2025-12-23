/**
 * Validation Types
 * Định nghĩa types cho validation system
 */

import type { PropertyEntity } from "./propertyDefinition";
import type { ValidationError, ValidationWarning } from "./propertyDefinition";

/**
 * Kết quả validation cho một field
 */
export interface FieldValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

/**
 * Kết quả validation cho toàn bộ entity
 */
export interface EntityValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
  fieldResults: Map<string, FieldValidationResult>;
}

/**
 * Validation context
 */
export interface ValidationContext {
  entity: PropertyEntity;
  allValues: Record<string, unknown>;
  changedField?: string;
}

/**
 * Custom validator function
 */
export type CustomValidator = (
  value: unknown,
  context: ValidationContext
) => FieldValidationResult | Promise<FieldValidationResult>;

/**
 * Validation options
 */
export interface ValidationOptions {
  // Validate tất cả fields hay chỉ field thay đổi
  mode?: "all" | "changed";

  // Abort early khi gặp error đầu tiên
  abortEarly?: boolean;

  // Async validation
  async?: boolean;
}
