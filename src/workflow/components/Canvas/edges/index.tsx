import { EdgePathType } from "@/enum/workflow.enum";
import {
  BaseEdge,
  EdgeLabelRenderer,
  getSmoothStepPath,
  getStraightPath,
  getBezierPath,
  type EdgeProps,
  Position,
  useReactFlow,
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
 * Generate custom SVG path with multiple waypoints for complex routing
 * Creates a path that routes around nodes intelligently
 */
function generateCustomPath(
  sourceX: number,
  sourceY: number,
  targetX: number,
  targetY: number,
  sourcePosition: Position,
  targetPosition: Position,
  borderRadius: number = 15
): [string, number, number, number, number] {
  const dx = targetX - sourceX;
  const dy = targetY - sourceY;
  
  // Detect complex routing scenario: output opposite to target direction
  const needsComplexRouting =
    (sourcePosition === Position.Right && targetPosition === Position.Left && dx < 0) ||
    (sourcePosition === Position.Left && targetPosition === Position.Right && dx > 0) ||
    (sourcePosition === Position.Bottom && targetPosition === Position.Top && dy < 0) ||
    (sourcePosition === Position.Top && targetPosition === Position.Bottom && dy > 0);
  
  if (!needsComplexRouting) {
    // Use standard smooth step for simple cases
    return getSmoothStepPath({
      sourceX,
      sourceY,
      sourcePosition,
      targetX,
      targetY,
      targetPosition,
      borderRadius,
    });
  }
  
  // Complex routing with waypoints
  const waypoints: Array<{ x: number; y: number }> = [];
  const offset = 50; // Distance to route around nodes horizontally
  const minStepDistance = 60; // Minimum distance to ensure clearing the node
  const verticalStepRatio = 0.25; // Go 25% of vertical distance before turning
  
  if (sourcePosition === Position.Right && dx < 0) {
    // A's output on right, B is to the left
    // Path: Right → Down/Up a bit → Left (past B) → Down/Up → Right into B
    
    // Use the larger of: minimum distance OR 25% of total distance
    const stepDistance = Math.max(minStepDistance, Math.abs(dy) * verticalStepRatio);
    const firstStepY = dy > 0 ? sourceY + stepDistance : sourceY - stepDistance; // Go down if B below, up if B above
    
    waypoints.push({ x: sourceX, y: sourceY }); // Start
    waypoints.push({ x: sourceX + offset, y: sourceY }); // Go right
    waypoints.push({ x: sourceX + offset, y: firstStepY }); // Go down/up from source
    waypoints.push({ x: targetX - offset, y: firstStepY }); // Go left (past target)
    waypoints.push({ x: targetX - offset, y: targetY }); // Go to target level
    waypoints.push({ x: targetX, y: targetY }); // Go right into target
  } else if (sourcePosition === Position.Left && dx > 0) {
    // Mirror case: output left, target is to the right
    const stepDistance = Math.max(minStepDistance, Math.abs(dy) * verticalStepRatio);
    const firstStepY = dy > 0 ? sourceY + stepDistance : sourceY - stepDistance;
    
    waypoints.push({ x: sourceX, y: sourceY });
    waypoints.push({ x: sourceX - offset, y: sourceY });
    waypoints.push({ x: sourceX - offset, y: firstStepY }); // Go down/up from source
    waypoints.push({ x: targetX + offset, y: firstStepY }); // Go right
    waypoints.push({ x: targetX + offset, y: targetY });
    waypoints.push({ x: targetX, y: targetY });
  } else if (sourcePosition === Position.Bottom && dy < 0) {
    // Vertical case: output bottom, target is above
    const stepDistance = Math.max(minStepDistance, Math.abs(dx) * verticalStepRatio);
    const firstStepX = dx > 0 ? sourceX + stepDistance : sourceX - stepDistance; // Go right if B right, left if B left
    
    waypoints.push({ x: sourceX, y: sourceY });
    waypoints.push({ x: sourceX, y: sourceY + offset });
    waypoints.push({ x: firstStepX, y: sourceY + offset }); // Go horizontally from source
    waypoints.push({ x: firstStepX, y: targetY - offset }); // Go up
    waypoints.push({ x: targetX, y: targetY - offset });
    waypoints.push({ x: targetX, y: targetY });
  } else if (sourcePosition === Position.Top && dy > 0) {
    // Vertical mirror: output top, target is below
    const stepDistance = Math.max(minStepDistance, Math.abs(dx) * verticalStepRatio);
    const firstStepX = dx > 0 ? sourceX + stepDistance : sourceX - stepDistance;
    
    waypoints.push({ x: sourceX, y: sourceY });
    waypoints.push({ x: sourceX, y: sourceY - offset });
    waypoints.push({ x: firstStepX, y: sourceY - offset }); // Go horizontally from source
    waypoints.push({ x: firstStepX, y: targetY + offset });
    waypoints.push({ x: targetX, y: targetY + offset });
    waypoints.push({ x: targetX, y: targetY });
  }
  
  // Generate smooth path through waypoints
  let pathD = `M ${waypoints[0].x} ${waypoints[0].y}`;
  
  for (let i = 1; i < waypoints.length; i++) {
    const prev = waypoints[i - 1];
    const curr = waypoints[i];
    const next = waypoints[i + 1];
    
    if (!next) {
      // Last point - straight line
      pathD += ` L ${curr.x} ${curr.y}`;
    } else {
      // Create rounded corner
      const distToCurr = Math.sqrt(Math.pow(curr.x - prev.x, 2) + Math.pow(curr.y - prev.y, 2));
      const distToNext = Math.sqrt(Math.pow(next.x - curr.x, 2) + Math.pow(next.y - curr.y, 2));
      const radius = Math.min(borderRadius, distToCurr / 2, distToNext / 2);
      
      // Calculate points for rounded corner
      const prevAngle = Math.atan2(curr.y - prev.y, curr.x - prev.x);
      const nextAngle = Math.atan2(next.y - curr.y, next.x - curr.x);
      
      const x1 = curr.x - Math.cos(prevAngle) * radius;
      const y1 = curr.y - Math.sin(prevAngle) * radius;
      const x2 = curr.x + Math.cos(nextAngle) * radius;
      const y2 = curr.y + Math.sin(nextAngle) * radius;
      
      pathD += ` L ${x1} ${y1}`;
      pathD += ` Q ${curr.x} ${curr.y} ${x2} ${y2}`;
    }
  }
  
  // Calculate label position (center of path)
  const centerIdx = Math.floor(waypoints.length / 2);
  const labelX = waypoints[centerIdx].x;
  const labelY = waypoints[centerIdx].y;
  
  // Return format matching getSmoothStepPath: [path, labelX, labelY, offsetX, offsetY]
  return [pathD, labelX, labelY, 0, 0];
}

/**
 * Calculate optimal offset for smooth step path to avoid node collision
 * Returns offset value that routes the edge around nodes intelligently
 */
function calculateSmartOffset(
  sourceX: number,
  sourceY: number,
  targetX: number,
  targetY: number,
  sourcePosition: Position,
  targetPosition: Position
): number {
  const dx = Math.abs(targetX - sourceX);
  const dy = Math.abs(targetY - sourceY);
  
  // Base offset - minimum space needed to route around nodes
  const baseOffset = 40;
  
  // Calculate offset based on distance and direction
  // For tight spaces, need larger offset to route around nodes
  const distanceBasedOffset = Math.min(dx, dy) < 150 ? 60 : baseOffset;
  
  // If routing requires turning back (opposite directions), need more space
  const isOppositeDirection = 
    (sourcePosition === Position.Right && targetPosition === Position.Left) ||
    (sourcePosition === Position.Left && targetPosition === Position.Right) ||
    (sourcePosition === Position.Top && targetPosition === Position.Bottom) ||
    (sourcePosition === Position.Bottom && targetPosition === Position.Top);
  
  const oppositeDirectionOffset = isOppositeDirection ? 30 : 0;
  
  return distanceBasedOffset + oppositeDirectionOffset;
}

/**
 * Detect optimal handle positions based on relative node positions
 * Returns adjusted source and target positions for smart routing
 */
function getSmartHandlePositions(
  sourceX: number,
  sourceY: number,
  targetX: number,
  targetY: number,
  sourcePosition: Position,
  targetPosition: Position
): { sourcePosition: Position; targetPosition: Position } {
  // Calculate relative position differences
  const dx = targetX - sourceX;
  const dy = targetY - sourceY;
  
  // Determine if target is in the "wrong" direction relative to source handle
  const isHorizontalHandle = sourcePosition === Position.Left || sourcePosition === Position.Right;
  const isVerticalHandle = sourcePosition === Position.Top || sourcePosition === Position.Bottom;
  
  let newSourcePosition = sourcePosition;
  let newTargetPosition = targetPosition;
  
  if (isHorizontalHandle) {
    // If source handle is on the right but target is to the left (dx < 0)
    if (sourcePosition === Position.Right && dx < -100) {
      // Target is significantly to the left, flip to use left handle
      newSourcePosition = Position.Left;
      newTargetPosition = Position.Right;
    }
    // If source handle is on the left but target is to the right (dx > 0)
    else if (sourcePosition === Position.Left && dx > 100) {
      // Target is significantly to the right, flip to use right handle
      newSourcePosition = Position.Right;
      newTargetPosition = Position.Left;
    }
    // Also consider vertical positioning for better routing
    else if (Math.abs(dy) > Math.abs(dx) * 2) { // Increased from 1.5 to 2 to be less aggressive
      // If vertical distance is much larger than horizontal, use vertical handles
      if (dy > 0) {
        newSourcePosition = Position.Bottom;
        newTargetPosition = Position.Top;
      } else {
        newSourcePosition = Position.Top;
        newTargetPosition = Position.Bottom;
      }
    }
  } else if (isVerticalHandle) {
    // If source handle is on the bottom but target is above (dy < 0)
    if (sourcePosition === Position.Bottom && dy < -100) {
      newSourcePosition = Position.Top;
      newTargetPosition = Position.Bottom;
    }
    // If source handle is on the top but target is below (dy > 0)
    else if (sourcePosition === Position.Top && dy > 100) {
      newSourcePosition = Position.Bottom;
      newTargetPosition = Position.Top;
    }
    // Consider horizontal positioning
    else if (Math.abs(dx) > Math.abs(dy) * 2) { // Increased from 1.5 to 2
      // If horizontal distance is much larger than vertical, use horizontal handles
      if (dx > 0) {
        newSourcePosition = Position.Right;
        newTargetPosition = Position.Left;
      } else {
        newSourcePosition = Position.Left;
        newTargetPosition = Position.Right;
      }
    }
  }
  
  return { sourcePosition: newSourcePosition, targetPosition: newTargetPosition };
}

/**
 * Get edge path based on edge type with smart routing
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
  },
  useSmartRouting: boolean = true
) {
  const { sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition } =
    params;

  const effectiveEdgeType = edgeType;
  const smartOffset = 0;
  let useCustomPath = false;
  
  // Apply smart routing if enabled
  if (useSmartRouting && edgeType !== EdgePathType.Straight) {
    // IMPORTANT: Check for complex routing BEFORE flipping handles
    const dx = targetX - sourceX;
    const dy = targetY - sourceY;
    
    // Detect if we need complex routing with original positions
    // Only trigger for CLEARLY opposite directions with strict thresholds
    const needsComplexRouting =
      (sourcePosition === Position.Right && dx < -150) || // Output right but target is significantly left
      (sourcePosition === Position.Left && dx > 150) ||   // Output left but target is significantly right
      (sourcePosition === Position.Bottom && dy < -150) || // Output bottom but target is significantly above
      (sourcePosition === Position.Top && dy > 150);      // Output top but target is significantly below
    
    if (needsComplexRouting) {
      // Use custom path with waypoints for complex opposite-direction routing
      useCustomPath = true;
    }
    // For all other cases, let Bezier handle naturally - no smart positioning
  }

  // Use custom path generator for complex routing scenarios
  if (useCustomPath) {
    return generateCustomPath(
      sourceX,
      sourceY,
      targetX,
      targetY,
      sourcePosition,
      targetPosition,
      15 // borderRadius
    );
  }

  // Standard path generation
  switch (effectiveEdgeType) {
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
        offset: smartOffset || 20,
        borderRadius: 15,
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
 * Renders different edge types based on data.edgeType with smart routing
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
  
  // Smart routing is enabled by default, can be disabled via data.disableSmartRouting
  const useSmartRouting = data?.disableSmartRouting !== true;

  const [edgePath, labelX, labelY] = getEdgePath(
    pathType,
    {
      sourceX,
      sourceY,
      targetX,
      targetY,
      sourcePosition,
      targetPosition,
    },
    useSmartRouting
  );

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
