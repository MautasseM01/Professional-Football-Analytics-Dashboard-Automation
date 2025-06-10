
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TouchFeedbackButton } from './TouchFeedbackButton';
import { IOSBottomSheet } from './IOSBottomSheet';
import { useSwipeGestures } from '@/hooks/use-swipe-gestures';
import { useHapticFeedback } from '@/hooks/use-haptic-feedback';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { ZoomIn, ZoomOut, RotateCcw, Filter, ChevronLeft, ChevronRight } from 'lucide-react';

interface HeatmapPoint {
  x: number;
  y: number;
  intensity: number;
}

interface IOSHeatmapVisualizationProps {
  playerId: string;
  playerName: string;
  heatmapData: HeatmapPoint[];
  onPlayerChange?: (playerId: string) => void;
  availablePlayers?: Array<{ id: string; name: string }>;
  className?: string;
}

export const IOSHeatmapVisualization = ({
  playerId,
  playerName,
  heatmapData,
  onPlayerChange,
  availablePlayers = [],
  className
}: IOSHeatmapVisualizationProps) => {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isLandscape, setIsLandscape] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('full_match');
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { triggerHaptic } = useHapticFeedback();
  const isMobile = useIsMobile();

  // Time period options
  const timePeriods = [
    { id: 'first_half', label: 'First Half' },
    { id: 'second_half', label: 'Second Half' },
    { id: 'full_match', label: 'Full Match' },
    { id: 'last_15min', label: 'Last 15 min' }
  ];

  // Swipe gestures for player switching
  const { swipeProps } = useSwipeGestures({
    onSwipeLeft: () => {
      if (currentPlayerIndex < availablePlayers.length - 1) {
        const newIndex = currentPlayerIndex + 1;
        setCurrentPlayerIndex(newIndex);
        onPlayerChange?.(availablePlayers[newIndex].id);
        triggerHaptic('light');
      }
    },
    onSwipeRight: () => {
      if (currentPlayerIndex > 0) {
        const newIndex = currentPlayerIndex - 1;
        setCurrentPlayerIndex(newIndex);
        onPlayerChange?.(availablePlayers[newIndex].id);
        triggerHaptic('light');
      }
    },
    threshold: 50
  });

  // Handle orientation changes
  useEffect(() => {
    const handleOrientationChange = () => {
      setIsLandscape(window.innerWidth > window.innerHeight);
    };

    handleOrientationChange();
    window.addEventListener('resize', handleOrientationChange);
    return () => window.removeEventListener('resize', handleOrientationChange);
  }, []);

  // Draw heatmap with smooth gradients
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !heatmapData.length) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { width, height } = canvas;
    ctx.clearRect(0, 0, width, height);

    // Create gradient overlay with enhanced mobile performance
    const imageData = ctx.createImageData(width, height);
    const data = imageData.data;

    // Optimize for mobile - reduce calculation intensity
    const step = isMobile ? 2 : 1;

    for (let x = 0; x < width; x += step) {
      for (let y = 0; y < height; y += step) {
        let totalIntensity = 0;
        
        heatmapData.forEach(point => {
          const distance = Math.sqrt(
            Math.pow((x - point.x * width), 2) + 
            Math.pow((y - point.y * height), 2)
          );
          
          const influence = Math.exp(-distance / (isMobile ? 40 : 50)) * point.intensity;
          totalIntensity += influence;
        });

        const normalizedIntensity = Math.min(totalIntensity, 1);
        
        // Fill pixels in a step pattern for mobile performance
        for (let dx = 0; dx < step && x + dx < width; dx++) {
          for (let dy = 0; dy < step && y + dy < height; dy++) {
            const pixelIndex = ((y + dy) * width + (x + dx)) * 4;

            if (normalizedIntensity > 0.1) {
              let r, g, b;
              
              if (normalizedIntensity < 0.25) {
                const t = normalizedIntensity / 0.25;
                r = Math.floor(0 * (1 - t) + 0 * t);
                g = Math.floor(100 * (1 - t) + 255 * t);
                b = Math.floor(255 * (1 - t) + 0 * t);
              } else if (normalizedIntensity < 0.5) {
                const t = (normalizedIntensity - 0.25) / 0.25;
                r = Math.floor(0 * (1 - t) + 255 * t);
                g = Math.floor(255 * (1 - t) + 255 * t);
                b = Math.floor(0 * (1 - t) + 0 * t);
              } else if (normalizedIntensity < 0.75) {
                const t = (normalizedIntensity - 0.5) / 0.25;
                r = Math.floor(255 * (1 - t) + 255 * t);
                g = Math.floor(255 * (1 - t) + 165 * t);
                b = Math.floor(0 * (1 - t) + 0 * t);
              } else {
                const t = (normalizedIntensity - 0.75) / 0.25;
                r = Math.floor(255 * (1 - t) + 255 * t);
                g = Math.floor(165 * (1 - t) + 0 * t);
                b = Math.floor(0 * (1 - t) + 0 * t);
              }

              data[pixelIndex] = r;
              data[pixelIndex + 1] = g;
              data[pixelIndex + 2] = b;
              data[pixelIndex + 3] = Math.floor(normalizedIntensity * 180);
            }
          }
        }
      }
    }

    ctx.putImageData(imageData, 0, 0);
  }, [heatmapData, zoomLevel, isMobile]);

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev * 1.5, 3));
    triggerHaptic('light');
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev / 1.5, 0.5));
    triggerHaptic('light');
  };

  const handleRotate = () => {
    setIsLandscape(prev => !prev);
    triggerHaptic('medium');
  };

  return (
    <div className={cn("w-full", className)}>
      <Card className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-white/20 dark:border-slate-700/20 overflow-hidden">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0 flex-1">
              <CardTitle className={cn(
                "font-semibold text-gray-900 dark:text-white",
                isMobile ? "text-lg" : "text-xl"
              )}>
                Player Heatmap
              </CardTitle>
              <p className={cn(
                "text-gray-600 dark:text-gray-400 mt-1",
                isMobile ? "text-sm" : "text-base"
              )}>
                {playerName} • {timePeriods.find(p => p.id === selectedPeriod)?.label}
              </p>
            </div>
            
            {/* Mobile-optimized Player navigation */}
            {availablePlayers.length > 1 && (
              <div className="flex items-center gap-2">
                <TouchFeedbackButton
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (currentPlayerIndex > 0) {
                      const newIndex = currentPlayerIndex - 1;
                      setCurrentPlayerIndex(newIndex);
                      onPlayerChange?.(availablePlayers[newIndex].id);
                    }
                  }}
                  disabled={currentPlayerIndex === 0}
                  className="min-h-[44px] min-w-[44px] p-0"
                  hapticType="light"
                >
                  <ChevronLeft size={isMobile ? 16 : 14} />
                </TouchFeedbackButton>
                
                <span className={cn(
                  "text-gray-600 dark:text-gray-400 min-w-[40px] text-center",
                  isMobile ? "text-sm" : "text-xs"
                )}>
                  {currentPlayerIndex + 1}/{availablePlayers.length}
                </span>
                
                <TouchFeedbackButton
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (currentPlayerIndex < availablePlayers.length - 1) {
                      const newIndex = currentPlayerIndex + 1;
                      setCurrentPlayerIndex(newIndex);
                      onPlayerChange?.(availablePlayers[newIndex].id);
                    }
                  }}
                  disabled={currentPlayerIndex === availablePlayers.length - 1}
                  className="min-h-[44px] min-w-[44px] p-0"
                  hapticType="light"
                >
                  <ChevronRight size={isMobile ? 16 : 14} />
                </TouchFeedbackButton>
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {/* Mobile-optimized Controls */}
          <div className="flex items-center justify-between px-4 py-3 bg-gray-50/50 dark:bg-slate-800/50">
            <div className="flex items-center gap-2">
              <TouchFeedbackButton
                variant="outline"
                size="sm"
                onClick={handleZoomOut}
                className="min-h-[44px] min-w-[44px] p-0"
                disabled={zoomLevel <= 0.5}
                hapticType="light"
              >
                <ZoomOut size={isMobile ? 16 : 14} />
              </TouchFeedbackButton>
              
              <span className={cn(
                "text-gray-600 dark:text-gray-400 min-w-[50px] text-center bg-white dark:bg-gray-800 px-2 py-1 rounded border",
                isMobile ? "text-sm" : "text-xs"
              )}>
                {Math.round(zoomLevel * 100)}%
              </span>
              
              <TouchFeedbackButton
                variant="outline"
                size="sm"
                onClick={handleZoomIn}
                className="min-h-[44px] min-w-[44px] p-0"
                disabled={zoomLevel >= 3}
                hapticType="light"
              >
                <ZoomIn size={isMobile ? 16 : 14} />
              </TouchFeedbackButton>
            </div>

            <div className="flex items-center gap-2">
              <TouchFeedbackButton
                variant="outline"
                size="sm"
                onClick={handleRotate}
                className="min-h-[44px] min-w-[44px] p-0"
                hapticType="medium"
              >
                <RotateCcw size={isMobile ? 16 : 14} />
              </TouchFeedbackButton>
              
              <TouchFeedbackButton
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(true)}
                className={cn(
                  "min-h-[44px]",
                  isMobile ? "px-4" : "px-3"
                )}
                hapticType="light"
              >
                <Filter size={isMobile ? 16 : 14} className="mr-1" />
                {!isMobile && "Filter"}
              </TouchFeedbackButton>
            </div>
          </div>

          {/* Mobile-optimized Heatmap Canvas */}
          <div 
            ref={containerRef}
            className={cn(
              "relative bg-green-100 dark:bg-green-900/20 overflow-hidden touch-none",
              isLandscape ? "aspect-[4/3]" : "aspect-[3/4]",
              isMobile && "min-h-[300px]"
            )}
            {...swipeProps}
          >
            {/* Football field background */}
            <div className="absolute inset-0 bg-gradient-to-b from-green-400/20 to-green-600/20">
              {/* Field markings */}
              <div className="absolute inset-4 border-2 border-white/30 rounded-sm">
                <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-white/30 transform -translate-y-0.5" />
                <div className="absolute top-1/2 left-1/2 w-16 h-16 sm:w-20 sm:h-20 border-2 border-white/30 rounded-full transform -translate-x-1/2 -translate-y-1/2" />
              </div>
            </div>

            <canvas
              ref={canvasRef}
              width={isMobile ? 300 : 400}
              height={isLandscape ? (isMobile ? 225 : 300) : (isMobile ? 400 : 533)}
              className="absolute inset-0 w-full h-full"
              style={{ 
                transform: `scale(${zoomLevel})`, 
                transformOrigin: 'center',
                imageRendering: isMobile ? 'pixelated' : 'auto'
              }}
            />

            {/* Mobile-optimized Interactive legend */}
            <div className="absolute top-3 right-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm rounded-xl p-3 shadow-lg">
              <div className={cn(
                "font-medium text-gray-900 dark:text-white mb-2",
                isMobile ? "text-xs" : "text-sm"
              )}>
                Activity Intensity
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-2 sm:w-4 sm:h-3 bg-gradient-to-r from-blue-500 to-green-500 rounded-sm" />
                  <span className={cn(
                    "text-gray-600 dark:text-gray-400",
                    isMobile ? "text-xs" : "text-sm"
                  )}>Low</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-2 sm:w-4 sm:h-3 bg-gradient-to-r from-green-500 to-yellow-500 rounded-sm" />
                  <span className={cn(
                    "text-gray-600 dark:text-gray-400",
                    isMobile ? "text-xs" : "text-sm"
                  )}>Medium</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-2 sm:w-4 sm:h-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-sm" />
                  <span className={cn(
                    "text-gray-600 dark:text-gray-400",
                    isMobile ? "text-xs" : "text-sm"
                  )}>High</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Mobile-optimized Time Period Filter Bottom Sheet */}
      <IOSBottomSheet
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
        title="Time Period Filter"
        initialHeight="collapsed"
      >
        <div className="space-y-4">
          <p className={cn(
            "text-gray-600 dark:text-gray-400",
            isMobile ? "text-sm" : "text-base"
          )}>
            Select time period to analyze
          </p>
          
          <div className="grid grid-cols-2 gap-3">
            {timePeriods.map((period) => (
              <TouchFeedbackButton
                key={period.id}
                variant={selectedPeriod === period.id ? "default" : "outline"}
                className={cn(
                  "min-h-[44px] text-center",
                  isMobile ? "h-12 text-sm" : "h-10 text-base",
                  selectedPeriod === period.id 
                    ? "bg-blue-600 text-white" 
                    : "bg-white/50 dark:bg-slate-800/50"
                )}
                onClick={() => {
                  setSelectedPeriod(period.id);
                  setShowFilters(false);
                  triggerHaptic('light');
                }}
                hapticType="light"
              >
                {period.label}
              </TouchFeedbackButton>
            ))}
          </div>
        </div>
      </IOSBottomSheet>
    </div>
  );
};
