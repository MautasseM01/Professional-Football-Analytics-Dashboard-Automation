
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PlayerAvatar } from "@/components/PlayerAvatar";
import { Users, Plus, X, Calendar } from "lucide-react";
import { Player } from "@/types";
import { useTheme } from "@/contexts/ThemeContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { useRealPlayers } from "@/hooks/use-real-players";
import { TableLoadingSkeleton } from "@/components/LoadingStates";

interface PlayerSelectionCardProps {
  selectedPlayers: Player[];
  onPlayerSelect: (player: Player) => void;
  onPlayerRemove: (playerId: number) => void;
}

export const PlayerSelectionCard = ({
  selectedPlayers,
  onPlayerSelect,
  onPlayerRemove
}: PlayerSelectionCardProps) => {
  const { theme } = useTheme();
  const isMobile = useIsMobile();
  const [showAllPlayers, setShowAllPlayers] = useState(false);
  
  const { data: availablePlayers = [], isLoading, error } = useRealPlayers();

  const unselectedPlayers = availablePlayers.filter(
    player => !selectedPlayers.some(selected => selected.id === player.id)
  );

  const displayedPlayers = showAllPlayers 
    ? unselectedPlayers 
    : unselectedPlayers.slice(0, isMobile ? 4 : 6);

  const getPositionBadgeColor = (position: string) => {
    const pos = position.toLowerCase();
    if (pos.includes('forward') || pos.includes('striker') || pos.includes('winger')) {
      return 'bg-red-500/20 text-red-400 border-red-500/30';
    }
    if (pos.includes('midfielder') || pos.includes('mid')) {
      return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    }
    if (pos.includes('defender') || pos.includes('back')) {
      return 'bg-green-500/20 text-green-400 border-green-500/30';
    }
    if (pos.includes('goalkeeper') || pos.includes('keeper')) {
      return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
    }
    return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
  };

  if (error) {
    return (
      <Card className="border-red-500/20 bg-club-dark-gray/80 backdrop-blur-sm">
        <CardContent className="p-6 text-center">
          <p className="text-red-400">Error loading players: {error.message}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-club-gold/20 bg-club-dark-gray/80 backdrop-blur-sm shadow-2xl">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-club-gold/10 border border-club-gold/20">
            <Users className="w-5 h-5 text-club-gold" />
          </div>
          <div className="flex-1">
            <CardTitle className="text-xl font-bold text-club-light-gray">
              Player Selection
            </CardTitle>
            <p className="text-sm text-club-light-gray/60 mt-1">
              Choose up to 4 players for comparison
            </p>
          </div>
          <Badge 
            variant="outline" 
            className="bg-club-gold/10 border-club-gold/30 text-club-gold font-medium px-3 py-1"
          >
            {selectedPlayers.length}/4
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-6 pt-0 space-y-6">
        {/* Selected Players */}
        {selectedPlayers.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-club-light-gray flex items-center gap-2">
              Selected Players
              <div className="h-px bg-club-gold/30 flex-1" />
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {selectedPlayers.map((player) => (
                <div
                  key={player.id}
                  className="group relative p-4 rounded-xl border border-club-gold/30 bg-gradient-to-br from-club-gold/10 to-club-gold/5 hover:from-club-gold/15 hover:to-club-gold/10 transition-all duration-300 hover:shadow-lg hover:shadow-club-gold/20"
                >
                  <div className="flex items-center gap-3">
                    {/* Jersey Number Circle */}
                    <div className="relative">
                      <div className="w-12 h-12 rounded-full bg-club-gold flex items-center justify-center font-bold text-club-black text-lg shadow-lg">
                        {player.number || '?'}
                      </div>
                      <div className="absolute -bottom-1 -right-1">
                        <PlayerAvatar player={player} size="sm" />
                      </div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-bold text-club-light-gray truncate">
                          {player.name}
                        </h4>
                        <Badge 
                          className={cn("text-xs px-2 py-0.5 border", getPositionBadgeColor(player.position))}
                        >
                          {player.position}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-club-light-gray/70">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>{player.matches || 0} matches</span>
                        </div>
                        <span>•</span>
                        <span>{player.goals || 0}G / {player.assists || 0}A</span>
                      </div>
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onPlayerRemove(player.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-500/20 hover:text-red-400 w-8 h-8 p-0"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Available Players */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-club-light-gray flex items-center gap-2">
            Available Players
            <div className="h-px bg-club-light-gray/20 flex-1" />
          </h3>

          {isLoading ? (
            <TableLoadingSkeleton rows={4} columns={1} />
          ) : unselectedPlayers.length === 0 ? (
            <div className="text-center py-8 rounded-xl border border-club-light-gray/10 bg-club-black/20">
              <Users className="w-12 h-12 mx-auto mb-3 text-club-light-gray/40" />
              <p className="text-club-light-gray/60">
                {selectedPlayers.length === 4 
                  ? "Maximum players selected" 
                  : "No available players"
                }
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {displayedPlayers.map((player) => (
                  <button
                    key={player.id}
                    onClick={() => onPlayerSelect(player)}
                    disabled={selectedPlayers.length >= 4}
                    className="group relative p-4 rounded-xl border border-club-light-gray/20 bg-club-black/30 hover:bg-club-black/50 hover:border-club-gold/40 transition-all duration-300 hover:shadow-lg hover:shadow-club-gold/10 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-club-light-gray/20 disabled:hover:bg-club-black/30 text-left"
                  >
                    <div className="flex items-center gap-3">
                      {/* Jersey Number Circle */}
                      <div className="relative">
                        <div className="w-10 h-10 rounded-full bg-club-light-gray/20 group-hover:bg-club-gold/20 flex items-center justify-center font-bold text-club-light-gray group-hover:text-club-gold text-sm transition-colors duration-300">
                          {player.number || '?'}
                        </div>
                        <div className="absolute -bottom-0.5 -right-0.5">
                          <PlayerAvatar player={player} size="sm" />
                        </div>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-club-light-gray group-hover:text-white truncate transition-colors duration-300">
                            {player.name}
                          </h4>
                          <Badge 
                            className={cn("text-xs px-2 py-0.5 border", getPositionBadgeColor(player.position))}
                          >
                            {player.position}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-club-light-gray/60">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            <span>{player.matches || 0} matches</span>
                          </div>
                          <span>•</span>
                          <span>{player.goals || 0}G / {player.assists || 0}A</span>
                        </div>
                      </div>

                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <Plus className="w-5 h-5 text-club-gold" />
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {unselectedPlayers.length > displayedPlayers.length && (
                <Button
                  variant="outline"
                  onClick={() => setShowAllPlayers(!showAllPlayers)}
                  className="w-full mt-4 border-club-gold/30 text-club-gold hover:bg-club-gold/10 hover:border-club-gold/50 transition-all duration-300"
                >
                  {showAllPlayers 
                    ? "Show Less" 
                    : `Show ${unselectedPlayers.length - displayedPlayers.length} More Players`
                  }
                </Button>
              )}
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
