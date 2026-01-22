/**
 * Toolbar Options - More options popover
 */

import { Menu, Check } from "lucide-react";
import { Popover, Command } from "@sth87/shadcn-design-system";
import { useLanguage } from "@/workflow/hooks/useLanguage";

export interface ToolbarOptionsProps {
  showMinimap?: boolean;
  onMinimapToggle?: (show: boolean) => void;
  className?: string;
}

export function ToolbarOptions({
  showMinimap = false,
  onMinimapToggle,
  className = "",
}: ToolbarOptionsProps) {
  const { getUIText } = useLanguage();

  return (
    <Popover
      trigger={
        <button
          title={getUIText("ui.toolbar.moreOptions")}
          className={`rounded p-2 hover:bg-muted transition-colors ${className}`}
        >
          <Menu size={18} />
        </button>
      }
      className="p-0 border-none"
      content={
        <Command className="rounded-lg border shadow-md min-w-40">
          <Command.List>
            <Command.Group heading={getUIText("ui.toolbar.options")}>
              <Command.Item
                onSelect={() => onMinimapToggle?.(!showMinimap)}
                className="flex justify-between"
              >
                <span>{getUIText("ui.toolbar.minimap")}</span>
                {showMinimap && (
                  <span>
                    <Check />
                  </span>
                )}
              </Command.Item>
            </Command.Group>
          </Command.List>
        </Command>
      }
    />
  );
}
