/**
 * Node Duplication Utilities
 * Common functions for duplicating nodes
 */

import type { BaseNodeConfig } from "@/core/types/base.types";

/**
 * Generate a unique ID for nodes
 */
export function generateId(nodeType: string): string {
  return `${nodeType}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Create a duplicated node with new ID, offset position, and updated metadata
 */
export function createDuplicatedNode(
  node: BaseNodeConfig,
  offsetX: number,
  offsetY: number,
  isDuplicate: boolean = false,
  newId?: string
): BaseNodeConfig {
  // Generate new unique ID if not provided
  const finalNewId = newId || generateId(node.type || "node");

  // Clone the node with new ID and offset position
  const duplicatedNode: BaseNodeConfig = {
    ...node,
    id: finalNewId,
    position: {
      x: node.position.x + offsetX,
      y: node.position.y + offsetY,
    },
    // Update metadata
    metadata: {
      ...node.metadata,
      id: finalNewId,
      ...(isDuplicate
        ? {
            title: `${node.metadata.title || node.type} (Copy)`,
            createdAt: new Date(),
            updatedAt: new Date(),
          }
        : {}),
    },
    // Clone data shallowly
    data: node.data ? { ...node.data } : {},
    // Reset selection state
    selected: false,
  };

  return duplicatedNode;
}
