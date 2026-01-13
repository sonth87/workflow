import { useWorkflowStore } from "@/core";
import { Button } from "@sth87/shadcn-design-system";
import { Shrink } from "lucide-react";
import React from "react";

type ViewModeSwitcherProps = { className?: string };

const ViewModeSwitcher = ({ className }: ViewModeSwitcherProps) => {
  const { compactView, toggleCompactView } = useWorkflowStore();

  return (
    <div className={className}>
      <Button
        title={compactView ? "Expand View" : "Compact View"}
        onClick={toggleCompactView}
        className={`flex items-center gap-2 rounded border border-border bg-card px-3 py-2 hover:bg-muted ${
          compactView ? "bg-primary text-primary-foreground" : ""
        }`}
      >
        <Shrink size={16} />
        {compactView ? "Expand" : "Compact"}
      </Button>
    </div>
  );
};

export { ViewModeSwitcher };
