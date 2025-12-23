import { useMemo } from "react";
import { propertyRegistry } from "@/core/properties";
import type {
  PropertyGroupDefinition,
  PropertyEntity,
} from "@/core/properties";
import type { BaseNodeConfig, BaseEdgeConfig } from "@/core/types/base.types";

/**
 * Hook để lấy property groups cho entity hiện tại
 */
export function usePropertyGroups(
  entity: PropertyEntity | null
): PropertyGroupDefinition[] {
  return useMemo(() => {
    if (!entity) {
      return [];
    }

    // Check xem entity là Node hay Edge
    const isNode = "nodeType" in entity;

    if (isNode) {
      const node = entity as BaseNodeConfig;
      return propertyRegistry.getNodePropertyGroups(node.nodeType);
    } else {
      const edge = entity as BaseEdgeConfig;
      const edgeType = edge.type || "default";
      return propertyRegistry.getEdgePropertyGroups(edgeType);
    }
  }, [entity]);
}
