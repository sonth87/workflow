import { useWorkflowLayout } from "@/workflow/hooks/useWorkflowLayout";
import { useLanguage } from "@/workflow/hooks/useLanguage";
import { Button } from "@sth87/shadcn-design-system";
import { Route } from "lucide-react";
import React from "react";

type TidyUpProps = { className?: string };

const TidyUp = ({ className }: TidyUpProps) => {
  const { tidyUpWorkflow } = useWorkflowLayout();
  const { getUIText } = useLanguage();

  return (
    <div className={className}>
      <Button
        title={getUIText("ui.tidyUp.organizeWorkflow")}
        onClick={tidyUpWorkflow}
        className="flex items-center gap-2 rounded border border-border bg-card px-3 py-2 hover:bg-muted"
      >
        <Route size={16} />
        {getUIText("ui.tidyUp.tidyUp")}
      </Button>
    </div>
  );
};

export { TidyUp };
