import { Handle, Position } from "@xyflow/react";
import type { CustomNodeProps } from "..";
import { handleStyle } from "../styles";

export function ExclusiveGatewayNode({
  isConnecting,
  sourcePosition = Position.Bottom,
  targetPosition = Position.Top,
}: CustomNodeProps) {
  const isHorizontal = sourcePosition === Position.Right;
  const out1Position = isHorizontal ? Position.Top : Position.Left;
  const out2Position = isHorizontal ? Position.Bottom : Position.Right;

  return (
    <>
      <Handle
        type="target"
        position={targetPosition}
        id="in"
        isConnectable={!isConnecting}
        className={handleStyle}
      />
      <Handle
        type="source"
        position={out1Position}
        id="out-1"
        isConnectable={!isConnecting}
        className={handleStyle}
      />
      <Handle
        type="source"
        position={out2Position}
        id="out-2"
        isConnectable={!isConnecting}
        className={handleStyle}
      />
    </>
  );
}

export function ParallelGatewayNode({
  isConnecting,
  sourcePosition = Position.Bottom,
  targetPosition = Position.Top,
}: CustomNodeProps) {
  return (
    <>
      <Handle
        type="target"
        position={targetPosition}
        id="in"
        isConnectable={!isConnecting}
        className={handleStyle}
      />
      <Handle
        type="source"
        position={sourcePosition}
        id="out"
        isConnectable={!isConnecting}
        className={handleStyle}
      />
    </>
  );
}

export function ParallelGatewayJoinNode({
  isConnecting,
  sourcePosition = Position.Bottom,
  targetPosition = Position.Top,
}: CustomNodeProps) {
  const isHorizontal = sourcePosition === Position.Right;
  const in2Position = isHorizontal ? Position.Top : Position.Left;

  return (
    <>
      <Handle
        type="target"
        position={targetPosition}
        id="in-1"
        isConnectable={!isConnecting}
        className={handleStyle}
      />
      <Handle
        type="target"
        position={in2Position}
        id="in-2"
        isConnectable={!isConnecting}
        className={handleStyle}
      />
      <Handle
        type="source"
        position={sourcePosition}
        id="out"
        isConnectable={!isConnecting}
        className={handleStyle}
      />
    </>
  );
}
