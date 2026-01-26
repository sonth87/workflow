import { useMemo } from "react";
import { propertySyncEngine, propertyRegistry } from "@/core/properties";
import type {
  PropertyEntity,
  PropertyGroupDefinition,
} from "@/core/properties";
import type { BaseNodeConfig, BaseEdgeConfig } from "@/core/types/base.types";

/**
 * Hook để filter visible groups dựa trên conditions
 */
export function useVisibleGroups(
  propertyGroups: PropertyGroupDefinition[],
  entity: PropertyEntity | null
): PropertyGroupDefinition[] {
  return useMemo(() => {
    if (!entity) {
      return propertyGroups;
    }

    // Lấy default values để evaluate conditions chính xác hơn nếu field chưa có value
    const isNode = "nodeType" in entity;
    const defaults = isNode
      ? propertyRegistry.getDefaultNodeProperties(
          (entity as BaseNodeConfig).nodeType
        )
      : propertyRegistry.getDefaultEdgeProperties(
          (entity as BaseEdgeConfig).type || "default"
        );

    const allValues = { ...defaults, ...entity.properties };

    // Filter visible groups
    const visibleGroups = propertySyncEngine.getVisibleGroups(
      propertyGroups,
      entity,
      allValues
    );

    // Filter visible fields trong mỗi group
    return visibleGroups.map(group => ({
      ...group,
      fields: propertySyncEngine.getVisibleFields(
        group.fields,
        entity,
        allValues
      ),
    }));
  }, [propertyGroups, entity]);
}
