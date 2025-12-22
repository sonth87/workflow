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
import { useState, useCallback } from "react";
import { useWorkflowStore } from "@/core/store/workflowStore";

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
 * Calculate position for edge labels
 */
function calculateLabelPosition(
  edgePath: string,
  position: "start" | "center" | "end"
): { x: number; y: number } {
  const pathElement = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "path"
  );
  pathElement.setAttribute("d", edgePath);
  const pathLength = pathElement.getTotalLength();

  let point;
  switch (position) {
    case "start":
      point = pathElement.getPointAtLength(pathLength * 0.15);
      break;
    case "end":
      point = pathElement.getPointAtLength(pathLength * 0.85);
      break;
    case "center":
    default:
      point = pathElement.getPointAtLength(pathLength * 0.5);
      break;
  }

  return { x: point.x, y: point.y };
}

/**
 * Edge Label Component with hover and edit functionality
 */
function EdgeLabelComponent({
  edgeId,
  label,
  position,
  edgePath,
  visualConfig,
}: {
  edgeId: string;
  label: EdgeLabel | undefined;
  position: "start" | "center" | "end";
  edgePath: string;
  visualConfig?: EdgeVisualConfig;
}) {
  const { updateEdge, edges } = useWorkflowStore();
  const [isHovered, setIsHovered] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(label?.text || "");

  const labelPos = calculateLabelPosition(edgePath, position);

  const handleDoubleClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      e.preventDefault();
      setIsEditing(true);
      setEditValue(label?.text || "");
    },
    [label]
  );

  const handleSave = useCallback(() => {
    const edge = edges.find(e => e.id === edgeId);
    if (!edge) return;

    const existingLabels = (edge.labels as EdgeLabel[]) || [];
    const newLabels = existingLabels.filter(l => l.position !== position);

    if (editValue.trim()) {
      newLabels.push({
        text: editValue.trim(),
        position,
      });
    }

    // Update both edge.labels and edge.data.labels to ensure sync
    updateEdge(edgeId, {
      labels: newLabels,
      data: {
        ...(edge.data || {}),
        labels: newLabels,
      },
    });
    setIsEditing(false);
  }, [edgeId, edges, updateEdge, position, editValue]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        handleSave();
      } else if (e.key === "Escape") {
        setIsEditing(false);
        setEditValue(label?.text || "");
      }
    },
    [handleSave, label]
  );

  const showPlaceholder = isHovered && !label?.text && !isEditing;
  const showLabel = label?.text || isEditing;

  if (!showPlaceholder && !showLabel) return null;

  return (
    <div
      style={{
        position: "absolute",
        transform: `translate(-50%, -50%) translate(${labelPos.x}px,${labelPos.y}px)`,
        pointerEvents: "all",
      }}
      className="nodrag nopan"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onDoubleClick={handleDoubleClick}
    >
      {isEditing ? (
        <input
          type="text"
          value={editValue}
          onChange={e => setEditValue(e.target.value)}
          onBlur={handleSave}
          onKeyDown={handleKeyDown}
          autoFocus
          className="px-2 py-1 text-xs border rounded bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          style={{
            minWidth: "80px",
            maxWidth: "200px",
          }}
        />
      ) : showPlaceholder ? (
        <div
          className="px-2 py-1 text-xs border-none bg-whiteOpacity100 rounded cursor-text opacity-60 hover:opacity-100 transition-opacity"
          style={{
            // backgroundColor: visualConfig?.labelBackgroundColor || "#f0f0f0",
            color: visualConfig?.labelTextColor || "#999",
            // borderColor: visualConfig?.labelBorderColor || "#ccc",
          }}
        >
          Double click to add {position} label
        </div>
      ) : (
        <div
          className="px-2 py-1 text-xs border-none bg-whiteOpacity100 rounded cursor-text hover:bg-accent transition-colors"
          style={{
            // backgroundColor: visualConfig?.labelBackgroundColor || "#e0f2fe",
            color: visualConfig?.labelTextColor || "#0369a1",
            // borderColor: visualConfig?.labelBorderColor || "#7dd3fc",
          }}
        >
          {label?.text}
        </div>
      )}
    </div>
  );
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
