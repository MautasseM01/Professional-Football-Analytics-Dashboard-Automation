
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PlayerAvatar } from "@/components/PlayerAvatar";
import { Users, Plus, X } from "lucide-react";
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

  const responsiveClasses = {
    headerText: cn("text-base font-semibold", "sm:text-lg", "lg:text-xl"),
    cardPadding: cn("p-3", "sm:p-4", "lg:p-6"),
    fontSize: cn("text-sm", "sm:text-base"),
    iconSize: cn("w-4 h-4", "sm:w-5 sm:h-5")
  };

  if (error) {
    return (
      <Card className={cn("border-red-500/20", theme === 'dark' ? "bg-club-dark-gray/60" : "bg-white/80")}>
        <CardContent className="p-6 text-center">
          <p className="text-red-500">Error loading players: {error.message}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn(
      "border-club-gold/20 overflow-hidden backdrop-blur-sm transition-all duration-300",
      theme === 'dark' ? "bg-club-dark-gray/60" : "bg-white/80",
      "shadow-xl animate-fade-in"
    )}>
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2 sm:gap-3">
          <Users className={cn(responsiveClasses.iconSize, "text-club-gold")} />
          <CardTitle className={cn(
            responsiveClasses.headerText,
            theme === 'dark' ? "text-club-light-gray" : "text-gray-900"
          )}>
            Player Selection
          </CardTitle>
          <Badge variant="outline" className="ml-auto bg-club-gold/10 border-club-gold/30 text-club-gold">
            {selectedPlayers.length}/4 selected
          </Badge>
        </div>
      </CardHeader>

      <CardContent className={responsiveClasses.cardPadding}>
        {/* Selected Players */}
        {selectedPlayers.length > 0 && (
          <div className="mb-6">
            <h3 className={cn(
              "font-medium mb-3",
              responsiveClasses.fontSize,
              theme === 'dark' ? "text-club-light-gray" : "text-gray-800"
            )}>
              Selected Players
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {selectedPlayers.map((player) => (
                <div
                  key={player.id}
                  className={cn(
                    "flex items-center gap-2 p-2 rounded-lg border transition-all duration-200",
                    "bg-club-gold/10 border-club-gold/20 hover:bg-club-gold/20"
                  )}
                >
                  <PlayerAvatar player={player} size="sm" />
                  <div className="flex-1 min-w-0">
                    <div className={cn(
                      "font-medium truncate",
                      "text-sm",
                      theme === 'dark' ? "text-club-light-gray" : "text-gray-900"
                    )}>
                      {player.name}
                    </div>
                    <div className="text-xs text-gray-500 truncate">
                      {player.position} • {player.matches} matches
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onPlayerRemove(player.id)}
                    className="h-6 w-6 p-0 hover:bg-red-500/20 hover:text-red-500"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Available Players */}
        <div>
          <h3 className={cn(
            "font-medium mb-3",
            responsiveClasses.fontSize,
            theme === 'dark' ? "text-club-light-gray" : "text-gray-800"
          )}>
            Available Players
          </h3>

          {isLoading ? (
            <TableLoadingSkeleton rows={4} columns={1} />
          ) : unselectedPlayers.length === 0 ? (
            <p className={cn(
              "text-center py-4",
              "text-sm text-gray-500"
            )}>
              {selectedPlayers.length === 4 
                ? "Maximum players selected" 
                : "No available players"
              }
            </p>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {displayedPlayers.map((player) => (
                  <Button
                    key={player.id}
                    variant="ghost"
                    onClick={() => onPlayerSelect(player)}
                    disabled={selectedPlayers.length >= 4}
                    className={cn(
                      "h-auto p-2 justify-start border transition-all duration-200",
                      "hover:bg-club-gold/10 hover:border-club-gold/30",
                      "disabled:opacity-50 disabled:cursor-not-allowed",
                      theme === 'dark' 
                        ? "border-gray-700 hover:bg-club-gold/20" 
                        : "border-gray-200"
                    )}
                  >
                    <div className="flex items-center gap-2 w-full">
                      <PlayerAvatar player={player} size="sm" />
                      <div className="flex-1 min-w-0 text-left">
                        <div className={cn(
                          "font-medium truncate text-sm",
                          theme === 'dark' ? "text-club-light-gray" : "text-gray-900"
                        )}>
                          {player.name}
                        </div>
                        <div className="text-xs text-gray-500 truncate">
                          {player.position} • {player.matches} matches
                        </div>
                      </div>
                      <Plus className="w-4 h-4 text-club-gold flex-shrink-0" />
                    </div>
                  </Button>
                ))}
              </div>

              {unselectedPlayers.length > displayedPlayers.length && (
                <Button
                  variant="outline"
                  onClick={() => setShowAllPlayers(!showAllPlayers)}
                  className="w-full mt-3 border-club-gold/30 text-club-gold hover:bg-club-gold/10"
                >
                  {showAllPlayers 
                    ? `Show Less` 
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
