/**
 * Layout utilities for workflow
 * Using dagre for auto-layout
 */

import dagre from "dagre";
import type { Node, Edge } from "@xyflow/react";
import { Position } from "@xyflow/react";
import type { LayoutDirection } from "../components/Header";

const nodeWidth = 150;
const nodeHeight = 60;

// Dagre node includes additional properties beyond the base definition
type DagreNode = {
  x: number;
  y: number;
  width: number;
  height: number;
  rank?: number; // Dagre assigns rank during layout
};

export const getLayoutedElements = (
  nodes: Node[],
  edges: Edge[],
  direction: LayoutDirection
): { nodes: Node[]; edges: Edge[] } => {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));

  const layoutHorizontal = direction === "horizontal";
  // Horizontal orientation = LR (left to right), Vertical orientation = TB (top to bottom)
  const dagreDirection = layoutHorizontal ? "LR" : "TB";
  // nodesep: spacing between nodes in the same rank, ranksep: spacing between ranks
  dagreGraph.setGraph({
    rankdir: dagreDirection,
    nodesep: 100,
    ranksep: 100,
  });

  // Filter out container and annotation nodes - only layout actual process nodes
  const processNodes = nodes.filter(
    node =>
      node.type !== "pool" && node.type !== "note" && node.type !== "annotation"
  );

  // Sort nodes by ID for deterministic layout (prevents changes on repeated executions)
  const sortedNodes = [...processNodes].sort((a, b) =>
    a.id.localeCompare(b.id)
  );

  // Add nodes to dagre graph with consistent dimensions
  sortedNodes.forEach(node => {
    // Use consistent dimensions - prefer measured, but once set, keep consistent
    const width = node.measured?.width || node.width || nodeWidth;
    const height = node.measured?.height || node.height || nodeHeight;
    dagreGraph.setNode(node.id, { width, height });
  });

  // Sort edges deterministically by source, then target, then id
  // This ensures dagre always processes edges in the same order
  const sortedEdges = [...edges].sort((a, b) => {
    const sourceCompare = a.source.localeCompare(b.source);
    if (sourceCompare !== 0) return sourceCompare;
    const targetCompare = a.target.localeCompare(b.target);
    if (targetCompare !== 0) return targetCompare;
    return a.id.localeCompare(b.id);
  });

  sortedEdges.forEach(edge => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  // Alignment logic based on orientation
  // Group nodes by their rank (which dagre assigns based on graph structure)
  const nodesByRank = new Map<
    number,
    Array<{ id: string; width: number; height: number; x: number; y: number }>
  >();

  sortedNodes.forEach(node => {
    const nodeWithPosition = dagreGraph.node(node.id) as DagreNode;
    const width = node.measured?.width || node.width || nodeWidth;
    const height = node.measured?.height || node.height || nodeHeight;

    // Group nodes by position with tolerance
    // For horizontal (LR): group by Y position (same row) to align tops
    // For vertical (TB): group by X position (same column) to align centers
    // Use Math.floor with division to create buckets for grouping
    const tolerance = 50; // Nodes within 50px are considered same rank
    const rankKey = layoutHorizontal
      ? Math.floor(nodeWithPosition.y / tolerance) // Horizontal: group by row (Y) for top alignment
      : Math.floor(nodeWithPosition.x / tolerance); // Vertical: group by column (X) for center alignment

    if (!nodesByRank.has(rankKey)) {
      nodesByRank.set(rankKey, []);
    }
    const rankNodes = nodesByRank.get(rankKey);
    if (rankNodes) {
      rankNodes.push({
        id: node.id,
        width,
        height,
        x: nodeWithPosition.x,
        y: nodeWithPosition.y,
      });
    }
  });

  // Apply alignment based on orientation
  nodesByRank.forEach(nodesInRank => {
    if (nodesInRank.length > 1) {
      if (layoutHorizontal) {
        // Horizontal layout (LR): align by TOP edge
        // Calculate top edge for each node (y - height/2, since dagre uses center position)
        const minTop = Math.min(...nodesInRank.map(n => n.y - n.height / 2));

        // Set each node's center Y so that all have the same top edge
        nodesInRank.forEach(({ id, height }) => {
          const nodeData = dagreGraph.node(id) as DagreNode;
          // Center Y = top edge + half height
          nodeData.y = minTop + height / 2;
        });
      } else {
        // Vertical layout (TB): align by CENTER (average X position)
        const avgX =
          nodesInRank.reduce((sum, n) => sum + n.x, 0) / nodesInRank.length;
        nodesInRank.forEach(({ id }) => {
          const nodeData = dagreGraph.node(id) as DagreNode;
          nodeData.x = avgX;
        });
      }
    }
  });

  // Calculate offset to preserve original workflow position
  // Find the first process node's current position and dagre's calculated position
  const firstProcessNode = processNodes[0];
  let offsetX = 0;
  let offsetY = 0;

  if (firstProcessNode) {
    const dagrePos = dagreGraph.node(firstProcessNode.id) as DagreNode;
    const width =
      firstProcessNode.measured?.width || firstProcessNode.width || nodeWidth;
    const height =
      firstProcessNode.measured?.height ||
      firstProcessNode.height ||
      nodeHeight;

    // Calculate what dagre wants for first node
    const dagreX = dagrePos.x - width / 2;
    const dagreY = dagrePos.y - height / 2;

    // Calculate offset to keep workflow in original position
    offsetX = firstProcessNode.position.x - dagreX;
    offsetY = firstProcessNode.position.y - dagreY;
  }

  const layoutedNodes = nodes.map(node => {
    // Only apply layout to process nodes, keep pool/note positions unchanged
    if (
      node.type === "pool" ||
      node.type === "note" ||
      node.type === "annotation"
    ) {
      return node;
    }

    const nodeWithPosition = dagreGraph.node(node.id) as DagreNode;
    // Use same dimension logic as when adding to dagre
    const width = node.measured?.width || node.width || nodeWidth;
    const height = node.measured?.height || node.height || nodeHeight;

    return {
      ...node,
      // Horizontal layout: source on right, target on left. Vertical: source on bottom, target on top
      targetPosition: layoutHorizontal ? Position.Left : Position.Top,
      sourcePosition: layoutHorizontal ? Position.Right : Position.Bottom,
      position: {
        x: nodeWithPosition.x - width / 2 + offsetX,
        y: nodeWithPosition.y - height / 2 + offsetY,
      },
    };
  });

  // Remove handle IDs to let React Flow auto-connect based on positions
  const layoutedEdges = edges.map(edge => {
    const { sourceHandle, targetHandle, ...rest } = edge;
    return rest as Edge;
  });

  return { nodes: layoutedNodes, edges: layoutedEdges };
};
