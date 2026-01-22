/**
 * Pan Mode Toggle Control
 */

import { Hand, MousePointer2 } from "lucide-react";
import { Tooltip } from "@sth87/shadcn-design-system";
import { useLanguage } from "@/workflow/hooks";

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
  const { getUIText } = useLanguage();

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <Tooltip
        key={"select-tool"}
        content={getUIText("ui.toolbar.selectTool")}
        delayDuration={0}
        sideOffset={4}
      >
        <button
          title={getUIText("ui.toolbar.selectTool")}
          onClick={() => onChange?.(false)}
          className={`rounded p-2 transition-colors ${
            !isPanMode
              ? "bg-primary text-primary-foreground"
              : "hover:bg-muted text-foreground"
          }`}
        >
          <MousePointer2 size={18} />
        </button>
      </Tooltip>

      <Tooltip
        key={"pan-tool"}
        content={getUIText("ui.toolbar.handTool")}
        delayDuration={0}
        sideOffset={4}
      >
        <button
          title={getUIText("ui.toolbar.handTool")}
          onClick={() => onChange?.(true)}
          className={`rounded p-2 transition-colors ${
            isPanMode
              ? "bg-primary text-primary-foreground"
              : "hover:bg-muted text-foreground"
          }`}
        >
          <Hand size={18} />
        </button>
      </Tooltip>
    </div>
  );
}
