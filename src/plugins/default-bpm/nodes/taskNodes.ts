import { NodeType, CategoryType } from "@/enum/workflow.enum";
import { ClipboardList } from "lucide-react";
import { createDefaultNodeConfig } from "../constants/nodeDefaults";

export const taskNodes = [
  {
    id: NodeType.TASK_DEFAULT,
    type: NodeType.TASK_DEFAULT,
    name: "Task",
    config: {
      ...createDefaultNodeConfig(NodeType.TASK_DEFAULT, CategoryType.TASK, {
        title: "plugin.default.taskDefault.title",
        description: "plugin.default.taskDefault.description",
      }),
      icon: {
        type: "lucide",
        value: ClipboardList,
        backgroundColor: "#24b0fb",
        color: "#ffffff",
      },
    },
  },
  {
    id: NodeType.TASK_USER,
    type: NodeType.TASK_USER,
    extends: NodeType.TASK_DEFAULT,
    name: "User Task",
    config: {
      metadata: {
        title: "plugin.default.taskUser.title",
        description: "plugin.default.taskUser.description",
      },
      propertyDefinitions: [
        {
          id: "assignee",
          name: "assignee",
          type: "text",
          label: "Assignee",
          group: "assignment",
          helpText: "Username or ID of the user assigned to this task",
        },
        {
          id: "candidateGroups",
          name: "candidateGroups",
          type: "text",
          label: "Candidate Groups",
          group: "assignment",
          helpText: "Comma-separated list of groups who can claim this task",
        },
        {
          id: "dueDate",
          name: "dueDate",
          type: "date",
          label: "Due Date",
          group: "assignment",
        },
        {
          id: "priority",
          name: "priority",
          type: "select",
          label: "Priority",
          group: "assignment",
          defaultValue: "medium",
          options: [
            { label: "Low", value: "low" },
            { label: "Medium", value: "medium" },
            { label: "High", value: "high" },
            { label: "Urgent", value: "urgent" },
          ],
        },
      ],
    },
  },
  {
    id: NodeType.TASK_SYSTEM,
    type: NodeType.TASK_SYSTEM,
    extends: NodeType.TASK_DEFAULT,
    name: "System Task",
    config: {
      metadata: {
        title: "plugin.default.taskSystem.title",
        description: "plugin.default.taskSystem.description",
      },
    },
  },
  {
    id: NodeType.TASK_SCRIPT,
    type: NodeType.TASK_SCRIPT,
    extends: NodeType.TASK_DEFAULT,
    name: "Script Task",
    config: {
      metadata: {
        title: "plugin.default.taskScript.title",
        description: "plugin.default.taskScript.description",
      },
      propertyDefinitions: [
        {
          id: "scriptFormat",
          name: "scriptFormat",
          type: "select",
          label: "Script Format",
          group: "logic",
          defaultValue: "javascript",
          options: [
            { label: "JavaScript", value: "javascript" },
            { label: "Groovy", value: "groovy" },
            { label: "Python", value: "python" },
          ],
        },
        {
          id: "script",
          name: "script",
          type: "logic",
          label: "Script Content",
          group: "logic",
          helpText: "The script to be executed when this task is reached",
        },
        {
          id: "resultVariable",
          name: "resultVariable",
          type: "text",
          label: "Result Variable",
          group: "logic",
          helpText: "Variable name to store the script result",
        },
      ],
    },
  },
  {
    id: NodeType.SERVICE_TASK,
    type: NodeType.SERVICE_TASK,
    extends: NodeType.TASK_DEFAULT,
    name: "Service Task",
    config: {
      metadata: {
        title: "plugin.default.serviceTask.title",
        description: "plugin.default.serviceTask.description",
      },
      propertyDefinitions: [
        {
          id: "apiUrl",
          name: "apiUrl",
          type: "text",
          label: "API URL",
          group: "service",
          placeholder: "https://api.example.com/v1/resource",
        },
        {
          id: "method",
          name: "method",
          type: "select",
          label: "HTTP Method",
          group: "service",
          options: [
            { label: "GET", value: "GET" },
            { label: "POST", value: "POST" },
            { label: "PUT", value: "PUT" },
            { label: "DELETE", value: "DELETE" },
            { label: "PATCH", value: "PATCH" },
          ],
          defaultValue: "GET",
        },
        {
          id: "headers",
          name: "headers",
          type: "json",
          label: "HTTP Headers",
          group: "service",
          defaultValue: {},
        },
        {
          id: "payloadMapping",
          name: "payloadMapping",
          type: "logic",
          label: "Request Payload Mapping",
          group: "service",
          helpText: "Logic to transform workflow data into API payload",
        },
        {
          id: "responseMapping",
          name: "responseMapping",
          type: "logic",
          label: "Response Data Mapping",
          group: "service",
          helpText: "Logic to transform API response back into workflow data",
        },
        {
          id: "timeout",
          name: "timeout",
          type: "number",
          label: "Timeout (ms)",
          group: "service",
          defaultValue: 5000,
        },
      ],
    },
  },
];
