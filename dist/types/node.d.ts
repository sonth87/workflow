import { type Node } from "@xyflow/react";
export interface NodeConfigType extends Node {
    resizer?: boolean;
    toolbar?: boolean;
    toolbarPosition?: "top" | "bottom" | "left" | "right";
}
