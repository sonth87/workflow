import type { BaseNodeConfig, BaseEdgeConfig } from "../types/base.types";
import { getRegistryCapabilities } from "../utils/aiUtils";
import { NodeType } from "../../enum/workflow.enum";

// Mock response interface
interface AIWorkflowResponse {
  nodes: BaseNodeConfig[];
  edges: BaseEdgeConfig[];
}

export class AIService {
  /**
   * Generates a workflow based on the user prompt.
   * This is a mocked implementation that simulates an AI response.
   */
  static async generateWorkflow(prompt: string): Promise<AIWorkflowResponse> {
    // 1. Get capabilities (context for AI)
    const capabilities = getRegistryCapabilities();

    // In a real implementation, you would send:
    // { prompt, capabilities } to an LLM API.

    // Simulating API latency
    await new Promise((resolve) => setTimeout(resolve, 1500));

    console.log("Generating workflow for prompt:", prompt);
    console.log("Using capabilities:", capabilities);

    // simple keyword matching for demo purposes
    const lowerPrompt = prompt.toLowerCase();

    if (lowerPrompt.includes("leave") || lowerPrompt.includes("holiday")) {
      return this.generateLeaveRequestWorkflow();
    } else if (lowerPrompt.includes("order") || lowerPrompt.includes("purchase")) {
      return this.generateOrderWorkflow();
    } else {
      return this.generateDefaultWorkflow();
    }
  }

  private static generateLeaveRequestWorkflow(): AIWorkflowResponse {
    const nodes: any[] = [
      {
        id: "start",
        type: NodeType.START_EVENT,
        position: { x: 100, y: 100 },
        data: { label: "Start" },
        properties: {}
      },
      {
        id: "submit-request",
        type: NodeType.TASK_USER,
        position: { x: 300, y: 100 },
        data: { label: "Submit Leave Request" },
        properties: { assignee: "employee" }
      },
      {
        id: "approve-request",
        type: NodeType.TASK_USER,
        position: { x: 500, y: 100 },
        data: { label: "Approve Request" },
        properties: { assignee: "manager" }
      },
      {
        id: "check-approval",
        type: NodeType.EXCLUSIVE_GATEWAY,
        position: { x: 700, y: 100 },
        data: { label: "Approved?" },
        properties: {}
      },
      {
        id: "send-confirmation",
        type: NodeType.SERVICE_TASK,
        position: { x: 900, y: 0 },
        data: { label: "Send Confirmation Email" },
        properties: {}
      },
      {
        id: "reject-notification",
        type: NodeType.TASK_USER,
        position: { x: 900, y: 200 },
        data: { label: "Notify Rejection" },
        properties: {}
      },
      {
        id: "end-approved",
        type: NodeType.END_EVENT_DEFAULT,
        position: { x: 1100, y: 0 },
        data: { label: "End (Approved)" },
        properties: {}
      },
      {
        id: "end-rejected",
        type: NodeType.END_EVENT_DEFAULT,
        position: { x: 1100, y: 200 },
        data: { label: "End (Rejected)" },
        properties: {}
      }
    ];

    const edges: any[] = [
      { id: "e1", source: "start", target: "submit-request", type: "sequence-flow" },
      { id: "e2", source: "submit-request", target: "approve-request", type: "sequence-flow" },
      { id: "e3", source: "approve-request", target: "check-approval", type: "sequence-flow" },
      {
        id: "e4",
        source: "check-approval",
        target: "send-confirmation",
        type: "sequence-flow",
        label: "Yes",
        properties: { condition: "approved == true" }
      },
      {
        id: "e5",
        source: "check-approval",
        target: "reject-notification",
        type: "sequence-flow",
        label: "No",
        properties: { condition: "approved == false" }
      },
      { id: "e6", source: "send-confirmation", target: "end-approved", type: "sequence-flow" },
      { id: "e7", source: "reject-notification", target: "end-rejected", type: "sequence-flow" }
    ];

    return { nodes, edges };
  }

  private static generateOrderWorkflow(): AIWorkflowResponse {
    const nodes: any[] = [
      {
        id: "order-received",
        type: NodeType.START_EVENT,
        position: { x: 100, y: 100 },
        data: { label: "Order Received" },
        properties: {}
      },
      {
        id: "validate-order",
        type: NodeType.TASK_SCRIPT,
        position: { x: 300, y: 100 },
        data: { label: "Validate Order" },
        properties: {}
      },
      {
        id: "check-stock",
        type: NodeType.SERVICE_TASK,
        position: { x: 500, y: 100 },
        data: { label: "Check Stock" },
        properties: {}
      },
      {
        id: "ship-order",
        type: NodeType.TASK_USER,
        position: { x: 700, y: 100 },
        data: { label: "Ship Order" },
        properties: { assignee: "warehouse" }
      },
      {
        id: "end-order",
        type: NodeType.END_EVENT_DEFAULT,
        position: { x: 900, y: 100 },
        data: { label: "Order Completed" },
        properties: {}
      }
    ];

    const edges: any[] = [
      { id: "e1", source: "order-received", target: "validate-order", type: "sequence-flow" },
      { id: "e2", source: "validate-order", target: "check-stock", type: "sequence-flow" },
      { id: "e3", source: "check-stock", target: "ship-order", type: "sequence-flow" },
      { id: "e4", source: "ship-order", target: "end-order", type: "sequence-flow" }
    ];

    return { nodes, edges };
  }

  private static generateDefaultWorkflow(): AIWorkflowResponse {
    const nodes: any[] = [
      {
        id: "start",
        type: NodeType.START_EVENT,
        position: { x: 100, y: 100 },
        data: { label: "Start" },
        properties: {}
      },
      {
        id: "task-1",
        type: NodeType.TASK_USER,
        position: { x: 300, y: 100 },
        data: { label: "Do something" },
        properties: {}
      },
      {
        id: "end",
        type: NodeType.END_EVENT_DEFAULT,
        position: { x: 500, y: 100 },
        data: { label: "End" },
        properties: {}
      }
    ];

    const edges: any[] = [
      { id: "e1", source: "start", target: "task-1", type: "sequence-flow" },
      { id: "e2", source: "task-1", target: "end", type: "sequence-flow" }
    ];

    return { nodes, edges };
  }
}
