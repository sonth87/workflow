import React from "react";
import {
  getBezierPath,
  getStraightPath,
  getSmoothStepPath,
  type ConnectionLineComponentProps,
} from "@xyflow/react";

/**
 * Custom Connection Line Preview Component
 * Styles the connection line when dragging to create a new edge
 */
export const ConnectionLinePreview: React.FC<ConnectionLineComponentProps> = ({
  fromX,
  fromY,
  toX,
  toY,
  connectionLineType = "bezier",
  fromPosition,
  toPosition,
}) => {
  let path = "";

  switch (connectionLineType) {
    case "straight":
      [path] = getStraightPath({
        sourceX: fromX,
        sourceY: fromY,
        targetX: toX,
        targetY: toY,
      });
      break;
    case "smoothstep":
      [path] = getSmoothStepPath({
        sourceX: fromX,
        sourceY: fromY,
        sourcePosition: fromPosition,
        targetX: toX,
        targetY: toY,
        targetPosition: toPosition,
      });
      break;
    case "bezier":
    default:
      [path] = getBezierPath({
        sourceX: fromX,
        sourceY: fromY,
        sourcePosition: fromPosition,
        targetX: toX,
        targetY: toY,
        targetPosition: toPosition,
      });
      break;
  }

  const markerColor = "#3b82f6";

  const isReversed = toX < fromX;

  return (
    <g>
      <path
        d={path}
        stroke="#3b82f6" // Blue color for preview
        strokeWidth={2}
        fill="none"
        strokeDasharray="5,5" // Dashed line
        opacity={0.7}
      >
        <animate
          attributeName="stroke-dashoffset"
          values="0;-10"
          dur="0.5s"
          repeatCount="indefinite"
        />
      </path>
      {/* Optional: Add an arrow marker at the end */}
      <defs>
        <marker
          id="connection-preview-arrow"
          markerWidth="2"
          markerHeight="2"
          viewBox="-1 -1 4 2"
          orient="auto"
          refX="0"
          refY="0"
        >
          {/* <polyline
            stroke={markerColor}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1"
            fill={markerColor}
            points="-1,-0.8 0,0 -1,0.8 -1,-0.8"
          /> */}
          <circle cx="0" cy="0" r="0.8" fill={markerColor} />
        </marker>

        <marker
          id="connection-preview-arrow-start"
          markerWidth="2"
          markerHeight="2"
          viewBox="-1 -1 4 2"
          orient="auto"
          refX="0"
          refY="0"
        >
          {/* <polyline
            stroke={markerColor}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1"
            fill={markerColor}
            points="1,0.8 0,0 1,-0.8 1,0.8"
          /> */}
          <circle cx="0" cy="0" r="0.8" fill={markerColor} />
        </marker>

        <marker
          id="connection-preview-arrow-dragging"
          markerWidth="2"
          markerHeight="2"
          viewBox="-1 -1 4 2"
          orient="auto"
          refX="0"
          refY="0"
        >
          <circle cx="0" cy="0" r="0.8" fill={markerColor} />
        </marker>
      </defs>
      <path
        d={path}
        stroke="transparent"
        strokeWidth={10} // Invisible thicker path for better interaction
        fill="none"
        markerEnd={
          isReversed
            ? "url(#connection-preview-arrow-dragging)"
            : "url(#connection-preview-arrow)"
        }
        markerStart={
          isReversed ? "url(#connection-preview-arrow-start)" : undefined
        }
      />
    </g>
  );
};
