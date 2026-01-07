/**
 * Theme Toggle Control
 */

import { Moon, Sun } from "lucide-react";
import { useWorkflowTheme } from "../../hooks/useWorkflowTheme";

export interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
  onChange?: (theme: "light" | "dark") => void;
}

export function ThemeToggle({
  className = "",
  showLabel = false,
  onChange,
}: ThemeToggleProps) {
  const { theme, toggleTheme } = useWorkflowTheme();

  const handleToggle = () => {
    toggleTheme();
    onChange?.(theme === "light" ? "dark" : "light");
  };

  return (
    <button
      onClick={handleToggle}
      className={`inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${className}`}
      title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
    >
      {theme === "light" ? (
        <Moon className="w-4 h-4" />
      ) : (
        <Sun className="w-4 h-4" />
      )}
      {showLabel && (theme === "light" ? "Dark" : "Light")}
    </button>
  );
}
