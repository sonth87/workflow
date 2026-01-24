import { Position } from "@xyflow/react";
import type { CustomNodeProps } from "..";
import { CustomHandle } from "../../handle";
import { DEFAULT_LAYOUT_DIRECTION } from "@/workflow/constants/common";

const sPos =
  DEFAULT_LAYOUT_DIRECTION !== "horizontal" ? Position.Bottom : Position.Right;
const tPos =
  DEFAULT_LAYOUT_DIRECTION !== "horizontal" ? Position.Top : Position.Left;

export function ImmediateNode({
  isConnecting,
  sourcePosition = sPos,
  targetPosition = tPos,
}: CustomNodeProps) {
  return (
    <>
      <CustomHandle
        type="target"
        position={targetPosition}
        id="in"
        isConnectable={!isConnecting}
      />
      <CustomHandle
        type="source"
        position={sourcePosition}
        id="out"
        isConnectable={!isConnecting}
      />
    </>
  );
}
