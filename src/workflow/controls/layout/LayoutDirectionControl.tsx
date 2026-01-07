/**
 * Layout Direction Control
 */

import { ArrowUpDown, ArrowRightLeft } from "lucide-react";
import { useWorkflowLayout } from "../../hooks/useWorkflowLayout";

export type LayoutDirection = "vertical" | "horizontal";

export interface LayoutDirectionControlProps {
  className?: string;
  onChange?: (direction: LayoutDirection) => void;
}

export function LayoutDirectionControl({
  className = "",
  onChange,
}: LayoutDirectionControlProps) {
  const { layoutDirection, setLayoutDirection } = useWorkflowLayout();

  const handleToggle = () => {
    const newDirection: LayoutDirection =
      layoutDirection === "vertical" ? "horizontal" : "vertical";
    setLayoutDirection(newDirection);
    onChange?.(newDirection);
  };

  return (
    <button
      onClick={handleToggle}
      className={`inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${className}`}
      title={`Switch to ${layoutDirection === "vertical" ? "horizontal" : "vertical"} layout`}
    >
      {layoutDirection === "vertical" ? (
        <>
          <ArrowRightLeft className="w-4 h-4" />
          Horizontal
        </>
      ) : (
        <>
          <ArrowUpDown className="w-4 h-4" />
          Vertical
        </>
      )}
    </button>
  );
}
