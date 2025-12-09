import { useState, useCallback, useMemo } from "react";
import {
  NodeResizer,
  type NodeProps,
  useReactFlow,
  useUpdateNodeInternals,
} from "@xyflow/react";
import { Plus, Trash2, GripVertical } from "lucide-react";
import type { PoolNode as PoolNodeType } from "@/types/workflow.type";

export function PoolNode({ id, data, selected }: NodeProps) {
  const { setNodes } = useReactFlow();
  const updateNodeInternals = useUpdateNodeInternals();
  const poolData = useMemo(() => (data as Partial<PoolNodeType>) || {}, [data]);

  const [label, setLabel] = useState(
    poolData.label || "Quy trình đăng ký sử dụng xe của trường"
  );
  const [lanes, setLanes] = useState(poolData.lanes || []);
  const [isEditingLabel, setIsEditingLabel] = useState(false);
  const [editingLane, setEditingLane] = useState<string | null>(null);

  const HEADER_HEIGHT = 40;
  const LANE_HEADER_HEIGHT = 40;
  const totalWidth = useMemo(
    () => lanes.reduce((sum, lane) => sum + lane.size, 0),
    [lanes]
  );

  const updateNodeData = useCallback(
    (updatedLanes: typeof lanes) => {
      setNodes(nodes =>
        nodes.map(node => {
          if (node.id === id) {
            return {
              ...node,
              data: {
                ...node.data,
                label,
                layout: "horizontal",
                lanes: updatedLanes,
              },
            };
          }
          return node;
        })
      );
      requestAnimationFrame(() => {
        updateNodeInternals(id);
      });
    },
    [id, label, setNodes, updateNodeInternals]
  );

  const handleAddLane = useCallback(() => {
    const newLane = {
      id: Date.now().toString(),
      label: `Lane ${lanes.length + 1}`,
      size: 200,
    };
    const newLanes = [...lanes, newLane];
    setLanes(newLanes);
    updateNodeData(newLanes);
  }, [lanes, updateNodeData]);

  const handleDeleteLane = useCallback(
    (laneId: string) => {
      if (lanes.length <= 1) return;
      const newLanes = lanes.filter(l => l.id !== laneId);
      setLanes(newLanes);
      updateNodeData(newLanes);
    },
    [lanes, updateNodeData]
  );

  const handleEditLaneLabel = useCallback(
    (laneId: string, newLabel: string) => {
      const newLanes = lanes.map(lane =>
        lane.id === laneId ? { ...lane, label: newLabel } : lane
      );
      setLanes(newLanes);
      updateNodeData(newLanes);
    },
    [lanes, updateNodeData]
  );

  const handleLabelBlur = useCallback(() => {
    setIsEditingLabel(false);
    updateNodeData(lanes);
  }, [lanes, updateNodeData]);

  const handleLabelKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        setIsEditingLabel(false);
        updateNodeData(lanes);
      } else if (e.key === "Escape") {
        setLabel(poolData.label || "Pool");
        setIsEditingLabel(false);
      }
    },
    [poolData.label, lanes, updateNodeData]
  );

  return (
    <>
      <NodeResizer
        isVisible={!!selected}
        minWidth={400}
        minHeight={200}
        handleStyle={{
          width: 8,
          height: 8,
          borderRadius: 4,
        }}
      />

      <div
        className="relative bg-background border-2 border-muted-foreground/30 rounded-lg overflow-hidden"
        style={{ width: totalWidth, height: 400 }}
      >
        {/* Pool Header */}
        <div
          className="absolute top-0 left-0 right-0 bg-muted/70 border-b border-muted-foreground/30 flex items-center justify-between px-4 cursor-move"
          style={{ height: HEADER_HEIGHT }}
        >
          <div className="flex items-center gap-2">
            <GripVertical className="w-4 h-4 text-muted-foreground" />
            {isEditingLabel ? (
              <input
                type="text"
                value={label}
                onChange={e => setLabel(e.target.value)}
                onBlur={handleLabelBlur}
                onKeyDown={handleLabelKeyDown}
                autoFocus
                className="px-2 py-1 text-sm font-semibold bg-background border rounded focus:outline-none focus:ring-2 focus:ring-primary nodrag"
              />
            ) : (
              <span
                className="text-sm font-semibold cursor-pointer hover:text-primary transition-colors"
                onDoubleClick={() => setIsEditingLabel(true)}
              >
                {label}
              </span>
            )}
          </div>

          {selected && (
            <button
              onClick={handleAddLane}
              className="p-1.5 hover:bg-background rounded transition-colors nodrag"
              title="Add Lane"
            >
              <Plus className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Lanes */}
        <div
          className="absolute left-0 right-0 bottom-0 flex nodrag"
          style={{ top: HEADER_HEIGHT }}
        >
          {lanes.map((lane, index) => (
            <div
              key={lane.id}
              className="relative bg-background/5 group/lane"
              style={{
                width: lane.size,
                borderRight:
                  index < lanes.length - 1
                    ? "1px solid rgba(0,0,0,0.1)"
                    : "none",
              }}
            >
              {/* Lane Header */}
              <div
                className="absolute top-0 left-0 right-0 bg-muted/50 border-b border-muted-foreground/20 flex items-center justify-center gap-1 px-2"
                style={{ height: LANE_HEADER_HEIGHT }}
              >
                {editingLane === lane.id ? (
                  <input
                    type="text"
                    value={lane.label}
                    onChange={e => handleEditLaneLabel(lane.id, e.target.value)}
                    onBlur={() => setEditingLane(null)}
                    onKeyDown={e => {
                      if (e.key === "Enter" || e.key === "Escape")
                        setEditingLane(null);
                    }}
                    autoFocus
                    className="w-full px-2 py-1 text-xs font-medium text-center bg-background border rounded focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                ) : (
                  <div className="flex items-center gap-1">
                    <span
                      className="text-xs font-medium cursor-pointer hover:text-primary transition-colors"
                      onDoubleClick={() => setEditingLane(lane.id)}
                    >
                      {lane.label}
                    </span>
                    {selected && lanes.length > 1 && (
                      <button
                        onClick={() => handleDeleteLane(lane.id)}
                        className="opacity-0 group-hover/lane:opacity-100 p-0.5 hover:bg-destructive/10 rounded transition-all"
                        title="Delete lane"
                      >
                        <Trash2 className="w-3 h-3 text-destructive" />
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Lane Content Area */}
              <div
                className="absolute left-0 right-0 bottom-0"
                style={{ top: LANE_HEADER_HEIGHT }}
              />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
