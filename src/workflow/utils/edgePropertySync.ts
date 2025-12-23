/**
 * Edge Property Synchronization Handlers
 * Định nghĩa logic sync cho các edge properties với edge.data
 * Mỗi handler nhận propertyId, value, và edge config, sau đó return partial updates
 */

import type { BaseEdgeConfig, EdgeLabel } from "@/core/types/base.types";

export type EdgePropertySyncHandler = (
  propertyId: string,
  value: unknown,
  edge: BaseEdgeConfig
) => Partial<BaseEdgeConfig>;

/**
 * Sync handlers cho các edge properties
 * Nếu property không có handler, sẽ dùng default behavior (sync vào properties và data)
 */
export const edgePropertySyncHandlers: Record<string, EdgePropertySyncHandler> =
  {
    // Label properties - sync vào data.labels
    "start-label": (_propertyId, value, edge) => {
      return syncLabelProperty("start", value, edge);
    },
    "center-label": (_propertyId, value, edge) => {
      return syncLabelProperty("center", value, edge);
    },
    "end-label": (_propertyId, value, edge) => {
      return syncLabelProperty("end", value, edge);
    },
  };

/**
 * Helper function để sync label properties
 */
function syncLabelProperty(
  position: "start" | "center" | "end",
  value: unknown,
  edge: BaseEdgeConfig
): Partial<BaseEdgeConfig> {
  const existingLabels = (edge.data?.labels as EdgeLabel[]) || [];
  const updatedLabels = existingLabels.filter(l => l.position !== position);

  const trimmedValue = String(value || "").trim();
  if (trimmedValue) {
    updatedLabels.push({
      text: trimmedValue,
      position,
    });
  }

  const propertyId = `${position}-label`;

  return {
    labels: updatedLabels,
    properties: {
      ...edge.properties,
      [propertyId]: value,
    },
    data: {
      ...(edge.data || {}),
      labels: updatedLabels,
      [propertyId]: value,
    },
  };
}

/**
 * Handler chính để xử lý edge property change
 * Sử dụng specific handler nếu có, nếu không thì dùng default behavior
 */
export function handleEdgePropertyChange(
  propertyId: string,
  value: unknown,
  edge: BaseEdgeConfig
): Partial<BaseEdgeConfig> {
  // Kiểm tra xem có handler cụ thể cho property này không
  const handler = edgePropertySyncHandlers[propertyId];

  if (handler) {
    return handler(propertyId, value, edge);
  }

  // Default behavior: sync vào properties và data
  return {
    properties: {
      ...edge.properties,
      [propertyId]: value,
    },
    data: {
      ...(edge.data || {}),
      [propertyId]: value,
    },
  };
}
