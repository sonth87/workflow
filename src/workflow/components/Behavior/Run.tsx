import { useWorkflowValidation } from "@/workflow/hooks";
import { Button } from "@sth87/shadcn-design-system";
import { Play } from "lucide-react";
import React, { useCallback } from "react";

type RunProps = {
  className?: string;
};

const Run = ({ className }: RunProps) => {
  const { validate } = useWorkflowValidation();

  const handleRun = useCallback(async () => {
    const result = await validate();

    if (!result.valid) {
      alert(
        `Cannot run workflow. Please fix ${result.errors.length} error(s).`
      );
      return;
    }

    // Run workflow logic here
    alert("Workflow execution started!");
  }, [validate]);

  return (
    <div className={className}>
      <Button title="Run" onClick={handleRun} color="success">
        <Play size={16} />
        Run
      </Button>
    </div>
  );
};

export { Run };
