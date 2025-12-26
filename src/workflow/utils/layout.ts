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
) => {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));

  const isHorizontal = direction === "horizontal";
  const dagreDirection = isHorizontal ? "LR" : "TB";
  dagreGraph.setGraph({ rankdir: dagreDirection, nodesep: 100, ranksep: 100 });

  nodes.forEach(node => {
    const width = node.measured?.width || nodeWidth;
    const height = node.measured?.height || nodeHeight;
    dagreGraph.setNode(node.id, { width, height });
  });

  edges.forEach(edge => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  const layoutedNodes = nodes.map(node => {
    const nodeWithPosition = dagreGraph.node(node.id);
    const width = node.measured?.width || nodeWidth;
    const height = node.measured?.height || nodeHeight;

    return {
      ...node,
      targetPosition: isHorizontal ? Position.Left : Position.Top,
      sourcePosition: isHorizontal ? Position.Right : Position.Bottom,
      position: {
        x: nodeWithPosition.x - width / 2,
        y: nodeWithPosition.y - height / 2,
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
