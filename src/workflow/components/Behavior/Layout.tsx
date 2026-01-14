import { useWorkflowStore, type BaseNodeConfig } from "@/core";
import { getLayoutedElements } from "@/workflow/utils/layout";
import { Button, cn } from "@sth87/shadcn-design-system";
import { useReactFlow, useUpdateNodeInternals } from "@xyflow/react";
import { ArrowRightLeft, ArrowUpDown } from "lucide-react";
import React, { useCallback } from "react";

type LayoutDirection = "vertical" | "horizontal";

interface LayoutSwitcherProps {
  className?: string;
}

const LayoutSwitcher = ({ className }: LayoutSwitcherProps) => {
  const {
    nodes,
    edges,
    setNodes,
    saveToHistory,
    setLayoutDirection: storeSetLayoutDirection,
    layoutDirection,
  } = useWorkflowStore();
  const { fitView } = useReactFlow();
  const updateNodeInternals = useUpdateNodeInternals();

  const handleChangeLayoutDirection = useCallback(
    (direction: LayoutDirection) => {
      // Save history before layout change
      saveToHistory();

      storeSetLayoutDirection(direction);

      const { nodes: layoutedNodes } = getLayoutedElements(
        nodes,
        edges,
        direction
      );

      setNodes(layoutedNodes as BaseNodeConfig[]);

      setTimeout(() => {
        layoutedNodes.forEach(n => updateNodeInternals(n.id));
        fitView({ padding: 0.2, duration: 300, maxZoom: 1 });
      }, 100);
    },
    [
      nodes,
      edges,
      setNodes,
      updateNodeInternals,
      fitView,
      saveToHistory,
      storeSetLayoutDirection,
    ]
  );

  return (
    <div
      className={cn(
        "flex items-center gap-1 rounded border border-border bg-muted p-1",
        className
      )}
    >
      <Button
        title="Vertical Layout (Top to Bottom)"
        onClick={() => handleChangeLayoutDirection("vertical")}
        className={`rounded p-2 transition-colors ${
          layoutDirection === "vertical"
            ? "bg-primary text-primary-foreground"
            : "hover:bg-background"
        }`}
      >
        <ArrowUpDown size={16} />
      </Button>
      <Button
        title="Horizontal Layout (Left to Right)"
        onClick={() => handleChangeLayoutDirection("horizontal")}
        className={`rounded p-2 transition-colors ${
          layoutDirection === "horizontal"
            ? "bg-primary text-primary-foreground"
            : "hover:bg-background"
        }`}
      >
        <ArrowRightLeft size={16} />
      </Button>
    </div>
  );
};

export { LayoutSwitcher };
