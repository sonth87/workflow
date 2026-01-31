import { EdgePathType } from "@/enum/workflow.enum";
import {
  BaseEdge,
  EdgeLabelRenderer,
  getSmoothStepPath,
  getStraightPath,
  getBezierPath,
  type EdgeProps,
} from "@xyflow/react";
import type { EdgeVisualConfig, EdgeLabel } from "@/core/types/base.types";
import { EdgeLabelComponent } from "./EdgeLabel";

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
    case EdgePathType.Straight:
      return getStraightPath({
        sourceX,
        sourceY,
        targetX,
        targetY,
      });
    case EdgePathType.Step:
      return getSmoothStepPath({
        sourceX,
        sourceY,
        sourcePosition,
        targetX,
        targetY,
        targetPosition,
      });
    case EdgePathType.Bezier:
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
  // Get path type (rendering type) from data, fallback to bezier
  const pathType = (data?.pathType as string) || EdgePathType.Bezier;
  const pathStyle = (data?.pathStyle as string) || "solid";

  const [edgePath, labelX, labelY] = getEdgePath(pathType, {
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
  });

  // Get visual config from edge data
  const visualConfig = data?.visualConfig as EdgeVisualConfig | undefined;
  const labels = (data?.labels as EdgeLabel[]) || [];

  // Find labels by position
  const startLabel = labels.find(l => l.position === "start");
  const centerLabel = labels.find(l => l.position === "center");
  const endLabel = labels.find(l => l.position === "end");

  // Determine colors and styles
  const strokeColor = selected
    ? visualConfig?.selectedStrokeColor || "var(--color-primary)"
    : visualConfig?.strokeColor || "#b1b1b7";
  const strokeWidth = selected
    ? visualConfig?.selectedStrokeWidth || 2.5
    : visualConfig?.strokeWidth || 2;
  const strokeDashArray = getStrokeDashArray(pathStyle as any);
  const markerColor = visualConfig?.markerColor || strokeColor || "#b1b1b7";

  return (
    <>
      <defs>
        <marker
          id={`arrow-${id}`}
          markerWidth="10"
          markerHeight="10"
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
        {/* Start Label */}
        <EdgeLabelComponent
          key={`${id}-start-${startLabel?.text || "empty"}`}
          edgeId={id}
          label={startLabel}
          position="start"
          edgePath={edgePath}
          visualConfig={visualConfig}
        />

        {/* Center Label */}
        <EdgeLabelComponent
          key={`${id}-center-${centerLabel?.text || "empty"}`}
          edgeId={id}
          label={centerLabel}
          position="center"
          edgePath={edgePath}
          visualConfig={visualConfig}
        />

        {/* End Label */}
        <EdgeLabelComponent
          key={`${id}-end-${endLabel?.text || "empty"}`}
          edgeId={id}
          label={endLabel}
          position="end"
          edgePath={edgePath}
          visualConfig={visualConfig}
        />

        {/* Legacy label support - show at center if no labels array exists */}
        {label && !labels.length && (
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
 * Maps BPMN edge registry types to the DynamicEdge component
 * The actual rendering type (Bezier/Straight/Step) is determined by data.edgeType
 */
export const edgeTypes = {
  "sequence-flow": DynamicEdge, // kết nối tuần tự (giữa các hoạt động trong cùng một pool)
  "message-flow": DynamicEdge, // kết nối message (giữa các pool/participants)
  association: DynamicEdge, // liên kết artifact (không ảnh hưởng tới logic luồng, mang ý nghĩa tham khảo, chú thích)
};
