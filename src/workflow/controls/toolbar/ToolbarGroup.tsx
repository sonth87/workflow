/**
 * Toolbar Group - Combines all toolbar controls
 */

import { PanModeToggle, type PanModeToggleProps } from "./PanModeToggle";
import { MinimapToggle, type MinimapToggleProps } from "./MinimapToggle";
import { ZoomControls, type ZoomControlsProps } from "./ZoomControls";
import { ToolbarOptions, type ToolbarOptionsProps } from "./ToolbarOptions";
import { TidyUpToggle, type TidyUpToggleProps } from "./TidyUpToggle";

export interface ToolbarGroupProps {
  panModeProps?: PanModeToggleProps;
  minimapProps?: MinimapToggleProps;
  tidyUpProps?: TidyUpToggleProps;
  zoomProps?: ZoomControlsProps;
  optionsProps?: ToolbarOptionsProps;
  className?: string;
  showPanMode?: boolean;
  showMinimap?: boolean;
  showTidyUp?: boolean;
  showZoom?: boolean;
  showOptions?: boolean;
}

export function ToolbarGroup({
  panModeProps,
  minimapProps,
  tidyUpProps,
  zoomProps,
  optionsProps,
  className = "",
  showPanMode = true,
  showMinimap = true,
  showTidyUp = true,
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

      {(showPanMode || showZoom || showMinimap) && showTidyUp && (
        <div className="h-6 w-px bg-border" />
      )}

      {showTidyUp && <TidyUpToggle {...tidyUpProps} />}

      {(showPanMode || showZoom || showMinimap || showTidyUp) &&
        showOptions && <div className="h-6 w-px bg-border" />}

      {showOptions && <ToolbarOptions {...optionsProps} />}
    </footer>
  );
}
