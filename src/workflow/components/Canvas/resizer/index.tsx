import { cn } from "@sth87/shadcn-design-system";
import React, { type PropsWithChildren, forwardRef } from "react";
import { NodeResizer as NodeResizerRoot } from "@xyflow/react";

type Props = {
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  isEditing?: boolean;
  selected?: boolean;
  className?: string;
  minWidth?: number;
  minHeight?: number;
  allowScroll?: boolean; // For notes/annotations that need scrolling
};

const NodeResizer = forwardRef<HTMLDivElement, PropsWithChildren<Props>>(
  (props, ref) => {
    const {
      onMouseEnter,
      onMouseLeave,
      selected,
      className,
      isEditing,
      allowScroll = false,
      minWidth = 150,
      minHeight = 100,
    } = props;

    return (
      <>
        <NodeResizerRoot
          isVisible={!!selected}
          minWidth={minWidth}
          minHeight={minHeight}
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
            allowScroll ? "nowheel" : "",
            className
          )}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          onWheel={e => allowScroll && e.stopPropagation()}
          style={{
            width: "100%",
            height: "100%",
            minWidth: minWidth,
            minHeight: minHeight,
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
