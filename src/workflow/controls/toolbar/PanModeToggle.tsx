/**
 * Pan Mode Toggle Control
 */

import { Hand, MousePointer2 } from "lucide-react";

export interface PanModeToggleProps {
  isPanMode?: boolean;
  onChange?: (isPanMode: boolean) => void;
  className?: string;
}

export function PanModeToggle({
  isPanMode = false,
  onChange,
  className = "",
}: PanModeToggleProps) {
  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <button
        title="Select tool (V)"
        onClick={() => onChange?.(false)}
        className={`rounded p-2 transition-colors ${
          !isPanMode
            ? "bg-primary text-primary-foreground"
            : "hover:bg-muted text-foreground"
        }`}
      >
        <MousePointer2 size={18} />
      </button>

      <button
        title="Hand tool (H) - Pan canvas only"
        onClick={() => onChange?.(true)}
        className={`rounded p-2 transition-colors ${
          isPanMode
            ? "bg-primary text-primary-foreground"
            : "hover:bg-muted text-foreground"
        }`}
      >
        <Hand size={18} />
      </button>
    </div>
  );
}
