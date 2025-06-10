
import React from 'react';
import { ZoomIn, ZoomOut, RotateCcw, Maximize2, Minimize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';

interface HeatmapZoomControlsProps {
  zoomLevel: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetZoom: () => void;
  onToggleFullscreen?: () => void;
  isFullscreen?: boolean;
  minZoom?: number;
  maxZoom?: number;
  className?: string;
}

export const HeatmapZoomControls = ({
  zoomLevel,
  onZoomIn,
  onZoomOut,
  onResetZoom,
  onToggleFullscreen,
  isFullscreen = false,
  minZoom = 0.5,
  maxZoom = 3,
  className = ""
}: HeatmapZoomControlsProps) => {
  const isMobile = useIsMobile();

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Zoom Out */}
      <Button
        variant="outline"
        size={isMobile ? "sm" : "default"}
        onClick={onZoomOut}
        disabled={zoomLevel <= minZoom}
        className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border-2 border-gray-200 dark:border-slate-600 hover:border-blue-300 dark:hover:border-blue-500 transition-all"
      >
        <ZoomOut size={isMobile ? 14 : 16} />
      </Button>

      {/* Zoom Level Display */}
      <div className="px-3 py-1.5 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border-2 border-gray-200 dark:border-slate-600 rounded-md">
        <span className="text-sm font-medium text-gray-900 dark:text-white">
          {Math.round(zoomLevel * 100)}%
        </span>
      </div>

      {/* Zoom In */}
      <Button
        variant="outline"
        size={isMobile ? "sm" : "default"}
        onClick={onZoomIn}
        disabled={zoomLevel >= maxZoom}
        className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border-2 border-gray-200 dark:border-slate-600 hover:border-blue-300 dark:hover:border-blue-500 transition-all"
      >
        <ZoomIn size={isMobile ? 14 : 16} />
      </Button>

      {/* Reset Zoom */}
      <Button
        variant="outline"
        size={isMobile ? "sm" : "default"}
        onClick={onResetZoom}
        className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border-2 border-gray-200 dark:border-slate-600 hover:border-blue-300 dark:hover:border-blue-500 transition-all"
      >
        <RotateCcw size={isMobile ? 14 : 16} />
      </Button>

      {/* Fullscreen Toggle (Desktop only) */}
      {!isMobile && onToggleFullscreen && (
        <Button
          variant="outline"
          size="default"
          onClick={onToggleFullscreen}
          className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border-2 border-gray-200 dark:border-slate-600 hover:border-blue-300 dark:hover:border-blue-500 transition-all"
        >
          {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
        </Button>
      )}
    </div>
  );
};
