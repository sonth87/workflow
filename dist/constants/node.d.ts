export declare enum NODES {
    task = "task",
    start = "start",
    end = "end",
    "e-gateway" = "exclusive-gateway"
}
export declare const nodeTypes: {
    task: import("react").FC<import("@xyflow/react").NodeProps>;
    start: import("react").FC<import("@xyflow/react").NodeProps>;
    end: import("react").FC<import("@xyflow/react").NodeProps>;
    "exclusive-gateway": import("react").FC<import("@xyflow/react").NodeProps>;
};
