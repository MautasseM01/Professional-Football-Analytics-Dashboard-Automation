
import { useState } from "react";
import { Player } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Users, TrendingUp } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { PlayerAvatar } from "./PlayerAvatar";
import { IOSLoadingState } from "./IOSLoadingState";

interface PlayerSelectorProps {
  players: Player[];
  selectedPlayer: Player | null;
  onPlayerSelect: (player: Player) => void; // Changed from (playerId: number) => void
  loading?: boolean;
  error?: string | null;
}

export const PlayerSelector = ({ 
  players, 
  selectedPlayer, 
  onPlayerSelect, 
  loading = false,
  error = null
}: PlayerSelectorProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const isMobile = useIsMobile();

  // Filter players based on search term
  const filteredPlayers = players.filter(player =>
    player.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    player.position.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlePlayerSelect = (playerId: string) => {
    const player = players.find(p => p.id.toString() === playerId);
    if (player) {
      onPlayerSelect(player); // Pass the full player object
    }
  };

  if (error) {
    return (
      <Card className="bg-club-dark-gray border-club-gold/20 light:bg-white light:border-gray-200">
        <CardContent className="p-6 text-center">
          <p className="text-red-400 light:text-red-600">Error loading players: {error}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-club-dark-gray border-club-gold/20 light:bg-white light:border-gray-200">
      <CardHeader className="p-4 sm:p-5 lg:p-6">
        <CardTitle className="flex items-center gap-2 text-club-gold light:text-yellow-600">
          <Users className="w-5 h-5" />
          Player Selection
        </CardTitle>
        <CardDescription className="text-club-light-gray/70 light:text-gray-600">
          Choose a player to view their detailed statistics and performance data
        </CardDescription>
      </CardHeader>
      
      <CardContent className="p-4 sm:p-5 lg:p-6 pt-0 space-y-4">
        <IOSLoadingState isLoading={loading} suppressDemoLoading={false}>
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-club-light-gray/50 light:text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search players by name or position..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-club-black/40 light:bg-gray-50 border-club-gold/30 light:border-gray-300 text-club-light-gray light:text-gray-900 placeholder:text-club-light-gray/50 light:placeholder:text-gray-500"
            />
          </div>

          {/* Player Selection */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-club-light-gray light:text-gray-700">
                Select Player ({filteredPlayers.length} available)
              </h3>
              {selectedPlayer && (
                <Badge variant="outline" className="text-club-gold light:text-yellow-600 border-club-gold/30 light:border-yellow-600/30">
                  {selectedPlayer.position}
                </Badge>
              )}
            </div>

            <Select 
              value={selectedPlayer?.id.toString() || ""} 
              onValueChange={handlePlayerSelect}
            >
              <SelectTrigger className="bg-club-black/40 light:bg-gray-50 border-club-gold/30 light:border-gray-300 text-club-light-gray light:text-gray-900">
                <SelectValue placeholder="Choose a player..." />
              </SelectTrigger>
              <SelectContent className="bg-club-dark-gray light:bg-white border-club-gold/30 light:border-gray-200 max-h-60">
                {filteredPlayers.map((player) => (
                  <SelectItem 
                    key={player.id} 
                    value={player.id.toString()}
                    className="text-club-light-gray light:text-gray-900 hover:bg-club-gold/10 light:hover:bg-yellow-600/10 focus:bg-club-gold/20 light:focus:bg-yellow-600/20"
                  >
                    <div className="flex items-center gap-3 w-full">
                      <PlayerAvatar player={player} size="sm" />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">{player.name}</div>
                        <div className="text-xs text-club-light-gray/60 light:text-gray-500 truncate">
                          {player.position} • #{player.number || 'N/A'}
                        </div>
                      </div>
                      <div className="text-xs text-club-gold light:text-yellow-600 font-medium">
                        {player.goals || 0}G
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Selected Player Info */}
          {selectedPlayer && (
            <div className="p-4 bg-club-black/40 light:bg-gray-50 rounded-lg border border-club-gold/20 light:border-gray-200">
              <div className="flex items-center gap-4">
                <PlayerAvatar player={selectedPlayer} size="md" />
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-club-light-gray light:text-gray-900 truncate">
                    {selectedPlayer.name}
                  </h4>
                  <p className="text-sm text-club-light-gray/70 light:text-gray-600">
                    {selectedPlayer.position} • #{selectedPlayer.number || 'N/A'}
                  </p>
                  <div className="flex items-center gap-4 mt-2 text-xs">
                    <span className="text-club-gold light:text-yellow-600 font-medium">
                      {selectedPlayer.matches || 0} matches
                    </span>
                    <span className="text-club-light-gray/60 light:text-gray-500">
                      {selectedPlayer.goals || 0} goals
                    </span>
                    <span className="text-club-light-gray/60 light:text-gray-500">
                      {selectedPlayer.assists || 0} assists
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 text-club-gold light:text-yellow-600">
                    <TrendingUp className="w-4 h-4" />
                    <span className="text-sm font-medium">
                      {selectedPlayer.match_rating ? Number(selectedPlayer.match_rating).toFixed(1) : '0.0'}
                    </span>
                  </div>
                  <p className="text-xs text-club-light-gray/60 light:text-gray-500">Rating</p>
                </div>
              </div>
            </div>
          )}

          {/* No players found */}
          {filteredPlayers.length === 0 && !loading && (
            <div className="text-center py-8 text-club-light-gray/60 light:text-gray-500">
              <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No players found matching your search</p>
            </div>
          )}
        </IOSLoadingState>
      </CardContent>
    </Card>
  );
};
