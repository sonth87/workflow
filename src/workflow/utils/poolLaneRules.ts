/**
 * Pool & Lane Business Rules
 * Centralized validation logic for Pool containers
 * Note: Lanes are now rendered as sections within Pool, not separate nodes
 */

import type { BaseNodeConfig, DynamicStyle } from "@/core/types/base.types";

/**
 * Sort nodes so that parent nodes always appear before their children
 * This is required by React Flow to avoid "parent node not found" warnings
 */
export function sortNodesByParentChild(
  nodes: BaseNodeConfig[]
): BaseNodeConfig[] {
  const sorted: BaseNodeConfig[] = [];
  const visited = new Set<string>();
  const nodeMap = new Map(nodes.map(n => [n.id, n]));

  function visit(node: BaseNodeConfig) {
    if (visited.has(node.id)) return;
    visited.add(node.id);

    // If node has a parent, visit parent first
    if (node.parentId) {
      const parent = nodeMap.get(node.parentId);
      if (parent) {
        visit(parent);
      }
    }

    sorted.push(node);
  }

  // Visit all nodes
  nodes.forEach(node => visit(node));

  return sorted;
}

/**
 * Safely get width from container style
 */
function getContainerWidth(container: BaseNodeConfig): number {
  const nodeStyle = container.style as DynamicStyle | undefined;
  const dataStyle = container.data?.style as DynamicStyle | undefined;

  const width = nodeStyle?.width ?? dataStyle?.width ?? 800;
  return typeof width === "number" ? width : 800;
}

/**
 * Safely get height from container style
 */
function getContainerHeight(container: BaseNodeConfig): number {
  const nodeStyle = container.style as DynamicStyle | undefined;
  const dataStyle = container.data?.style as DynamicStyle | undefined;

  const height = nodeStyle?.height ?? dataStyle?.height ?? 300;
  return typeof height === "number" ? height : 300;
}

/**
 * Helper function to check if a node is a pool
 */
function isPoolNode(node: BaseNodeConfig): boolean {
  return node.type === "pool" || node.data?.nodeType === "pool";
}

/**
 * Helper function to check if a node is a lane
 * Note: This is deprecated as lanes are no longer separate nodes
 * @deprecated Lanes are now sections within Pool
 */
function isLaneNode(node: BaseNodeConfig): boolean {
  return node.type === "lane" || node.data?.nodeType === "lane";
}

/**
 * Rule 1: Check if a normal node can enter a Pool container
 * Normal nodes (tasks, events, gateways, etc.) can freely enter Pool
 */
export function canNodeEnterContainer(
  node: BaseNodeConfig,
  container: BaseNodeConfig
): boolean {
  // Only apply to normal nodes (not pool or lane)
  if (isPoolNode(node) || isLaneNode(node)) {
    return false;
  }

  // Container must be pool
  if (!isPoolNode(container)) {
    return false;
  }

  return true;
}

/**
 * Rule 2: Lane node functionality is deprecated
 * Lanes are now rendered as sections within Pool component
 * @deprecated
 */
export function canLaneEnterPool(
  lane: BaseNodeConfig,
  pool: BaseNodeConfig,
  allNodes: BaseNodeConfig[]
): { allowed: boolean; reason?: string } {
  return {
    allowed: false,
    reason: "Lane nodes are deprecated. Lanes are now sections within Pool.",
  };
}

/**
 * Rule 3: Lane node functionality is deprecated
 * @deprecated
 */
export function canLaneExistStandalone(lane: BaseNodeConfig): {
  allowed: boolean;
  reason?: string;
} {
  if (!isLaneNode(lane)) {
    return { allowed: true }; // Not a lane, not our concern
  }

  return {
    allowed: false,
    reason: "Lane nodes are deprecated. Use Pool with lane sections instead.",
  };
}

/**
 * Rule 3b: Prevent Lane from being dropped on canvas
 * Lane nodes are deprecated in favor of Pool sections
 */
export function canLaneBeDroppedOnCanvas(nodeType: string): {
  allowed: boolean;
  reason?: string;
} {
  if (nodeType === "lane") {
    return {
      allowed: false,
      reason:
        "Lane không còn được hỗ trợ như node riêng. Sử dụng Pool và thêm lanes bên trong.",
    };
  }

  return { allowed: true };
}

