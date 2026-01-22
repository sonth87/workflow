/**
 * Workflow Actions Hook
 * Provides centralized actions for controlling workflow behavior
 */

import { useReactFlow } from "@xyflow/react";
import { useState, useCallback } from "react";

export interface WorkflowActions {
  // Pan mode
  panMode: {
    enabled: boolean;
    enable: () => void;
    disable: () => void;
    toggle: () => void;
    set: (enabled: boolean) => void;
  };

  // Zoom
  zoom: {
    in: () => void;
    out: () => void;
    reset: () => void;
    set: (zoom: number) => void;
  };

  // Minimap
  minimap: {
    visible: boolean;
    show: () => void;
    hide: () => void;
    toggle: () => void;
    set: (visible: boolean) => void;
  };

  // Fullscreen
  fullscreen: {
    enabled: boolean;
    enable: () => void;
    disable: () => void;
    toggle: () => void;
  };
}

export function useWorkflowActions(): WorkflowActions {
  const { zoomIn, zoomOut, fitView, setViewport } = useReactFlow();
  const [isPanMode, setIsPanMode] = useState(false);
  const [showMinimap, setShowMinimap] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleZoomIn = useCallback(() => {
    zoomIn({ duration: 200 });
  }, [zoomIn]);

  const handleZoomOut = useCallback(() => {
    zoomOut({ duration: 200 });
  }, [zoomOut]);

  const handleZoomReset = useCallback(() => {
    fitView({ padding: 0.2, duration: 200, maxZoom: 1 });
  }, [fitView]);

  const handleZoomSet = useCallback(
    (zoom: number) => {
      setViewport({ x: 0, y: 0, zoom: zoom / 100 }, { duration: 200 });
    },
    [setViewport]
  );

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  }, []);

  return {
    panMode: {
      enabled: isPanMode,
      enable: () => setIsPanMode(true),
      disable: () => setIsPanMode(false),
      toggle: () => setIsPanMode(prev => !prev),
      set: setIsPanMode,
    },
    zoom: {
      in: handleZoomIn,
      out: handleZoomOut,
      reset: handleZoomReset,
      set: handleZoomSet,
    },
    minimap: {
      visible: showMinimap,
      show: () => setShowMinimap(true),
      hide: () => setShowMinimap(false),
      toggle: () => setShowMinimap(prev => !prev),
      set: setShowMinimap,
    },
    fullscreen: {
      enabled: isFullscreen,
      enable: () => toggleFullscreen(),
      disable: () => toggleFullscreen(),
      toggle: toggleFullscreen,
    },
  };
}
