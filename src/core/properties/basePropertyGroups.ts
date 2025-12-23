/**
 * Base Property Groups
 * Định nghĩa các property groups mặc định cho Node và Edge
 */

import type { PropertyGroupDefinition } from "./types/propertyDefinition";
import { z } from "zod";
import { Settings, Palette, Info, Settings2 } from "lucide-react";

/**
 * Base property groups cho tất cả Node types
 * Các groups này sẽ được merge với custom groups từ node registry
 */
export const baseNodePropertyGroups: PropertyGroupDefinition[] = [
  {
    id: "basic",
    label: "Basic",
    description: "Basic node properties",
    icon: Settings2,
    order: 1,
    fields: [
      {
        id: "id",
        label: "ID",
        type: "text",
        readonly: true,
        helpText: "Unique identifier for this node",
        order: 1,
      },
      {
        id: "label",
        label: "Label",
        type: "text",
        required: true,
        placeholder: "",
        helpText: "Display name for this node",
        validation: z.string().min(1, "Label is required"),
        order: 2,
      },
      {
        id: "description",
        label: "Description",
        type: "textarea",
        placeholder: "",
        helpText: "Optional description for this node",
        validation: z.string().optional(),
        order: 3,
      },
    ],
  },
];

/**
 * Base property groups cho tất cả Edge types
 */
export const baseEdgePropertyGroups: PropertyGroupDefinition[] = [
  {
    id: "basic",
    label: "Basic",
    description: "Basic edge properties",
    icon: Settings2,
    order: 1,
    fields: [
      {
        id: "id",
        label: "ID",
        type: "text",
        readonly: true,
        helpText: "Unique identifier for this edge",
        order: 1,
      },
      {
        id: "source",
        label: "Source Node",
        type: "text",
        readonly: true,
        helpText: "Source node ID",
        order: 2,
      },
      {
        id: "target",
        label: "Target Node",
        type: "text",
        readonly: true,
        helpText: "Target node ID",
        order: 3,
      },
    ],
  },
  {
    id: "labels",
    label: "Labels",
    description: "Edge label settings",
    icon: Info,
    order: 2,
    fields: [
      {
        id: "start-label",
        label: "Start Label",
        type: "text",
        placeholder: "",
        helpText: "Label at the start of the edge",
        order: 1,
      },
      {
        id: "center-label",
        label: "Center Label",
        type: "text",
        placeholder: "",
        helpText: "Label at the center of the edge",
        order: 2,
      },
      {
        id: "end-label",
        label: "End Label",
        type: "text",
        placeholder: "",
        helpText: "Label at the end of the edge",
        order: 3,
      },
    ],
  },
];
