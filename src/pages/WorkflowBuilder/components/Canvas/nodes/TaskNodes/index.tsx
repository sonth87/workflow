import { Handle, Position } from "@xyflow/react";
import type { CustomNodeProps } from "..";
import { handleStyle } from "../styles";

export function TaskNode({
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

export function ServiceTaskNode({
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

export function NotificationNode({
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

export function TimeDelayNode({
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

export function SubflowNode({
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
