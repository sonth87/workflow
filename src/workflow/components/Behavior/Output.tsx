import { useWorkflowImportExport } from "@/workflow/hooks";
import { Button } from "@sth87/shadcn-design-system";
import { Copy, Eye, X } from "lucide-react";
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

      {showJsonDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-[90vw] max-w-4xl h-[80vh] bg-card rounded-lg shadow-xl flex flex-col">
            {/* Dialog Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h2 className="text-xl font-semibold">Workflow JSON</h2>
              <div className="flex items-center gap-2">
                <Button
                  title="Copy JSON"
                  onClick={handleCopyJson}
                  className="rounded p-2 hover:bg-muted"
                >
                  <Copy size={18} />
                </Button>
                <Button
                  title="Close"
                  onClick={() => setShowJsonDialog(false)}
                  className="rounded p-2 hover:bg-muted"
                >
                  <X size={18} />
                </Button>
              </div>
            </div>

            {/* Dialog Content */}
            <div className="flex-1 overflow-auto p-4">
              <pre className="bg-muted rounded p-4 text-sm font-mono overflow-auto">
                {jsonData}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export { OutputViewer };
