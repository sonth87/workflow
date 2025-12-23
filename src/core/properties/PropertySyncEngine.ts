/**
 * Property Sync Engine
 * Xử lý sync property changes với validation
 */

import type {
  BaseNodeConfig,
  BaseEdgeConfig,
  BaseMetadata,
} from "@/core/types/base.types";
import type {
  PropertyEntity,
  PropertyFieldDefinition,
  PropertyGroupDefinition,
  ValidationError,
  ValidationWarning,
} from "./types/propertyDefinition";
import type {
  EntityValidationResult,
  FieldValidationResult,
  ValidationOptions,
} from "./types/validationTypes";
import { ZodError, type ZodSchema } from "zod";

/**
 * Kết quả sau khi sync property
 */
export interface PropertySyncResult {
  updates: Partial<BaseNodeConfig | BaseEdgeConfig>;
  errors: ValidationError[];
  warnings: ValidationWarning[];
  valid: boolean;
}

/**
 * Property Sync Engine
 * Xử lý logic sync property changes và validation
 */
export class PropertySyncEngine {
  /**
   * Sync một property change
   */
  syncProperty(
    entity: PropertyEntity,
    propertyId: string,
    value: unknown,
    fieldDefinition?: PropertyFieldDefinition
  ): PropertySyncResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    // Validate nếu có schema
    if (fieldDefinition?.validation) {
      const validationResult = this.validateField(
        propertyId,
        value,
        fieldDefinition.validation
      );

      if (!validationResult.valid) {
        errors.push(...validationResult.errors);
        warnings.push(...validationResult.warnings);
      }
    }

    // Tạo updates dựa trên field type
    const updates: Partial<BaseNodeConfig | BaseEdgeConfig> = {};

    if (propertyId === "id") {
      // ID field không thể thay đổi
      // Không thêm gì vào updates
    } else if (propertyId === "description") {
      // Description field update cả metadata và data
      updates.metadata = {
        ...entity.metadata,
        description: value as string,
      };
      updates.data = {
        ...(entity.data || {}),
        description: value,
      };
      updates.properties = {
        ...entity.properties,
        [propertyId]: value,
      };
    } else {
      // Other fields: update properties và data
      updates.properties = {
        ...entity.properties,
        [propertyId]: value,
      };
      updates.data = {
        ...(entity.data || {}),
        [propertyId]: value,
      };
    }

