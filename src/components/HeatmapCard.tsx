
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
  BarChart3,
  TrendingUp
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

  const handleFullscreen = () => {
    if (!isFullscreen) {
      // Enter fullscreen
      if (containerRef.current?.requestFullscreen) {
        containerRef.current.requestFullscreen();
      }
    } else {
      // Exit fullscreen
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
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 w-full">
            {/* Time Period Selector - Left Side on desktop, top on mobile */}
            <div className="w-full lg:w-64">
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

            {/* Zoom Controls - Uniform sizing and spacing */}
            <div className="flex items-center gap-2 w-full lg:w-auto">
              <Button
                variant="outline"
                onClick={handleZoomOut}
                disabled={zoomLevel <= 0.5}
                className={cn(
                  "border-2 transition-all backdrop-blur-sm w-12 h-10",
                  theme === 'dark'
                    ? "bg-club-black/50 border-club-gold/30 hover:border-club-gold/50 text-club-light-gray"
                    : "bg-white/90 border-club-gold/40 hover:border-club-gold/60 text-gray-900"
                )}
              >
                <ZoomOut size={16} />
              </Button>

              <Button
                variant="outline"
                disabled
                className={cn(
                  "border-2 transition-all backdrop-blur-sm w-12 h-10",
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
                  "border-2 transition-all backdrop-blur-sm w-12 h-10",
                  theme === 'dark'
                    ? "bg-club-black/50 border-club-gold/30 hover:border-club-gold/50 text-club-light-gray"
                    : "bg-white/90 border-club-gold/40 hover:border-club-gold/60 text-gray-900"
                )}
              >
                <ZoomIn size={16} />
              </Button>

              <Button
                variant="outline"
                onClick={handleResetZoom}
                className={cn(
                  "border-2 transition-all backdrop-blur-sm w-12 h-10",
                  theme === 'dark'
                    ? "bg-club-black/50 border-club-gold/30 hover:border-club-gold/50 text-club-light-gray"
                    : "bg-white/90 border-club-gold/40 hover:border-club-gold/60 text-gray-900"
                )}
              >
                <RotateCcw size={16} />
              </Button>

              <Button
                variant="outline"
                onClick={handleFullscreen}
                className={cn(
                  "border-2 transition-all backdrop-blur-sm w-12 h-10",
                  theme === 'dark'
                    ? "bg-club-black/50 border-club-gold/30 hover:border-club-gold/50 text-club-light-gray"
                    : "bg-white/90 border-club-gold/40 hover:border-club-gold/60 text-gray-900"
                )}
              >
                {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
              </Button>
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
          </div>

          {/* Professional Activity Intensity Legend - Full Width */}
          <div className={cn(
            "w-full rounded-2xl border-2 shadow-lg backdrop-blur-md",
            theme === 'dark'
              ? "bg-club-black/80 border-club-gold/30"
              : "bg-white/90 border-club-gold/40"
          )}>
            <div className="p-4 lg:p-6">
              {/* Legend Header */}
              <div className="flex items-center gap-3 mb-4">
                <div className={cn(
                  "p-2 rounded-lg border",
                  theme === 'dark' 
                    ? "bg-club-gold/20 border-club-gold/30" 
                    : "bg-club-gold/10 border-club-gold/40"
                )}>
                  <TrendingUp className="w-5 h-5 text-club-gold" />
                </div>
                <div>
                  <h4 className={cn(
                    "text-lg font-bold",
                    theme === 'dark' ? "text-club-light-gray" : "text-gray-900"
                  )}>
                    Activity Intensity Scale
                  </h4>
                  <p className={cn(
                    "text-sm",
                    theme === 'dark' ? "text-club-light-gray/70" : "text-gray-600"
                  )}>
                    Player movement density and engagement level across field zones
                  </p>
                </div>
              </div>

              {/* Horizontal Gradient Bar */}
              <div className="space-y-3">
                <div className="relative">
                  {/* Main gradient bar */}
                  <div 
                    className="w-full h-8 rounded-lg border-2 border-club-gold/30 shadow-inner relative overflow-hidden"
                    style={{
                      background: theme === 'dark' 
                        ? 'linear-gradient(to right, #1a1a1a 0%, #2d4a22 20%, #4a7c59 40%, #d4af37 60%, #f59e0b 80%, #dc2626 100%)'
                        : 'linear-gradient(to right, #f8fafc 0%, #86efac 20%, #65a3d9 40%, #d4af37 60%, #f59e0b 80%, #dc2626 100%)'
                    }}
                  >
                    {/* Subtle overlay for depth */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
                  </div>
                  
                  {/* Scale markers */}
                  <div className="absolute inset-0 flex justify-between items-center px-1">
                    {[0, 2, 4, 6, 8, 10].map((value, index) => (
                      <div key={value} className="relative">
                        <div className={cn(
                          "w-0.5 h-6 rounded-full",
                          theme === 'dark' ? "bg-club-light-gray/40" : "bg-gray-700/40"
                        )}></div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Scale labels */}
                <div className="flex justify-between items-center text-sm font-medium">
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
                        "font-bold text-club-gold text-base mb-1"
                      )}>
                        {value}
                      </div>
                      <div className={cn(
                        "text-xs",
                        theme === 'dark' ? "text-club-light-gray/80" : "text-gray-600"
                      )}>
                        {label}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Additional info */}
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
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
