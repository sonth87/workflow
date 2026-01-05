/**
 * Pool & Lane Business Rules
 * Centralized validation logic for Pool and Lane containers
 */

import type { BaseNodeConfig, DynamicStyle } from "@/core/types/base.types";

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
 */
function isLaneNode(node: BaseNodeConfig): boolean {
  return node.type === "lane" || node.data?.nodeType === "lane";
}

/**
 * Rule 1: Check if a normal node can enter a Pool or Lane container
 * Normal nodes (tasks, events, gateways, etc.) can freely enter Pool/Lane
 */
export function canNodeEnterContainer(
  node: BaseNodeConfig,
  container: BaseNodeConfig
): boolean {
  // Only apply to normal nodes (not pool or lane)
  if (isPoolNode(node) || isLaneNode(node)) {
    return false;
  }

  // Container must be pool or lane
  if (!isPoolNode(container) && !isLaneNode(container)) {
    return false;
  }

  return true;
}

/**
 * Rule 2: Check if a Lane can enter a Pool
 * Lane can only enter Pool if:
 * - Pool is empty (no children), OR
 * - Pool already has Lanes (can add more lanes)
 * - Pool CANNOT have only Nodes (without lanes)
 */
export function canLaneEnterPool(
  lane: BaseNodeConfig,
  pool: BaseNodeConfig,
  allNodes: BaseNodeConfig[]
): { allowed: boolean; reason?: string } {
  // Must be lane and pool
  if (!isLaneNode(lane)) {
    return { allowed: false, reason: "Source must be a Lane" };
  }

  if (!isPoolNode(pool)) {
    return { allowed: false, reason: "Target must be a Pool" };
  }

  // Get all children of the pool (excluding the lane being checked)
  const poolChildren = allNodes.filter(
    n => n.parentId === pool.id && n.id !== lane.id
  );

  // Check if pool has lanes
  const hasLanes = poolChildren.some(n => isLaneNode(n));

  // Check if pool has normal nodes (non-lane, non-pool)
  const hasNodes = poolChildren.some(n => !isLaneNode(n) && !isPoolNode(n));

  // RULE 2 VALIDATION:
  // If pool has nodes but no lanes → BLOCK
  if (hasNodes && !hasLanes) {
    return {
      allowed: false,
      reason:
        "Lane chỉ được kéo vào Pool trống hoặc Pool đã có Lane. Pool này đã có Nodes.",
    };
  }

  // Otherwise allow (pool is empty OR pool has lanes)
  return { allowed: true };
}

/**
 * Rule 3: Check if Lane can exist standalone on canvas
 * Lane MUST be inside a Pool, cannot exist independently
 */
export function canLaneExistStandalone(lane: BaseNodeConfig): {
  allowed: boolean;
  reason?: string;
} {
  if (!isLaneNode(lane)) {
    return { allowed: true }; // Not a lane, not our concern
  }

  // Lane without parent is NOT allowed
  if (!lane.parentId) {
    return {
      allowed: false,
      reason:
        "Lane phải được đặt bên trong Pool. Vui lòng kéo Lane vào một Pool.",
    };
  }

  return { allowed: true };
}

/**
 * Rule 3b: Prevent Lane from being dropped directly on canvas from Toolbox
 */
export function canLaneBeDroppedOnCanvas(nodeType: string): {
  allowed: boolean;
  reason?: string;
} {
  if (nodeType === "lane") {
    return {
      allowed: false,
      reason:
        "Lane không thể được kéo trực tiếp ra canvas. Vui lòng kéo Lane vào Pool.",
    };
  }

  return { allowed: true };
}

/**
 * Rule 4: Check if Lane inside Pool can be dragged
 * Lanes inside Pool should not be draggable (only Pool can be dragged)
 */
export function canLaneBeDragged(
  lane: BaseNodeConfig,
  allNodes: BaseNodeConfig[]
): boolean {
  if (!isLaneNode(lane)) {
    return true; // Not a lane, can be dragged normally
  }

  // If lane has no parent, it can be dragged (will be caught by Rule 3)
  if (!lane.parentId) {
    return true;
  }

  // Find parent
  const parent = allNodes.find(n => n.id === lane.parentId);

  // If parent is Pool, lane should NOT be draggable
  if (parent && isPoolNode(parent)) {
    return false;
  }

  return true;
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
