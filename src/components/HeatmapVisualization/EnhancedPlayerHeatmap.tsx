
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff, BarChart3, Activity } from 'lucide-react';
import { Player } from '@/types';
import { PlayerHeatmapSelector } from './PlayerHeatmapSelector';
import { HeatmapZoomControls } from './HeatmapZoomControls';
import { HeatmapTimePeriodFilter, TimePeriod } from './HeatmapTimePeriodFilter';
import { ResponsiveHeatmapCanvas } from './ResponsiveHeatmapCanvas';
import { PlayerAvatar } from '@/components/PlayerAvatar';
import { useIsMobile } from '@/hooks/use-mobile';
import { toast } from '@/hooks/use-toast';

interface EnhancedPlayerHeatmapProps {
  players: Player[];
  selectedPlayer: Player | null;
  onPlayerChange?: (player: Player) => void;
  className?: string;
}

// Mock heatmap data generator
const generateMockHeatmapData = (player: Player, period: TimePeriod) => {
  const points = [];
  const baseIntensity = player.position === 'Forward' ? 0.8 : 
                       player.position === 'Midfielder' ? 0.6 : 0.4;
  
  // Generate position-specific heat patterns
  for (let i = 0; i < 20; i++) {
    let x, y;
    
    if (player.position === 'Forward') {
      x = 0.2 + Math.random() * 0.6; // More attacking areas
      y = 0.1 + Math.random() * 0.4;
    } else if (player.position === 'Midfielder') {
      x = 0.3 + Math.random() * 0.4; // Central areas
      y = 0.3 + Math.random() * 0.4;
    } else { // Defender/Goalkeeper
      x = 0.1 + Math.random() * 0.5; // More defensive areas
      y = 0.6 + Math.random() * 0.3;
    }
    
    points.push({
      x,
      y,
      intensity: baseIntensity * (0.3 + Math.random() * 0.7),
      timestamp: Date.now() - Math.random() * 90 * 60 * 1000 // Last 90 minutes
    });
  }
  
  return points;
};

