import { Position } from "@xyflow/react";
import type { CustomNodeProps } from "..";
import { CustomHandle } from "../../handle";

export function StartEventNode({
  sourcePosition = Position.Bottom,
}: CustomNodeProps) {
  return <CustomHandle type="source" position={sourcePosition} id="out" />;
}

export function EndEventNode({
  targetPosition = Position.Top,
}: CustomNodeProps) {
  return <CustomHandle type="target" position={targetPosition} id="in" />;
}
