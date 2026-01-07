/**
 * Hook for workflow theme management
 */

import { useCallback } from "react";
import { useTheme } from "@/hooks/useTheme";

export type WorkflowTheme = "light" | "dark";

export function useWorkflowTheme() {
  const { theme, setTheme } = useTheme();

  const toggleTheme = useCallback(() => {
    setTheme(theme === "light" ? "dark" : "light");
  }, [theme, setTheme]);

  const isDark = theme === "dark";
  const isLight = theme === "light";

  return {
    theme,
    setTheme,
    toggleTheme,
    isDark,
    isLight,
  };
}
