import { useWorkflowStore } from "@/core";
import { useLanguage } from "@/workflow/hooks/useLanguage";
import { Button } from "@sth87/shadcn-design-system";
import { Shrink } from "lucide-react";
import React from "react";

type ViewModeSwitcherProps = { className?: string };

const ViewModeSwitcher = ({ className }: ViewModeSwitcherProps) => {
  const { compactView, toggleCompactView } = useWorkflowStore();
  const { getUIText } = useLanguage();

  return (
    <div className={className}>
      <Button
        title={
          compactView
            ? getUIText("viewMode.expandView")
            : getUIText("viewMode.compactView")
        }
        onClick={toggleCompactView}
        className={`flex items-center gap-2 rounded border border-border bg-card px-3 py-2 hover:bg-muted ${
          compactView ? "bg-primary text-primary-foreground" : ""
        }`}
      >
        <Shrink size={16} />
        {compactView
          ? getUIText("viewMode.expand")
          : getUIText("viewMode.compact")}
      </Button>
    </div>
  );
};

export { ViewModeSwitcher };
