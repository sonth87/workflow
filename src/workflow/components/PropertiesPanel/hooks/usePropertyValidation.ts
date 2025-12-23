import { useCallback } from "react";
import { propertySyncEngine } from "@/core/properties";
import type {
  PropertyEntity,
  PropertyGroupDefinition,
  ValidationError,
} from "@/core/properties";
import type { EntityValidationResult } from "@/core/properties";

interface UsePropertyValidationReturn {
  validateEntity: () => EntityValidationResult;
  validateField: (fieldId: string) => ValidationError[];
  getFieldErrors: (fieldId: string) => ValidationError[];
}

/**
 * Hook để validate entity properties
 */
export function usePropertyValidation(
  entity: PropertyEntity | null,
  propertyGroups: PropertyGroupDefinition[]
): UsePropertyValidationReturn {
  // Validate toàn bộ entity
  const validateEntity = useCallback((): EntityValidationResult => {
    if (!entity) {
      return {
        valid: true,
        errors: [],
        warnings: [],
        fieldResults: new Map(),
      };
    }

    return propertySyncEngine.validateEntity(entity, propertyGroups);
  }, [entity, propertyGroups]);

  // Validate một field cụ thể
  const validateField = useCallback(
    (fieldId: string): ValidationError[] => {
      if (!entity) return [];

      const result = validateEntity();
      const fieldResult = result.fieldResults.get(fieldId);

      return fieldResult?.errors || [];
    },
    [entity, validateEntity]
  );

  // Get errors cho một field
  const getFieldErrors = useCallback(
    (fieldId: string): ValidationError[] => {
      return validateField(fieldId);
    },
    [validateField]
  );

  return {
    validateEntity,
    validateField,
    getFieldErrors,
  };
}
