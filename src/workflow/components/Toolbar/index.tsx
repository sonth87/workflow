/**
 * Toolbar Component
 * Uses ToolbarGroup with individual controls
 */

import { ToolbarGroup } from "@/workflow/controls/toolbar/ToolbarGroup";

interface ToolbarProps {
  isPanMode?: boolean;
  onPanModeChange?: (isPanMode: boolean) => void;
  showMinimap?: boolean;
  onMinimapToggle?: (show: boolean) => void;
}

export function Toolbar({
  isPanMode = false,
  onPanModeChange,
  showMinimap = false,
  onMinimapToggle,
}: ToolbarProps) {
  return (
    <ToolbarGroup
      panModeProps={{
        isPanMode,
        onChange: onPanModeChange,
      }}
      zoomProps={{
        showPercentage: true,
      }}
      minimapProps={{
        show: showMinimap,
        onChange: onMinimapToggle,
      }}
    />
  );
}
