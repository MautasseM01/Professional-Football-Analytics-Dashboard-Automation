
import { useState } from "react";
import { Player } from "@/types";
import { useUserProfile } from "@/hooks/use-user-profile";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Users, User } from "lucide-react";

interface PlayerSelectorProps {
  players: Player[];
  selectedPlayer: Player | null;
  onPlayerSelect: (playerId: number) => void;
  loading?: boolean;
}

export const PlayerSelector = ({ 
  players, 
  selectedPlayer, 
  onPlayerSelect, 
  loading = false 
}: PlayerSelectorProps) => {
  const { profile } = useUserProfile();

  // Don't show selector if user is a player (they can only see their own data)
  if (profile?.role === 'player') {
    return (
      <Card className="bg-club-black/90 dark:bg-club-dark-bg light:bg-white border-club-gold/20 light:border-gray-200">
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
                Position: {selectedPlayer.position}
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
    return (
      <Card className="bg-club-black/90 dark:bg-club-dark-bg light:bg-white border-club-gold/20 light:border-gray-200">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center text-club-gold light:text-yellow-600 text-lg">
            <Users className="mr-2 h-5 w-5" />
            Select Player
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse">
            <div className="h-10 bg-club-gold/10 light:bg-gray-200 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-club-black/90 dark:bg-club-dark-bg light:bg-white border-club-gold/20 light:border-gray-200">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center text-club-gold light:text-yellow-600 text-lg">
          <Users className="mr-2 h-5 w-5" />
          Select Player
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Select 
          value={selectedPlayer?.id.toString() || ""} 
          onValueChange={(value) => onPlayerSelect(Number(value))}
        >
          <SelectTrigger className="w-full bg-club-black/80 light:bg-white border-club-gold/30 light:border-gray-300 text-club-light-gray light:text-gray-900 hover:border-club-gold/50 light:hover:border-yellow-600/60">
            <SelectValue placeholder="Choose a player" />
          </SelectTrigger>
          <SelectContent className="bg-club-black light:bg-white border-club-gold/30 light:border-gray-200 text-club-light-gray light:text-gray-900">
            {players.map((player) => {
              const isSelected = selectedPlayer?.id === player.id;
              return (
                <SelectItem 
                  key={player.id} 
                  value={player.id.toString()}
                  className={`
                    relative pl-6 pr-3 py-2 cursor-pointer transition-all duration-200
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
                    {/* Player Number Badge */}
                    <div className="flex-shrink-0 w-8 h-8 bg-club-gold/20 light:bg-yellow-600/20 rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold text-club-gold light:text-yellow-600">
                        {player.number || '?'}
                      </span>
                    </div>
                    
                    {/* Player Info */}
                    <div className="flex-1">
                      <span className="font-medium text-club-light-gray light:text-gray-900">{player.name}</span>
                      {player.position && (
                        <span className="text-club-light-gray/70 light:text-gray-600 ml-2 text-sm">
                          - {player.position}
                        </span>
                      )}
                    </div>
                  </div>
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </CardContent>
    </Card>
  );
};
