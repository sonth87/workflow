import { NodeType, CategoryType } from "@/enum/workflow.enum";
import { PanelTopBottomDashed } from "lucide-react";
import { createDefaultNodeConfig } from "../constants/nodeDefaults";
import type { BaseNodeConfig, RegistryItem } from "@/core";

export const otherNodes: RegistryItem<Partial<BaseNodeConfig>>[] = [
  {
    id: NodeType.NOTE,
    type: NodeType.NOTE,
    name: "Note",
    config: {
      ...createDefaultNodeConfig(NodeType.NOTE, CategoryType.OTHER, {
        title: "plugin.default.note.title",
        description: "plugin.default.note.description",
      }),
      width: 250,
      height: 200,
      propertyDefinitions: [
        {
          id: "color",
          name: "color",
          type: "color",
          label: "Note Color",
          group: "appearance",
        },
      ],
    },
  },
  {
    id: NodeType.ANNOTATION,
    type: NodeType.ANNOTATION,
    name: "Annotation",
    config: {
      ...createDefaultNodeConfig(NodeType.ANNOTATION, CategoryType.OTHER, {
        level: "1",
        title: "plugin.default.annotation.title",
        description: "plugin.default.annotation.description",
      }),
      propertyDefinitions: [
        {
          id: "textColor",
          name: "textColor",
          type: "color",
          label: "Text Color",
          group: "appearance",
        },
      ],
    },
  },
  {
    id: NodeType.POOL,
    type: NodeType.POOL,
    name: "Pool",
    config: {
      ...createDefaultNodeConfig(NodeType.POOL, CategoryType.OTHER, {
        title: "plugin.default.pool.title",
        description: "plugin.default.pool.description",
      }),
      nodeType: NodeType.POOL,
      icon: {
        type: "lucide",
        value: PanelTopBottomDashed,
        backgroundColor: "#3b82f6",
        color: "#ffffff",
      },
      resizable: true,
      draggable: true,
      propertyDefinitions: [
        {
          id: "orientation",
          name: "orientation",
          type: "select",
          label: "Orientation",
          group: "config",
          defaultValue: "horizontal",
          options: [
            { label: "Horizontal", value: "horizontal" },
            { label: "Vertical", value: "vertical" },
          ],
        },
        {
          id: "isLocked",
          name: "isLocked",
          type: "boolean",
          label: "Lock Children",
          group: "config",
          defaultValue: false,
        },
      ],
    },
  },
];
