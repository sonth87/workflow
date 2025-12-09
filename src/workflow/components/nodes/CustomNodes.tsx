/**
 * Custom Node Components
 * Demo components cho custom plugin nodes
 */

import { Handle, Position } from "@xyflow/react";
import { Sparkles, Database, Globe, CheckCircle2 } from "lucide-react";
import BaseNode, { type NodeColorConfig } from "./BaseNode";
import type { CustomNodeProps } from ".";
import { handleStyle } from "./styles";

// Color configurations for each custom node type
const aiAssistantColors: NodeColorConfig = {
  backgroundColor: "#faf5ff",
  borderColor: "#a855f7",
  ringColor: "rgba(168, 85, 247, 0.25)",
  titleColor: "#581c87",
  descriptionColor: "#9333ea",
  iconBgColor: "#f3e8ff",
  iconColor: "#9333ea",
};

const dataProcessorColors: NodeColorConfig = {
  backgroundColor: "#eff6ff",
  borderColor: "#3b82f6",
  ringColor: "rgba(59, 130, 246, 0.25)",
  titleColor: "#1e3a8a",
  descriptionColor: "#2563eb",
  iconBgColor: "#dbeafe",
  iconColor: "#2563eb",
};

const apiIntegratorColors: NodeColorConfig = {
  backgroundColor: "#f0fdf4",
  borderColor: "#22c55e",
  ringColor: "rgba(34, 197, 94, 0.25)",
  titleColor: "#14532d",
  descriptionColor: "#16a34a",
  iconBgColor: "#dcfce7",
  iconColor: "#16a34a",
};

const customValidatorColors: NodeColorConfig = {
  backgroundColor: "#fff7ed",
  borderColor: "#f97316",
  ringColor: "rgba(249, 115, 22, 0.25)",
  titleColor: "#7c2d12",
  descriptionColor: "#ea580c",
  iconBgColor: "#ffedd5",
  iconColor: "#ea580c",
};

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
  return (
    <BaseNode
      {...props}
      type={"aiAssistant" as any}
      colorConfig={aiAssistantColors}
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
  return (
    <BaseNode
      {...props}
      type={"dataProcessor" as any}
      colorConfig={dataProcessorColors}
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
  return (
    <BaseNode
      {...props}
      type={"apiIntegrator" as any}
      colorConfig={apiIntegratorColors}
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
  return (
    <BaseNode
      {...props}
      type={"customValidator" as any}
      colorConfig={customValidatorColors}
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
