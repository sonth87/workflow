/**
 * Toolbar Group - Combines all toolbar controls
 */

import { PanModeToggle, type PanModeToggleProps } from "./PanModeToggle";
import { MinimapToggle, type MinimapToggleProps } from "./MinimapToggle";
import { ZoomControls, type ZoomControlsProps } from "./ZoomControls";
import { ToolbarOptions, type ToolbarOptionsProps } from "./ToolbarOptions";

export interface ToolbarGroupProps {
  panModeProps?: PanModeToggleProps;
  minimapProps?: MinimapToggleProps;
  zoomProps?: ZoomControlsProps;
  optionsProps?: ToolbarOptionsProps;
  className?: string;
  showPanMode?: boolean;
  showMinimap?: boolean;
  showZoom?: boolean;
  showOptions?: boolean;
}

export function ToolbarGroup({
  panModeProps,
  minimapProps,
  zoomProps,
  optionsProps,
  className = "",
  showPanMode = true,
  showMinimap = true,
  showZoom = true,
  showOptions = true,
}: ToolbarGroupProps) {
  return (
    <footer
      className={`flex items-center justify-center gap-1 rounded-lg bg-card p-2 shadow-md border border-border ${className}`}
    >
      {showPanMode && <PanModeToggle {...panModeProps} />}

      {showPanMode && showZoom && <div className="h-6 w-px bg-border" />}

      {showZoom && <ZoomControls showResetView showFullscreen {...zoomProps} />}

      {(showPanMode || showZoom) && showMinimap && (
        <div className="h-6 w-px bg-border" />
      )}

      {showMinimap && <MinimapToggle {...minimapProps} />}

      {(showPanMode || showZoom || showMinimap) && showOptions && (
        <div className="h-6 w-px bg-border" />
      )}

      {showOptions && <ToolbarOptions {...optionsProps} />}
    </footer>
  );
}
