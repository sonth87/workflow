import { useWorkflowImportExport } from "@/workflow/hooks";
import { Button } from "@sth87/shadcn-design-system";
import { Download } from "lucide-react";
import React from "react";

type ExportWorkflowProps = { className?: string };

const ExportWorkflow = ({ className }: ExportWorkflowProps) => {
  const { exportWorkflow } = useWorkflowImportExport();

  return (
    <div className={className}>
      <Button
        title="Export Workflow"
        onClick={exportWorkflow}
        className="flex items-center gap-2 rounded border border-border bg-card px-3 py-2 hover:bg-muted"
      >
        <Download size={16} />
        Export
      </Button>
    </div>
  );
};

export { ExportWorkflow };
