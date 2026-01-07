/**
 * Minimap Toggle Control
 */

import { Map } from "lucide-react";

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
  return (
    <button
      title="Toggle minimap"
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
