/**
 * Zoom Controls
 */

import { useReactFlow } from "@xyflow/react";
import { Minus, Plus, RefreshCcw, Maximize } from "lucide-react";
import { useEffect, useState } from "react";
import { Tooltip } from "@sth87/shadcn-design-system";
import { useLanguage } from "@/workflow/hooks/useLanguage";

export interface ZoomControlsProps {
  className?: string;
  showPercentage?: boolean;
  showResetView?: boolean;
  showFullscreen?: boolean;
  onZoomChange?: (zoom: number) => void;
}

export function ZoomControls({
  className = "",
  showPercentage = true,
  showResetView = true,
  showFullscreen = false,
  onZoomChange,
}: ZoomControlsProps) {
  const { zoomIn, zoomOut, fitView, getZoom } = useReactFlow();
  const { getUIText } = useLanguage();
  const [displayZoom, setDisplayZoom] = useState(100);

  useEffect(() => {
    const handleZoomChange = () => {
      const zoom = Math.round(getZoom() * 100);
      setDisplayZoom(zoom);
      onZoomChange?.(zoom);
    };

    const interval = setInterval(handleZoomChange, 100);
    return () => clearInterval(interval);
  }, [getZoom, onZoomChange]);

  const handleZoomOut = () => {
    zoomOut({ duration: 200 });
  };

  const handleZoomIn = () => {
    zoomIn({ duration: 200 });
  };

  const handleFitView = () => {
    fitView({ padding: 0.2, duration: 200, maxZoom: 1 });
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  };

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <button
        onClick={handleZoomOut}
        title={getUIText("ui.toolbar.zoomOut")}
        className="rounded p-2 hover:bg-muted transition-colors"
      >
        <Minus size={18} className="text-foreground" />
      </button>

      {showPercentage && (
        <div className="min-w-15 text-center px-3 py-1.5 rounded bg-muted text-sm font-medium">
          {displayZoom}%
        </div>
      )}

      <button
        onClick={handleZoomIn}
        title={getUIText("ui.toolbar.zoomIn")}
        className="rounded p-2 hover:bg-muted transition-colors"
      >
        <Plus size={18} className="text-foreground" />
      </button>

      {showResetView && (
        <Tooltip
          content={getUIText("ui.toolbar.resetView")}
          delayDuration={0}
          sideOffset={4}
        >
          <button
            onClick={handleFitView}
            title={getUIText("ui.toolbar.resetView")}
            className="rounded p-2 hover:bg-muted transition-colors"
          >
            <RefreshCcw size={18} className="text-foreground" />
          </button>
        </Tooltip>
      )}

      {showFullscreen && (
        <Tooltip
          content={getUIText("ui.toolbar.fullscreen")}
          delayDuration={0}
          sideOffset={4}
        >
          <button
            onClick={toggleFullscreen}
            title={getUIText("ui.toolbar.fullscreen")}
            className="rounded p-2 hover:bg-muted transition-colors"
          >
            <Maximize size={18} className="text-foreground" />
          </button>
        </Tooltip>
      )}
    </div>
  );
}
