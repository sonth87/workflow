import { CategoryType, NodeType } from "@/enum/workflow.enum";
import type { BaseRuleConfig, BaseNodeConfig } from "@/core/types/base.types";

export const defaultRules: Array<{
  id: string;
  type: string;
  name: string;
  config: BaseRuleConfig;
}> = [
  {
    id: "require-start-node",
    type: "validation",
    name: "Require Start Node",
    config: {
      id: "require-start-node",
      name: "Require Start Node",
      description: "Workflow must have at least one start node",
      type: "validation",
      enabled: true,
      priority: 1,
      scope: "workflow",
      condition: (context: any) => {
        const { nodes } = context;
        return nodes.some(
          (n: BaseNodeConfig) => n.category === CategoryType.START
        );
      },
    },
  },
  {
    id: "require-end-node",
    type: "validation",
    name: "Require End Node",
    config: {
      id: "require-end-node",
      name: "Require End Node",
      description: "Workflow must have at least one end node",
      type: "validation",
      enabled: true,
      priority: 2,
      scope: "workflow",
      condition: (context: any) => {
        const { nodes } = context;
        return nodes.some(
          (n: BaseNodeConfig) => n.category === CategoryType.END
        );
      },
    },
  },
  {
    id: "pool-lane-containment",
    type: "validation",
    name: "Pool/Lane Containment Rule",
    config: {
      id: "pool-lane-containment",
      name: "Pool/Lane Containment Rule",
      description:
        "Lane cannot contain Pool or other Lanes. Pool can contain Lanes.",
      type: "validation",
      enabled: true,
      priority: 3,
      scope: "node",
      condition: (context: any) => {
        const { node, nodes } = context;

        if (node.type === NodeType.POOL) {
          if (node.parentId) {
            const parent = nodes.find(
              (n: BaseNodeConfig) => n.id === node.parentId
            );
            if (parent && parent.type === NodeType.POOL) {
              return false;
            }
          }
        }

        return true;
      },
      action: (context: any) => {
        console.warn(
          "Validation failed: Pool cannot be nested inside another Pool"
        );
      },
    },
  },
];
