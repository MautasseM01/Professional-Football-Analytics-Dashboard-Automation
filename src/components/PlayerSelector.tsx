
import { useState, useEffect, useMemo, useCallback } from "react";
import { Player } from "@/types";
import { useUserProfile } from "@/hooks/use-user-profile";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Users, 
  User, 
  Search, 
  Filter, 
  ArrowLeft, 
  ArrowRight, 
  Star,
  UserPlus,
  ClipboardList,
  MessageCircle,
  GitCompare,
  AlertTriangle
} from "lucide-react";
import { ErrorFallback } from "@/components/ErrorStates/ErrorFallback";
import { DataLoadingSkeleton } from "@/components/LoadingStates/DataLoadingSkeleton";
import { MultiPlayerSelect } from "./MultiPlayerSelect";
import { toast } from "sonner";

interface PlayerSelectorProps {
  players: Player[];
  selectedPlayer: Player | null;
  onPlayerSelect: (playerId: number) => void;
  loading?: boolean;
  error?: string | null;
}

type FilterStatus = 'all' | 'available' | 'injured' | 'suspended';
type FilterPosition = 'all' | 'goalkeeper' | 'defender' | 'midfielder' | 'forward';

export const PlayerSelector = ({ 
  players, 
  selectedPlayer, 
  onPlayerSelect, 
  loading = false,
  error = null
}: PlayerSelectorProps) => {
  const { profile } = useUserProfile();
  const [selectError, setSelectError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('all');
  const [positionFilter, setPositionFilter] = useState<FilterPosition>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [favorites, setFavorites] = useState<Set<number>>(new Set());
  const [selectedForComparison, setSelectedForComparison] = useState<number[]>([]);

  // Mock status logic - simplified for demo purposes
  const getPlayerStatus = useCallback((player: Player): FilterStatus => {
    // Simple mock logic based on player ID for demo
    const statusMod = player.id % 20;
    if (statusMod === 1 || statusMod === 2) return 'injured';
    if (statusMod === 3) return 'suspended';
    return 'available';
  }, []);

  const getPlayerForm = useCallback((player: Player) => {
    const rating = player.match_rating || 0;
    if (rating >= 7.5) return 'excellent';
    if (rating >= 6.5) return 'good';
    if (rating >= 5.0) return 'average';
    return 'poor';
  }, []);

  // Enhanced filtering logic
  const filteredPlayers = useMemo(() => {
    if (!players?.length) return [];

    return players.filter(player => {
      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesSearch = 
          player.name?.toLowerCase().includes(query) ||
          player.position?.toLowerCase().includes(query) ||
          player.number?.toString().includes(query);
        if (!matchesSearch) return false;
      }

      // Status filter
      if (statusFilter !== 'all') {
        const playerStatus = getPlayerStatus(player);
        if (playerStatus !== statusFilter) return false;
      }

      // Position filter
      if (positionFilter !== 'all') {
        const position = player.position?.toLowerCase() || '';
        switch (positionFilter) {
          case 'goalkeeper':
            if (!position.includes('goalkeeper') && !position.includes('gk')) return false;
            break;
          case 'defender':
            if (!position.includes('defender') && !position.includes('back') && !position.includes('cb') && !position.includes('lb') && !position.includes('rb')) return false;
            break;
          case 'midfielder':
            if (!position.includes('midfielder') && !position.includes('mid') && !position.includes('cm') && !position.includes('dm') && !position.includes('am')) return false;
            break;
          case 'forward':
            if (!position.includes('forward') && !position.includes('striker') && !position.includes('winger') && !position.includes('lw') && !position.includes('rw')) return false;
            break;
        }
      }

      return true;
    });
  }, [players, searchQuery, statusFilter, positionFilter, getPlayerStatus]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!filteredPlayers?.length || !selectedPlayer) return;

      const currentIndex = filteredPlayers.findIndex(p => p.id === selectedPlayer.id);
      
      if (e.key === 'ArrowLeft' && currentIndex > 0) {
        e.preventDefault();
        onPlayerSelect(filteredPlayers[currentIndex - 1].id);
      } else if (e.key === 'ArrowRight' && currentIndex < filteredPlayers.length - 1) {
        e.preventDefault();
        onPlayerSelect(filteredPlayers[currentIndex + 1].id);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [filteredPlayers, selectedPlayer, onPlayerSelect]);

  const handlePlayerSelect = (value: string) => {
    try {
      const playerId = Number(value);
      if (isNaN(playerId)) {
        throw new Error('Invalid player selection');
      }
      onPlayerSelect(playerId);
      setSelectError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to select player';
      setSelectError(errorMessage);
      toast.error(errorMessage);
    }
  };

  const toggleFavorite = (playerId: number) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(playerId)) {
      newFavorites.delete(playerId);
      toast.success("Removed from favorites");
    } else {
      newFavorites.add(playerId);
      toast.success("Added to favorites");
    }
    setFavorites(newFavorites);
  };

  const handleQuickAction = (action: string, player: Player) => {
    switch (action) {
      case 'starting-xi':
        toast.success(`${player.name} would be added to Starting XI`);
        break;
      case 'training-data':
        toast.info(`Training data for ${player.name} would be opened`);
        break;
      case 'contact':
        toast.info(`Contact details for ${player.name} would be opened`);
        break;
      default:
        toast.info(`Action ${action} for ${player.name}`);
    }
  };

  const getStatusColor = (status: FilterStatus) => {
    switch (status) {
      case 'available': return 'bg-green-500';
      case 'injured': return 'bg-red-500';
      case 'suspended': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getFormColor = (form: string) => {
    switch (form) {
      case 'excellent': return 'text-green-500';
      case 'good': return 'text-blue-500';
      case 'average': return 'text-amber-500';
      case 'poor': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const clearFilters = () => {
    setSearchQuery("");
    setStatusFilter('all');
    setPositionFilter('all');
    toast.info("Filters cleared");
  };

  // Handle errors
  if (error) {
    return (
      <ErrorFallback 
        title="Failed to load players"
        description={error}
        className="mb-4"
      />
    );
  }

  // Don't show selector if user is a player
  if (profile?.role === 'player') {
    if (loading) {
      return <DataLoadingSkeleton count={1} />;
    }

    return (
      <Card className="bg-club-black/90 border-club-gold/20 light:bg-white light:border-gray-200">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center text-club-gold light:text-yellow-600 text-lg">
            <User className="mr-2 h-5 w-5" />
            Your Player Profile
          </CardTitle>
        </CardHeader>
        <CardContent>
          {selectedPlayer ? (
            <div className="text-club-light-gray light:text-gray-900">
              <p className="font-medium">{selectedPlayer.name}</p>
              <p className="text-sm text-club-light-gray/70 light:text-gray-600">
                Position: {selectedPlayer.position || 'Not specified'}
              </p>
            </div>
          ) : (
            <p className="text-club-light-gray/70 light:text-gray-600">Loading your profile...</p>
          )}
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return <DataLoadingSkeleton count={1} />;
  }

  if (!players || players.length === 0) {
    return (
      <ErrorFallback 
        title="No players available"
        description="No player data is currently available. Please check back later."
        className="mb-4"
      />
    );
  }

  const currentPlayerIndex = selectedPlayer ? filteredPlayers.findIndex(p => p.id === selectedPlayer.id) : -1;
  const canGoNext = currentPlayerIndex >= 0 && currentPlayerIndex < filteredPlayers.length - 1;
  const canGoPrevious = currentPlayerIndex > 0;

  return (
    <div className="space-y-4">
      <Card className="bg-club-black/90 border-club-gold/20 light:bg-white light:border-gray-200">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between text-club-gold light:text-yellow-600 text-lg">
            <div className="flex items-center">
              <Users className="mr-2 h-5 w-5" />
              Player Selection ({filteredPlayers.length} of {players.length})
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2"
              >
                <Filter className="h-4 w-4" />
                Filters
              </Button>
              {selectedForComparison.length > 1 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toast.info("Player comparison feature coming soon")}
                  className="flex items-center gap-2"
                >
                  <GitCompare className="h-4 w-4" />
                  Compare ({selectedForComparison.length})
                </Button>
              )}
            </div>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {selectError && (
            <div className="mb-3 p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-red-500" />
              <span className="text-red-600 text-sm">{selectError}</span>
            </div>
          )}

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search players by name, position, or number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-club-black/80 light:bg-white border-club-gold/30 light:border-gray-300"
              onKeyDown={(e) => {
                if (e.key === 'Escape') {
                  setSearchQuery('');
                }
              }}
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                onClick={() => setSearchQuery('')}
              >
                ×
              </Button>
            )}
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-club-black/40 light:bg-gray-50 rounded-lg">
              <div>
                <label className="text-sm font-medium text-club-light-gray light:text-gray-700 mb-2 block">
                  Status
                </label>
                <Select value={statusFilter} onValueChange={(value: FilterStatus) => setStatusFilter(value)}>
                  <SelectTrigger className="bg-club-black/80 light:bg-white border-club-gold/30 light:border-gray-300">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Players</SelectItem>
                    <SelectItem value="available">Available</SelectItem>
                    <SelectItem value="injured">Injured</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium text-club-light-gray light:text-gray-700 mb-2 block">
                  Position
                </label>
                <Select value={positionFilter} onValueChange={(value: FilterPosition) => setPositionFilter(value)}>
                  <SelectTrigger className="bg-club-black/80 light:bg-white border-club-gold/30 light:border-gray-300">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Positions</SelectItem>
                    <SelectItem value="goalkeeper">Goalkeeper</SelectItem>
                    <SelectItem value="defender">Defender</SelectItem>
                    <SelectItem value="midfielder">Midfielder</SelectItem>
                    <SelectItem value="forward">Forward</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="md:col-span-2 flex justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearFilters}
                  className="flex items-center gap-2"
                >
                  Clear Filters
                </Button>
              </div>
            </div>
          )}

          {/* Player Selection */}
          <Select 
            value={selectedPlayer?.id?.toString() || ""} 
            onValueChange={handlePlayerSelect}
          >
            <SelectTrigger className="w-full bg-club-black/80 light:bg-white border-club-gold/30 light:border-gray-300 text-club-light-gray light:text-gray-900 hover:border-club-gold/50 light:hover:border-yellow-600/60">
              <SelectValue placeholder="Choose a player" />
            </SelectTrigger>
            <SelectContent className="bg-club-black light:bg-white border-club-gold/30 light:border-gray-200 text-club-light-gray light:text-gray-900 max-h-80">
              {filteredPlayers.length === 0 ? (
                <div className="p-4 text-center text-club-light-gray/70 light:text-gray-600">
                  No players match your current filters
                </div>
              ) : (
                filteredPlayers.map((player) => {
                  if (!player?.id || !player?.name) return null;
                  
                  const isSelected = selectedPlayer?.id === player.id;
                  const playerStatus = getPlayerStatus(player);
                  const playerForm = getPlayerForm(player);
                  const isFavorite = favorites.has(player.id);
                  
                  return (
                    <SelectItem 
                      key={`player-${player.id}`}
                      value={player.id.toString()}
                      className={`
                        relative pl-6 pr-3 py-3 cursor-pointer transition-all duration-200
                        hover:bg-club-gold/20 light:hover:bg-yellow-600/10
                        focus:bg-club-gold/20 light:focus:bg-yellow-600/10
                        data-[highlighted]:bg-club-gold/20 light:data-[highlighted]:bg-yellow-600/10
                        ${isSelected 
                          ? 'bg-club-gold/10 light:bg-yellow-600/10 border-l-4 border-l-club-gold light:border-l-yellow-600' 
                          : 'border-l-4 border-l-transparent'
                        }
                      `}
                    >
                      <div className="flex items-center gap-3">
                        {/* Player Avatar with Status Indicator */}
                        <div className="relative flex-shrink-0">
                          <div className="w-10 h-10 bg-club-gold/20 light:bg-yellow-600/20 rounded-full flex items-center justify-center">
                            <span className="text-sm font-bold text-club-gold light:text-yellow-600">
                              {player.number || '?'}
                            </span>
                          </div>
                          {/* Status indicator */}
                          <div className={`absolute -top-1 -right-1 w-4 h-4 ${getStatusColor(playerStatus)} rounded-full border-2 border-club-black light:border-white`} />
                        </div>
                        
                        {/* Player Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-club-light-gray light:text-gray-900 truncate">{player.name}</span>
                            {isFavorite && <Star className="w-4 h-4 text-yellow-500 fill-current" />}
                            <div className={`w-2 h-2 rounded-full ${getFormColor(playerForm)}`} title={`Form: ${playerForm}`} />
                          </div>
                          <div className="flex items-center gap-2 text-xs text-club-light-gray/70 light:text-gray-600">
                            <span>{player.position}</span>
                            <Badge variant="outline" className={`px-1 py-0 text-xs ${getStatusColor(playerStatus)} text-white border-0`}>
                              {playerStatus}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </SelectItem>
                  );
                })
              )}
            </SelectContent>
          </Select>

          {/* Navigation Controls */}
          {selectedPlayer && filteredPlayers.length > 0 && (
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  if (canGoPrevious) {
                    onPlayerSelect(filteredPlayers[currentPlayerIndex - 1].id);
                  }
                }}
                disabled={!canGoPrevious}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Previous
              </Button>

              <span className="text-sm text-club-light-gray/70 light:text-gray-600 px-4">
                Use ← → keys to navigate
              </span>

              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  if (canGoNext) {
                    onPlayerSelect(filteredPlayers[currentPlayerIndex + 1].id);
                  }
                }}
                disabled={!canGoNext}
                className="flex items-center gap-2"
              >
                Next
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          )}

          {/* Quick Actions for Selected Player */}
          {selectedPlayer && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 p-4 bg-club-black/40 light:bg-gray-50 rounded-lg">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleQuickAction('starting-xi', selectedPlayer)}
                className="flex items-center gap-2"
              >
                <UserPlus className="w-4 h-4" />
                <span className="hidden sm:inline">Add to XI</span>
                <span className="sm:hidden">XI</span>
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleQuickAction('training-data', selectedPlayer)}
                className="flex items-center gap-2"
              >
                <ClipboardList className="w-4 h-4" />
                <span className="hidden sm:inline">Training</span>
                <span className="sm:hidden">Train</span>
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleQuickAction('contact', selectedPlayer)}
                className="flex items-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                <span className="hidden sm:inline">Contact</span>
                <span className="sm:hidden">Call</span>
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => toggleFavorite(selectedPlayer.id)}
                className="flex items-center gap-2"
              >
                <Star className={`w-4 h-4 ${favorites.has(selectedPlayer.id) ? 'text-yellow-500 fill-current' : ''}`} />
                <span className="hidden sm:inline">{favorites.has(selectedPlayer.id) ? 'Unfavorite' : 'Favorite'}</span>
                <span className="sm:hidden">★</span>
              </Button>
            </div>
          )}

          {/* Multi-Select for Comparison */}
          <div className="border-t border-club-gold/20 light:border-gray-200 pt-4">
            <label className="text-sm font-medium text-club-light-gray light:text-gray-700 mb-2 block">
              Select Players for Comparison
            </label>
            <MultiPlayerSelect
              players={filteredPlayers}
              selectedPlayerIds={selectedForComparison}
              onChange={setSelectedForComparison}
              loading={loading}
              maxSelections={4}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
