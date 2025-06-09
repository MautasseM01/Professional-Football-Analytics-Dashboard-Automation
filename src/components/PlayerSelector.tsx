
import { useState } from "react";
import { Player } from "@/types";
import { useUserProfile } from "@/hooks/use-user-profile";
import { useIsMobile } from "@/hooks/use-mobile";
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
  const isMobile = useIsMobile();

  // Don't show selector if user is a player (they can only see their own data)
  if (profile?.role === 'player') {
    return (
      <Card className="bg-club-dark-bg border-club-gold/20">
        <CardHeader className={isMobile ? "pb-2" : "pb-3"}>
          <CardTitle className={`flex items-center text-club-gold ${isMobile ? 'text-base' : 'text-lg'}`}>
            <User className={`mr-2 ${isMobile ? 'h-4 w-4' : 'h-5 w-5'}`} />
            Your Player Profile
          </CardTitle>
        </CardHeader>
        <CardContent className={isMobile ? "pt-0" : ""}>
          {selectedPlayer ? (
            <div className="text-club-light-gray">
              <p className={`font-medium ${isMobile ? 'text-base' : ''}`}>{selectedPlayer.name}</p>
              <p className={`text-club-light-gray/70 ${isMobile ? 'text-sm' : 'text-sm'}`}>
                Position: {selectedPlayer.position}
              </p>
            </div>
          ) : (
            <p className={`text-club-light-gray/70 ${isMobile ? 'text-sm' : ''}`}>Loading your profile...</p>
          )}
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card className="bg-club-dark-bg border-club-gold/20">
        <CardHeader className={isMobile ? "pb-2" : "pb-3"}>
          <CardTitle className={`flex items-center text-club-gold ${isMobile ? 'text-base' : 'text-lg'}`}>
            <Users className={`mr-2 ${isMobile ? 'h-4 w-4' : 'h-5 w-5'}`} />
            Select Player
          </CardTitle>
        </CardHeader>
        <CardContent className={isMobile ? "pt-0" : ""}>
          <div className="animate-pulse">
            <div className={`bg-club-gold/10 rounded ${isMobile ? 'h-12' : 'h-10'}`}></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-club-dark-bg border-club-gold/20">
      <CardHeader className={isMobile ? "pb-2" : "pb-3"}>
        <CardTitle className={`flex items-center text-club-gold ${isMobile ? 'text-base' : 'text-lg'}`}>
          <Users className={`mr-2 ${isMobile ? 'h-4 w-4' : 'h-5 w-5'}`} />
          Select Player
        </CardTitle>
      </CardHeader>
      <CardContent className={isMobile ? "pt-0" : ""}>
        <Select 
          value={selectedPlayer?.id.toString() || ""} 
          onValueChange={(value) => onPlayerSelect(Number(value))}
        >
          <SelectTrigger className="w-full bg-club-black border-club-gold/30 text-club-light-gray focus:border-club-gold focus:ring-club-gold/20">
            <SelectValue placeholder="Choose a player" />
          </SelectTrigger>
          <SelectContent className="bg-club-black border-club-gold/30 text-club-light-gray">
            {players.map((player) => (
              <SelectItem 
                key={player.id} 
                value={player.id.toString()}
                className="focus:bg-club-gold/20"
              >
                <div className="flex flex-col items-start">
                  <span className="font-medium">{player.name}</span>
                  {player.position && (
                    <span className="text-club-light-gray/70 text-xs">
                      {player.position}
                    </span>
                  )}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardContent>
    </Card>
  );
};
