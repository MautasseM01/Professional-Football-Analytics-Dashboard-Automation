
import React, { useState, useRef } from "react";
import { FootballPitch } from "./FootballPitch";
import { ShotPoint } from "./ShotPoint";
import { Shot } from "@/types/shot";
import { LoadingOverlay } from "../LoadingOverlay";
import { Loader, RotateCcw, ZoomIn, ZoomOut } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useResponsiveBreakpoint } from "@/hooks/use-orientation";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useHapticFeedback } from "@/hooks/use-haptic-feedback";

interface ShotMapVisualizationProps {
  shots: Shot[];
  loading: boolean;
  filterLoading: boolean;
}

export const ShotMapVisualization = ({ shots, loading, filterLoading }: ShotMapVisualizationProps) => {
  const isMobile = useIsMobile();
  const breakpoint = useResponsiveBreakpoint();
  const { triggerHaptic } = useHapticFeedback();
  
  // Zoom and pan state
  const [zoomLevel, setZoomLevel] = useState(1);
  const [transform, setTransform] = useState({ x: 0, y: 0 });
  const [selectedShot, setSelectedShot] = useState<Shot | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [lastTouch, setLastTouch] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Touch gesture handlers for pinch-to-zoom and pan
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      setLastTouch({ x: e.touches[0].clientX, y: e.touches[0].clientY });
      triggerHaptic('light');
    } else if (e.touches.length === 2) {
      // Handle pinch start
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const distance = Math.sqrt(
        Math.pow(touch2.clientX - touch1.clientX, 2) + 
        Math.pow(touch2.clientY - touch1.clientY, 2)
      );
      setLastTouch({ x: distance, y: 0 });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    e.preventDefault();
    
    if (e.touches.length === 1 && isDragging) {
      // Pan gesture
      const deltaX = e.touches[0].clientX - lastTouch.x;
      const deltaY = e.touches[0].clientY - lastTouch.y;
      
      setTransform(prev => ({
        x: Math.max(-200, Math.min(200, prev.x + deltaX * 0.5)),
        y: Math.max(-200, Math.min(200, prev.y + deltaY * 0.5))
      }));
      
      setLastTouch({ x: e.touches[0].clientX, y: e.touches[0].clientY });
    } else if (e.touches.length === 2) {
      // Pinch zoom gesture
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const distance = Math.sqrt(
        Math.pow(touch2.clientX - touch1.clientX, 2) + 
        Math.pow(touch2.clientY - touch1.clientY, 2)
      );
      
      const scale = distance / lastTouch.x;
      setZoomLevel(prev => Math.max(0.5, Math.min(3, prev * scale)));
      setLastTouch({ x: distance, y: 0 });
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // Zoom controls
  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(3, prev + 0.3));
    triggerHaptic('medium');
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(0.5, prev - 0.3));
    triggerHaptic('medium');
  };

  const handleReset = () => {
    setZoomLevel(1);
    setTransform({ x: 0, y: 0 });
    setSelectedShot(null);
    triggerHaptic('heavy');
  };

  // Shot selection handler
  const handleShotSelect = (shot: Shot) => {
    setSelectedShot(shot);
    triggerHaptic('medium');
  };

  // Responsive container styling with iOS gradients
  const getContainerClasses = () => {
    const baseClasses = "w-full relative transition-all duration-300 ease-out rounded-2xl overflow-hidden";
    
    if (breakpoint === 'mobile') {
      return `${baseClasses} min-h-[300px] bg-gradient-to-br from-green-50 to-emerald-100 dark:from-slate-900 dark:to-slate-800`;
    }
    if (breakpoint === 'tablet-portrait') {
      return `${baseClasses} min-h-[400px] bg-gradient-to-br from-green-50 to-emerald-100 dark:from-slate-900 dark:to-slate-800`;
    }
    return `${baseClasses} min-h-[500px] bg-gradient-to-br from-green-50 to-emerald-100 dark:from-slate-900 dark:to-slate-800`;
  };

  // Responsive pitch dimensions
  const getPitchDimensions = () => {
    if (typeof window === 'undefined') return { width: 800, height: 500 };
    
    const screenWidth = window.innerWidth;
    
    if (breakpoint === 'mobile') {
      return {
        width: Math.min(screenWidth - 32, 375),
        height: Math.min((screenWidth - 32) * 0.6, 225)
      };
    }
    if (breakpoint === 'tablet-portrait') {
      return {
        width: Math.min(screenWidth - 64, 640),
        height: Math.min((screenWidth - 64) * 0.6, 384)
      };
    }
    return {
      width: Math.min(screenWidth - 96, 1000),
      height: Math.min((screenWidth - 96) * 0.6, 600)
    };
  };

  if (loading) {
    return (
      <div className={getContainerClasses()}>
        <div className="flex justify-center items-center h-full min-h-[300px]">
          <div className="flex flex-col items-center space-y-4">
            {/* iOS-style loading animation */}
            <div className="relative">
              <div className="w-16 h-16 bg-white/20 dark:bg-white/10 rounded-full animate-pulse" />
              <Loader className="absolute inset-0 m-auto h-8 w-8 text-emerald-600 dark:text-emerald-400 animate-spin" />
            </div>
            <div className="space-y-2 text-center">
              <div className="h-4 bg-white/20 dark:bg-white/10 rounded-full w-32 animate-pulse" />
              <p className="text-gray-600 dark:text-gray-400 text-sm">Loading shot map...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const pitchDimensions = getPitchDimensions();

  return (
    <div className="space-y-4">
      {/* Mobile orientation suggestion */}
      {isMobile && (
        <Alert className="bg-blue-500/10 border-blue-500/30 rounded-xl backdrop-blur-sm">
          <RotateCcw className="h-4 w-4" />
          <AlertDescription className="text-gray-700 dark:text-gray-300 text-sm">
            For the best experience, try landscape mode and use pinch-to-zoom
          </AlertDescription>
        </Alert>
      )}
      
      <div className={getContainerClasses()} ref={containerRef}>
        <LoadingOverlay isLoading={filterLoading} />
        
        {/* Fixed z-index for control bar - should be lower than header (z-30) */}
        <div className="absolute top-4 right-4 z-10 flex gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={handleZoomOut}
            className="bg-white/90 dark:bg-black/90 backdrop-blur-sm border-0 shadow-lg hover:scale-105 transition-transform rounded-full"
          >
            <ZoomOut className="w-4 h-4" />
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={handleZoomIn}
            className="bg-white/90 dark:bg-black/90 backdrop-blur-sm border-0 shadow-lg hover:scale-105 transition-transform rounded-full"
          >
            <ZoomIn className="w-4 h-4" />
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={handleReset}
            className="bg-white/90 dark:bg-black/90 backdrop-blur-sm border-0 shadow-lg hover:scale-105 transition-transform rounded-full"
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>

        {/* Main pitch container with touch interactions */}
        <div className="flex justify-center items-center w-full h-full p-4">
          <div 
            className="touch-manipulation relative overflow-hidden rounded-xl"
            style={{
              width: pitchDimensions.width,
              height: pitchDimensions.height,
              transform: `scale(${zoomLevel}) translate(${transform.x}px, ${transform.y}px)`,
              transition: isDragging ? 'none' : 'transform 0.3s ease-out'
            }}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <FootballPitch>
              {shots.map((shot) => (
                <ShotPoint 
                  key={shot.id} 
                  shot={shot}
                  onSelect={() => handleShotSelect(shot)}
                  isSelected={selectedShot?.id === shot.id}
                  size={Math.max(12, isMobile ? 16 : 14)}
                />
              ))}
            </FootballPitch>

            {/* Gradient overlay for shot probability zones */}
            <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-black/5 pointer-events-none" />
          </div>
        </div>

        {/* No shots message */}
        {!loading && !filterLoading && shots.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/50 dark:bg-black/50 backdrop-blur-sm rounded-2xl m-4">
            <div className="text-center space-y-3 p-6">
              <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto flex items-center justify-center">
                <span className="text-2xl">⚽</span>
              </div>
              <p className="text-gray-700 dark:text-gray-300 font-medium">
                No shots found
              </p>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Try adjusting your filter criteria
              </p>
            </div>
          </div>
        )}

        {/* Shot count indicator with fixed z-index */}
        {shots.length > 0 && (
          <div className="absolute top-4 left-4 z-10 bg-white/90 dark:bg-black/90 backdrop-blur-sm text-gray-800 dark:text-gray-200 px-3 py-2 rounded-full text-sm font-semibold shadow-lg">
            {shots.length} shot{shots.length !== 1 ? 's' : ''}
          </div>
        )}
      </div>

      {/* iOS-style sliding bottom sheet for shot details with proper z-index */}
      {selectedShot && (
        <Card className="bg-white/95 dark:bg-black/95 backdrop-blur-md border-0 shadow-2xl rounded-2xl overflow-hidden z-10">
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  {selectedShot.player_name}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {selectedShot.minute}' - {selectedShot.match_name}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedShot(null)}
                className="rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                ✕
              </Button>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500 dark:text-gray-400">Outcome</span>
                <p className="font-semibold">{selectedShot.outcome}</p>
              </div>
              {selectedShot.distance && (
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Distance</span>
                  <p className="font-semibold">{selectedShot.distance}m</p>
                </div>
              )}
              {selectedShot.assisted_by && (
                <div className="col-span-2">
                  <span className="text-gray-500 dark:text-gray-400">Assisted by</span>
                  <p className="font-semibold">{selectedShot.assisted_by}</p>
                </div>
              )}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};
