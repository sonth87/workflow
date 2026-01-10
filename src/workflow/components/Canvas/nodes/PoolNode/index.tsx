import { memo, useCallback, useMemo, useState } from "react";
import { type NodeProps } from "@xyflow/react";
import { cn, Label, Popover } from "@sth87/shadcn-design-system";
import type { PoolNodeData, LaneConfig } from "@/core/types/base.types";
import {
  Lock,
  Unlock,
  FlipHorizontal,
  FlipVertical,
  Plus,
  Palette,
  Trash2,
} from "lucide-react";
import { useWorkflowStore } from "@/core/store/workflowStore";
import { globalEventBus } from "@/core/events/EventBus";
import NodeResizer from "../../resizer";
import NodeToolbar, { type ToolbarItemProps } from "../shared/NodeToolbar";

const poolColorClasses = {
  yellow: {
    bg: "bg-[#fde68a]/5",
    border: "border-[#fbbf24]",
    header: "bg-[#fef3c7]",
    headerBorder: "border-[#fbbf24]",
    text: "text-[#78350f]",
    lane: "bg-[#fef3c7]/0",
    laneText: "text-[#92400e]",
    laneBg: "bg-[#fef3c7]/60",
  },
  blue: {
    bg: "bg-[#bfdbfe]/5",
    border: "border-[#60a5fa]",
    header: "bg-[#dbeafe]",
    headerBorder: "border-[#60a5fa]",
    text: "text-[#1e3a8a]",
    lane: "bg-[#dbeafe]/0",
    laneText: "text-[#1e40af]",
    laneBg: "bg-[#dbeafe]/60",
  },
  green: {
    bg: "bg-[#d9f99d]/5",
    border: "border-[#84cc16]",
    header: "bg-[#ecfccb]",
    headerBorder: "border-[#84cc16]",
    text: "text-[#365314]",
    lane: "bg-[#ecfccb]/0",
    laneText: "text-[#3f6212]",
    laneBg: "bg-[#ecfccb]/60",
  },
  pink: {
    bg: "bg-[#fecdd3]/5",
    border: "border-[#fb7185]",
    header: "bg-[#ffe4e6]",
    headerBorder: "border-[#fb7185]",
    text: "text-[#881337]",
    lane: "bg-[#ffe4e6]/0",
    laneText: "text-[#9f1239]",
    laneBg: "bg-[#ffe4e6]/60",
  },
  purple: {
    bg: "bg-[#ddd6fe]/5",
    border: "border-[#a78bfa]",
    header: "bg-[#ede9fe]",
    headerBorder: "border-[#a78bfa]",
    text: "text-[#4c1d95]",
    lane: "bg-[#ede9fe]/0",
    laneText: "text-[#5b21b6]",
    laneBg: "bg-[#ede9fe]/60",
  },
  orange: {
    bg: "bg-[#fed7aa]/5",
    border: "border-[#fb923c]",
    header: "bg-[#ffedd5]",
    headerBorder: "border-[#fb923c]",
    text: "text-[#7c2d12]",
    lane: "bg-[#ffedd5]/0",
    laneText: "text-[#9a3412]",
    laneBg: "bg-[#ffedd5]/60",
  },
  gray: {
    bg: "bg-[#e4e4e7]/5",
    border: "border-[#d4d4d8]",
    header: "bg-[#f4f4f5]",
    headerBorder: "border-[#d4d4d8]",
    text: "text-[#27272a]",
    lane: "bg-[#f4f4f5]/0",
    laneText: "text-[#3f3f46]",
    laneBg: "bg-[#f4f4f5]/60",
  },
};

export interface PoolNodeProps extends NodeProps {
  data: PoolNodeData;
}

