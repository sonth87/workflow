import { NodeType, CategoryType } from "@/enum/workflow.enum";
import { Circle } from "lucide-react";
import { createDefaultNodeConfig } from "../constants/nodeDefaults";

export const startNodes = [
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
    name: "Timer Start Event",
    config: {
      ...createDefaultNodeConfig(
        NodeType.START_EVENT_TIMER,
        CategoryType.START,
        {
          title: "plugin.default.startEventTimer.title",
          description: "plugin.default.startEventTimer.description",
        }
      ),
      propertyDefinitions: [
        {
          id: "timerType",
          name: "timerType",
          type: "select",
          label: "Timer Type",
          group: "config",
          defaultValue: "once",
          options: [
            { label: "One date/time", value: "once" },
            { label: "Hourly", value: "hourly" },
            { label: "Daily", value: "daily" },
            { label: "Monthly", value: "monthly" },
            { label: "Every (Interval)", value: "interval" },
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
            operator: "custom",
            customCheck: (val: any) => ["hourly", "daily", "monthly", "interval"].includes(val as string),
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
            operator: "custom",
            customCheck: (val: any) => ["hourly", "daily", "monthly", "interval"].includes(val as string),
          },
        },
        // Hourly / Daily / Monthly minute
        {
          id: "minute",
          name: "minute",
          type: "number",
          label: "Minute (0-59)",
          group: "config",
          visible: {
            field: "timerType",
            operator: "custom",
            customCheck: (val: any) => ["hourly", "daily", "monthly"].includes(val as string),
          },
          options: { min: 0, max: 59 },
        },
        // Daily / Monthly hour
        {
          id: "hour",
          name: "hour",
          type: "number",
          label: "Hour (0-23)",
          group: "config",
          visible: {
            field: "timerType",
            operator: "custom",
            customCheck: (val: any) => ["daily", "monthly"].includes(val as string),
          },
          options: { min: 0, max: 23 },
        },
        // Monthly
        {
          id: "dayOfMonth",
          name: "dayOfMonth",
          type: "number",
          label: "Day of Month (1-31)",
          group: "config",
          visible: { field: "timerType", operator: "equals", value: "monthly" },
          options: { min: 1, max: 31 },
        },
        // Interval
        {
          id: "intervalValue",
          name: "intervalValue",
          type: "number",
          label: "Interval Value",
          group: "config",
          visible: { field: "timerType", operator: "equals", value: "interval" },
        },
        {
          id: "intervalUnit",
          name: "intervalUnit",
          type: "select",
          label: "Interval Unit",
          group: "config",
          visible: { field: "timerType", operator: "equals", value: "interval" },
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
    name: "Message Start Event",
    config: {
      ...createDefaultNodeConfig(
        NodeType.START_EVENT_MESSAGE,
        CategoryType.START,
        {
          title: "Message Start",
          description: "Start process when a message is received",
        }
      ),
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
    name: "API Start Event",
    config: {
      ...createDefaultNodeConfig(
        NodeType.START_EVENT_API,
        CategoryType.START,
        {
          title: "plugin.default.startEventApi.title",
          description: "plugin.default.startEventApi.description",
        }
      ),
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
          label: "Authentication",
          group: "config",
          defaultValue: "none",
          options: [
            { label: "None", value: "none" },
            { label: "API Key", value: "apiKey" },
            { label: "OAuth2", value: "oauth2" },
          ],
        },
      ],
    },
  },
  {
    id: NodeType.START_EVENT_WEB,
    type: NodeType.START_EVENT_WEB,
    name: "Web Start Event",
    config: {
      ...createDefaultNodeConfig(
        NodeType.START_EVENT_WEB,
        CategoryType.START,
        {
          title: "plugin.default.startEventWeb.title",
          description: "plugin.default.startEventWeb.description",
        }
      ),
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
    name: "Receive Signal Start Event",
    config: {
      ...createDefaultNodeConfig(
        NodeType.START_EVENT_RECEIVE_SIGNAL,
        CategoryType.START,
        {
          title: "plugin.default.startEventReceiveSignal.title",
          description: "plugin.default.startEventReceiveSignal.description",
        }
      ),
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
