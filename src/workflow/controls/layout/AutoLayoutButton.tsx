/**
 * Auto Layout Button Control
 */

import { LayoutGrid } from "lucide-react";
import { useWorkflowLayout } from "../../hooks/useWorkflowLayout";

export interface AutoLayoutButtonProps {
  className?: string;
  onLayout?: () => void;
}

export function AutoLayoutButton({
  className = "",
  onLayout,
}: AutoLayoutButtonProps) {
  const { applyAutoLayout } = useWorkflowLayout();

  const handleLayout = () => {
    applyAutoLayout();
    onLayout?.();
  };

  return (
    <button
      onClick={handleLayout}
      className={`inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${className}`}
      title="Auto layout"
    >
      <LayoutGrid className="w-4 h-4" />
      Auto Layout
    </button>
  );
}
