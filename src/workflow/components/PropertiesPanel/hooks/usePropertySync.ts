import { useCallback, useMemo } from "react";
import { useWorkflowStore } from "@/core/store/workflowStore";
import { propertySyncEngine, propertyRegistry } from "@/core/properties";
import type {
  PropertyEntity,
  PropertyFieldDefinition,
  PropertyGroupDefinition,
} from "@/core/properties";
import type { BaseNodeConfig, BaseEdgeConfig } from "@/core/types/base.types";

interface UsePropertySyncReturn {
  handlePropertyChange: (propertyId: string, value: unknown) => void;
  handlePropertiesChange: (changes: Record<string, unknown>) => void;
  isFieldDisabled: (field: PropertyFieldDefinition) => boolean;
  isFieldVisible: (field: PropertyFieldDefinition) => boolean;
}

/**
 * Hook để xử lý property changes với validation
 */
export function usePropertySync(
  entity: PropertyEntity | null,
  propertyGroups: PropertyGroupDefinition[]
): UsePropertySyncReturn {
  const { updateNode, updateEdge } = useWorkflowStore();

  // Tạo map của field definitions để dễ lookup
  const fieldDefinitionsMap = useMemo(() => {
    const map = new Map<string, PropertyFieldDefinition>();
    propertyGroups.forEach(group => {
      group.fields.forEach(field => {
        map.set(field.id, field);
      });
    });
    return map;
  }, [propertyGroups]);

  // Lấy tất cả values (bao gồm cả defaults) để evaluate conditions
  const allValues = useMemo(() => {
    if (!entity) return {};
    const isNode = "nodeType" in entity;
    const defaults = isNode
      ? propertyRegistry.getDefaultNodeProperties(
          (entity as BaseNodeConfig).nodeType
        )
      : propertyRegistry.getDefaultEdgeProperties(
          (entity as BaseEdgeConfig).type || "default"
        );

    return { ...defaults, ...entity.properties };
  }, [entity]);

  // Handle single property change
  const handlePropertyChange = useCallback(
    (propertyId: string, value: unknown) => {
      if (!entity) return;

      const fieldDefinition = fieldDefinitionsMap.get(propertyId);
      const syncResult = propertySyncEngine.syncProperty(
        entity,
        propertyId,
        value,
        fieldDefinition
      );

      // Log validation errors nếu có
      if (syncResult.errors.length > 0) {
        console.warn("Validation errors:", syncResult.errors);
      }

      // Update entity dù có lỗi hay không (để user thấy real-time feedback)
      const isNode = "nodeType" in entity;
      if (isNode) {
        updateNode(entity.id, syncResult.updates);
      } else {
        updateEdge(entity.id, syncResult.updates);
      }
    },
    [entity, fieldDefinitionsMap, updateNode, updateEdge]
  );

  // Handle multiple property changes
  const handlePropertiesChange = useCallback(
    (changes: Record<string, unknown>) => {
      if (!entity) return;

      const syncResult = propertySyncEngine.syncProperties(
        entity,
        changes,
        fieldDefinitionsMap
      );

      // Log validation errors nếu có
      if (syncResult.errors.length > 0) {
        console.warn("Validation errors:", syncResult.errors);
      }

      // Update entity
      const isNode = "nodeType" in entity;
      if (isNode) {
        updateNode(entity.id, syncResult.updates);
      } else {
        updateEdge(entity.id, syncResult.updates);
      }
    },
    [entity, fieldDefinitionsMap, updateNode, updateEdge]
  );

  // Check if field is disabled
  const isFieldDisabled = useCallback(
    (field: PropertyFieldDefinition): boolean => {
      if (!entity) return false;
      return propertySyncEngine.isFieldDisabled(field, entity, allValues);
    },
    [entity, allValues]
  );

  // Check if field is visible
  const isFieldVisible = useCallback(
    (field: PropertyFieldDefinition): boolean => {
      if (!entity) return false;
      return propertySyncEngine.isFieldVisible(field, entity, allValues);
    },
    [entity, allValues]
  );

  return {
    handlePropertyChange,
    handlePropertiesChange,
    isFieldDisabled,
    isFieldVisible,
  };
}
