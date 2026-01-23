import type {
  BaseEdgeConfig,
} from "@/core/types/base.types";
import {
  EdgePathType,
  EdgePathStyle,
} from "@/enum/workflow.enum";

export const defaultEdges: Array<{
  id: string;
  type: string;
  name: string;
  config: BaseEdgeConfig;
}> = [
  {
    id: "sequence-flow",
    type: "sequence-flow",
    name: "Sequence Flow",
    config: {
      id: "",
      source: "",
      target: "",
      type: "sequence-flow",
      pathType: EdgePathType.Bezier,
      metadata: {
        id: "sequence-flow",
        title: "plugin.default.edge.sequenceFlow.title",
        description: "plugin.default.edge.sequenceFlow.description",
        version: "1.0.0",
      },
      pathStyle: EdgePathStyle.Solid,
      pathWidth: 2,
      animated: false,
      editable: true,
      deletable: true,
      selectable: true,
      labels: [],
      properties: {
        pathType: EdgePathType.Bezier,
        pathStyle: EdgePathStyle.Solid,
      },
      propertyDefinitions: [
        {
          id: "condition",
          name: "condition",
          type: "expression",
          label: "Condition Expression",
          group: "logic",
          helpText: "Condition to follow this flow (e.g. amount > 100)",
        },
        {
          id: "isDefault",
          name: "isDefault",
          type: "boolean",
          label: "Is Default Flow",
          group: "logic",
          defaultValue: false,
        },
      ],
    },
  },
  {
    id: "message-flow",
    type: "message-flow",
    name: "Message Flow",
    config: {
      id: "",
      source: "",
      target: "",
      type: "message-flow",
      pathType: EdgePathType.Straight,
      metadata: {
        id: "message-flow",
        title: "plugin.default.edge.messageFlow.title",
        description: "plugin.default.edge.messageFlow.description",
        version: "1.0.0",
      },
      pathStyle: EdgePathStyle.Dashed,
      pathWidth: 2,
      animated: false,
      editable: true,
      deletable: true,
      selectable: true,
      labels: [],
      properties: {
        pathType: EdgePathType.Straight,
        pathStyle: EdgePathStyle.Dashed,
        messageType: "default",
      },
      propertyDefinitions: [
        {
          id: "messageType",
          name: "messageType",
          type: "select",
          label: "plugin.default.edge.property.messageType.label",
          description: "plugin.default.edge.property.messageType.description",
          defaultValue: "default",
          required: false,
          order: 0,
          options: [
            {
              label: "plugin.default.edge.property.messageType.option.default",
              value: "default",
            },
            {
              label: "plugin.default.edge.property.messageType.option.email",
              value: "email",
            },
            {
              label: "plugin.default.edge.property.messageType.option.api",
              value: "api",
            },
            {
              label: "plugin.default.edge.property.messageType.option.event",
              value: "event",
            },
          ],
        },
        {
          id: "pathType",
          name: "pathType",
          type: "select",
          label: "plugin.default.edge.property.pathType.label",
          description: "plugin.default.edge.property.pathType.description",
          defaultValue: EdgePathType.Straight,
          options: [
            {
              label: "plugin.default.edge.property.pathType.option.bezier",
              value: EdgePathType.Bezier,
            },
            {
              label: "plugin.default.edge.property.pathType.option.straight",
              value: EdgePathType.Straight,
            },
            {
              label: "plugin.default.edge.property.pathType.option.step",
              value: EdgePathType.Step,
            },
          ],
        },
      ],
    },
  },
  {
    id: "association",
    type: "association",
    name: "Association",
    config: {
      id: "",
      source: "",
      target: "",
      type: "association",
      pathType: EdgePathType.Straight,
      metadata: {
        id: "association",
        title: "plugin.default.edge.association.title",
        description: "plugin.default.edge.association.description",
        version: "1.0.0",
      },
      pathStyle: EdgePathStyle.Dotted,
      pathWidth: 1.5,
      animated: false,
      editable: true,
      deletable: true,
      selectable: true,
      labels: [],
      properties: {
        pathType: EdgePathType.Straight,
        pathStyle: EdgePathStyle.Dotted,
        direction: "none",
      },
      propertyDefinitions: [
        {
          id: "direction",
          name: "direction",
          type: "select",
          label: "plugin.default.edge.property.direction.label",
          description: "plugin.default.edge.property.direction.description",
          defaultValue: "none",
          options: [
            {
              label: "plugin.default.edge.property.direction.option.none",
              value: "none",
            },
            {
              label: "plugin.default.edge.property.direction.option.one",
              value: "one",
            },
            {
              label: "plugin.default.edge.property.direction.option.both",
              value: "both",
            },
          ],
        },
      ],
    },
  },
];
