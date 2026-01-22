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
          id: "defaultFlow",
          name: "defaultFlow",
          type: "text",
          label: "Default Flow ID",
          group: "gateway",
          helpText: "The ID of the sequence flow to use if no conditions are met",
        },
      ],
    },
  },
  {
    id: NodeType.PARALLEL_GATEWAY,
    type: NodeType.PARALLEL_GATEWAY,
    name: "Parallel Gateway",
    config: createDefaultNodeConfig(
      NodeType.PARALLEL_GATEWAY,
      CategoryType.GATEWAY,
      {
        title: "plugin.default.parallelGateway.title",
        description: "plugin.default.parallelGateway.description",
      }
    ),
  },
  {
    id: NodeType.EVENT_BASED_GATEWAY,
    type: NodeType.EVENT_BASED_GATEWAY,
    name: "Event Based Gateway",
    config: createDefaultNodeConfig(
      NodeType.EVENT_BASED_GATEWAY,
      CategoryType.GATEWAY,
      {
        title: "plugin.default.eventBasedGateway.title",
        description: "plugin.default.eventBasedGateway.description",
      }
    ),
  },
];
