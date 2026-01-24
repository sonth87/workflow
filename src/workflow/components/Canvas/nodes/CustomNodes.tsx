/**
 * Custom Node Component
 * Generic component for all custom plugin nodes
 * Visual configurations are provided by plugins through node data
 */

import { Position } from "@xyflow/react";
import BaseNode from "./BaseNode";
import type { CustomNodeProps } from ".";
import { CustomHandle } from "../handle";
import type { NodeVisualConfig } from "@/core/types/base.types";
import { nodeRegistry } from "@/core/registry/NodeRegistry";

/**
 * Generic Custom Node Content
 * Handles for custom nodes - respects connection rules
 */
function CustomNodeContent({
  isConnecting,
  sourcePosition = Position.Right,
  targetPosition = Position.Left,
  type,
}: CustomNodeProps) {
  // Get connection rules from node config
  const nodeConfig = type ? nodeRegistry.get(type)?.config : null;
  const connectionRules = nodeConfig?.connectionRules;

  // Handle array or single object format for connection rules
  const rules = Array.isArray(connectionRules)
    ? connectionRules[0]
    : connectionRules;

  // Determine if handles should be shown based on connection rules
  const showInputHandle =
    !rules ||
    rules.maxInputConnections === undefined ||
    rules.maxInputConnections !== 0;

  const showOutputHandle =
    !rules ||
    rules.maxOutputConnections === undefined ||
    rules.maxOutputConnections !== 0;

  return (
    <>
      {showInputHandle && (
        <CustomHandle
          type="target"
          position={targetPosition}
          id="in"
          isConnectable={!isConnecting}
        />
      )}
      {showOutputHandle && (
        <CustomHandle
          type="source"
          position={sourcePosition}
          id="out"
          isConnectable={!isConnecting}
        />
      )}
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
