import { NodeType, CategoryType } from "@/enum/workflow.enum";
import { createDefaultNodeConfig } from "../constants/nodeDefaults";
import type { BaseNodeConfig, RegistryItem } from "@/core";

export const endNodes: RegistryItem<Partial<BaseNodeConfig>>[] = [
  {
    id: NodeType.END_EVENT_DEFAULT,
    type: NodeType.END_EVENT_DEFAULT,
    name: "End Event",
    config: {
      ...createDefaultNodeConfig(NodeType.END_EVENT_DEFAULT, CategoryType.END, {
        title: "plugin.default.endEventDefault.title",
        description: "plugin.default.endEventDefault.description",
      }),
      connectionRules: [
        {
          id: "end-event-default-connection-rule",
          name: "End Event Default Connection Rule",
          description: "Allow multiple inputs, no outputs",
          maxInputConnections: undefined,
          maxOutputConnections: 0,
          requiresConnection: true,
        },
      ],
    },
  },
  {
    id: NodeType.END_EVENT_SEND_SIGNAL,
    type: NodeType.END_EVENT_SEND_SIGNAL,
    extends: NodeType.END_EVENT_DEFAULT,
    name: "Send Signal End Event",
    config: {
      metadata: {
        title: "plugin.default.endEventSendSignal.title",
        description: "plugin.default.endEventSendSignal.description",
      },
      propertyDefinitions: [
        {
          id: "signalName",
          name: "signalName",
          type: "text",
          label: "Signal Name",
          group: "config",
          required: true,
        },
      ],
    },
  },
  {
    id: NodeType.END_EVENT_ERROR,
    type: NodeType.END_EVENT_ERROR,
    extends: NodeType.END_EVENT_DEFAULT,
    name: "Error End Event",
    config: {
      metadata: {
        title: "plugin.default.endEventError.title",
        description: "plugin.default.endEventError.description",
      },
      propertyDefinitions: [
        {
          id: "errorCode",
          name: "errorCode",
          type: "text",
          label: "Error Code",
          group: "config",
          required: true,
        },
        {
          id: "errorMessage",
          name: "errorMessage",
          type: "text",
          label: "Error Message",
          group: "config",
        },
      ],
    },
  },
];
