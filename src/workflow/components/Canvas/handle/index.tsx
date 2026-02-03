import { Handle, useConnection, useNodeId } from "@xyflow/react";
import type { HandleProps } from "@xyflow/react";
import { Position } from "@xyflow/react";
import { handleStyle } from "../nodes/styles";
import { useWorkflowStore } from "@/core/store/workflowStore";
import { cx } from "@/utils/cx";

export interface CustomHandleProps extends HandleProps {}

export function CustomHandle(props: CustomHandleProps) {
  const { compactView, layoutDirection } = useWorkflowStore();
  const connection = useConnection();
  const nodeId = useNodeId();

  const isFixedPosition = !compactView && layoutDirection === "horizontal";
  const fixedStyle =
    isFixedPosition &&
    (props.position === Position.Left || props.position === Position.Right)
      ? { top: 30, ...props.style }
      : props.style;

  // Check if currently connecting and if the connection is from the same node
  const isConnectingFromSameNode =
    connection.inProgress &&
    connection.fromNode?.id === nodeId &&
    connection.fromNode?.id !== null;

  // Add class to indicate handle should be disabled when connecting from same node
  const handleClassName = cx(
    "w-fit! h-fit! bg-transparent! border-none! p-1",
    isConnectingFromSameNode && "connecting-same-node"
  );

  // Disable connection if trying to connect to the same node
  const isConnectable = isConnectingFromSameNode ? false : props.isConnectable;

  return (
    <Handle
      {...props}
      style={fixedStyle}
      className={handleClassName}
      isConnectable={isConnectable}
    >
      <div className={handleStyle}></div>
    </Handle>
  );
}
