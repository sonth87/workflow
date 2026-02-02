/**
 * Tidy Up Toggle Control
 */

import { Route } from "lucide-react";
import { Tooltip } from "@sth87/shadcn-design-system";
import { useLanguage } from "@/workflow/hooks/useLanguage";
import { useWorkflowLayout } from "@/workflow/hooks/useWorkflowLayout";

export interface TidyUpToggleProps {
  className?: string;
}

export function TidyUpToggle({ className = "" }: TidyUpToggleProps) {
  const { tidyUpWorkflow } = useWorkflowLayout();
  const { getUIText } = useLanguage();

  return (
    <Tooltip
      content={getUIText("ui.tidyUp.organizeWorkflow")}
      delayDuration={0}
      sideOffset={4}
    >
      <button
        title={getUIText("ui.tidyUp.organizeWorkflow")}
        onClick={tidyUpWorkflow}
        className={`rounded p-2 transition-colors hover:bg-muted text-foreground ${className}`}
      >
        <Route size={18} />
      </button>
    </Tooltip>
  );
}
