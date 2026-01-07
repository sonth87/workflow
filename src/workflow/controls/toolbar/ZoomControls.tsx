/**
 * Zoom Controls
 */

import { useReactFlow } from "@xyflow/react";
import { Minus, Plus, Maximize } from "lucide-react";
import { useEffect, useState } from "react";

export interface ZoomControlsProps {
  className?: string;
  showPercentage?: boolean;
  onZoomChange?: (zoom: number) => void;
}

export function ZoomControls({
  className = "",
  showPercentage = true,
  onZoomChange,
}: ZoomControlsProps) {
  const { zoomIn, zoomOut, fitView, getZoom } = useReactFlow();
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

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <button
        onClick={handleZoomOut}
        title="Zoom out"
        className="rounded p-2 hover:bg-muted transition-colors"
      >
        <Minus size={18} className="text-foreground" />
      </button>

      {showPercentage && (
        <span className="min-w-15 text-center text-sm font-medium text-foreground">
          {displayZoom}%
        </span>
      )}

      <button
        onClick={handleZoomIn}
        title="Zoom in"
        className="rounded p-2 hover:bg-muted transition-colors"
      >
        <Plus size={18} className="text-foreground" />
      </button>

      <button
        onClick={handleFitView}
        title="Fit view"
        className="rounded p-2 hover:bg-muted transition-colors"
      >
        <Maximize size={18} className="text-foreground" />
      </button>
    </div>
  );
}