export const EnhancedPlayerHeatmap = ({
  players,
  selectedPlayer,
  onPlayerChange,
  className = ""
}: EnhancedPlayerHeatmapProps) => {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>('full_match');
  const [showIllustration, setShowIllustration] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [heatmapData, setHeatmapData] = useState<any[]>([]);
  const isMobile = useIsMobile();

  // Generate heatmap data when player or period changes
  useEffect(() => {
    if (selectedPlayer) {
      const data = generateMockHeatmapData(selectedPlayer, selectedPeriod);
      setHeatmapData(data);
    }
  }, [selectedPlayer, selectedPeriod]);

  // Mock match data
  const availableMatches = [
    { id: 'match1', date: '2024-01-15', opponent: 'Barcelona' },
    { id: 'match2', date: '2024-01-10', opponent: 'Real Madrid' },
    { id: 'match3', date: '2024-01-05', opponent: 'Atletico Madrid' },
  ];

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev * 1.2, 3));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev / 1.2, 0.5));
  };

  const handleResetZoom = () => {
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
  };

  const handlePlayerSelect = (player: Player) => {
    onPlayerChange?.(player);
    toast({
      title: "Player Selected",
      description: `Now viewing ${player.name}'s heatmap data`,
    });
  };

  const handlePeriodChange = (period: TimePeriod) => {
    setSelectedPeriod(period);
    toast({
      title: "Time Period Changed",
      description: `Heatmap updated to show ${period.replace('_', ' ')} data`,
    });
  };

  if (!selectedPlayer) {
    return (
      <Card className={`bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-white/20 dark:border-slate-700/20 ${className}`}>
        <CardContent className="flex items-center justify-center min-h-[400px]">
          <div className="text-center space-y-4">
            <Activity size={48} className="mx-auto text-gray-400" />
            <div>
              <p className="text-lg font-medium text-gray-900 dark:text-white">
                No Player Selected
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Select a player to view their heatmap analysis
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-white/20 dark:border-slate-700/20 overflow-hidden ${className}`}>
      <CardHeader className="bg-gradient-to-r from-blue-50/80 to-indigo-50/80 dark:from-slate-800/80 dark:to-slate-700/80 border-b border-white/30 dark:border-slate-600/30">
        <div className="flex flex-col lg:flex-row lg:items-start gap-4">
          {/* Header with player info and illustration toggle */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start gap-4">
              {/* Player illustration - moved to header */}
              {showIllustration && (
                <div className="flex-shrink-0 hidden sm:block">
                  <div className="relative">
                    <PlayerAvatar player={selectedPlayer} size="lg" />
                    <div className="absolute -bottom-1 -right-1 bg-blue-600 text-white text-xs px-1.5 py-0.5 rounded-full font-bold">
                      #{selectedPlayer.number}
                    </div>
                  </div>
                </div>
              )}
              
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white">
                    Player Heatmap Analysis
                  </h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowIllustration(!showIllustration)}
                    className="p-1 h-6 w-6"
                  >
                    {showIllustration ? <EyeOff size={14} /> : <Eye size={14} />}
                  </Button>
                </div>
                
                {/* Player stats summary */}
                <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                  <span className="font-medium">{selectedPlayer.name}</span>
                  <span>•</span>
                  <span>{selectedPlayer.position}</span>
                  <span>•</span>
                  <span>{selectedPlayer.matches} matches</span>
                  <span>•</span>
                  <span>{selectedPlayer.distance}km avg</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Controls section */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 lg:w-80">
            {/* Player selector */}
            <div className="min-w-0 flex-1">
              <PlayerHeatmapSelector
                players={players}
                selectedPlayer={selectedPlayer}
                onPlayerSelect={handlePlayerSelect}
              />
            </div>
            
            {/* Zoom controls */}
            <div className="flex-shrink-0">
              <HeatmapZoomControls
                zoomLevel={zoomLevel}
                onZoomIn={handleZoomIn}
                onZoomOut={handleZoomOut}
                onResetZoom={handleResetZoom}
                onToggleFullscreen={() => setIsFullscreen(!isFullscreen)}
                isFullscreen={isFullscreen}
              />
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4 lg:p-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filters sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            <HeatmapTimePeriodFilter
              selectedPeriod={selectedPeriod}
              onPeriodChange={handlePeriodChange}
              availableMatches={availableMatches}
              selectedMatch="match1"
              onMatchChange={(matchId) => console.log('Selected match:', matchId)}
            />
            
            {/* Performance metrics */}
            <div className="mt-6 space-y-3">
              <h4 className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
                <BarChart3 size={16} />
                Key Metrics
              </h4>
              <div className="grid grid-cols-2 lg:grid-cols-1 gap-3">
                <div className="bg-white/50 dark:bg-slate-800/50 rounded-lg p-3">
                  <div className="text-xs text-gray-500 dark:text-gray-400">Distance</div>
                  <div className="text-lg font-bold text-gray-900 dark:text-white">
                    {selectedPlayer.distance}km
                  </div>
                </div>
                <div className="bg-white/50 dark:bg-slate-800/50 rounded-lg p-3">
                  <div className="text-xs text-gray-500 dark:text-gray-400">Max Speed</div>
                  <div className="text-lg font-bold text-gray-900 dark:text-white">
                    {selectedPlayer.maxSpeed}km/h
                  </div>
                </div>
                <div className="bg-white/50 dark:bg-slate-800/50 rounded-lg p-3">
                  <div className="text-xs text-gray-500 dark:text-gray-400">Sprint Distance</div>
                  <div className="text-lg font-bold text-gray-900 dark:text-white">
                    {selectedPlayer.sprintDistance}km
                  </div>
                </div>
                <div className="bg-white/50 dark:bg-slate-800/50 rounded-lg p-3">
                  <div className="text-xs text-gray-500 dark:text-gray-400">Passes</div>
                  <div className="text-lg font-bold text-gray-900 dark:text-white">
                    {selectedPlayer.passes_completed}/{selectedPlayer.passes_attempted}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Heatmap visualization */}
          <div className="flex-1 min-w-0">
            <ResponsiveHeatmapCanvas
              heatmapData={heatmapData}
              zoomLevel={zoomLevel}
              onZoomChange={setZoomLevel}
              panOffset={panOffset}
              onPanChange={setPanOffset}
              showPlayerIllustration={showIllustration}
              className="w-full"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
