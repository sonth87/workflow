export declare const connectionStyle: {
    straight: string;
    step: string;
    smoothstep: string;
    bezier: string;
};
export declare enum EDGES {
    bezier = "bezier",
    connection = "connection",
    straight = "straight"
}
export declare const connnectionTypes: {
    bezier: ({ id, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, style, markerEnd, data, }: import("@xyflow/react").EdgeProps<import("@xyflow/react").Edge<{
        label: string;
    }>>) => import("react/jsx-runtime").JSX.Element;
    connection: (props: import("@xyflow/react").EdgeProps) => import("react/jsx-runtime").JSX.Element;
};
