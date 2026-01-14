import { useWorkflowImportExport } from "@/workflow/hooks";
import { Button } from "@sth87/shadcn-design-system";
import { Upload } from "lucide-react";
import React from "react";

type ImportWorkflowProps = { className?: string };

const ImportWorkflow = ({ className }: ImportWorkflowProps) => {
  const { importWorkflow } = useWorkflowImportExport();

  return (
    <div className={className}>
      <Button
        title="Import Workflow"
        onClick={importWorkflow}
        className="flex items-center gap-2 rounded border border-border bg-card px-3 py-2 hover:bg-muted"
      >
        <Upload size={16} />
        Import
      </Button>
    </div>
  );
};

export { ImportWorkflow };
