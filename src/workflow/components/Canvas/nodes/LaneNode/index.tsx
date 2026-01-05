import { memo, useCallback } from "react";
import { NodeResizer, type NodeProps } from "@xyflow/react";
import { cn } from "@sth87/shadcn-design-system";
import type { LaneNodeData } from "@/core/types/base.types";
import { Lock, Unlock, FlipHorizontal, FlipVertical } from "lucide-react";
import { useWorkflowStore } from "@/core/store/workflowStore";

export interface LaneNodeProps extends NodeProps {
  data: LaneNodeData;
}

function LaneNodeComponent({ data, selected, id }: LaneNodeProps) {
  const { updateNode } = useWorkflowStore();

  const isHorizontal = data.orientation === "horizontal" || !data.orientation;
  const isLocked = data.isLocked ?? false;

  // Default dimensions
  const defaultWidth = isHorizontal ? 600 : 250;
  const defaultHeight = isHorizontal ? 200 : 400;

  const minWidth = data.minWidth ?? (isHorizontal ? 300 : 150);
  const minHeight = data.minHeight ?? (isHorizontal ? 150 : 300);

  const handleToggleLock = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      updateNode(id, {
        ...data,
        isLocked: !isLocked,
      });
    },
    [id, data, isLocked, updateNode]
  );

  const handleToggleOrientation = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      const newOrientation = isHorizontal ? "vertical" : "horizontal";
      updateNode(id, {
        ...data,
        orientation: newOrientation,
      });
    },
    [id, data, isHorizontal, updateNode]
  );

  return (
    <div
      className={cn(
        "relative bg-green-50/30 border-2 border-green-300 rounded-lg overflow-visible",
        {
          "border-green-500 ring-4 ring-green-500/25": selected,
        }
      )}
      style={{
        width: data.style?.width ?? defaultWidth,
        height: data.style?.height ?? defaultHeight,
        minWidth,
        minHeight,
      }}
    >
      {/* Resizer */}
      {data.resizable !== false && (
        <NodeResizer
          minWidth={minWidth}
          minHeight={minHeight}
          isVisible={selected}
          lineClassName="!border-green-500"
          handleClassName="!w-3 !h-3 !bg-green-500"
        />
      )}

      {/* Lane Header - Label bar */}
      <div
        className={cn(
          "absolute bg-green-200 border-green-400 flex items-center justify-center font-semibold text-green-800 text-sm z-10",
          {
            // Horizontal: Label on left side (vertical bar)
            "top-0 left-0 h-full w-8 border-r-2": isHorizontal,
            // Vertical: Label on top (horizontal bar)
            "top-0 left-0 w-full h-8 border-b-2": !isHorizontal,
          }
        )}
      >
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
          {String(data.metadata?.title || data.data?.label || "Lane")}
        </span>
      </div>

      {/* Lane Content Area */}
      <div
        className={cn("absolute", {
          // Horizontal: content starts after left label
          "left-8 top-0 right-0 bottom-0": isHorizontal,
          // Vertical: content starts after top label
          "left-0 top-8 right-0 bottom-0": !isHorizontal,
        })}
      >
        {/* Empty state hint */}
        <div className="flex items-center justify-center h-full text-green-400 text-xs">
          {isLocked
            ? "Kéo nodes vào đây (chế độ khóa)"
            : "Kéo nodes vào/ra tự do"}
        </div>
      </div>

      {/* Toolbar - Floating controls */}
      {selected && (
        <div className="absolute top-2 right-2 flex gap-1 bg-white/90 backdrop-blur-sm border border-green-300 rounded-md p-1 shadow-sm z-20">
          <button
            onClick={handleToggleLock}
            className="p-1.5 hover:bg-green-100 rounded transition-colors"
            title={
              isLocked ? "Unlock (cho phép kéo ra)" : "Lock (giữ nodes bên trong)"
            }
          >
            {isLocked ? (
              <Lock size={16} className="text-green-600" />
            ) : (
              <Unlock size={16} className="text-green-400" />
            )}
          </button>
          <button
            onClick={handleToggleOrientation}
            className="p-1.5 hover:bg-green-100 rounded transition-colors"
            title={isHorizontal ? "Chuyển sang dọc" : "Chuyển sang ngang"}
          >
            {isHorizontal ? (
              <FlipVertical size={16} className="text-green-600" />
            ) : (
              <FlipHorizontal size={16} className="text-green-600" />
            )}
          </button>
        </div>
      )}
    </div>
  );
}

export default memo(LaneNodeComponent);
