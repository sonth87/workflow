/**
 * Toolbar Group - Combines all toolbar controls
 */

import { PanModeToggle, type PanModeToggleProps } from "./PanModeToggle";
import { MinimapToggle, type MinimapToggleProps } from "./MinimapToggle";
import { ZoomControls, type ZoomControlsProps } from "./ZoomControls";

export interface ToolbarGroupProps {
  panModeProps?: PanModeToggleProps;
  minimapProps?: MinimapToggleProps;
  zoomProps?: ZoomControlsProps;
  className?: string;
  showPanMode?: boolean;
  showMinimap?: boolean;
  showZoom?: boolean;
}

export function ToolbarGroup({
  panModeProps,
  minimapProps,
  zoomProps,
  className = "",
  showPanMode = true,
  showMinimap = true,
  showZoom = true,
}: ToolbarGroupProps) {
  return (
    <footer
      className={`flex items-center justify-center gap-1 rounded-lg bg-card p-2 shadow-md border border-border ${className}`}
    >
      {showPanMode && <PanModeToggle {...panModeProps} />}

      {showPanMode && showZoom && <div className="h-6 w-px bg-border" />}

      {showZoom && <ZoomControls {...zoomProps} />}

      {(showPanMode || showZoom) && showMinimap && (
        <div className="h-6 w-px bg-border" />
      )}

      {showMinimap && <MinimapToggle {...minimapProps} />}
    </footer>
  );
}
