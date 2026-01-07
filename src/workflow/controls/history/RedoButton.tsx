/**
 * Redo Button Control
 */

import { Redo } from "lucide-react";
import { useWorkflowStore } from "@/core/store/workflowStore";

export interface RedoButtonProps {
  className?: string;
  onRedo?: () => void;
}

export function RedoButton({ className = "", onRedo }: RedoButtonProps) {
  const { redo, history } = useWorkflowStore();
  const canRedo = history.future.length > 0;

  const handleRedo = () => {
    redo();
    onRedo?.();
  };

  return (
    <button
      onClick={handleRedo}
      disabled={!canRedo}
      className={`inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      title="Redo"
    >
      <Redo className="w-4 h-4" />
      Redo
    </button>
  );
}
