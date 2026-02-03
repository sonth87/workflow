import { NodeType, CategoryType } from "@/enum/workflow.enum";
import { Circle, Clock, MessageSquare, Globe, Radio } from "lucide-react";
import { createDefaultNodeConfig } from "../constants/nodeDefaults";
import type { BaseNodeConfig, RegistryItem } from "@/core";

export const startNodes: RegistryItem<Partial<BaseNodeConfig>>[] = [
  {
    id: NodeType.START_EVENT_DEFAULT,
    type: NodeType.START_EVENT_DEFAULT,
    name: "Start Event",
    config: {
      ...createDefaultNodeConfig(
        NodeType.START_EVENT_DEFAULT,
        CategoryType.START,
        {
          title: "plugin.default.startEventDefault.title",
          description: "plugin.default.startEventDefault.description",
        }
      ),
      icon: {
        type: "lucide",
        value: Circle,
        backgroundColor: "#39cc7e",
        color: "#ffffff",
      },
    },
  },
  {
    id: NodeType.START_EVENT_TIMER,
    type: NodeType.START_EVENT_TIMER,
    extends: NodeType.START_EVENT_DEFAULT,
    name: "Timer Start Event",
    config: {
      metadata: {
        title: "plugin.default.startEventTimer.title",
        description: "plugin.default.startEventTimer.description",
      },
      icon: {
        type: "lucide",
        value: Clock,
      },
      propertyDefinitions: [
        {
          id: "timerType",
          name: "timerType",
          type: "select",
          label: "ui.properties.timerType",
          group: "config",
          defaultValue: "once",
          options: [
            { label: "ui.properties.timerType.option.once", value: "once" },
            { label: "ui.properties.timerType.option.hourly", value: "hourly" },
            { label: "ui.properties.timerType.option.daily", value: "daily" },
            {
              label: "ui.properties.timerType.option.monthly",
              value: "monthly",
            },
            {
              label: "ui.properties.timerType.option.interval",
              value: "interval",
            },
          ],
        },
        // For One date/time
        {
          id: "dateTime",
          name: "dateTime",
          type: "date",
          label: "Date/Time",
          group: "config",
          visible: { field: "timerType", operator: "equals", value: "once" },
        },
        // Common for recurring
        {
          id: "startDate",
          name: "startDate",
          type: "date",
          label: "Start Date",
          group: "config",
          visible: {
            field: "timerType",
            operator: "in",
            value: ["hourly", "daily", "monthly", "interval"],
          },
        },
        {
          id: "endDate",
          name: "endDate",
          type: "date",
          label: "End Date",
          group: "config",
          visible: {
            field: "timerType",
            operator: "in",
            value: ["hourly", "daily", "monthly", "interval"],
          },
        },
        // Hourly / Daily / Monthly minute
        {
          id: "minute",
          name: "minute",
          type: "number",
          label: "ui.properties.minute",
          group: "config",
          visible: {
            field: "timerType",
            operator: "in",
            value: ["hourly", "daily", "monthly"],
          },
          options: { min: 0, max: 59 },
        },
        // Daily / Monthly hour
        {
          id: "hour",
          name: "hour",
          type: "number",
          label: "ui.properties.hour",
          group: "config",
          visible: {
            field: "timerType",
            operator: "in",
            value: ["daily", "monthly"],
          },
          options: { min: 0, max: 23 },
        },
        // Daily days of week
        {
          id: "daysOfWeek",
          name: "daysOfWeek",
          type: "multiselect",
          label: "ui.properties.daysOfWeek",
          group: "config",
          visible: { field: "timerType", operator: "equals", value: "daily" },
          options: [
            { label: "Monday", value: "MON" },
            { label: "Tuesday", value: "TUE" },
            { label: "Wednesday", value: "WED" },
            { label: "Thursday", value: "THU" },
            { label: "Friday", value: "FRI" },
            { label: "Saturday", value: "SAT" },
            { label: "Sunday", value: "SUN" },
          ],
          defaultValue: ["MON", "TUE", "WED", "THU", "FRI"],
        },
        // Monthly
        {
          id: "dayOfMonth",
          name: "dayOfMonth",
          type: "number",
          label: "ui.properties.dayOfMonth",
          group: "config",
          visible: { field: "timerType", operator: "equals", value: "monthly" },
          options: { min: 1, max: 31 },
        },
        // Interval
        {
          id: "intervalValue",
          name: "intervalValue",
          type: "number",
          label: "ui.properties.intervalValue",
          group: "config",
          visible: {
            field: "timerType",
            operator: "equals",
            value: "interval",
          },
        },
        {
          id: "intervalUnit",
          name: "intervalUnit",
          type: "select",
          label: "ui.properties.intervalUnit",
          group: "config",
          visible: {
            field: "timerType",
            operator: "equals",
            value: "interval",
          },
          options: [
            { label: "Seconds", value: "seconds" },
            { label: "Minutes", value: "minutes" },
            { label: "Hours", value: "hours" },
            { label: "Days", value: "days" },
          ],
          defaultValue: "minutes",
        },
      ],
    },
  },
  {
    id: NodeType.START_EVENT_MESSAGE,
    type: NodeType.START_EVENT_MESSAGE,
    extends: NodeType.START_EVENT_DEFAULT,
    name: "Message Start Event",
    config: {
      metadata: {
        title: "plugin.default.startEventMessage.title",
        description: "Start process when a message is received",
      },
      icon: {
        type: "lucide",
        value: MessageSquare,
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
    id: NodeType.START_EVENT_API,
    type: NodeType.START_EVENT_API,
    extends: NodeType.START_EVENT_DEFAULT,
    name: "API Start Event",
    config: {
      metadata: {
        title: "plugin.default.startEventApi.title",
        description: "plugin.default.startEventApi.description",
      },
      icon: {
        type: "lucide",
        value: Globe,
      },
      propertyDefinitions: [
        {
          id: "endpoint",
          name: "endpoint",
          type: "text",
          label: "API Endpoint",
          group: "config",
          placeholder: "/api/start/process",
        },
        {
          id: "authentication",
          name: "authentication",
          type: "select",
          label: "ui.properties.authentication",
          group: "config",
          defaultValue: "none",
          options: [
            {
              label: "ui.properties.authentication.option.none",
              value: "none",
            },
            {
              label: "ui.properties.authentication.option.apiKey",
              value: "apiKey",
            },
            {
              label: "ui.properties.authentication.option.oauth2",
              value: "oauth2",
            },
          ],
        },
      ],
    },
  },
  {
    id: NodeType.START_EVENT_WEB,
    type: NodeType.START_EVENT_WEB,
    extends: NodeType.START_EVENT_DEFAULT,
    name: "Web Start Event",
    config: {
      metadata: {
        title: "plugin.default.startEventWeb.title",
        description: "plugin.default.startEventWeb.description",
      },
      propertyDefinitions: [
        {
          id: "formId",
          name: "formId",
          type: "text",
          label: "Form ID",
          group: "config",
          helpText: "The ID of the form that triggers this process",
        },
      ],
    },
  },
  {
    id: NodeType.START_EVENT_RECEIVE_SIGNAL,
    type: NodeType.START_EVENT_RECEIVE_SIGNAL,
    extends: NodeType.START_EVENT_DEFAULT,
    name: "Receive Signal Start Event",
    config: {
      metadata: {
        title: "plugin.default.startEventReceiveSignal.title",
        description: "plugin.default.startEventReceiveSignal.description",
      },
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
];
