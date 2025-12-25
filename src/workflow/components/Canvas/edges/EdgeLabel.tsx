import type { EdgeVisualConfig, EdgeLabel } from "@/core/types/base.types";
import { useState, useCallback } from "react";
import { useWorkflowStore } from "@/core/store/workflowStore";
import { handleEdgePropertyChange as syncEdgeProperty } from "@/workflow/utils/edgePropertySync";

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
export function EdgeLabelComponent({
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

    const trimmedValue = editValue.trim();
    const propertyId = `${position}-label`;

    // Use sync handler to manage all related updates
    const updates = syncEdgeProperty(propertyId, trimmedValue, edge);
    updateEdge(edgeId, updates);
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

  const showPlaceholder = isHovered && !isEditing && !label?.text;
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
