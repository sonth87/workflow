/**
 * Fit View Button Control
 */

import { Maximize2 } from "lucide-react";
import { useWorkflowLayout } from "../../hooks/useWorkflowLayout";

export interface FitViewButtonProps {
  className?: string;
  padding?: number;
  duration?: number;
  maxZoom?: number;
  onFit?: () => void;
}

export function FitViewButton({
  className = "",
  padding = 0.2,
  duration = 300,
  maxZoom = 1,
  onFit,
}: FitViewButtonProps) {
  const { fitToView } = useWorkflowLayout();

  const handleFit = () => {
    fitToView({ padding, duration, maxZoom });
    onFit?.();
  };

  return (
    <button
      onClick={handleFit}
      className={`inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${className}`}
      title="Fit view"
    >
      <Maximize2 className="w-4 h-4" />
      Fit View
    </button>
  );
}
