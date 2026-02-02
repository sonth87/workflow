import { Handle } from "@xyflow/react";
import type { HandleProps } from "@xyflow/react";
import { Position } from "@xyflow/react";
import { handleStyle } from "../nodes/styles";
import { useWorkflowStore } from "@/core/store/workflowStore";

export interface CustomHandleProps extends HandleProps {}

export function CustomHandle(props: CustomHandleProps) {
  const { compactView, layoutDirection } = useWorkflowStore();

  const isFixedPosition = !compactView && layoutDirection === "horizontal";
  const fixedStyle =
    isFixedPosition &&
    (props.position === Position.Left || props.position === Position.Right)
      ? { top: 30, ...props.style }
      : props.style;

  return (
    <Handle
      {...props}
      style={fixedStyle}
      className="w-fit! h-fit! bg-transparent! border-none! p-1"
    >
      <div className={handleStyle}></div>
    </Handle>
  );
}
