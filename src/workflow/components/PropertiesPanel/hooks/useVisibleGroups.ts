import { useMemo } from "react";
import { propertySyncEngine } from "@/core/properties";
import type {
  PropertyEntity,
  PropertyGroupDefinition,
} from "@/core/properties";

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

    // Filter visible groups
    const visibleGroups = propertySyncEngine.getVisibleGroups(
      propertyGroups,
      entity
    );

    // Filter visible fields trong mỗi group
    return visibleGroups.map(group => ({
      ...group,
      fields: propertySyncEngine.getVisibleFields(group.fields, entity),
    }));
  }, [propertyGroups, entity]);
}
