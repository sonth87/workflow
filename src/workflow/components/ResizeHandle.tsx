import React, { useState, useEffect, useCallback } from "react";
import { cn } from "@sth87/shadcn-design-system";

interface ResizeHandleProps {
  onResize: (delta: number) => void;
  direction: "left" | "right";
  className?: string;
}

export const ResizeHandle: React.FC<ResizeHandleProps> = ({
  onResize,
  direction,
  className,
}) => {
  const [isResizing, setIsResizing] = useState(false);

  const startResizing = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  }, []);

  const stopResizing = useCallback(() => {
    setIsResizing(false);
  }, []);

  const resize = useCallback(
    (e: MouseEvent) => {
      if (isResizing) {
        // For right direction (Toolbox), moving mouse right increases width
        // For left direction (PropertiesPanel), moving mouse left increases width (delta is negative)
        const delta = direction === "right" ? e.movementX : -e.movementX;
        onResize(delta);
      }
    },
    [isResizing, onResize, direction]
  );

  useEffect(() => {
    if (isResizing) {
      window.addEventListener("mousemove", resize);
      window.addEventListener("mouseup", stopResizing);
    }

    return () => {
      window.removeEventListener("mousemove", resize);
      window.removeEventListener("mouseup", stopResizing);
    };
  }, [isResizing, resize, stopResizing]);

  return (
    <div
      onMouseDown={startResizing}
      className={cn(
        "absolute top-0 bottom-0 w-1.5 cursor-col-resize hover:bg-primary/30 transition-colors z-50",
        direction === "right" ? "right-[-3px]" : "left-[-3px]",
        isResizing && "bg-primary/50",
        className
      )}
    />
  );
};
