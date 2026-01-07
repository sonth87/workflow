/**
 * Export Button Control
 */

import { Download } from "lucide-react";
import { useWorkflowImportExport, type WorkflowData } from "../../hooks/useWorkflowImportExport";

export interface ExportButtonProps {
  className?: string;
  filename?: string;
  onExport?: (data: WorkflowData) => void;
}

export function ExportButton({
  className = "",
  filename = "workflow.json",
  onExport,
}: ExportButtonProps) {
  const { downloadWorkflow, exportWorkflow } = useWorkflowImportExport();

  const handleExport = () => {
    const data = exportWorkflow();
    downloadWorkflow(filename);
    onExport?.(data);
  };

  return (
    <button
      onClick={handleExport}
      className={`inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${className}`}
      title="Export workflow"
    >
      <Download className="w-4 h-4" />
      Export
    </button>
  );
}
