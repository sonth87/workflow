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
  dagreGraph.setGraph({ rankdir: dagreDirection, nodesep: 100, ranksep: 100 });

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

  // Calculate offset to preserve original workflow position
  // Find the first process node's current position and dagre's calculated position
  const firstProcessNode = processNodes[0];
  let offsetX = 0;
  let offsetY = 0;

  if (firstProcessNode) {
    const dagrePos = dagreGraph.node(firstProcessNode.id);
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

    const nodeWithPosition = dagreGraph.node(node.id);
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
