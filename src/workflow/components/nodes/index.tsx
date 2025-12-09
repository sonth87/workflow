import { NodeType } from "@/enum/workflow.enum";
import { StartEventNode, EndEventNode } from "./EventNodes";
import {
  TaskNode,
  ServiceTaskNode,
  NotificationNode,
  TimeDelayNode,
  SubflowNode,
} from "./TaskNodes";
import {
  ExclusiveGatewayNode,
  ParallelGatewayNode,
  ParallelGatewayJoinNode,
} from "./GatewayNodes";
import { PoolNode } from "./PoolNode";
import { NoteNode } from "./NoteNode";
import {
  AIAssistantNode,
  DataProcessorNode,
  APIIntegratorNode,
  CustomValidatorNode,
} from "./CustomNodes";
import BaseNode from "./BaseNode";
import type { Position } from "@xyflow/react";

// Export shared styles
export { nodeStyle, handleStyle } from "./styles";

export interface CustomNodeProps {
  id: string;
  type?: NodeType;
  data: { label: string };
  isConnecting?: boolean;
  selected?: boolean;
  sourcePosition?: Position;
  targetPosition?: Position;
}

// Wrap all nodes with BaseNode
const wrapWithBaseNode = (
  Component: React.ComponentType<CustomNodeProps>,
  nodeType: NodeType
) => {
  return (props: CustomNodeProps) => (
    <BaseNode {...props} type={nodeType}>
      <Component {...props} />
    </BaseNode>
  );
};

export const nodeTypes = {
  //start events
  [NodeType.START_EVENT]: wrapWithBaseNode(
    StartEventNode,
    NodeType.START_EVENT
  ),
  [NodeType.START_EVENT_DEFAULT]: wrapWithBaseNode(
    StartEventNode,
    NodeType.START_EVENT_DEFAULT
  ),
  [NodeType.START_EVENT_WEB]: wrapWithBaseNode(
    StartEventNode,
    NodeType.START_EVENT_WEB
  ),
  [NodeType.START_EVENT_API]: wrapWithBaseNode(
    StartEventNode,
    NodeType.START_EVENT_API
  ),
  [NodeType.START_EVENT_TIMER]: wrapWithBaseNode(
    StartEventNode,
    NodeType.START_EVENT_TIMER
  ),
  [NodeType.START_EVENT_RECEIVE_SIGNAL]: wrapWithBaseNode(
    StartEventNode,
    NodeType.START_EVENT_RECEIVE_SIGNAL
  ),
  //end events
  [NodeType.END_EVENT_DEFAULT]: wrapWithBaseNode(
    EndEventNode,
    NodeType.END_EVENT_DEFAULT
  ),
  [NodeType.END_EVENT_SEND_SIGNAL]: wrapWithBaseNode(
    EndEventNode,
    NodeType.END_EVENT_SEND_SIGNAL
  ),
  //tasks
  [NodeType.TASK_DEFAULT]: wrapWithBaseNode(TaskNode, NodeType.TASK_DEFAULT),
  [NodeType.TASK_USER]: wrapWithBaseNode(TaskNode, NodeType.TASK_USER),
  [NodeType.TASK_SYSTEM]: wrapWithBaseNode(TaskNode, NodeType.TASK_SYSTEM),
  [NodeType.TASK_SEND_NOTIFICATION]: wrapWithBaseNode(
    TaskNode,
    NodeType.TASK_SEND_NOTIFICATION
  ),
  [NodeType.TASK_SCRIPT]: wrapWithBaseNode(TaskNode, NodeType.TASK_SCRIPT),
  [NodeType.TASK_MANUAL]: wrapWithBaseNode(TaskNode, NodeType.TASK_MANUAL),
  [NodeType.TASK_BUSINESS_RULE]: wrapWithBaseNode(
    TaskNode,
    NodeType.TASK_BUSINESS_RULE
  ),
  [NodeType.TASK_AI]: wrapWithBaseNode(TaskNode, NodeType.TASK_AI),
  // other task types
  [NodeType.SERVICE_TASK]: wrapWithBaseNode(
    ServiceTaskNode,
    NodeType.SERVICE_TASK
  ),
  [NodeType.NOTIFICATION]: wrapWithBaseNode(
    NotificationNode,
    NodeType.NOTIFICATION
  ),
  [NodeType.TIME_DELAY]: wrapWithBaseNode(TimeDelayNode, NodeType.TIME_DELAY),
  [NodeType.EXCLUSIVE_GATEWAY]: wrapWithBaseNode(
    ExclusiveGatewayNode,
    NodeType.EXCLUSIVE_GATEWAY
  ),
  [NodeType.PARALLEL_GATEWAY]: wrapWithBaseNode(
    ParallelGatewayNode,
    NodeType.PARALLEL_GATEWAY
  ),
  [NodeType.PARALLEL_GATEWAY_JOIN]: wrapWithBaseNode(
    ParallelGatewayJoinNode,
    NodeType.PARALLEL_GATEWAY_JOIN
  ),
  [NodeType.SUBFLOW]: wrapWithBaseNode(SubflowNode, NodeType.SUBFLOW),
  [NodeType.POOL]: PoolNode,
  [NodeType.NOTE]: NoteNode,
  
  // Custom plugin nodes
  aiAssistant: AIAssistantNode,
  dataProcessor: DataProcessorNode,
  apiIntegrator: APIIntegratorNode,
  customValidator: CustomValidatorNode,
};
