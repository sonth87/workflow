import { Position } from "@xyflow/react";
import type { CustomNodeProps } from "..";
import { CustomHandle } from "../../handle";
import { DEFAULT_LAYOUT_DIRECTION } from "@/workflow/constants/common";

const sPos =
  DEFAULT_LAYOUT_DIRECTION === "horizontal" ? Position.Right : Position.Bottom;
const tPos =
  DEFAULT_LAYOUT_DIRECTION === "horizontal" ? Position.Left : Position.Top;

export function TaskNode({
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

export function ServiceTaskNode({
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

export function NotificationNode({
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

export function TimeDelayNode({
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

export function SubflowNode({
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
