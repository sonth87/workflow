import { cn } from "@sth87/shadcn-design-system";
import React, { type PropsWithChildren, forwardRef } from "react";
import { NodeResizer as NodeResizerRoot } from "@xyflow/react";

type Props = {
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  isEditing?: boolean;
  selected?: boolean;
  className?: string;
};

const NodeResizer = forwardRef<HTMLDivElement, PropsWithChildren<Props>>(
  (props, ref) => {
    const { onMouseEnter, onMouseLeave, selected, className, isEditing } =
      props;

    return (
      <>
        <NodeResizerRoot
          isVisible={!!selected}
          minWidth={150}
          minHeight={100}
          handleStyle={{
            width: 8,
            height: 8,
            zIndex: 10,
          }}
          handleClassName="bg-primary/50! border-primary! rounded-xs!"
          lineClassName={cn(
            "border-primary! min-h-1! min-w-1!"
            // "ring-4! ring-primary/25!"
          )}
        />

        <div
          ref={ref}
          className={cn(
            "relative rounded-lg transition-all border",
            isEditing ? "nodrag shadow-lg" : "",
            className
          )}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          style={{
            width: "100%",
            height: "100%",
            minWidth: 150,
            minHeight: 100,
          }}
        >
          {props.children}
        </div>
      </>
    );
  }
);

NodeResizer.displayName = "NodeResizer";

export default NodeResizer;
