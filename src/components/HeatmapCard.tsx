import { useState, useRef, useEffect, useCallback } from "react";
import { Player } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Maximize2, 
  Minimize2, 
  Activity,
  Eye,
  EyeOff,
  BarChart3,
  TrendingUp,
  Minimize
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/contexts/ThemeContext";
import { useHeatmapData, TimePeriod } from "@/hooks/use-heatmap-data";
import { useIsMobile } from "@/hooks/use-mobile";
import { PlayerAvatar } from "@/components/PlayerAvatar";
import { LoadingOverlay } from "@/components/LoadingOverlay";

interface HeatmapCardProps {
  player: Player;
}

type ViewMode = 'standard' | 'compact' | 'focus';

export const HeatmapCard = ({ player }: HeatmapCardProps) => {
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>('full_match');
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('standard');
  const [isDragging, setIsDragging] = useState(false);
  const [lastPanPoint, setLastPanPoint] = useState({ x: 0, y: 0 });
  
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const isMobile = useIsMobile();
  
  const { data: heatmapData, loading, error } = useHeatmapData(player, selectedPeriod);

  // Set compact mode as default on mobile, but allow cycling through all modes
  useEffect(() => {
    if (isMobile && viewMode === 'standard') {
      setViewMode('compact');
    }
  }, [isMobile]);

  // Cycle through view modes
  const cycleViewMode = () => {
    const modes: ViewMode[] = ['standard', 'compact', 'focus'];
    const currentIndex = modes.indexOf(viewMode);
    const nextIndex = (currentIndex + 1) % modes.length;
    setViewMode(modes[nextIndex]);
  };

  // Get current icon and tooltip based on view mode
  const getViewModeConfig = () => {
    switch (viewMode) {
      case 'standard':
        return {
          icon: Eye,
          tooltip: 'Switch to Compact View',
          description: 'Standard View'
        };
      case 'compact':
        return {
          icon: Minimize,
          tooltip: 'Switch to Focus View',
          description: 'Compact View'
        };
      case 'focus':
        return {
          icon: EyeOff,
          tooltip: 'Switch to Standard View',
          description: 'Focus View'
        };
    }
  };

  const viewConfig = getViewModeConfig();
  const ViewIcon = viewConfig.icon;

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
    setLastPanPoint({ x: e.clientX, y: e.clientY });
    if (containerRef.current) {
      containerRef.current.setPointerCapture(e.pointerId);
    }
  }, []);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    
    const deltaX = e.clientX - lastPanPoint.x;
    const deltaY = e.clientY - lastPanPoint.y;
    
    setPanOffset(prev => ({
      x: prev.x + deltaX,
      y: prev.y + deltaY
    }));
    
    setLastPanPoint({ x: e.clientX, y: e.clientY });
  }, [isDragging, lastPanPoint]);

  const handlePointerUp = useCallback((e: React.PointerEvent) => {
    setIsDragging(false);
    if (containerRef.current) {
      containerRef.current.releasePointerCapture(e.pointerId);
    }
  }, []);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const delta = e.deltaY > 0 ? 0.9 : 1.1;
      setZoomLevel(prev => Math.max(0.5, Math.min(3, prev * delta)));
    }
  }, []);

  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev * 1.2, 3));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev / 1.2, 0.5));
  const handleResetZoom = () => {
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
  };

  const handleFullscreen = () => {
    if (!isFullscreen) {
      if (containerRef.current?.requestFullscreen) {
        containerRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
    setIsFullscreen(!isFullscreen);
  };

  if (loading) {
    return (
      <Card className={cn(
        "relative overflow-hidden transition-all duration-300 w-full",
        theme === 'dark' ? "bg-club-dark-gray/50 border-club-gold/20" : "bg-white/90 border-club-gold/30"
      )}>
        <LoadingOverlay isLoading={loading} />
        <CardContent className="p-6 min-h-[400px]" />
      </Card>
    );
  }

  return (
    <TooltipProvider>
      <Card className={cn(
        "overflow-hidden transition-all duration-300 w-full relative",
        theme === 'dark' ? "bg-club-dark-gray/50 border-club-gold/20" : "bg-white/90 border-club-gold/30"
      )}>
        {/* Enhanced View Toggle Button - Mobile Floating */}
        {isMobile && (
          <div className="absolute top-4 right-4 z-20">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={cycleViewMode}
                  className={cn(
                    "h-12 w-12 rounded-full shadow-lg border-2 transition-all backdrop-blur-md",
                    theme === 'dark'
                      ? "bg-club-black/80 border-club-gold/40 hover:border-club-gold/60 text-club-light-gray hover:bg-club-black/90"
                      : "bg-white/95 border-club-gold/50 hover:border-club-gold/70 text-gray-900 hover:bg-white"
                  )}
                >
                  <ViewIcon size={20} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-sm font-medium">{viewConfig.tooltip}</p>
                <p className="text-xs opacity-80">Current: {viewConfig.description}</p>
              </TooltipContent>
            </Tooltip>
          </div>
        )}

        {/* Header Section */}
        <CardHeader className={cn(
          "border-b pb-4 w-full transition-all duration-300",
          theme === 'dark' ? "bg-club-black/40 border-club-gold/20" : "bg-blue-50/80 border-club-gold/30",
          viewMode === 'focus' ? "pb-2" : "pb-4"
        )}>
          <div className="flex flex-col space-y-4 w-full">
            <div className="flex items-start justify-between gap-4 w-full">
              <div className="flex items-start gap-4 min-w-0 flex-1">
                {/* Player Avatar - Hidden in compact/focus modes on mobile, compact+ modes on desktop */}
                {((viewMode === 'standard' && !isMobile) || (viewMode === 'standard' && isMobile)) && (
                  <div className="flex-shrink-0 hidden sm:block transition-opacity duration-300">
                    <div className="relative">
                      <PlayerAvatar player={player} size="lg" />
                      <div className="absolute -bottom-1 -right-1 bg-club-gold text-club-black text-xs px-1.5 py-0.5 rounded-full font-bold">
                        #{player.number}
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <CardTitle className={cn(
                      "font-bold tracking-tight flex items-center gap-2 transition-all duration-300",
                      isMobile ? "text-lg" : "text-xl lg:text-2xl",
                      viewMode === 'focus' ? "text-base" : "",
                      theme === 'dark' ? "text-club-light-gray" : "text-gray-900"
                    )}>
                      <Activity className={cn(
                        "text-club-gold transition-all duration-300",
                        viewMode === 'focus' ? "w-4 h-4" : "w-5 h-5"
                      )} />
                      {viewMode === 'focus' ? 'Heatmap' : 'Player Heatmap Analysis'}
                    </CardTitle>
                    
                    {/* Desktop View Toggle Button */}
                    {!isMobile && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={cycleViewMode}
                            className={cn(
                              "h-8 w-8 transition-all duration-300 hover:bg-club-gold/20",
                              viewMode === 'focus' ? "h-6 w-6" : ""
                            )}
                          >
                            <ViewIcon size={viewMode === 'focus' ? 12 : 14} />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="text-sm font-medium">{viewConfig.tooltip}</p>
                          <p className="text-xs opacity-80">Current: {viewConfig.description}</p>
                        </TooltipContent>
                      </Tooltip>
                    )}
                  </div>
                  
                  {/* Player Info - Hidden in focus mode */}
                  {viewMode !== 'focus' && (
                    <div className={cn(
                      "flex flex-wrap items-center gap-2 text-sm transition-all duration-300",
                      theme === 'dark' ? "text-club-light-gray/70" : "text-gray-600",
                      viewMode === 'compact' ? "text-xs" : ""
                    )}>
                      <span className="font-medium text-club-gold">{player.name}</span>
                      <span className="hidden sm:inline">•</span>
                      <span>{player.position}</span>
                      {viewMode === 'standard' && (
                        <>
                          <span className="hidden sm:inline">•</span>
                          <span>{player.matches} matches</span>
                          <span className="hidden sm:inline">•</span>
                          <span>{player.distance}km avg</span>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className={cn(
          "p-4 lg:p-6 space-y-6 w-full transition-all duration-300",
          viewMode === 'focus' ? "p-2 space-y-3" : "",
          theme === 'dark' ? "bg-club-black/20" : "bg-gradient-to-br from-slate-50/80 to-blue-50/80"
        )}>
          {/* Key Metrics Section - Hidden in focus mode, simplified in compact */}
          {viewMode !== 'focus' && (
            <div className={cn(
              "space-y-3 w-full transition-all duration-300",
              viewMode === 'compact' ? "space-y-2" : ""
            )}>
              <h4 className={cn(
                "font-medium flex items-center gap-2",
                viewMode === 'compact' ? "text-sm" : "text-base",
                theme === 'dark' ? "text-club-light-gray" : "text-gray-900"
              )}>
                <BarChart3 size={viewMode === 'compact' ? 14 : 16} className="text-club-gold" />
                Key Metrics
              </h4>
              <div className={cn(
                "grid gap-3 w-full transition-all duration-300",
                viewMode === 'compact' ? "grid-cols-2 gap-2" : "grid-cols-2 lg:grid-cols-4"
              )}>
                <div className={cn(
                  "rounded-lg border border-club-gold/20 text-center transition-all duration-300",
                  viewMode === 'compact' ? "p-2" : "p-3",
                  theme === 'dark' ? "bg-club-black/30" : "bg-white/50"
                )}>
                  <div className={cn(
                    "mb-1",
                    viewMode === 'compact' ? "text-xs" : "text-xs",
                    theme === 'dark' ? "text-club-light-gray/70" : "text-gray-500"
                  )}>Distance</div>
                  <div className={cn(
                    "font-bold text-club-gold transition-all duration-300",
                    viewMode === 'compact' ? "text-base" : "text-lg"
                  )}>
                    {player.distance}km
                  </div>
                </div>
                <div className={cn(
                  "rounded-lg border border-club-gold/20 text-center transition-all duration-300",
                  viewMode === 'compact' ? "p-2" : "p-3",
                  theme === 'dark' ? "bg-club-black/30" : "bg-white/50"
                )}>
                  <div className={cn(
                    "mb-1",
                    viewMode === 'compact' ? "text-xs" : "text-xs",
                    theme === 'dark' ? "text-club-light-gray/70" : "text-gray-500"
                  )}>Max Speed</div>
                  <div className={cn(
                    "font-bold text-club-gold transition-all duration-300",
                    viewMode === 'compact' ? "text-base" : "text-lg"
                  )}>
                    {player.maxSpeed}km/h
                  </div>
                </div>
                {viewMode === 'standard' && (
                  <>
                    <div className={cn(
                      "rounded-lg p-3 border border-club-gold/20 text-center",
                      theme === 'dark' ? "bg-club-black/30" : "bg-white/50"
                    )}>
                      <div className={cn(
                        "text-xs mb-1",
                        theme === 'dark' ? "text-club-light-gray/70" : "text-gray-500"
                      )}>Sprint Distance</div>
                      <div className="text-lg font-bold text-club-gold">
                        {player.sprintDistance}km
                      </div>
                    </div>
                    <div className={cn(
                      "rounded-lg p-3 border border-club-gold/20 text-center",
                      theme === 'dark' ? "bg-club-black/30" : "bg-white/50"
                    )}>
                      <div className={cn(
                        "text-xs mb-1",
                        theme === 'dark' ? "text-club-light-gray/70" : "text-gray-500"
                      )}>Passes</div>
                      <div className="text-lg font-bold text-club-gold">
                        {player.passes_completed}/{player.passes_attempted}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Heatmap with Controls Section */}
          <div className={cn(
            "space-y-4 w-full transition-all duration-300",
            viewMode === 'focus' ? "space-y-2" : ""
          )}>
            {/* Controls - Always show time period selector, simplified in focus mode */}
            <div className={cn(
              "flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 w-full transition-all duration-300",
              viewMode === 'focus' ? "gap-2" : ""
            )}>
              {/* Time Period Selector - Always visible but compact in focus mode */}
              <div className={cn(
                "w-full transition-all duration-300",
                viewMode === 'focus' ? "lg:w-48" : "lg:w-64"
              )}>
                <Select value={selectedPeriod} onValueChange={(value) => setSelectedPeriod(value as TimePeriod)}>
                  <SelectTrigger className={cn(
                    "border-2 focus:ring-2 focus:ring-club-gold shadow-lg backdrop-blur-sm font-medium transition-all duration-300",
                    viewMode === 'focus' ? "h-8 text-xs" : "",
                    theme === 'dark' 
                      ? "bg-club-black/50 text-club-light-gray border-club-gold/30 hover:border-club-gold/50" 
                      : "bg-white/95 text-gray-900 border-club-gold/40 hover:border-club-gold/60"
                  )}>
                    <SelectValue placeholder="Select Period" />
                  </SelectTrigger>
                  <SelectContent className={cn(
                    "border-2 shadow-2xl backdrop-blur-xl z-50",
                    theme === 'dark' 
                      ? "bg-club-black/95 text-club-light-gray border-club-gold/30" 
                      : "bg-white/98 text-gray-900 border-club-gold/40"
                  )}>
                    <SelectItem value="full_match">Full Match</SelectItem>
                    <SelectItem value="first_half">First Half</SelectItem>
                    <SelectItem value="second_half">Second Half</SelectItem>
                    <SelectItem value="last_15min">Last 15 min</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Zoom Controls */}
              <div className={cn(
                "flex items-center gap-2 w-full lg:w-auto transition-all duration-300",
                viewMode === 'focus' ? "justify-center" : ""
              )}>
                <Button
                  variant="outline"
                  onClick={handleZoomOut}
                  disabled={zoomLevel <= 0.5}
                  className={cn(
                    "border-2 transition-all backdrop-blur-sm",
                    viewMode === 'focus' ? "w-10 h-8" : "w-12 h-10",
                    theme === 'dark'
                      ? "bg-club-black/50 border-club-gold/30 hover:border-club-gold/50 text-club-light-gray"
                      : "bg-white/90 border-club-gold/40 hover:border-club-gold/60 text-gray-900"
                  )}
                >
                  <ZoomOut size={viewMode === 'focus' ? 14 : 16} />
                </Button>

                <Button
                  variant="outline"
                  disabled
                  className={cn(
                    "border-2 transition-all backdrop-blur-sm",
                    viewMode === 'focus' ? "w-10 h-8 text-xs" : "w-12 h-10",
                    theme === 'dark'
                      ? "bg-club-black/50 border-club-gold/30 hover:border-club-gold/50 text-club-light-gray"
                      : "bg-white/90 border-club-gold/40 hover:border-club-gold/60 text-gray-900"
                  )}
                >
                  {Math.round(zoomLevel * 100)}%
                </Button>

                <Button
                  variant="outline"
                  onClick={handleZoomIn}
                  disabled={zoomLevel >= 3}
                  className={cn(
                    "border-2 transition-all backdrop-blur-sm",
                    viewMode === 'focus' ? "w-10 h-8" : "w-12 h-10",
                    theme === 'dark'
                      ? "bg-club-black/50 border-club-gold/30 hover:border-club-gold/50 text-club-light-gray"
                      : "bg-white/90 border-club-gold/40 hover:border-club-gold/60 text-gray-900"
                  )}
                >
                  <ZoomIn size={viewMode === 'focus' ? 14 : 16} />
                </Button>

                <Button
                  variant="outline"
                  onClick={handleResetZoom}
                  className={cn(
                    "border-2 transition-all backdrop-blur-sm",
                    viewMode === 'focus' ? "w-10 h-8" : "w-12 h-10",
                    theme === 'dark'
                      ? "bg-club-black/50 border-club-gold/30 hover:border-club-gold/50 text-club-light-gray"
                      : "bg-white/90 border-club-gold/40 hover:border-club-gold/60 text-gray-900"
                  )}
                >
                  <RotateCcw size={viewMode === 'focus' ? 14 : 16} />
                </Button>

                <Button
                  variant="outline"
                  onClick={handleFullscreen}
                  className={cn(
                    "border-2 transition-all backdrop-blur-sm",
                    viewMode === 'focus' ? "w-10 h-8" : "w-12 h-10",
                    theme === 'dark'
                      ? "bg-club-black/50 border-club-gold/30 hover:border-club-gold/50 text-club-light-gray"
                      : "bg-white/90 border-club-gold/40 hover:border-club-gold/60 text-gray-900"
                  )}
                >
                  {isFullscreen ? <Minimize2 size={viewMode === 'focus' ? 14 : 16} /> : <Maximize2 size={viewMode === 'focus' ? 14 : 16} />}
                </Button>
              </div>
            </div>

            {/* Heatmap Visualization Container */}
            <div 
              ref={containerRef}
              className={cn(
                "relative rounded-2xl overflow-hidden shadow-xl border-2 select-none w-full transition-all duration-300",
                theme === 'dark' 
                  ? "bg-gradient-to-br from-slate-900 to-slate-800 border-club-gold/30" 
                  : "bg-gradient-to-br from-slate-100 to-slate-200 border-club-gold/40"
              )}
              style={{ 
                aspectRatio: isMobile ? '4/3' : '16/10',
                minHeight: viewMode === 'focus' ? (isMobile ? '250px' : '400px') : (isMobile ? '300px' : '500px')
              }}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onWheel={handleWheel}
            >
              <div className="absolute inset-0 w-full h-full overflow-hidden">
                {player.heatmapUrl ? (
                  <img
                    ref={imageRef}
                    src={player.heatmapUrl}
                    alt={`${player.name} heatmap`}
                    className="w-full h-full object-contain transition-transform duration-200 pointer-events-none"
                    style={{
                      transform: `scale(${zoomLevel}) translate(${panOffset.x / zoomLevel}px, ${panOffset.y / zoomLevel}px)`,
                      transformOrigin: 'center center'
                    }}
                    draggable={false}
                    onError={(e) => {
                      console.error('Failed to load heatmap image:', e);
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                ) : (
                  <div className={cn(
                    "w-full h-full flex items-center justify-center border-2 border-dashed",
                    theme === 'dark' ? "border-club-gold/30 text-club-light-gray/50" : "border-club-gold/40 text-gray-400"
                  )}>
                    <div className="text-center">
                      <Activity className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No heatmap data available</p>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Mobile Touch Hint */}
              {isMobile && viewMode !== 'focus' && (
                <div className={cn(
                  "absolute top-2 left-2 px-2 py-1 rounded-lg shadow-lg border backdrop-blur-md text-xs",
                  theme === 'dark'
                    ? "bg-club-black/80 text-club-light-gray border-club-gold/30"
                    : "bg-white/80 text-slate-900 border-club-gold/40"
                )}>
                  <span className="font-medium">Pinch to zoom • Drag to pan</span>
                </div>
              )}
            </div>

            {/* Activity Intensity Legend - Hidden in focus mode */}
            {viewMode !== 'focus' && (
              <div className={cn(
                "w-full rounded-2xl border-2 shadow-lg backdrop-blur-md transition-all duration-300",
                theme === 'dark'
                  ? "bg-club-black/80 border-club-gold/30"
                  : "bg-white/90 border-club-gold/40"
              )}>
                <div className={cn(
                  "transition-all duration-300",
                  viewMode === 'compact' ? "p-3" : "p-4 lg:p-6"
                )}>
                  {/* Legend Header */}
                  <div className={cn(
                    "flex items-center gap-3 transition-all duration-300",
                    viewMode === 'compact' ? "mb-3" : "mb-4"
                  )}>
                    <div className={cn(
                      "p-2 rounded-lg border",
                      theme === 'dark' 
                        ? "bg-club-gold/20 border-club-gold/30" 
                        : "bg-club-gold/10 border-club-gold/40"
                    )}>
                      <TrendingUp className={cn(
                        "text-club-gold transition-all duration-300",
                        viewMode === 'compact' ? "w-4 h-4" : "w-5 h-5"
                      )} />
                    </div>
                    <div>
                      <h4 className={cn(
                        "font-bold transition-all duration-300",
                        viewMode === 'compact' ? "text-base" : "text-lg",
                        theme === 'dark' ? "text-club-light-gray" : "text-gray-900"
                      )}>
                        Activity Intensity Scale
                      </h4>
                      {viewMode === 'standard' && (
                        <p className={cn(
                          "text-sm",
                          theme === 'dark' ? "text-club-light-gray/70" : "text-gray-600"
                        )}>
                          Player movement density and engagement level across field zones
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Horizontal Gradient Bar */}
                  <div className="space-y-3">
                    <div className="relative">
                      <div 
                        className={cn(
                          "w-full rounded-lg border-2 border-club-gold/30 shadow-inner relative overflow-hidden transition-all duration-300",
                          viewMode === 'compact' ? "h-6" : "h-8"
                        )}
                        style={{
                          background: theme === 'dark' 
                            ? 'linear-gradient(to right, #1a1a1a 0%, #2d4a22 20%, #4a7c59 40%, #d4af37 60%, #f59e0b 80%, #dc2626 100%)'
                            : 'linear-gradient(to right, #f8fafc 0%, #86efac 20%, #65a3d9 40%, #d4af37 60%, #f59e0b 80%, #dc2626 100%)'
                        }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
                      </div>
                      
                      <div className="absolute inset-0 flex justify-between items-center px-1">
                        {[0, 2, 4, 6, 8, 10].map((value, index) => (
                          <div key={value} className="relative">
                            <div className={cn(
                              "rounded-full transition-all duration-300",
                              viewMode === 'compact' ? "w-0.5 h-4" : "w-0.5 h-6",
                              theme === 'dark' ? "bg-club-light-gray/40" : "bg-gray-700/40"
                            )}></div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Scale labels */}
                    <div className={cn(
                      "flex justify-between items-center font-medium transition-all duration-300",
                      viewMode === 'compact' ? "text-xs" : "text-sm"
                    )}>
                      {[
                        { value: 0, label: 'Minimal' },
                        { value: 2, label: 'Low' },
                        { value: 4, label: 'Moderate' },
                        { value: 6, label: 'Active' },
                        { value: 8, label: 'High' },
                        { value: 10, label: 'Peak' }
                      ].map(({ value, label }) => (
                        <div key={value} className="text-center flex-1">
                          <div className={cn(
                            "font-bold text-club-gold transition-all duration-300",
                            viewMode === 'compact' ? "text-sm mb-0.5" : "text-base mb-1"
                          )}>
                            {value}
                          </div>
                          <div className={cn(
                            "transition-all duration-300",
                            viewMode === 'compact' ? "text-xs" : "text-xs",
                            theme === 'dark' ? "text-club-light-gray/80" : "text-gray-600"
                          )}>
                            {label}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Additional info - Only in standard mode */}
                    {viewMode === 'standard' && (
                      <div className={cn(
                        "mt-4 p-3 rounded-lg border text-center",
                        theme === 'dark' 
                          ? "bg-club-dark-gray/30 border-club-gold/20" 
                          : "bg-gray-50 border-club-gold/30"
                      )}>
                        <p className={cn(
                          "text-sm",
                          theme === 'dark' ? "text-club-light-gray/80" : "text-gray-600"
                        )}>
                          <span className="font-medium text-club-gold">Higher values</span> indicate areas of frequent player presence and activity
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
};
