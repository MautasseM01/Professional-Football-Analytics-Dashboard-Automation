
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TouchFeedbackButton } from '@/components/TouchFeedbackButton';
import { Badge } from '@/components/ui/badge';
import { useSwipeGestures } from '@/hooks/use-swipe-gestures';
import { useHapticFeedback } from '@/hooks/use-haptic-feedback';
import { useDeviceCapabilities } from '@/hooks/use-orientation';
import { PlayerAvatar } from '@/components/PlayerAvatar';
import { 
  Star, 
  Eye, 
  Download, 
  Filter,
  Search,
  ChevronLeft,
  ChevronRight,
  Zap,
  Wifi,
  WifiOff
} from 'lucide-react';
import { toast } from 'sonner';

interface Player {
  id: number;
  name: string;
  position: string;
  rating: number;
  status: 'available' | 'injured' | 'suspended';
  marketValue: number;
  developmentROI: number;
  watchList: boolean;
}

export const EnhancedPlayerPerformanceMonitor = () => {
  const [selectedPlayers, setSelectedPlayers] = useState<Player[]>([]);
  const [currentView, setCurrentView] = useState(0);
  const [filterMode, setFilterMode] = useState('all');
  const { triggerHaptic } = useHapticFeedback();
  const { isOnline, hasVibration } = useDeviceCapabilities();

  // Mock player data
  const players: Player[] = [
    { id: 1, name: 'Marcus Johnson', position: 'Midfielder', rating: 9.2, status: 'available', marketValue: 25000000, developmentROI: 156, watchList: true },
    { id: 2, name: 'Alex Rodriguez', position: 'Forward', rating: 9.0, status: 'available', marketValue: 30000000, developmentROI: 142, watchList: false },
    { id: 3, name: 'David Chen', position: 'Defender', rating: 8.8, status: 'injured', marketValue: 18000000, developmentROI: 128, watchList: true },
    { id: 4, name: 'James Wilson', position: 'Goalkeeper', rating: 8.5, status: 'available', marketValue: 15000000, developmentROI: 134, watchList: false },
  ];

  const views = ['Grid View', 'List View', 'Performance View'];

  const { swipeProps } = useSwipeGestures({
    onSwipeLeft: () => {
      if (currentView < views.length - 1) {
        setCurrentView(currentView + 1);
        triggerHaptic('light');
      }
    },
    onSwipeRight: () => {
      if (currentView > 0) {
        setCurrentView(currentView - 1);
        triggerHaptic('light');
      }
    },
    threshold: 100
  });

  const handlePlayerSelect = (player: Player) => {
    const isSelected = selectedPlayers.find(p => p.id === player.id);
    
    if (isSelected) {
      setSelectedPlayers(selectedPlayers.filter(p => p.id !== player.id));
    } else if (selectedPlayers.length < 4) {
      setSelectedPlayers([...selectedPlayers, player]);
    } else {
      toast.error('Maximum 4 players can be selected');
    }
    
    triggerHaptic('light');
  };

  const toggleWatchList = (playerId: number) => {
    triggerHaptic('medium');
    toast.success('Watch list updated');
  };

  const exportData = () => {
    triggerHaptic('medium');
    toast.success('Performance data exported');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'text-green-500 bg-green-500/10 border-green-500/30';
      case 'injured': return 'text-red-500 bg-red-500/10 border-red-500/30';
      case 'suspended': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/30';
      default: return 'text-gray-500 bg-gray-500/10 border-gray-500/30';
    }
  };

  const renderPlayerCard = (player: Player, compact = false) => (
    <Card 
      key={player.id}
      className={`bg-club-dark-gray/80 backdrop-blur-sm border-club-gold/20 cursor-pointer transition-all duration-200 ios-touch-feedback ${
        selectedPlayers.find(p => p.id === player.id) ? 'ring-2 ring-club-gold/50 border-club-gold/50' : ''
      }`}
      onClick={() => handlePlayerSelect(player)}
    >
      <CardContent className={compact ? 'p-3' : 'p-4'}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <PlayerAvatar player={player} size={compact ? 'sm' : 'md'} />
            <div>
              <h4 className={`font-medium text-club-light-gray ${compact ? 'text-sm' : ''}`}>
                {player.name}
              </h4>
              <p className={`text-club-light-gray/70 ${compact ? 'text-xs' : 'text-sm'}`}>
                {player.position}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className={getStatusColor(player.status)}>
              {player.status}
            </Badge>
            {player.watchList && (
              <TouchFeedbackButton
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 text-club-gold"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleWatchList(player.id);
                }}
              >
                <Star className="h-3 w-3 fill-current" />
              </TouchFeedbackButton>
            )}
          </div>
        </div>

        {!compact && (
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="text-center">
              <div className="font-bold text-club-gold text-lg">{player.rating}</div>
              <div className="text-club-light-gray/70">Rating</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-green-500">€{(player.marketValue / 1000000).toFixed(1)}M</div>
              <div className="text-club-light-gray/70">Value</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-blue-500">{player.developmentROI}%</div>
              <div className="text-club-light-gray/70">ROI</div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6" {...swipeProps}>
      {/* Enhanced Header */}
      <Card className="bg-club-dark-gray/80 backdrop-blur-sm border-club-gold/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center text-club-gold">
              <Eye className="mr-2 h-5 w-5" />
              Player Performance Monitor
              {!isOnline && <WifiOff className="ml-2 h-4 w-4 text-red-500" />}
            </CardTitle>
            <div className="flex gap-2">
              {hasVibration && (
                <TouchFeedbackButton
                  variant="outline"
                  size="sm"
                  className="border-club-gold/30"
                  onClick={() => triggerHaptic('heavy')}
                >
                  <Zap className="h-4 w-4" />
                </TouchFeedbackButton>
              )}
              <TouchFeedbackButton
                variant="outline"
                size="sm"
                onClick={exportData}
                className="border-club-gold/30"
              >
                <Download className="h-4 w-4" />
              </TouchFeedbackButton>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* View Toggle */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <TouchFeedbackButton
                variant="ghost"
                size="sm"
                onClick={() => {
                  if (currentView > 0) {
                    setCurrentView(currentView - 1);
                    triggerHaptic('light');
                  }
                }}
                disabled={currentView === 0}
              >
                <ChevronLeft className="h-4 w-4" />
              </TouchFeedbackButton>
              
              <span className="text-sm font-medium text-club-light-gray min-w-[100px] text-center">
                {views[currentView]}
              </span>
              
              <TouchFeedbackButton
                variant="ghost"
                size="sm"
                onClick={() => {
                  if (currentView < views.length - 1) {
                    setCurrentView(currentView + 1);
                    triggerHaptic('light');
                  }
                }}
                disabled={currentView === views.length - 1}
              >
                <ChevronRight className="h-4 w-4" />
              </TouchFeedbackButton>
            </div>

            {/* Filter Toggle */}
            <div className="flex gap-2">
              {['all', 'available', 'watch'].map((filter) => (
                <TouchFeedbackButton
                  key={filter}
                  variant={filterMode === filter ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => {
                    setFilterMode(filter);
                    triggerHaptic('light');
                  }}
                  className={filterMode === filter ? 'bg-club-gold text-club-black' : 'border-club-gold/30'}
                >
                  {filter === 'all' && <Filter className="h-3 w-3 mr-1" />}
                  {filter === 'available' && <Eye className="h-3 w-3 mr-1" />}
                  {filter === 'watch' && <Star className="h-3 w-3 mr-1" />}
                  {filter.charAt(0).toUpperCase() + filter.slice(1)}
                </TouchFeedbackButton>
              ))}
            </div>
          </div>

          {/* Selected Players */}
          {selectedPlayers.length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-medium text-club-light-gray mb-2">
                Selected Players ({selectedPlayers.length}/4)
              </h4>
              <div className="flex flex-wrap gap-2">
                {selectedPlayers.map(player => (
                  <Badge
                    key={player.id}
                    className="bg-club-gold/20 text-club-light-gray border-club-gold/30 px-3 py-1.5"
                  >
                    {player.name}
                    <TouchFeedbackButton
                      variant="ghost"
                      size="sm"
                      className="h-4 w-4 p-0 ml-2 hover:bg-red-500/20"
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePlayerSelect(player);
                      }}
                    >
                      ×
                    </TouchFeedbackButton>
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Player Display */}
      <div className={
        currentView === 0 ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' :
        currentView === 1 ? 'space-y-3' :
        'grid grid-cols-1 lg:grid-cols-2 gap-6'
      }>
        {players
          .filter(player => {
            if (filterMode === 'available') return player.status === 'available';
            if (filterMode === 'watch') return player.watchList;
            return true;
          })
          .map(player => renderPlayerCard(player, currentView === 1))
        }
      </div>

      {/* Offline Mode Indicator */}
      {!isOnline && (
        <Card className="bg-amber-500/10 border-amber-500/30">
          <CardContent className="p-4 flex items-center gap-3">
            <WifiOff className="h-5 w-5 text-amber-500" />
            <div>
              <h4 className="font-medium text-amber-500">Offline Mode</h4>
              <p className="text-amber-400 text-sm">Some features may be limited. Data will sync when connection is restored.</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
