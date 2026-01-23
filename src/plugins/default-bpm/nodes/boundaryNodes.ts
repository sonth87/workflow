import { NodeType, CategoryType } from "@/enum/workflow.enum";
import { MessageSquare, AlertTriangle, Clock, Radio } from "lucide-react";
import { createDefaultNodeConfig } from "../constants/nodeDefaults";

export const boundaryNodes = [
  {
    id: NodeType.BOUNDARY_MESSAGE,
    type: NodeType.BOUNDARY_MESSAGE,
    name: "Message Boundary Event",
    config: {
      ...createDefaultNodeConfig(
        NodeType.BOUNDARY_MESSAGE,
        CategoryType.BOUNDARY,
        {
          title: "plugin.default.boundaryMessage.title",
          description: "plugin.default.boundaryMessage.description",
        }
      ),
      icon: {
        type: "lucide",
        value: MessageSquare,
        backgroundColor: "#3b82f6",
        color: "#ffffff",
      },
      propertyDefinitions: [
        {
          id: "messageName",
          name: "messageName",
          type: "text",
          label: "Message Name",
          group: "config",
          required: true,
        },
        {
          id: "cancelActivity",
          name: "cancelActivity",
          type: "boolean",
          label: "Cancel Activity",
          defaultValue: true,
          group: "config",
        },
      ],
    },
  },
  {
    id: NodeType.BOUNDARY_ERROR,
    type: NodeType.BOUNDARY_ERROR,
    name: "Error Boundary Event",
    config: {
      ...createDefaultNodeConfig(
        NodeType.BOUNDARY_ERROR,
        CategoryType.BOUNDARY,
        {
          title: "plugin.default.boundaryError.title",
          description: "plugin.default.boundaryError.description",
        }
      ),
      icon: {
        type: "lucide",
        value: AlertTriangle,
        backgroundColor: "#ef4444",
        color: "#ffffff",
      },
      propertyDefinitions: [
        {
          id: "errorCode",
          name: "errorCode",
          type: "text",
          label: "Error Code",
          group: "config",
        },
        {
          id: "errorMessageVariable",
          name: "errorMessageVariable",
          type: "text",
          label: "Error Message Variable",
          group: "config",
        },
      ],
    },
  },
  {
    id: NodeType.BOUNDARY_TIMER,
    type: NodeType.BOUNDARY_TIMER,
    name: "Timer Boundary Event",
    config: {
      ...createDefaultNodeConfig(
        NodeType.BOUNDARY_TIMER,
        CategoryType.BOUNDARY,
        {
          title: "plugin.default.boundaryTimer.title",
          description: "plugin.default.boundaryTimer.description",
        }
      ),
      icon: {
        type: "lucide",
        value: Clock,
        backgroundColor: "#f59e0b",
        color: "#ffffff",
      },
      propertyDefinitions: [
        {
          id: "duration",
          name: "duration",
          type: "text",
          label: "Duration (ISO 8601)",
          group: "config",
          placeholder: "PT1H",
        },
      ],
    },
  },
];
