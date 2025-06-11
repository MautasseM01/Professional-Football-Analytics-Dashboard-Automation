
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

interface HeatmapPoint {
  x: number;
  y: number;
  intensity: number;
  timestamp?: number;
}

export const HeatmapCard = ({ player }: HeatmapCardProps) => {
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>('full_match');
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showPlayerIllustration, setShowPlayerIllustration] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [lastPanPoint, setLastPanPoint] = useState({ x: 0, y: 0 });
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const isMobile = useIsMobile();
  
  const { data: heatmapData, loading, error } = useHeatmapData(player, selectedPeriod);

  // Draw football field background
  const drawFootballField = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.clearRect(0, 0, width, height);
    
    ctx.save();
    ctx.translate(width / 2 + panOffset.x, height / 2 + panOffset.y);
    ctx.scale(zoomLevel, zoomLevel);
    ctx.translate(-width / 2, -height / 2);
    
    const fieldWidth = width * 0.9;
    const fieldHeight = height * 0.85;
    const fieldX = (width - fieldWidth) / 2;
    const fieldY = (height - fieldHeight) / 2;
    
    // Enhanced field background
    const gradient = ctx.createLinearGradient(fieldX, fieldY, fieldX, fieldY + fieldHeight);
    gradient.addColorStop(0, theme === 'dark' ? '#0f172a' : '#166534');
    gradient.addColorStop(0.5, theme === 'dark' ? '#1e293b' : '#15803d');
    gradient.addColorStop(1, theme === 'dark' ? '#0f172a' : '#14532d');
    ctx.fillStyle = gradient;
    ctx.fillRect(fieldX, fieldY, fieldWidth, fieldHeight);
    
    // Field markings
    ctx.strokeStyle = '#D4AF37';
    ctx.lineWidth = 3;
    ctx.setLineDash([]);
    
    // Outer boundary
    ctx.strokeRect(fieldX, fieldY, fieldWidth, fieldHeight);
    
    // Center line
    ctx.beginPath();
    ctx.moveTo(fieldX + fieldWidth / 2, fieldY);
    ctx.lineTo(fieldX + fieldWidth / 2, fieldY + fieldHeight);
    ctx.stroke();
    
    // Center circle
    const centerX = fieldX + fieldWidth / 2;
    const centerY = fieldY + fieldHeight / 2;
    const centerRadius = Math.min(fieldWidth, fieldHeight) * 0.08;
    ctx.beginPath();
    ctx.arc(centerX, centerY, centerRadius, 0, Math.PI * 2);
    ctx.stroke();
    
    // Center spot
    ctx.beginPath();
    ctx.arc(centerX, centerY, 4, 0, Math.PI * 2);
    ctx.fillStyle = '#D4AF37';
    ctx.fill();
    
    // Penalty areas
    const penaltyWidth = fieldWidth * 0.14;
    const penaltyHeight = fieldHeight * 0.35;
    const penaltyY = (fieldHeight - penaltyHeight) / 2 + fieldY;
    
    // Left penalty area
    ctx.strokeRect(fieldX, penaltyY, penaltyWidth, penaltyHeight);
    // Right penalty area
    ctx.strokeRect(fieldX + fieldWidth - penaltyWidth, penaltyY, penaltyWidth, penaltyHeight);
    
    // Goal areas
    const goalWidth = fieldWidth * 0.05;
    const goalHeight = fieldHeight * 0.18;
    const goalY = (fieldHeight - goalHeight) / 2 + fieldY;
    
    ctx.strokeRect(fieldX, goalY, goalWidth, goalHeight);
    ctx.strokeRect(fieldX + fieldWidth - goalWidth, goalY, goalWidth, goalHeight);
    
    // Penalty spots
    ctx.beginPath();
    ctx.arc(fieldX + penaltyWidth * 0.7, centerY, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(fieldX + fieldWidth - penaltyWidth * 0.7, centerY, 3, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.restore();
  }, [zoomLevel, panOffset, theme]);

  // Draw heatmap overlay
  const drawHeatmap = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number) => {
    if (!heatmapData.length) return;
    
    ctx.save();
    ctx.translate(width / 2 + panOffset.x, height / 2 + panOffset.y);
    ctx.scale(zoomLevel, zoomLevel);
    ctx.translate(-width / 2, -height / 2);
    
    heatmapData.forEach(point => {
      const x = point.x * width;
      const y = point.y * height;
      const radius = Math.max(25, 45 * point.intensity) * zoomLevel;
      
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
      
      // Enhanced colorblind-friendly color scheme
      if (point.intensity < 0.25) {
        gradient.addColorStop(0, `rgba(37, 99, 235, ${Math.min(point.intensity * 1.2, 0.9)})`);
        gradient.addColorStop(0.7, `rgba(37, 99, 235, ${point.intensity * 0.6})`);
        gradient.addColorStop(1, 'rgba(37, 99, 235, 0)');
      } else if (point.intensity < 0.5) {
        gradient.addColorStop(0, `rgba(6, 182, 212, ${Math.min(point.intensity * 1.2, 0.9)})`);
        gradient.addColorStop(0.7, `rgba(6, 182, 212, ${point.intensity * 0.6})`);
        gradient.addColorStop(1, 'rgba(6, 182, 212, 0)');
      } else if (point.intensity < 0.75) {
        gradient.addColorStop(0, `rgba(212, 175, 55, ${Math.min(point.intensity * 1.2, 0.9)})`);
        gradient.addColorStop(0.7, `rgba(212, 175, 55, ${point.intensity * 0.6})`);
        gradient.addColorStop(1, 'rgba(212, 175, 55, 0)');
      } else {
        gradient.addColorStop(0, `rgba(220, 38, 127, ${Math.min(point.intensity * 1.2, 0.9)})`);
        gradient.addColorStop(0.7, `rgba(220, 38, 127, ${point.intensity * 0.6})`);
        gradient.addColorStop(1, 'rgba(220, 38, 127, 0)');
      }
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    });
    
    ctx.restore();
  }, [heatmapData, zoomLevel, panOffset]);

  // Redraw canvas when data changes
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const { width, height } = canvas;
    drawFootballField(ctx, width, height);
    drawHeatmap(ctx, width, height);
  }, [drawFootballField, drawHeatmap]);

  // Handle mouse events
  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setLastPanPoint({ x: e.clientX, y: e.clientY });
  }, []);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging) return;
    
    const deltaX = e.clientX - lastPanPoint.x;
    const deltaY = e.clientY - lastPanPoint.y;
    
    setPanOffset({
      x: panOffset.x + deltaX,
      y: panOffset.y + deltaY
    });
    
    setLastPanPoint({ x: e.clientX, y: e.clientY });
  }, [isDragging, lastPanPoint, panOffset]);

  const handlePointerUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    const newZoom = Math.min(3, Math.max(0.5, zoomLevel * delta));
    setZoomLevel(newZoom);
  }, [zoomLevel]);

  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev * 1.2, 3));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev / 1.2, 0.5));
  const handleResetZoom = () => {
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
  };

  const availableMatches = [
    { id: 'match1', date: '2024-01-15', opponent: 'Barcelona' },
    { id: 'match2', date: '2024-01-10', opponent: 'Real Madrid' },
    { id: 'match3', date: '2024-01-05', opponent: 'Atletico Madrid' },
  ];

  if (loading) {
    return (
      <Card className={cn(
        "relative overflow-hidden transition-all duration-300",
        theme === 'dark' ? "bg-club-dark-gray/50 border-club-gold/20" : "bg-white/90 border-club-gold/30"
      )}>
        <LoadingOverlay isLoading={loading} />
        <CardContent className="p-6 min-h-[400px]" />
      </Card>
    );
  }

  return (
    <Card className={cn(
      "overflow-hidden transition-all duration-300",
      theme === 'dark' ? "bg-club-dark-gray/50 border-club-gold/20" : "bg-white/90 border-club-gold/30"
    )}>
      <CardHeader className={cn(
        "border-b",
        theme === 'dark' ? "bg-club-black/40 border-club-gold/20" : "bg-blue-50/80 border-club-gold/30"
      )}>
        <div className="flex flex-col lg:flex-row lg:items-start gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-start gap-4">
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
                  "flex items-center gap-4 text-sm",
                  theme === 'dark' ? "text-club-light-gray/70" : "text-gray-600"
                )}>
                  <span className="font-medium text-club-gold">{player.name}</span>
                  <span>•</span>
                  <span>{player.position}</span>
                  <span>•</span>
                  <span>{player.matches} matches</span>
                  <span>•</span>
                  <span>{player.distance}km avg</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Controls */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 lg:w-80">
            <div className="min-w-0 flex-1">
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
                  <SelectItem value="full_match" className="hover:bg-club-gold/20 focus:bg-club-gold/30 font-medium">Full Match</SelectItem>
                  <SelectItem value="first_half" className="hover:bg-club-gold/20 focus:bg-club-gold/30 font-medium">First Half</SelectItem>
                  <SelectItem value="second_half" className="hover:bg-club-gold/20 focus:bg-club-gold/30 font-medium">Second Half</SelectItem>
                  <SelectItem value="last_15min" className="hover:bg-club-gold/20 focus:bg-club-gold/30 font-medium">Last 15 min</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* Zoom controls */}
            <div className="flex items-center gap-2">
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
                "px-3 py-1.5 border-2 rounded-md backdrop-blur-sm",
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
        </div>
      </CardHeader>

      <CardContent className={cn(
        "p-4 lg:p-6",
        theme === 'dark' ? "bg-club-black/20" : "bg-gradient-to-br from-slate-50/80 to-blue-50/80"
      )}>
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar with metrics */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="space-y-4">
              <h4 className={cn(
                "font-medium flex items-center gap-2",
                theme === 'dark' ? "text-club-light-gray" : "text-gray-900"
              )}>
                <BarChart3 size={16} className="text-club-gold" />
                Key Metrics
              </h4>
              <div className="grid grid-cols-2 lg:grid-cols-1 gap-3">
                <div className={cn(
                  "rounded-lg p-3 border border-club-gold/20",
                  theme === 'dark' ? "bg-club-black/30" : "bg-white/50"
                )}>
                  <div className={cn(
                    "text-xs",
                    theme === 'dark' ? "text-club-light-gray/70" : "text-gray-500"
                  )}>Distance</div>
                  <div className={cn(
                    "text-lg font-bold text-club-gold"
                  )}>
                    {player.distance}km
                  </div>
                </div>
                <div className={cn(
                  "rounded-lg p-3 border border-club-gold/20",
                  theme === 'dark' ? "bg-club-black/30" : "bg-white/50"
                )}>
                  <div className={cn(
                    "text-xs",
                    theme === 'dark' ? "text-club-light-gray/70" : "text-gray-500"
                  )}>Max Speed</div>
                  <div className="text-lg font-bold text-club-gold">
                    {player.maxSpeed}km/h
                  </div>
                </div>
                <div className={cn(
                  "rounded-lg p-3 border border-club-gold/20",
                  theme === 'dark' ? "bg-club-black/30" : "bg-white/50"
                )}>
                  <div className={cn(
                    "text-xs",
                    theme === 'dark' ? "text-club-light-gray/70" : "text-gray-500"
                  )}>Sprint Distance</div>
                  <div className="text-lg font-bold text-club-gold">
                    {player.sprintDistance}km
                  </div>
                </div>
                <div className={cn(
                  "rounded-lg p-3 border border-club-gold/20",
                  theme === 'dark' ? "bg-club-black/30" : "bg-white/50"
                )}>
                  <div className={cn(
                    "text-xs",
                    theme === 'dark' ? "text-club-light-gray/70" : "text-gray-500"
                  )}>Passes</div>
                  <div className="text-lg font-bold text-club-gold">
                    {player.passes_completed}/{player.passes_attempted}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Heatmap visualization */}
          <div className="flex-1 min-w-0">
            <div 
              ref={containerRef}
              className={cn(
                "relative rounded-2xl overflow-hidden shadow-xl border-2",
                theme === 'dark' 
                  ? "bg-gradient-to-br from-slate-900 to-slate-800 border-club-gold/30" 
                  : "bg-gradient-to-br from-slate-100 to-slate-200 border-club-gold/40"
              )}
              style={{ 
                aspectRatio: isMobile ? '4/3' : '16/10',
                minHeight: isMobile ? '250px' : '400px',
                touchAction: 'none'
              }}
            >
              <canvas
                ref={canvasRef}
                width={800}
                height={isMobile ? 600 : 500}
                className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing"
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onWheel={handleWheel}
                style={{ touchAction: 'none' }}
              />
              
              {/* Mobile controls hint */}
              {isMobile && (
                <div className={cn(
                  "absolute top-3 right-3 px-4 py-3 rounded-xl shadow-lg border-2 backdrop-blur-md",
                  theme === 'dark'
                    ? "bg-club-black/95 text-club-light-gray border-club-gold/30"
                    : "bg-white/95 text-slate-900 border-club-gold/40"
                )}>
                  <span className="text-sm font-semibold">Pinch to zoom • Drag to pan</span>
                </div>
              )}
              
              {/* Activity legend */}
              <div className={cn(
                "absolute bottom-3 left-3 rounded-xl p-4 shadow-xl border-2 backdrop-blur-md",
                theme === 'dark'
                  ? "bg-club-black/95 border-club-gold/30"
                  : "bg-white/95 border-club-gold/40"
              )}>
                <div className={cn(
                  "text-sm font-bold mb-3 flex items-center gap-2",
                  theme === 'dark' ? "text-club-light-gray" : "text-slate-900"
                )}>
                  Activity Intensity
                  <div className="w-2 h-2 rounded-full bg-club-gold"></div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-4 bg-gradient-to-r from-blue-600 to-blue-500 rounded-sm shadow-md border border-blue-300"></div>
                    <span className={cn(
                      "text-xs font-medium",
                      theme === 'dark' ? "text-club-light-gray/80" : "text-slate-700"
                    )}>Low</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-4 bg-gradient-to-r from-cyan-600 to-cyan-500 rounded-sm shadow-md border border-cyan-300"></div>
                    <span className={cn(
                      "text-xs font-medium",
                      theme === 'dark' ? "text-club-light-gray/80" : "text-slate-700"
                    )}>Medium</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-4 bg-gradient-to-r from-yellow-600 to-yellow-500 rounded-sm shadow-md border border-yellow-300"></div>
                    <span className={cn(
                      "text-xs font-medium",
                      theme === 'dark' ? "text-club-light-gray/80" : "text-slate-700"
                    )}>High</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-4 bg-gradient-to-r from-pink-600 to-pink-500 rounded-sm shadow-md border border-pink-300"></div>
                    <span className={cn(
                      "text-xs font-medium",
                      theme === 'dark' ? "text-club-light-gray/80" : "text-slate-700"
                    )}>Peak</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