function PoolNodeComponent({ data, selected, id }: PoolNodeProps) {
  const { updateNode, nodes } = useWorkflowStore();

  const isHorizontal = data.orientation === "horizontal" || !data.orientation;
  const isLocked = data.isLocked ?? false;
  const color = (data.color as keyof typeof poolColorClasses) || "gray";
  const colorScheme = poolColorClasses[color];

  const [showColorPicker, setShowColorPicker] = useState(false);
  const [editingLaneId, setEditingLaneId] = useState<string | null>(null);
  const [editingLabel, setEditingLabel] = useState("");
  const [resizingLaneIndex, setResizingLaneIndex] = useState<number | null>(
    null
  );
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editingTitle, setEditingTitle] = useState("");

  // Default dimensions
  const defaultWidth = isHorizontal ? 650 : 300;
  const defaultHeight = isHorizontal ? 300 : 400;

  const minWidth = data.minWidth ?? defaultWidth;
  const minHeight = data.minHeight ?? defaultHeight;

  // Check if pool has any child nodes
  const hasChildNodes = useMemo(() => {
    return nodes.some(n => n.parentId === id);
  }, [nodes, id]);

  // Calculate lane positions and sizes based on ratios
  const poolNode = useMemo(() => nodes.find(n => n.id === id), [nodes, id]);
  const poolWidth = poolNode?.measured?.width ?? defaultWidth;
  const poolHeight = poolNode?.measured?.height ?? defaultHeight;

  const laneLayout = useMemo(() => {
    if (!data.lanes || data.lanes.length === 0) return [];

    const lanes = data.lanes;

    // Subtract label bar size
    const labelSize = 32; // 8 * 4 = 32px for label bar
    const availableWidth = isHorizontal ? poolWidth - labelSize : poolWidth;
    const availableHeight = isHorizontal ? poolHeight : poolHeight - labelSize;
    const totalSpace = isHorizontal ? availableHeight : availableWidth;

    return lanes.map(lane => {
      // Calculate size ratio (0-1) for flex-basis
      let flexRatio: number;
      if (lane.sizeRatio !== undefined) {
        flexRatio = lane.sizeRatio;
      } else if (lane.size !== undefined) {
        // Backward compatibility: convert old pixel size to ratio
        flexRatio = lane.size / totalSpace;
      } else {
        // Distribute evenly
        flexRatio = 1 / lanes.length;
      }

      return {
        ...lane,
        flexRatio,
      };
    });
  }, [data.lanes, isHorizontal, poolWidth, poolHeight]);

  const handleDeleteLane = useCallback(
    (laneId: string, e?: React.MouseEvent) => {
      e?.stopPropagation();

      const existingLanes = data.lanes ?? [];

      // Don't allow deleting if only one lane
      if (existingLanes.length <= 1) {
        return;
      }

      // Filter out the deleted lane
      const remainingLanes = existingLanes.filter(l => l.id !== laneId);

      // Normalize remaining lanes to have sizeRatio
      const normalizedRemaining = remainingLanes.map(lane => ({
        ...lane,
        sizeRatio: lane.sizeRatio ?? 1 / existingLanes.length,
      }));

      // Calculate total ratio of remaining lanes
      const totalRatio = normalizedRemaining.reduce(
        (sum, lane) => sum + (lane.sizeRatio ?? 0),
        0
      );

      // Scale up remaining lanes proportionally to fill 100%
      const scaleFactor = 1 / totalRatio;
      const updatedLanes = normalizedRemaining.map(lane => ({
        ...lane,
        sizeRatio: (lane.sizeRatio ?? 0) * scaleFactor,
      }));

      updateNode(id, {
        data: {
          ...data,
          lanes: updatedLanes,
        },
      });
    },
    [id, data, updateNode]
  );

  const handleAddLane = useCallback(
    (e?: React.MouseEvent) => {
      e?.stopPropagation();

      const existingLanes = data.lanes ?? [];
      const totalLanes = existingLanes.length + 1;

      // Case 1: No existing lanes → first lane takes 100%
      if (existingLanes.length === 0) {
        const newLane: LaneConfig = {
          id: `lane-${Date.now()}`,
          label: `Lane 1`,
          sizeRatio: 1.0,
        };

        updateNode(id, {
          data: { ...data, lanes: [newLane] },
        });
        return;
      }

      // Normalize all lanes to have sizeRatio first
      // This ensures consistent calculation
      const normalizedLanes = existingLanes.map(lane => ({
        ...lane,
        sizeRatio: lane.sizeRatio ?? 1 / existingLanes.length,
      }));

      // Calculate total current ratio (should be ~1.0)
      const totalCurrentRatio = normalizedLanes.reduce(
        (sum, lane) => sum + (lane.sizeRatio ?? 0),
        0
      );

      // Case 2: All lanes were evenly distributed (total ≈ 1.0 and all equal)
      // → Redistribute all lanes equally
      const allEqual = normalizedLanes.every(
        l => Math.abs((l.sizeRatio ?? 0) - 1 / existingLanes.length) < 0.001
      );
      if (allEqual && Math.abs(totalCurrentRatio - 1.0) < 0.001) {
        const newRatio = 1 / totalLanes;
        const updatedLanes = normalizedLanes.map(lane => ({
          ...lane,
          sizeRatio: newRatio,
        }));

        const newLane: LaneConfig = {
          id: `lane-${Date.now()}`,
          label: `Lane ${totalLanes}`,
          sizeRatio: newRatio,
        };

        updateNode(id, {
          data: { ...data, lanes: [...updatedLanes, newLane] },
        });
        return;
      }

      // Case 3: Some lanes have custom ratios
      // → Steal from last lane (or shrink all if last lane too small)
      const newLaneRatio = Math.min(0.15, 1 / totalLanes); // Min 15% or 1/n
      const lastIndex = normalizedLanes.length - 1;
      const lastLane = normalizedLanes[lastIndex];
      const currentRatio = lastLane.sizeRatio ?? 0;

      let updatedExistingLanes: LaneConfig[];

      // If last lane is too small, shrink all proportionally
      if (currentRatio < newLaneRatio * 2) {
        const scaleFactor = (1 - newLaneRatio) / totalCurrentRatio;
        updatedExistingLanes = normalizedLanes.map(lane => ({
          ...lane,
          sizeRatio: (lane.sizeRatio ?? 0) * scaleFactor,
        }));
      } else {
        // Last lane is large enough, only steal from last lane
        updatedExistingLanes = normalizedLanes.map((lane, idx) =>
          idx === lastIndex
            ? { ...lane, sizeRatio: currentRatio - newLaneRatio }
            : lane
        );
      }

      const newLane: LaneConfig = {
        id: `lane-${Date.now()}`,
        label: `Lane ${totalLanes}`,
        sizeRatio: newLaneRatio,
      };

      updateNode(id, {
        data: {
          ...data,
          lanes: [...updatedExistingLanes, newLane],
        },
      });
    },
    [id, data, updateNode]
  );

  const handleColorChange = useCallback(
    (newColor: keyof typeof poolColorClasses) => {
      updateNode(id, {
        data: {
          ...data,
          color: newColor,
        },
      });
      setShowColorPicker(false);
    },
    [id, data, updateNode]
  );

  const handleLaneLabelDoubleClick = useCallback(
    (lane: LaneConfig, e: React.MouseEvent) => {
      e.stopPropagation();
      setEditingLaneId(lane.id);
      setEditingLabel(lane.label);
    },
    []
  );

  const handleLaneLabelChange = useCallback(
    (laneId: string, newLabel: string) => {
      const updatedLanes = data.lanes?.map(l =>
        l.id === laneId ? { ...l, label: newLabel } : l
      );
      updateNode(id, {
        data: {
          ...data,
          lanes: updatedLanes,
        },
      });
      setEditingLaneId(null);
    },
    [id, data, updateNode]
  );

  const handleLaneLabelBlur = useCallback(() => {
    if (editingLaneId) {
      handleLaneLabelChange(editingLaneId, editingLabel);
    }
  }, [editingLaneId, editingLabel, handleLaneLabelChange]);

  const handleLaneLabelKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault();
        handleLaneLabelBlur();
      } else if (e.key === "Escape") {
        setEditingLaneId(null);
      }
    },
    [handleLaneLabelBlur]
  );

  const handleTitleDoubleClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      const currentTitle = String(
        data.metadata?.title || data.data?.label || "Pool"
      );
      setIsEditingTitle(true);
      setEditingTitle(currentTitle);
    },
    [data]
  );

  const handleTitleChange = useCallback(
    (newTitle: string) => {
      updateNode(id, {
        data: {
          ...data,
          metadata: {
            ...data.metadata,
            title: newTitle,
          },
        },
      });
      setIsEditingTitle(false);
    },
    [id, data, updateNode]
  );

  const handleTitleBlur = useCallback(() => {
    if (isEditingTitle) {
      handleTitleChange(editingTitle);
    }
  }, [isEditingTitle, editingTitle, handleTitleChange]);

  const handleTitleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault();
        handleTitleBlur();
      } else if (e.key === "Escape") {
        setIsEditingTitle(false);
      }
    },
    [handleTitleBlur]
  );

  const handleDividerMouseDown = useCallback(
    (laneIndex: number, e: React.MouseEvent) => {
      e.stopPropagation();
      e.preventDefault();
      setResizingLaneIndex(laneIndex);

      const startPos = isHorizontal ? e.clientY : e.clientX;

      // Get current flex ratios
      const currentRatio =
        data.lanes?.[laneIndex]?.sizeRatio ?? 1 / (data.lanes?.length ?? 1);
      const nextRatio =
        data.lanes?.[laneIndex + 1]?.sizeRatio ?? 1 / (data.lanes?.length ?? 1);

      // Get pool dimensions for ratio calculation
      const labelSize = 32;
      const availableWidth = isHorizontal ? poolWidth - labelSize : poolWidth;
      const availableHeight = isHorizontal
        ? poolHeight
        : poolHeight - labelSize;
      const totalSpace = isHorizontal ? availableHeight : availableWidth;

      // Calculate current pixel sizes from ratios
      const startSize = currentRatio * totalSpace;
      const nextStartSize = nextRatio * totalSpace;

      const handleMouseMove = (moveEvent: MouseEvent) => {
        const currentPos = isHorizontal ? moveEvent.clientY : moveEvent.clientX;
        const delta = currentPos - startPos;
        const newSize = Math.max(
          data.lanes?.[laneIndex]?.minSize || 50,
          startSize + delta
        );
        const newNextSize = Math.max(
          data.lanes?.[laneIndex + 1]?.minSize || 50,
          nextStartSize - delta
        );

        // Convert pixel sizes to ratios
        const newSizeRatio = newSize / totalSpace;
        const newNextSizeRatio = newNextSize / totalSpace;

        const updatedLanes = data.lanes?.map((l, idx) => {
          if (idx === laneIndex) return { ...l, sizeRatio: newSizeRatio };
          if (idx === laneIndex + 1)
            return { ...l, sizeRatio: newNextSizeRatio };
          return l;
        });

        updateNode(id, {
          data: {
            ...data,
            lanes: updatedLanes,
          },
        });
      };

      const handleMouseUp = () => {
        setResizingLaneIndex(null);
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    },
    [data, id, isHorizontal, updateNode, poolWidth, poolHeight]
  );

  const handleToggleLock = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      const newLockState = !isLocked;

      // Update pool lock state in both data and properties
      updateNode(id, {
        data: {
          ...data,
          isLocked: newLockState,
        },
        properties: {
          ...data.properties,
          isLocked: newLockState,
        },
      });

      // Update all children nodes to set/clear extent based on lock state
      const childrenNodes = nodes.filter(n => n.parentId === id);
      childrenNodes.forEach(child => {
        updateNode(child.id, {
          extent: newLockState ? ("parent" as const) : undefined,
        });
      });
    },
    [id, data, isLocked, updateNode, nodes]
  );

  const handleToggleOrientation = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      const newOrientation = isHorizontal ? "vertical" : "horizontal";

      // Use memoized poolNode to access measured dimensions
      const currentWidth =
        poolNode?.measured?.width ?? (isHorizontal ? 650 : 300);
      const currentHeight =
        poolNode?.measured?.height ?? (isHorizontal ? 300 : 400);

      // Calculate new min dimensions based on new orientation
      // When switching orientation, swap the dimensions to maintain proportions
      const newMinWidth = newOrientation === "horizontal" ? 650 : 300;
      const newMinHeight = newOrientation === "horizontal" ? 300 : 400;

      // Also adjust current dimensions if they don't meet new minimums
      const adjustedWidth = Math.max(currentWidth, newMinWidth);
      const adjustedHeight = Math.max(currentHeight, newMinHeight);

      updateNode(id, {
        data: {
          ...data,
          orientation: newOrientation,
          minWidth: newMinWidth,
          minHeight: newMinHeight,
        },
        // Update node dimensions to meet new minimums
        style: {
          ...poolNode?.style,
          width: adjustedWidth,
          height: adjustedHeight,
        },
      });
    },
    [id, data, isHorizontal, updateNode, poolNode]
  );

  const handleMouseEnter = useCallback(() => {
    globalEventBus.emit("pool-hover", true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    globalEventBus.emit("pool-hover", false);
  }, []);

  // Build toolbar items
  const toolbarItems = useMemo<ToolbarItemProps[]>(() => {
    const items: ToolbarItemProps[] = [
      {
        id: "add-lane",
        icon: <Plus size={16} />,
        tooltip: "Thêm lane mới",
        onClick: handleAddLane,
      },
      {
        id: "toggle-lock",
        icon: isLocked ? <Lock size={16} /> : <Unlock size={16} />,
        tooltip: isLocked
          ? "Unlock (cho phép kéo ra)"
          : "Lock (giữ nodes bên trong)",
        onClick: handleToggleLock,
      },
      {
        id: "toggle-orientation",
        icon: isHorizontal ? (
          <FlipVertical size={16} />
        ) : (
          <FlipHorizontal size={16} />
        ),
        tooltip: isHorizontal ? "Chuyển sang dọc" : "Chuyển sang ngang",
        onClick: handleToggleOrientation,
      },
      {
        id: "color-picker",
        icon: <></>,
        tooltip: "Đổi màu",
        onClick: () => {},
        customContent: (
          <Popover
            open={showColorPicker}
            onOpenChange={setShowColorPicker}
            className="py-2 px-3"
            trigger={
              <button
                onClick={() => setShowColorPicker(!showColorPicker)}
                className="p-1 hover:bg-accent rounded transition-colors"
              >
                <Palette className="w-4 h-4" />
              </button>
            }
            content={
              <div className="flex gap-1">
                {[
                  { key: "yellow", bg: "bg-[#fde68a]" },
                  { key: "blue", bg: "bg-[#bfdbfe]" },
                  { key: "green", bg: "bg-[#d9f99d]" },
                  { key: "pink", bg: "bg-[#fecdd3]" },
                  { key: "purple", bg: "bg-[#ddd6fe]" },
                  { key: "orange", bg: "bg-[#fed7aa]" },
                  { key: "gray", bg: "bg-[#e4e4e7]" },
                ].map(({ key, bg }) => (
                  <button
                    key={key}
                    onClick={() =>
                      handleColorChange(key as keyof typeof poolColorClasses)
                    }
                    className={cn("w-6 h-6 rounded-full border", bg, {
                      "border-primary ring-primary/50": color === key,
                      "border-gray-300": color !== key,
                    })}
                    title={key}
                  />
                ))}
              </div>
            }
          />
        ),
      },
    ];
    return items;
  }, [
    isLocked,
    isHorizontal,
    showColorPicker,
    color,
    handleAddLane,
    handleToggleLock,
    handleToggleOrientation,
    handleColorChange,
  ]);

  return (
    <NodeResizer
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      selected={selected}
      minWidth={minWidth}
      minHeight={minHeight}
      className={cn(
        colorScheme.bg,
        "border",
        colorScheme.border,
        "rounded-lg overflow-visible"
      )}
    >
      {/* Pool Header - Vertical label bar */}
      <div
        className={cn(
          "absolute",
          colorScheme.header,
          colorScheme.headerBorder,
          "flex items-center justify-center font-semibold",
          colorScheme.text,
          "text-md z-10",
          {
            // Horizontal: Label on left side (vertical bar)
            "top-0 left-0 h-full w-10 border-r writing-mode-vertical rounded-l-lg":
              isHorizontal,
            // Vertical: Label on top (horizontal bar)
            "top-0 left-0 w-full h-10 border-b rounded-t-lg": !isHorizontal,
          }
        )}
        onDoubleClick={handleTitleDoubleClick}
        style={{
          cursor: isEditingTitle ? "text" : "pointer",
        }}
      >
        {isEditingTitle ? (
          <input
            type="text"
            value={editingTitle}
            onChange={e => setEditingTitle(e.target.value)}
            onBlur={handleTitleBlur}
            onKeyDown={handleTitleKeyDown}
            autoFocus
            className={cn(
              "min-w-xs bg-white/70 border font-semibold nodrag text-center rounded px-3 py-1",
              colorScheme.text
            )}
            onClick={e => e.stopPropagation()}
          />
        ) : (
          <span
            className={cn({
              "rotate-180": isHorizontal,
            })}
            style={
              isHorizontal
                ? { writingMode: "vertical-rl", textOrientation: "mixed" }
                : {}
            }
          >
            {String(data.metadata?.title || data.data?.label || "Pool")}
          </span>
        )}
      </div>

      {/* Pool Content Area */}
      <div
        className={cn("absolute flex", {
          // Horizontal: content starts after left label, lanes stack vertically
          "left-10 top-0 right-0 bottom-0 flex-col": isHorizontal,
          // Vertical: content starts after top label, lanes stack horizontally
          "left-0 top-10 right-0 bottom-0 flex-row": !isHorizontal,
        })}
      >
        {/* Render lanes */}
        {laneLayout.length > 0
          ? laneLayout.map((lane, index) => (
              <div
                key={lane.id}
                className={cn(
                  "relative group",
                  colorScheme.border,
                  colorScheme.lane,
                  {
                    "border-b": isHorizontal && index < laneLayout.length - 1,
                    "border-r": !isHorizontal && index < laneLayout.length - 1,
                  }
                )}
                style={{
                  flex: `${lane.flexRatio} 1 0`,
                  minHeight: isHorizontal ? (lane.minSize ?? 50) : undefined,
                  minWidth: !isHorizontal ? (lane.minSize ?? 50) : undefined,
                }}
              >
                {/* Lane Label */}
                <div
                  className={cn(
                    "absolute font-medium",
                    colorScheme.laneText,
                    "flex items-center justify-center",
                    colorScheme.laneBg,
                    "px-2 rounded max-w-[calc(100%-1rem)]",
                    {
                      "left-2 top-2": true,
                    }
                  )}
                  onDoubleClick={e => handleLaneLabelDoubleClick(lane, e)}
                  style={{
                    cursor: editingLaneId === lane.id ? "text" : "pointer",
                  }}
                >
                  {editingLaneId === lane.id ? (
                    <input
                      type="text"
                      value={editingLabel}
                      onChange={e => setEditingLabel(e.target.value)}
                      onBlur={handleLaneLabelBlur}
                      onKeyDown={handleLaneLabelKeyDown}
                      autoFocus
                      className={cn(
                        "bg-transparent border outline-none font-medium px-3 py-2 rounded nodrag",
                        colorScheme.laneText,
                        "w-full"
                      )}
                      onClick={e => e.stopPropagation()}
                    />
                  ) : (
                    <span>{lane.label}</span>
                  )}
                </div>

                {/* Delete button - positioned at opposite corner */}
                {laneLayout.length > 1 && (
                  <button
                    onClick={e => handleDeleteLane(lane.id, e)}
                    className={cn(
                      "absolute nodrag opacity-0 group-hover:opacity-100 transition-opacity",
                      "hover:bg-red-500/20 rounded p-1.5",
                      "flex items-center justify-center",
                      colorScheme.laneBg,
                      {
                        "right-2 top-2": true,
                      }
                    )}
                    title="Xóa lane"
                  >
                    <Trash2 size={14} className="text-red-600" />
                  </button>
                )}

                {/* Lane Resize Divider */}
                {index < laneLayout.length - 1 && (
                  <div
                    className={cn(
                      "absolute z-50 hover:bg-blue-400/50 transition-colors nodrag",
                      {
                        "bottom-0 left-0 right-0 h-1 cursor-row-resize":
                          isHorizontal,
                        "right-0 top-0 bottom-0 w-1 cursor-col-resize":
                          !isHorizontal,
                        "bg-blue-400/30": resizingLaneIndex === index,
                      }
                    )}
                    onMouseDown={e => handleDividerMouseDown(index, e)}
                    title="Kéo để thay đổi kích thước"
                  />
                )}
              </div>
            ))
          : /* Empty state hint - only show if no lanes AND no children */
            !hasChildNodes && (
              <div
                className={cn(
                  "flex items-center justify-center h-full text-sm",
                  colorScheme.text
                )}
              >
                Nhấn
                <Label className="mx-2 text-lg bg-muted rounded w-5 h-5 leading-0 flex items-center justify-center">
                  +
                </Label>
                để thêm lanes
              </div>
            )}
      </div>

      {/* Toolbar */}
      <NodeToolbar items={toolbarItems} visible={selected} />
    </NodeResizer>
  );
}

export default memo(PoolNodeComponent);
