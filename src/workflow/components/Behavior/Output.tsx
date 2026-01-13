import { useWorkflowImportExport } from "@/workflow/hooks";
import { Button, Dialog } from "@sth87/shadcn-design-system";
import { Copy, Eye } from "lucide-react";
import React, { useState } from "react";

type OutputViewerProps = {
  className?: string;
};

const OutputViewer = ({ className }: OutputViewerProps) => {
  const { viewWorkflow } = useWorkflowImportExport();

  const [showJsonDialog, setShowJsonDialog] = useState(false);
  const [jsonData, setJsonData] = useState<string>("");

  const handleViewWorkflow = () => {
    const wfj = viewWorkflow();
    setJsonData(JSON.stringify(wfj, null, 2));
    setShowJsonDialog(true);
  };

  const handleCopyJson = () => {
    navigator.clipboard.writeText(jsonData);
  };

  return (
    <div className={className}>
      <Button
        title="View Workflow"
        onClick={handleViewWorkflow}
        className="flex items-center gap-2 rounded border border-border bg-card px-3 py-2 hover:bg-muted"
      >
        <Eye size={16} />
      </Button>

      <Dialog
        open={showJsonDialog}
        onOpenChange={setShowJsonDialog}
        title="Workflow JSON"
        description="View and copy the workflow configuration as JSON"
        confirmButton={{
          onClick: () => setShowJsonDialog(false),
          text: "Close",
        }}
        size="4xl"
        contentClassName="max-h-[80vh]!"
      >
        <div className="space-y-4">
          <div className="flex justify-end">
            <Button
              title="Copy JSON"
              onClick={handleCopyJson}
              className="flex items-center gap-2"
            >
              <Copy size={16} />
              Copy JSON
            </Button>
          </div>
          <pre className="bg-muted rounded p-4 text-sm font-mono overflow-auto">
            {jsonData}
          </pre>
        </div>
      </Dialog>
    </div>
  );
};

export { OutputViewer };
