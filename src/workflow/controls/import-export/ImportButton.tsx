/**
 * Import Button Control
 */

import { Upload } from "lucide-react";
import { useWorkflowImportExport, type WorkflowData } from "../../hooks/useWorkflowImportExport";

export interface ImportButtonProps {
  className?: string;
  onImportStart?: () => void;
  onImportComplete?: (data: WorkflowData) => void;
  onImportError?: (error: Error) => void;
}

export function ImportButton({
  className = "",
  onImportStart,
  onImportComplete,
  onImportError,
}: ImportButtonProps) {
  const { uploadWorkflow } = useWorkflowImportExport();

  const handleImport = async () => {
    try {
      onImportStart?.();
      const data = await uploadWorkflow();
      onImportComplete?.(data);
    } catch (error) {
      onImportError?.(error as Error);
      console.error("Import failed:", error);
    }
  };

  return (
    <button
      onClick={handleImport}
      className={`inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${className}`}
      title="Import workflow"
    >
      <Upload className="w-4 h-4" />
      Import
    </button>
  );
}
