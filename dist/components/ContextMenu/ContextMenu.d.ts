import React from "react";
import { ContextMenuPosition } from "../../types/context-menu";
type Props = {
    onClick?: (e: any) => void;
} & ContextMenuPosition;
declare const ContextMenu: React.FC<Props>;
export default ContextMenu;
