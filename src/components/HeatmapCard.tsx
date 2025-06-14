import { useState, useRef, useEffect, useCallback } from "react";
import { Player } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Maximize2, 
  Minimize2, 
  Activity,
  Eye,
  EyeOff,
  BarChart3
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

export const HeatmapCard = ({ player }: HeatmapCardProps) => {
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>('full_match');
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showPlayerIllustration, setShowPlayerIllustration] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [lastPanPoint, setLastPanPoint] = useState({ x: 0, y: 0 });
  
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const isMobile = useIsMobile();
  
  const { data: heatmapData, loading, error } = useHeatmapData(player, selectedPeriod);

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
    <Card className={cn(
      "overflow-hidden transition-all duration-300 w-full",
      theme === 'dark' ? "bg-club-dark-gray/50 border-club-gold/20" : "bg-white/90 border-club-gold/30"
    )}>
      {/* Header Section - Full Width */}
      <CardHeader className={cn(
        "border-b pb-4 w-full",
        theme === 'dark' ? "bg-club-black/40 border-club-gold/20" : "bg-blue-50/80 border-club-gold/30"
      )}>
        <div className="flex flex-col space-y-4 w-full">
          {/* Title and Player Info Row */}
          <div className="flex items-start justify-between gap-4 w-full">
            <div className="flex items-start gap-4 min-w-0 flex-1">
              {showPlayerIllustration && (
                <div className="flex-shrink-0 hidden sm:block">
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
                    "font-bold tracking-tight flex items-center gap-2",
                    isMobile ? "text-lg" : "text-xl lg:text-2xl",
                    theme === 'dark' ? "text-club-light-gray" : "text-gray-900"
                  )}>
                    <Activity className="w-5 h-5 text-club-gold" />
                    Player Heatmap Analysis
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowPlayerIllustration(!showPlayerIllustration)}
                    className="p-1 h-6 w-6 hover:bg-club-gold/20"
                  >
                    {showPlayerIllustration ? <EyeOff size={14} /> : <Eye size={14} />}
                  </Button>
                </div>
                
                <div className={cn(
                  "flex flex-wrap items-center gap-2 text-sm",
                  theme === 'dark' ? "text-club-light-gray/70" : "text-gray-600"
                )}>
                  <span className="font-medium text-club-gold">{player.name}</span>
                  <span className="hidden sm:inline">•</span>
                  <span>{player.position}</span>
                  <span className="hidden sm:inline">•</span>
                  <span>{player.matches} matches</span>
                  <span className="hidden sm:inline">•</span>
                  <span>{player.distance}km avg</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className={cn(
        "p-4 lg:p-6 space-y-6 w-full",
        theme === 'dark' ? "bg-club-black/20" : "bg-gradient-to-br from-slate-50/80 to-blue-50/80"
      )}>
        {/* Key Metrics Section - Full Width */}
        <div className="space-y-3 w-full">
          <h4 className={cn(
            "font-medium flex items-center gap-2 text-base",
            theme === 'dark' ? "text-club-light-gray" : "text-gray-900"
          )}>
            <BarChart3 size={16} className="text-club-gold" />
            Key Metrics
          </h4>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 w-full">
            <div className={cn(
              "rounded-lg p-3 border border-club-gold/20 text-center",
              theme === 'dark' ? "bg-club-black/30" : "bg-white/50"
            )}>
              <div className={cn(
                "text-xs mb-1",
                theme === 'dark' ? "text-club-light-gray/70" : "text-gray-500"
              )}>Distance</div>
              <div className="text-lg font-bold text-club-gold">
                {player.distance}km
              </div>
            </div>
            <div className={cn(
              "rounded-lg p-3 border border-club-gold/20 text-center",
              theme === 'dark' ? "bg-club-black/30" : "bg-white/50"
            )}>
              <div className={cn(
                "text-xs mb-1",
                theme === 'dark' ? "text-club-light-gray/70" : "text-gray-500"
              )}>Max Speed</div>
              <div className="text-lg font-bold text-club-gold">
                {player.maxSpeed}km/h
              </div>
            </div>
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
          </div>
        </div>

        {/* Heatmap with Controls Section */}
        <div className="space-y-4 w-full">
          {/* Time Period Selector and Zoom Controls */}
          <div className="flex items-center justify-between gap-3 w-full">
            {/* Time Period Selector - Left Side */}
            <div className="w-full sm:w-64">
              <Select value={selectedPeriod} onValueChange={(value) => setSelectedPeriod(value as TimePeriod)}>
                <SelectTrigger className={cn(
                  "border-2 focus:ring-2 focus:ring-club-gold shadow-lg backdrop-blur-sm font-medium",
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

            {/* Zoom Controls - Right Side */}
            <div className="flex items-center gap-2 flex-wrap">
              <Button
                variant="outline"
                size={isMobile ? "sm" : "default"}
                onClick={handleZoomOut}
                disabled={zoomLevel <= 0.5}
                className={cn(
                  "border-2 transition-all backdrop-blur-sm",
                  theme === 'dark'
                    ? "bg-club-black/50 border-club-gold/30 hover:border-club-gold/50 text-club-light-gray"
                    : "bg-white/90 border-club-gold/40 hover:border-club-gold/60 text-gray-900"
                )}
              >
                <ZoomOut size={isMobile ? 14 : 16} />
              </Button>

              <div className={cn(
                "px-3 py-1.5 border-2 rounded-md backdrop-blur-sm min-w-[60px] text-center",
                theme === 'dark'
                  ? "bg-club-black/50 border-club-gold/30 text-club-light-gray"
                  : "bg-white/90 border-club-gold/40 text-gray-900"
              )}>
                <span className="text-sm font-medium">
                  {Math.round(zoomLevel * 100)}%
                </span>
              </div>

              <Button
                variant="outline"
                size={isMobile ? "sm" : "default"}
                onClick={handleZoomIn}
                disabled={zoomLevel >= 3}
                className={cn(
                  "border-2 transition-all backdrop-blur-sm",
                  theme === 'dark'
                    ? "bg-club-black/50 border-club-gold/30 hover:border-club-gold/50 text-club-light-gray"
                    : "bg-white/90 border-club-gold/40 hover:border-club-gold/60 text-gray-900"
                )}
              >
                <ZoomIn size={isMobile ? 14 : 16} />
              </Button>

              <Button
                variant="outline"
                size={isMobile ? "sm" : "default"}
                onClick={handleResetZoom}
                className={cn(
                  "border-2 transition-all backdrop-blur-sm",
                  theme === 'dark'
                    ? "bg-club-black/50 border-club-gold/30 hover:border-club-gold/50 text-club-light-gray"
                    : "bg-white/90 border-club-gold/40 hover:border-club-gold/60 text-gray-900"
                )}
              >
                <RotateCcw size={isMobile ? 14 : 16} />
              </Button>

              {!isMobile && (
                <Button
                  variant="outline"
                  size="default"
                  onClick={() => setIsFullscreen(!isFullscreen)}
                  className={cn(
                    "border-2 transition-all backdrop-blur-sm",
                    theme === 'dark'
                      ? "bg-club-black/50 border-club-gold/30 hover:border-club-gold/50 text-club-light-gray"
                      : "bg-white/90 border-club-gold/40 hover:border-club-gold/60 text-gray-900"
                  )}
                >
                  {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                </Button>
              )}
            </div>
          </div>

          {/* Heatmap Visualization Container */}
          <div 
            ref={containerRef}
            className={cn(
              "relative rounded-2xl overflow-hidden shadow-xl border-2 select-none w-full",
              theme === 'dark' 
                ? "bg-gradient-to-br from-slate-900 to-slate-800 border-club-gold/30" 
                : "bg-gradient-to-br from-slate-100 to-slate-200 border-club-gold/40"
            )}
            style={{ 
              aspectRatio: isMobile ? '4/3' : '16/10',
              minHeight: isMobile ? '300px' : '500px'
            }}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onWheel={handleWheel}
          >
            {/* Heatmap Image */}
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
            
            {/* Mobile Touch Hint - Positioned to not block image */}
            {isMobile && (
              <div className={cn(
                "absolute top-2 right-2 px-2 py-1 rounded-lg shadow-lg border backdrop-blur-md text-xs",
                theme === 'dark'
                  ? "bg-club-black/80 text-club-light-gray border-club-gold/30"
                  : "bg-white/80 text-slate-900 border-club-gold/40"
              )}>
                <span className="font-medium">Pinch to zoom • Drag to pan</span>
              </div>
            )}
            
            {/* Activity Intensity Scale - Updated to 0-10 numerical scale */}
            <div className={cn(
              "absolute bottom-2 left-2 rounded-xl p-3 shadow-xl border backdrop-blur-md",
              theme === 'dark'
                ? "bg-club-black/80 border-club-gold/30"
                : "bg-white/80 border-club-gold/40"
            )}>
              <div className={cn(
                "text-xs font-bold mb-2 flex items-center gap-1",
                theme === 'dark' ? "text-club-light-gray" : "text-slate-900"
              )}>
                Activity Intensity
                <div className="w-1 h-1 rounded-full bg-club-gold"></div>
              </div>
              <div className="flex items-center gap-2">
                {/* Vertical Scale Bar */}
                <div className="flex flex-col items-center">
                  <div className="h-16 w-4 rounded-lg border border-gray-300 relative overflow-hidden"
                       style={{
                         background: 'linear-gradient(to top, #22c55e 0%, #84cc16 20%, #eab308 40%, #f59e0b 60%, #ef4444 80%, #dc2626 100%)'
                       }}>
                  </div>
                </div>
                {/* Scale Numbers */}
                <div className="flex flex-col justify-between h-16 text-xs font-medium">
                  <span className={cn(
                    theme === 'dark' ? "text-club-light-gray/80" : "text-slate-700"
                  )}>10</span>
                  <span className={cn(
                    theme === 'dark' ? "text-club-light-gray/80" : "text-slate-700"
                  )}>8</span>
                  <span className={cn(
                    theme === 'dark' ? "text-club-light-gray/80" : "text-slate-700"
                  )}>6</span>
                  <span className={cn(
                    theme === 'dark' ? "text-club-light-gray/80" : "text-slate-700"
                  )}>4</span>
                  <span className={cn(
                    theme === 'dark' ? "text-club-light-gray/80" : "text-slate-700"
                  )}>2</span>
                  <span className={cn(
                    theme === 'dark' ? "text-club-light-gray/80" : "text-slate-700"
                  )}>0</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
