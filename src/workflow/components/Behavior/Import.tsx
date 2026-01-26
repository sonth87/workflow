import { useWorkflowImportExport } from "@/workflow/hooks";
import { useLanguage } from "@/workflow/hooks/useLanguage";
import { Button } from "@sth87/shadcn-design-system";
import { Upload } from "lucide-react";
import React from "react";

type ImportWorkflowProps = { className?: string };

const ImportWorkflow = ({ className }: ImportWorkflowProps) => {
  const { uploadWorkflow } = useWorkflowImportExport();
  const { getUIText } = useLanguage();

  const handleImport = () => {
    uploadWorkflow().catch(error => {
      console.error("Failed to import workflow:", error);
    });
  };

  return (
    <div className={className}>
      <Button
        title={getUIText("import.importWorkflow")}
        onClick={handleImport}
        className="flex items-center gap-2 rounded border border-border bg-card px-3 py-2 hover:bg-muted"
      >
        <Upload size={16} />
        {getUIText("import.import")}
      </Button>
    </div>
  );
};

export { ImportWorkflow };
