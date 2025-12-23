/**
 * Custom Node Component
 * Generic component for all custom plugin nodes
 * Visual configurations are provided by plugins through node data
 */

import { Handle, Position } from "@xyflow/react";
import BaseNode from "./BaseNode";
import type { CustomNodeProps } from ".";
import { handleStyle } from "./styles";
import type { NodeVisualConfig } from "@/core/types/base.types";

/**
 * Generic Custom Node Content
 * Handles for custom nodes
 */
function CustomNodeContent({
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

/**
 * Generic Custom Node
 * Used for all plugin-registered custom nodes
 */
export function CustomNode(props: CustomNodeProps) {
  const visualConfig = props.data?.visualConfig as NodeVisualConfig | undefined;

  return (
    <BaseNode {...props} type={props.type!} visualConfig={visualConfig}>
      <CustomNodeContent {...props} />
    </BaseNode>
  );
}
