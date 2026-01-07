/**
 * Undo Button Control
 */

import { Undo } from "lucide-react";
import { useWorkflowStore } from "@/core/store/workflowStore";

export interface UndoButtonProps {
  className?: string;
  onUndo?: () => void;
}

export function UndoButton({ className = "", onUndo }: UndoButtonProps) {
  const { undo, history } = useWorkflowStore();
  const canUndo = history.past.length > 0;

  const handleUndo = () => {
    undo();
    onUndo?.();
  };

  return (
    <button
      onClick={handleUndo}
      disabled={!canUndo}
      className={`inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      title="Undo"
    >
      <Undo className="w-4 h-4" />
      Undo
    </button>
  );
}
