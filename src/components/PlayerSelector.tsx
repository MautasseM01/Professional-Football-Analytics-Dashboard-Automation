
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
      <Card className="bg-club-dark-bg border-club-gold/20">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center text-club-gold text-lg">
            <User className="mr-2 h-5 w-5" />
            Your Player Profile
          </CardTitle>
        </CardHeader>
        <CardContent>
          {selectedPlayer ? (
            <div className="text-club-light-gray">
              <p className="font-medium">{selectedPlayer.name}</p>
              <p className="text-sm text-club-light-gray/70">
                Position: {selectedPlayer.position}
              </p>
            </div>
          ) : (
            <p className="text-club-light-gray/70">Loading your profile...</p>
          )}
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card className="bg-club-dark-bg border-club-gold/20">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center text-club-gold text-lg">
            <Users className="mr-2 h-5 w-5" />
            Select Player
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse">
            <div className="h-10 bg-club-gold/10 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-club-dark-bg border-club-gold/20">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center text-club-gold text-lg">
          <Users className="mr-2 h-5 w-5" />
          Select Player
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Select 
          value={selectedPlayer?.id.toString() || ""} 
          onValueChange={(value) => onPlayerSelect(Number(value))}
        >
          <SelectTrigger className="w-full bg-club-black border-club-gold/30 text-club-light-gray">
            <SelectValue placeholder="Choose a player" />
          </SelectTrigger>
          <SelectContent className="bg-club-black border-club-gold/30 text-club-light-gray">
            {players.map((player) => (
              <SelectItem 
                key={player.id} 
                value={player.id.toString()}
                className="focus:bg-club-gold/20 pl-3"
              >
                <span className="font-medium">{player.name}</span>
                {player.position && (
                  <span className="text-club-light-gray/70 ml-2">
                    - {player.position}
                  </span>
                )}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardContent>
    </Card>
  );
};
