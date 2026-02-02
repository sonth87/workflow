/**
 * Minimap Toggle Control
 */

import { Map } from "lucide-react";

import { useLanguage } from "@/workflow/hooks/useLanguage";

export interface MinimapToggleProps {
  show?: boolean;
  onChange?: (show: boolean) => void;
  className?: string;
}

export function MinimapToggle({
  show = false,
  onChange,
  className = "",
}: MinimapToggleProps) {
  const { getUIText } = useLanguage();
  return (
    <button
      title={getUIText("ui.toolbar.minimap")}
      onClick={() => onChange?.(!show)}
      className={`rounded p-2 transition-colors ${
        show
          ? "bg-primary text-primary-foreground"
          : "hover:bg-muted text-foreground"
      } ${className}`}
    >
      <Map size={18} />
    </button>
  );
}
