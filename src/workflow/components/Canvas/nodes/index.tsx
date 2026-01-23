import type { NodeVisualConfig } from "@/core/types/base.types";
import { NodeType } from "@/enum/workflow.enum";
import type { Position } from "@xyflow/react";
import BaseNode from "./BaseNode";
import { EndEventNode, StartEventNode } from "./EventNodes";
import {
  ExclusiveGatewayNode,
  ParallelGatewayJoinNode,
  ParallelGatewayNode,
} from "./GatewayNodes";
import { NoteNode } from "./NoteNode";
import PoolNode from "./PoolNode";
import {
  NotificationNode,
  ServiceTaskNode,
  SubflowNode,
  TaskNode,
  TimeDelayNode,
} from "./TaskNodes";
import { AnnotationNode } from "./NoteNode/AnnotationNode";
import { ImmediateNode } from "./ImmediateNodes";

// Export shared styles
export { handleStyle, nodeStyle } from "./styles";
export { CustomNode } from "./CustomNodes";

export interface CustomNodeProps {
  id: string;
  type?: NodeType;
  data: {
    label: string;
    visualConfig?: NodeVisualConfig;
    [key: string]: unknown;
  };
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
  return (props: CustomNodeProps) => {
    // Extract visualConfig from data
    const visualConfig = props.data?.visualConfig as
      | NodeVisualConfig
      | undefined;

    return (
      <BaseNode {...props} type={nodeType} visualConfig={visualConfig}>
        <Component {...props} />
      </BaseNode>
    );
  };
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
  [NodeType.END_EVENT_ERROR]: wrapWithBaseNode(
    EndEventNode,
    NodeType.END_EVENT_ERROR
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
  // immediate nodes
  [NodeType.IMMEDIATE_EMAIL]: wrapWithBaseNode(
    ImmediateNode,
    NodeType.IMMEDIATE_EMAIL
  ),
  [NodeType.IMMEDIATE_RECEIVE_MESSAGE]: wrapWithBaseNode(
    ImmediateNode,
    NodeType.IMMEDIATE_RECEIVE_MESSAGE
  ),
  [NodeType.IMMEDIATE_TIMER]: wrapWithBaseNode(
    ImmediateNode,
    NodeType.IMMEDIATE_TIMER
  ),
  [NodeType.IMMEDIATE_SIGNAL]: wrapWithBaseNode(
    ImmediateNode,
    NodeType.IMMEDIATE_SIGNAL
  ),
  [NodeType.IMMEDIATE_CONDITION]: wrapWithBaseNode(
    ImmediateNode,
    NodeType.IMMEDIATE_CONDITION
  ),
  // notifications and delays
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
  [NodeType.ANNOTATION]: AnnotationNode,
};