    return {
      updates,
      errors,
      warnings,
      valid: errors.length === 0,
    };
  }

  /**
   * Sync nhiều property changes cùng lúc
   */
  syncProperties(
    entity: PropertyEntity,
    changes: Record<string, unknown>,
    fieldDefinitions?: Map<string, PropertyFieldDefinition>
  ): PropertySyncResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    // Validate từng field
    if (fieldDefinitions) {
      Object.entries(changes).forEach(([propertyId, value]) => {
        const definition = fieldDefinitions.get(propertyId);
        if (definition?.validation) {
          const validationResult = this.validateField(
            propertyId,
            value,
            definition.validation
          );

          if (!validationResult.valid) {
            errors.push(...validationResult.errors);
            warnings.push(...validationResult.warnings);
          }
        }
      });
    }

    // Tạo updates dựa trên field types
    const updates: Partial<BaseNodeConfig | BaseEdgeConfig> = {};
    const propertiesUpdates: Record<string, unknown> = { ...entity.properties };
    const dataUpdates: Record<string, unknown> = { ...(entity.data || {}) };
    let metadataUpdates: BaseMetadata | undefined;

    Object.entries(changes).forEach(([propertyId, value]) => {
      if (propertyId === "id") {
        // ID field không thể thay đổi
        return;
      } else if (propertyId === "description") {
        // Description field update cả metadata và data
        metadataUpdates = {
          ...entity.metadata,
          description: value as string,
        };
        dataUpdates[propertyId] = value;
        propertiesUpdates[propertyId] = value;
      } else {
        // Other fields: update properties và data
        propertiesUpdates[propertyId] = value;
        dataUpdates[propertyId] = value;
      }
    });

    updates.properties = propertiesUpdates;
    updates.data = dataUpdates;
    if (metadataUpdates) {
      updates.metadata = metadataUpdates;
    }

    return {
      updates,
      errors,
      warnings,
      valid: errors.length === 0,
    };
  }

  /**
   * Validate toàn bộ entity dựa trên property groups
   */
  validateEntity(
    entity: PropertyEntity,
    propertyGroups: PropertyGroupDefinition[],
    options: ValidationOptions = {}
  ): EntityValidationResult {
    const fieldResults = new Map<string, FieldValidationResult>();
    const allErrors: ValidationError[] = [];
    const allWarnings: ValidationWarning[] = [];

    // Collect tất cả field definitions
    const allFields = propertyGroups.flatMap(group => group.fields);

    // Validate từng field
    for (const field of allFields) {
      let value: unknown = field.defaultValue;

      if (field.id === "id") {
        // ID field lấy từ entity.id
        value = entity.id;
      } else if (field.id === "description") {
        // Description field lấy từ metadata hoặc data
        value =
          entity.metadata?.description ??
          entity.data?.description ??
          field.defaultValue;
      } else {
        // Other fields: properties first, then data, then default
        value =
          entity.properties?.[field.id] ??
          entity.data?.[field.id] ??
          field.defaultValue;
      }

      // Skip nếu field không có validation
      if (!field.validation) {
        continue;
      }

      const result = this.validateField(field.id, value, field.validation);
      fieldResults.set(field.id, result);

      if (!result.valid) {
        allErrors.push(...result.errors);
        allWarnings.push(...result.warnings);

        // Abort early nếu được config
        if (options.abortEarly && result.errors.length > 0) {
          break;
        }
      }
    }

    return {
      valid: allErrors.length === 0,
      errors: allErrors,
      warnings: allWarnings,
      fieldResults,
    };
  }

  /**
   * Validate một field với Zod schema
   */
  private validateField(
    fieldId: string,
    value: unknown,
    schema: ZodSchema
  ): FieldValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    try {
      schema.parse(value);
      return { valid: true, errors, warnings };
    } catch (err) {
      if (err instanceof ZodError) {
        err.issues.forEach(issue => {
          errors.push({
            field: fieldId,
            message: issue.message,
            code: issue.code,
          });
        });
      } else {
        errors.push({
          field: fieldId,
          message: "Validation failed",
        });
      }

      return { valid: false, errors, warnings };
    }
  }

  /**
   * Check xem field có visible không dựa trên condition
   */
  isFieldVisible(
    field: PropertyFieldDefinition,
    entity: PropertyEntity
  ): boolean {
    if (!field.visible) {
      return true; // Mặc định là visible
    }

    if (typeof field.visible === "function") {
      return field.visible(entity);
    }

    // Evaluate condition object
    const condition = field.visible;
    const fieldValue = entity.properties?.[condition.field];

    switch (condition.operator) {
      case "equals":
        return fieldValue === condition.value;
      case "notEquals":
        return fieldValue !== condition.value;
      case "includes":
        return (
          Array.isArray(fieldValue) && fieldValue.includes(condition.value)
        );
      case "notIncludes":
        return (
          Array.isArray(fieldValue) && !fieldValue.includes(condition.value)
        );
      case "custom":
        return condition.customCheck
          ? condition.customCheck(fieldValue, entity)
          : true;
      default:
        return true;
    }
  }

  /**
   * Check xem field có disabled không dựa trên condition
   */
  isFieldDisabled(
    field: PropertyFieldDefinition,
    entity: PropertyEntity
  ): boolean {
    if (field.readonly) {
      return true;
    }

    if (!field.disabled) {
      return false;
    }

    if (typeof field.disabled === "function") {
      return field.disabled(entity);
    }

    // Evaluate condition object (giống logic visible)
    const condition = field.disabled;
    const fieldValue = entity.properties?.[condition.field];

    switch (condition.operator) {
      case "equals":
        return fieldValue === condition.value;
      case "notEquals":
        return fieldValue !== condition.value;
      case "includes":
        return (
          Array.isArray(fieldValue) && fieldValue.includes(condition.value)
        );
      case "notIncludes":
        return (
          Array.isArray(fieldValue) && !fieldValue.includes(condition.value)
        );
      case "custom":
        return condition.customCheck
          ? condition.customCheck(fieldValue, entity)
          : false;
      default:
        return false;
    }
  }

  /**
   * Check xem group có visible không
   */
  isGroupVisible(
    group: PropertyGroupDefinition,
    entity: PropertyEntity
  ): boolean {
    if (!group.visible) {
      return true;
    }

    if (typeof group.visible === "function") {
      return group.visible(entity);
    }

    // Evaluate condition object
    const condition = group.visible;
    const fieldValue = entity.properties?.[condition.field];

    switch (condition.operator) {
      case "equals":
        return fieldValue === condition.value;
      case "notEquals":
        return fieldValue !== condition.value;
      case "includes":
        return (
          Array.isArray(fieldValue) && fieldValue.includes(condition.value)
        );
      case "notIncludes":
        return (
          Array.isArray(fieldValue) && !fieldValue.includes(condition.value)
        );
      case "custom":
        return condition.customCheck
          ? condition.customCheck(fieldValue, entity)
          : true;
      default:
        return true;
    }
  }

  /**
   * Filter visible groups
   */
  getVisibleGroups(
    groups: PropertyGroupDefinition[],
    entity: PropertyEntity
  ): PropertyGroupDefinition[] {
    return groups.filter(group => this.isGroupVisible(group, entity));
  }

  /**
   * Filter visible fields trong một group
   */
  getVisibleFields(
    fields: PropertyFieldDefinition[],
    entity: PropertyEntity
  ): PropertyFieldDefinition[] {
    return fields.filter(field => this.isFieldVisible(field, entity));
  }
}

/**
 * Export singleton instance
 */
export const propertySyncEngine = new PropertySyncEngine();
