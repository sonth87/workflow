/**
 * Auto Layout Button Control
 */

import { Route } from "lucide-react";
import { useWorkflowLayout } from "../../hooks/useWorkflowLayout";
import { useLanguage } from "../../hooks/useLanguage";

export interface AutoLayoutButtonProps {
  className?: string;
  onLayout?: () => void;
}

export function AutoLayoutButton({
  className = "",
  onLayout,
}: AutoLayoutButtonProps) {
  const { applyAutoLayout } = useWorkflowLayout();
  const { getUIText } = useLanguage();

  const handleLayout = () => {
    applyAutoLayout();
    onLayout?.();
  };

  // Get translated texts using the exact keys present in translation files
  // "ui.tidyUp.tidyUp": "Tidy Up" / "Sắp xếp"
  // "ui.tidyUp.organizeWorkflow": "Organize workflow layout" / "Sắp xếp bố cục workflow"

  return (
    <button
      onClick={handleLayout}
      className={`inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${className}`}
      title={getUIText("ui.tidyUp.organizeWorkflow")}
    >
      <Route className="w-4 h-4" />
      {getUIText("ui.tidyUp.tidyUp")}
    </button>
  );
}
