import { Handle } from "@xyflow/react";
import type { HandleProps } from "@xyflow/react";
import { handleStyle } from "../nodes/styles";

export interface CustomHandleProps extends HandleProps {}

export function CustomHandle(props: CustomHandleProps) {
  return (
    <Handle
      {...props}
      className="w-fit! h-fit! bg-transparent! border-none! p-1"
    >
      <div className={handleStyle}></div>
    </Handle>
  );
}
