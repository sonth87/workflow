import { startNodes } from "./startNodes";
import { taskNodes } from "./taskNodes";
import { gatewayNodes } from "./gatewayNodes";
import { endNodes } from "./endNodes";
import { immediateNodes } from "./immediateNodes";
import { boundaryNodes } from "./boundaryNodes";
import { otherNodes } from "./otherNodes";

export const defaultNodes: any[] = [
  ...startNodes,
  ...taskNodes,
  ...gatewayNodes,
  ...endNodes,
  ...immediateNodes,
  ...boundaryNodes,
  ...otherNodes,
];