/**
 * Rule 4: Lane drag functionality is deprecated
 * @deprecated
 */
export function canLaneBeDragged(
  lane: BaseNodeConfig,
  allNodes: BaseNodeConfig[]
): boolean {
  if (!isLaneNode(lane)) {
    return true; // Not a lane, can be dragged normally
  }

  // Lane nodes should not be draggable (deprecated)
  return false;
}

/**
 * Check if a node is inside container bounds (collision detection)
 */
export function isNodeInsideContainer(
  node: BaseNodeConfig,
  container: BaseNodeConfig,
  nodeCenterOffset = { x: 75, y: 35 } // Default approximate center
): boolean {
  // Get node center point
  const nodeCenter = {
    x: node.position.x + nodeCenterOffset.x,
    y: node.position.y + nodeCenterOffset.y,
  };

  // Get container bounds
  const containerBounds = {
    left: container.position.x,
    top: container.position.y,
    right: container.position.x + getContainerWidth(container),
    bottom: container.position.y + getContainerHeight(container),
  };

  // Check if node center is inside container
  return (
    nodeCenter.x >= containerBounds.left &&
    nodeCenter.x <= containerBounds.right &&
    nodeCenter.y >= containerBounds.top &&
    nodeCenter.y <= containerBounds.bottom
  );
}

/**
 * Find the target container for a node (handles nested containers)
 * Returns the innermost container that contains the node
 */
export function findTargetContainer(
  node: BaseNodeConfig,
  allNodes: BaseNodeConfig[],
  excludeLockedContainers = true
): BaseNodeConfig | null {
  // Find all potential containers
  const containers = allNodes.filter(
    n =>
      (isPoolNode(n) || isLaneNode(n)) &&
      n.id !== node.id &&
      (!excludeLockedContainers || !n.data?.isLocked)
  );

  let targetContainer: BaseNodeConfig | null = null;

  for (const container of containers) {
    if (isNodeInsideContainer(node, container)) {
      // If node is inside multiple containers, choose the smallest (innermost)
      if (!targetContainer) {
        targetContainer = container;
      } else {
        const currentArea = getContainerArea(container);
        const prevArea = getContainerArea(targetContainer);

        if (currentArea < prevArea) {
          targetContainer = container;
        }
      }
    }
  }

  return targetContainer;
}

/**
 * Calculate container area
 */
function getContainerArea(container: BaseNodeConfig): number {
  const width = getContainerWidth(container);
  const height = getContainerHeight(container);
  return width * height;
}

/**
 * Convert absolute position to relative position (when node enters container)
 */
export function toRelativePosition(
  absolutePosition: { x: number; y: number },
  containerPosition: { x: number; y: number }
): { x: number; y: number } {
  return {
    x: absolutePosition.x - containerPosition.x,
    y: absolutePosition.y - containerPosition.y,
  };
}

/**
 * Convert relative position to absolute position (when node exits container)
 */
export function toAbsolutePosition(
  relativePosition: { x: number; y: number },
  containerPosition: { x: number; y: number }
): { x: number; y: number } {
  return {
    x: relativePosition.x + containerPosition.x,
    y: relativePosition.y + containerPosition.y,
  };
}

/**
 * Comprehensive validation for Lane operations
 */
export function validateLaneOperation(
  operation: "drop" | "dragStop" | "create",
  lane: BaseNodeConfig,
  targetContainer: BaseNodeConfig | null,
  allNodes: BaseNodeConfig[]
): { valid: boolean; error?: string } {
  // Rule 3: Lane cannot be dropped on canvas
  if (operation === "drop" && !targetContainer) {
    return {
      valid: false,
      error:
        "Lane không thể được kéo trực tiếp ra canvas. Vui lòng kéo Lane vào Pool.",
    };
  }

  // Lane can only be dropped into Pool (not into another Lane)
  if (targetContainer && !isPoolNode(targetContainer)) {
    return {
      valid: false,
      error: "Lane chỉ có thể được kéo vào Pool.",
    };
  }

  // Rule 2: Check if lane can enter pool
  if (targetContainer && isPoolNode(targetContainer)) {
    const canEnter = canLaneEnterPool(lane, targetContainer, allNodes);
    if (!canEnter.allowed) {
      return {
        valid: false,
        error: canEnter.reason,
      };
    }
  }

  return { valid: true };
}
