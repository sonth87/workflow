/**
 * Custom Node Components
 * Demo components cho custom plugin nodes
 * Visual configurations are now provided by plugins
 */

import { Handle, Position } from "@xyflow/react";
import BaseNode from "./BaseNode";
import type { CustomNodeProps } from ".";
import { handleStyle } from "./styles";
import type { NodeVisualConfig } from "@/core/types/base.types";

/**
 * AI Assistant Node
 */
function AIAssistantNodeContent(props: CustomNodeProps) {
  return (
    <>
      <Handle
        type="target"
        position={Position.Left}
        id="in"
        isConnectable={!props.isConnecting}
        className={handleStyle}
      />
      <Handle
        type="source"
        position={Position.Right}
        id="out"
        isConnectable={!props.isConnecting}
        className={handleStyle}
      />
    </>
  );
}

export function AIAssistantNode(props: CustomNodeProps) {
  // Visual config should come from node data (provided by plugin)
  const visualConfig = props.data?.visualConfig as NodeVisualConfig | undefined;

  return (
    <BaseNode
      {...props}
      type={"aiAssistant" as any}
      visualConfig={visualConfig}
    >
      <AIAssistantNodeContent {...props} />
    </BaseNode>
  );
}

/**
 * Data Processor Node
 */
function DataProcessorNodeContent(props: CustomNodeProps) {
  return (
    <>
      <Handle
        type="target"
        position={Position.Left}
        id="in"
        isConnectable={!props.isConnecting}
        className={handleStyle}
      />
      <Handle
        type="source"
        position={Position.Right}
        id="out"
        isConnectable={!props.isConnecting}
        className={handleStyle}
      />
    </>
  );
}

export function DataProcessorNode(props: CustomNodeProps) {
  const visualConfig = props.data?.visualConfig as NodeVisualConfig | undefined;

  return (
    <BaseNode
      {...props}
      type={"dataProcessor" as any}
      visualConfig={visualConfig}
    >
      <DataProcessorNodeContent {...props} />
    </BaseNode>
  );
}

/**
 * API Integrator Node
 */
function APIIntegratorNodeContent(props: CustomNodeProps) {
  return (
    <>
      <Handle
        type="target"
        position={Position.Left}
        id="in"
        isConnectable={!props.isConnecting}
        className={handleStyle}
      />
      <Handle
        type="source"
        position={Position.Right}
        id="out"
        isConnectable={!props.isConnecting}
        className={handleStyle}
      />
    </>
  );
}

export function APIIntegratorNode(props: CustomNodeProps) {
  const visualConfig = props.data?.visualConfig as NodeVisualConfig | undefined;

  return (
    <BaseNode
      {...props}
      type={"apiIntegrator" as any}
      visualConfig={visualConfig}
    >
      <APIIntegratorNodeContent {...props} />
    </BaseNode>
  );
}

/**
 * Custom Validator Node
 */
function CustomValidatorNodeContent(props: CustomNodeProps) {
  return (
    <>
      <Handle
        type="target"
        position={Position.Left}
        id="in"
        isConnectable={!props.isConnecting}
        className={handleStyle}
      />
      <Handle
        type="source"
        position={Position.Right}
        id="out"
        isConnectable={!props.isConnecting}
        className={handleStyle}
      />
    </>
  );
}

export function CustomValidatorNode(props: CustomNodeProps) {
  const visualConfig = props.data?.visualConfig as NodeVisualConfig | undefined;

  return (
    <BaseNode
      {...props}
      type={"customValidator" as any}
      visualConfig={visualConfig}
    >
      <CustomValidatorNodeContent {...props} />
    </BaseNode>
  );
}

/**
 * Export all custom node components
 */
export const customNodeComponents = {
  aiAssistant: AIAssistantNode,
  dataProcessor: DataProcessorNode,
  apiIntegrator: APIIntegratorNode,
  customValidator: CustomValidatorNode,
};
