import { type NodeProps } from "@xyflow/react";
import React, { type JSX, type ReactElement } from "react";
import { type NodeConfigType } from "../types/node";
type NodeBaseProps = {
    children?: JSX.Element | JSX.Element[] | ReactElement;
};
declare const NodeBase: React.FC<NodeBaseProps & NodeProps<NodeConfigType>>;
export default NodeBase;
