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
  // Check multiple sources for width in order of priority:
  // 1. Direct width property (set by ReactFlow after resizing)
  // 2. Measured width (actual rendered size)
  // 3. Style width (from node.style)
  // 4. Data style width (from node.data.style)
  // 5. Default fallback
  const directWidth = (container as any).width;
  const measuredWidth = (container as any).measured?.width;
  const nodeStyle = container.style as DynamicStyle | undefined;
  const dataStyle = container.data?.style as DynamicStyle | undefined;

  const width =
    directWidth ?? measuredWidth ?? nodeStyle?.width ?? dataStyle?.width ?? 800;
  return typeof width === "number" ? width : 800;
}

/**
 * Safely get height from container style
 */
function getContainerHeight(container: BaseNodeConfig): number {
  // Check multiple sources for height in order of priority:
  // 1. Direct height property (set by ReactFlow after resizing)
  // 2. Measured height (actual rendered size)
  // 3. Style height (from node.style)
  // 4. Data style height (from node.data.style)
  // 5. Default fallback
  const directHeight = (container as any).height;
  const measuredHeight = (container as any).measured?.height;
  const nodeStyle = container.style as DynamicStyle | undefined;
  const dataStyle = container.data?.style as DynamicStyle | undefined;

  const height =
    directHeight ??
    measuredHeight ??
    nodeStyle?.height ??
    dataStyle?.height ??
    300;
  return typeof height === "number" ? height : 300;
}

/**
 * Helper function to check if a node is a pool
 */
function isPoolNode(node: BaseNodeConfig): boolean {
  return node.type === "pool" || node.data?.nodeType === "pool";
}

/**
 * Rule 1: Check if a normal node can enter a Pool container
 * Normal nodes (tasks, events, gateways, etc.) can freely enter Pool
 */
export function canNodeEnterContainer(
  node: BaseNodeConfig,
  container: BaseNodeConfig
): boolean {
  // Only apply to normal nodes (not pool)
  if (isPoolNode(node)) {
    return false;
  }

  // Container must be pool
  if (!isPoolNode(container)) {
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

  // Get container dimensions
  const containerWidth = getContainerWidth(container);
  const containerHeight = getContainerHeight(container);

  // Get container bounds
  const containerBounds = {
    left: container.position.x,
    top: container.position.y,
    right: container.position.x + containerWidth,
    bottom: container.position.y + containerHeight,
  };

  // Debug logging to help troubleshoot collision detection
  const isInside =
    nodeCenter.x >= containerBounds.left &&
    nodeCenter.x <= containerBounds.right &&
    nodeCenter.y >= containerBounds.top &&
    nodeCenter.y <= containerBounds.bottom;

  return isInside;
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
      isPoolNode(n) &&
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
