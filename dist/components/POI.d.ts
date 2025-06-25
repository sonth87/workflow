import { HandleProps, HandleType, Position } from "@xyflow/react";
import { FC } from "react";
type Props = {
    type: HandleType;
    position?: Position;
    className?: string;
} & Omit<HandleProps, "position">;
declare const POI: FC<Props>;
export default POI;
