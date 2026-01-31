import { NodeType, CategoryType } from "@/enum/workflow.enum";
import { DiamondPlus } from "lucide-react";
import { createDefaultNodeConfig } from "../constants/nodeDefaults";

export const gatewayNodes = [
  {
    id: NodeType.EXCLUSIVE_GATEWAY,
    type: NodeType.EXCLUSIVE_GATEWAY,
    name: "Exclusive Gateway",
    config: {
      ...createDefaultNodeConfig(
        NodeType.EXCLUSIVE_GATEWAY,
        CategoryType.GATEWAY,
        {
          title: "plugin.default.exclusiveGateway.title",
          description: "plugin.default.exclusiveGateway.description",
        }
      ),
      icon: {
        type: "lucide",
        value: DiamondPlus,
        backgroundColor: "#ff9d57",
        color: "#ffffff",
      },
      propertyDefinitions: [
        {
          id: "outgoingFlows",
          name: "outgoingFlows",
          type: "gateway-flows" as any,
          label: "ui.gatewayFlows.outgoingFlows",
          group: "gateway",
        },
      ],
    },
  },
  {
    id: NodeType.PARALLEL_GATEWAY,
    type: NodeType.PARALLEL_GATEWAY,
    extends: NodeType.EXCLUSIVE_GATEWAY,
    name: "Parallel Gateway",
    config: {
      metadata: {
        title: "plugin.default.parallelGateway.title",
        description: "plugin.default.parallelGateway.description",
      },
      propertyDefinitions: [], // Parallel gateway typically doesn't have the same logic as Exclusive
    },
  },
  {
    id: NodeType.INCLUSIVE_GATEWAY,
    type: NodeType.INCLUSIVE_GATEWAY,
    extends: NodeType.EXCLUSIVE_GATEWAY,
    name: "Inclusive Gateway",
    config: {
      metadata: {
        title: "plugin.default.inclusiveGateway.title",
        description: "plugin.default.inclusiveGateway.description",
      },
    },
  },
];
