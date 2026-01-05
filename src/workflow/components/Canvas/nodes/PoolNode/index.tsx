import { memo, useCallback } from "react";
import { type NodeProps } from "@xyflow/react";
import { cn } from "@sth87/shadcn-design-system";
import type { PoolNodeData } from "@/core/types/base.types";
import { Lock, Unlock, FlipHorizontal, FlipVertical } from "lucide-react";
import { useWorkflowStore } from "@/core/store/workflowStore";
import { globalEventBus } from "@/core/events/EventBus";
import NodeResizer from "../../resizer";

export interface PoolNodeProps extends NodeProps {
  data: PoolNodeData;
}

function PoolNodeComponent({ data, selected, id }: PoolNodeProps) {
  const { updateNode, nodes } = useWorkflowStore();

  const isHorizontal = data.orientation === "horizontal" || !data.orientation;
  const isLocked = data.isLocked ?? false;

  // Default dimensions
  const defaultWidth = isHorizontal ? 800 : 300;
  const defaultHeight = isHorizontal ? 300 : 600;

  const minWidth = data.minWidth ?? defaultWidth;
  const minHeight = data.minHeight ?? defaultHeight;

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
      updateNode(id, {
        ...data,
        orientation: newOrientation,
      });
    },
    [id, data, isHorizontal, updateNode]
  );

  const handleMouseEnter = useCallback(() => {
    globalEventBus.emit("pool-hover", true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    globalEventBus.emit("pool-hover", false);
  }, []);

  return (
    <NodeResizer
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      selected={selected}
      minWidth={minWidth}
      minHeight={minHeight}
      // style={{
      //   width: data.style?.width ?? defaultWidth,
      //   height: data.style?.height ?? defaultHeight,
      // }}
      className={cn(
        "bg-blue-50/30 border-2 border-blue-300 rounded-lg overflow-visible",
        {
          "border-blue-500 ring-4 ring-blue-500/25": selected,
        }
      )}
    >
      {/* Pool Header - Vertical label bar */}
      <div
        className={cn(
          "absolute bg-blue-200 border-blue-400 flex items-center justify-center font-semibold text-blue-800 text-sm z-10",
          {
            // Horizontal: Label on left side (vertical bar)
            "top-0 left-0 h-full w-8 border-r-2 writing-mode-vertical":
              isHorizontal,
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
          {String(data.metadata?.title || data.data?.label || "Pool")}
        </span>
      </div>

      {/* Pool Content Area */}
      <div
        className={cn("absolute", {
          // Horizontal: content starts after left label
          "left-8 top-0 right-0 bottom-0": isHorizontal,
          // Vertical: content starts after top label
          "left-0 top-8 right-0 bottom-0": !isHorizontal,
        })}
      >
        {/* Empty state hint */}
        {(!data.lanes || data.lanes.length === 0) && (
          <div className="flex items-center justify-center h-full text-blue-400 text-sm">
            {isLocked
              ? "Kéo nodes vào đây (chế độ khóa)"
              : "Kéo nodes vào/ra tự do"}
          </div>
        )}
      </div>

      {/* Toolbar - Floating controls */}
      {selected && (
        <div className="absolute top-2 right-2 flex gap-1 bg-white/90 backdrop-blur-sm border border-blue-300 rounded-md p-1 shadow-sm z-20">
          <button
            onClick={handleToggleLock}
            className="p-1.5 hover:bg-blue-100 rounded transition-colors"
            title={
              isLocked
                ? "Unlock (cho phép kéo ra)"
                : "Lock (giữ nodes bên trong)"
            }
          >
            {isLocked ? (
              <Lock size={16} className="text-blue-600" />
            ) : (
              <Unlock size={16} className="text-blue-400" />
            )}
          </button>
          <button
            onClick={handleToggleOrientation}
            className="p-1.5 hover:bg-blue-100 rounded transition-colors"
            title={isHorizontal ? "Chuyển sang dọc" : "Chuyển sang ngang"}
          >
            {isHorizontal ? (
              <FlipVertical size={16} className="text-blue-600" />
            ) : (
              <FlipHorizontal size={16} className="text-blue-600" />
            )}
          </button>
        </div>
      )}
    </NodeResizer>
  );
}

export default memo(PoolNodeComponent);
