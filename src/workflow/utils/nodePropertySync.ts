/**
 * Node Property Synchronization Handlers
 * Định nghĩa logic sync cho các node properties với node.data
 * Mỗi handler nhận propertyId, value, và node config, sau đó return partial updates
 */

import type { BaseNodeConfig } from "@/core/types/base.types";

export type NodePropertySyncHandler = (
  propertyId: string,
  value: unknown,
  node: BaseNodeConfig
) => Partial<BaseNodeConfig>;

/**
 * Sync handlers cho các node properties
 * Nếu property không có handler, sẽ dùng default behavior (sync vào properties và data)
 */
export const nodePropertySyncHandlers: Record<string, NodePropertySyncHandler> =
  {
    // Có thể thêm các handler cụ thể cho node properties tại đây
    // Ví dụ: icon mapping, specific property transformations, v.v.
  };

/**
 * Handler chính để xử lý node property change
 * Sử dụng specific handler nếu có, nếu không thì dùng default behavior
 */
export function handleNodePropertyChange(
  propertyId: string,
  value: unknown,
  node: BaseNodeConfig
): Partial<BaseNodeConfig> {
  // Kiểm tra xem có handler cụ thể cho property này không
  const handler = nodePropertySyncHandlers[propertyId];

  if (handler) {
    return handler(propertyId, value, node);
  }

  // Default behavior: sync vào properties và data
  return {
    properties: {
      ...node.properties,
      [propertyId]: value,
    },
    data: {
      ...(node.data || {}),
      [propertyId]: value,
    },
  };
}
