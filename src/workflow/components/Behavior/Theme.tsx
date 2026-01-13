import { useTheme } from "@/hooks/useTheme";
import { Button } from "@sth87/shadcn-design-system";
import { Monitor, Moon, Sun } from "lucide-react";
import React from "react";

const ThemeSwitcher = () => {
  const { theme, setLightMode, setDarkMode, setSystemMode } = useTheme();

  return (
    <div className="flex items-center gap-1 rounded border border-border bg-muted p-1">
      <Button
        title="Light Mode"
        onClick={setLightMode}
        className={`rounded p-2 transition-colors ${
          theme === "light"
            ? "bg-primary text-primary-foreground"
            : "hover:bg-background"
        }`}
      >
        <Sun size={16} />
      </Button>
      <Button
        title="Dark Mode"
        onClick={setDarkMode}
        className={`rounded p-2 transition-colors ${
          theme === "dark"
            ? "bg-primary text-primary-foreground"
            : "hover:bg-background"
        }`}
      >
        <Moon size={16} />
      </Button>
      <Button
        title="System Mode"
        onClick={setSystemMode}
        className={`rounded p-2 transition-colors ${
          theme === "system"
            ? "bg-primary text-primary-foreground"
            : "hover:bg-background"
        }`}
      >
        <Monitor size={16} />
      </Button>
    </div>
  );
};

export { ThemeSwitcher };
