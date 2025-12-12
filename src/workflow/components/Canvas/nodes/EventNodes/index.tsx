import { Handle, Position } from "@xyflow/react";
import type { CustomNodeProps } from "..";
import { handleStyle } from "../styles";

export function StartEventNode({
  sourcePosition = Position.Bottom,
}: CustomNodeProps) {
  return (
    <Handle
      type="source"
      position={sourcePosition}
      id="out"
      className={handleStyle}
    />
  );
}

export function EndEventNode({
  targetPosition = Position.Top,
}: CustomNodeProps) {
  return (
    <Handle
      type="target"
      position={targetPosition}
      id="in"
      className={handleStyle}
    />
  );
}
