import { EdgeType } from "@/enum/workflow.enum";
import {
  BaseEdge,
  EdgeLabelRenderer,
  getSmoothStepPath,
  getStraightPath,
  getBezierPath,
  type EdgeProps,
} from "@xyflow/react";
import type { EdgeVisualConfig } from "@/core/types/base.types";

/**
 * Get stroke dash array based on border style
 */
function getStrokeDashArray(
  style?: "solid" | "dashed" | "dotted" | "double"
): string | undefined {
  switch (style) {
    case "dashed":
      return "5,5";
    case "dotted":
      return "2,2";
    default:
      return undefined;
  }
}

/**
 * Get edge path based on edge type
 */
function getEdgePath(
  edgeType: string,
  params: {
    sourceX: number;
    sourceY: number;
    targetX: number;
    targetY: number;
    sourcePosition: any;
    targetPosition: any;
  }
) {
  const { sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition } =
    params;

  switch (edgeType) {
    case EdgeType.Straight:
      return getStraightPath({
        sourceX,
        sourceY,
        targetX,
        targetY,
      });
    case EdgeType.Step:
      return getSmoothStepPath({
        sourceX,
        sourceY,
        sourcePosition,
        targetX,
        targetY,
        targetPosition,
      });
    case EdgeType.Bezier:
    default:
      return getBezierPath({
        sourceX,
        sourceY,
        sourcePosition,
        targetX,
        targetY,
        targetPosition,
      });
  }
}

/**
 * Dynamic Edge Component
 * Renders different edge types based on data.edgeType
 */
export function DynamicEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style,
  label,
  selected,
  data,
}: EdgeProps) {
  // Get edge type from data, fallback to bezier
  const edgeType = (data?.edgeType as string) || EdgeType.Bezier;
  const pathStyle = (data?.pathStyle as string) || "solid";

  const [edgePath, labelX, labelY] = getEdgePath(edgeType, {
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
  });

  // Get visual config from edge data
  const visualConfig = data?.visualConfig as EdgeVisualConfig | undefined;

  // Determine colors and styles
  const strokeColor = selected
    ? visualConfig?.selectedStrokeColor || "#3b82f6"
    : visualConfig?.strokeColor;
  const strokeWidth = selected
    ? visualConfig?.selectedStrokeWidth || 3
    : visualConfig?.strokeWidth || 2;
  const strokeDashArray = getStrokeDashArray(pathStyle as any);
  const markerColor = visualConfig?.markerColor || strokeColor || "#3b82f6";

  return (
    <>
      <defs>
        <marker
          id={`arrow-${id}`}
          markerWidth="12.5"
          markerHeight="12.5"
          viewBox="-10 -10 20 20"
          orient="auto"
          refX="0"
          refY="0"
        >
          <polyline
            stroke={markerColor}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1"
            fill={markerColor}
            points="-5,-4 0,0 -5,4 -5,-4"
          />
        </marker>
      </defs>

      <BaseEdge
        path={edgePath}
        markerEnd={`url(#arrow-${id})`}
        style={{
          strokeWidth,
          stroke: strokeColor,
          strokeDasharray: strokeDashArray,
          opacity: visualConfig?.opacity,
          transition: "stroke-width 0.2s ease, stroke 0.2s ease",
          ...visualConfig?.customStyles,
          ...style,
        }}
        interactionWidth={20}
      />

      {/* Invisible path for interaction */}
      <path
        d={edgePath}
        fill="none"
        stroke="transparent"
        strokeWidth={20}
        style={{ cursor: "pointer" }}
        pointerEvents="stroke"
      />

      <EdgeLabelRenderer>
        {label && (
          <div
            style={{
              position: "absolute",
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              pointerEvents: "all",
            }}
            className="nodrag nopan"
          >
            <div
              className="px-2 py-1 text-xs border rounded-full cursor-pointer hover:bg-accent transition-colors"
              style={{
                backgroundColor:
                  visualConfig?.labelBackgroundColor || "#e0f2fe",
                color: visualConfig?.labelTextColor || "#0369a1",
                borderColor: visualConfig?.labelBorderColor || "#7dd3fc",
              }}
            >
              {label}
            </div>
          </div>
        )}
      </EdgeLabelRenderer>
    </>
  );
}

/**
 * Edge types mapping for React Flow
 * All edge types use the DynamicEdge component
 */
export const edgeTypes = {
  "sequence-flow": DynamicEdge,
  [EdgeType.Bezier]: DynamicEdge,
  [EdgeType.Straight]: DynamicEdge,
  [EdgeType.Step]: DynamicEdge,
};
