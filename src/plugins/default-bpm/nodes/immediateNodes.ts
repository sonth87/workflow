import { NodeType, CategoryType } from "@/enum/workflow.enum";
import { Mail, AlarmClock, Radio, ListCheck } from "lucide-react";
import { createDefaultNodeConfig } from "../constants/nodeDefaults";
import { BaseNodeType } from "@/core/nodes/BaseNodeDefinitions";
import type { BaseNodeConfig, RegistryItem } from "@/core";

export const immediateNodes: RegistryItem<Partial<BaseNodeConfig>>[] = [
  {
    id: NodeType.IMMEDIATE_EMAIL,
    type: NodeType.IMMEDIATE_EMAIL,
    name: "Immediate Email",
    config: {
      ...createDefaultNodeConfig(
        NodeType.IMMEDIATE_EMAIL,
        CategoryType.IMMEDIATE,
        {
          title: "plugin.default.immediateEmail.title",
          description: "plugin.default.immediateEmail.description",
        },
        BaseNodeType.IMMEDIATE
      ),
      icon: {
        type: "lucide",
        value: Mail,
      },
      propertyDefinitions: [
        {
          id: "to",
          name: "to",
          type: "text",
          label: "To",
          group: "config",
          required: true,
        },
        {
          id: "subject",
          name: "subject",
          type: "text",
          label: "Subject",
          group: "config",
          required: true,
        },
        {
          id: "body",
          name: "body",
          type: "textarea",
          label: "Body",
          group: "config",
        },
      ],
    },
  },
  {
    id: NodeType.IMMEDIATE_RECEIVE_MESSAGE,
    type: NodeType.IMMEDIATE_RECEIVE_MESSAGE,
    name: "Immediate Receive Message",
    config: {
      ...createDefaultNodeConfig(
        NodeType.IMMEDIATE_RECEIVE_MESSAGE,
        CategoryType.IMMEDIATE,
        {
          title: "plugin.default.immediateReceiveMessage.title",
          description: "plugin.default.immediateReceiveMessage.description",
        },
        BaseNodeType.IMMEDIATE
      ),
      icon: {
        type: "lucide",
        value: Mail,
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
      ],
    },
  },
  {
    id: NodeType.IMMEDIATE_TIMER,
    type: NodeType.IMMEDIATE_TIMER,
    name: "Immediate Timer",
    config: {
      ...createDefaultNodeConfig(
        NodeType.IMMEDIATE_TIMER,
        CategoryType.IMMEDIATE,
        {
          title: "plugin.default.immediateTimer.title",
          description: "plugin.default.immediateTimer.description",
        },
        BaseNodeType.IMMEDIATE
      ),
      icon: {
        type: "lucide",
        value: AlarmClock,
      },
      propertyDefinitions: [
        {
          id: "timeDuration",
          name: "timeDuration",
          type: "text",
          label: "Time Duration (ISO 8601)",
          group: "config",
          placeholder: "PT5M",
          helpText: "e.g. PT5M for 5 minutes, P1D for 1 day",
        },
      ],
    },
  },
  {
    id: NodeType.IMMEDIATE_SIGNAL,
    type: NodeType.IMMEDIATE_SIGNAL,
    name: "Immediate Signal",
    config: {
      ...createDefaultNodeConfig(
        NodeType.IMMEDIATE_SIGNAL,
        CategoryType.IMMEDIATE,
        {
          title: "plugin.default.immediateSignal.title",
          description: "plugin.default.immediateSignal.description",
        },
        BaseNodeType.IMMEDIATE
      ),
      icon: {
        type: "lucide",
        value: Radio,
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
    id: NodeType.IMMEDIATE_CONDITION,
    type: NodeType.IMMEDIATE_CONDITION,
    name: "Immediate Condition",
    config: {
      ...createDefaultNodeConfig(
        NodeType.IMMEDIATE_CONDITION,
        CategoryType.IMMEDIATE,
        {
          title: "plugin.default.immediateCondition.title",
          description: "plugin.default.immediateCondition.description",
        },
        BaseNodeType.IMMEDIATE
      ),
      icon: {
        type: "lucide",
        value: ListCheck,
      },
      propertyDefinitions: [
        {
          id: "condition",
          name: "condition",
          type: "expression",
          label: "Condition Expression",
          group: "config",
          required: true,
        },
      ],
    },
  },
];
