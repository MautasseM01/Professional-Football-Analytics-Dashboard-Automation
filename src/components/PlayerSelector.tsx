
import { useState } from "react";
import { Player } from "@/types";
import { useRoleAccess } from "@/hooks/use-role-access";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Users, User, Lock } from "lucide-react";
import { RoleBadge } from "./RoleBadge";

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
  const { profile, canViewOwnDataOnly, canViewAllPlayers, currentRole } = useRoleAccess();

  // Show player-specific view for player role
  if (canViewOwnDataOnly()) {
    return (
      <div className="space-y-4">
        <Card className="bg-club-dark-bg border-club-gold/20">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between text-club-gold text-lg">
              <div className="flex items-center">
                <User className="mr-2 h-5 w-5" />
                Your Player Profile
              </div>
              <RoleBadge role={currentRole} size="sm" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedPlayer ? (
              <div className="text-club-light-gray">
                <p className="font-medium">{selectedPlayer.name}</p>
                <p className="text-sm text-club-light-gray/70">
                  Position: {selectedPlayer.position}
                </p>
                <p className="text-sm text-club-light-gray/70">
                  Number: #{selectedPlayer.number}
                </p>
              </div>
            ) : (
              <p className="text-club-light-gray/70">Loading your profile...</p>
            )}
          </CardContent>
        </Card>
        
        <Alert className="bg-club-gold/10 border-club-gold/30">
          <Lock className="h-4 w-4" />
          <AlertDescription className="text-club-light-gray text-sm">
            You can only view your own statistics and performance data.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Show loading state
  if (loading) {
    return (
      <Card className="bg-club-dark-bg border-club-gold/20">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between text-club-gold text-lg">
            <div className="flex items-center">
              <Users className="mr-2 h-5 w-5" />
              Select Player
            </div>
            <RoleBadge role={currentRole} size="sm" />
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

  // Show access denied for users without proper permissions
  if (!canViewAllPlayers()) {
    return (
      <Card className="bg-club-dark-bg border-red-500/20">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between text-red-400 text-lg">
            <div className="flex items-center">
              <Lock className="mr-2 h-5 w-5" />
              Access Restricted
            </div>
            <RoleBadge role={currentRole} size="sm" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert className="bg-red-500/10 border-red-500/30">
            <Lock className="h-4 w-4" />
            <AlertDescription className="text-club-light-gray text-sm">
              Your current role ({currentRole}) does not have permission to view player statistics.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  // Show full selector for authorized roles (admin, management, coach, analyst, performance_director)
  return (
    <Card className="bg-club-dark-bg border-club-gold/20">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-club-gold text-lg">
          <div className="flex items-center">
            <Users className="mr-2 h-5 w-5" />
            Select Player
          </div>
          <RoleBadge role={currentRole} size="sm" />
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
                className="focus:bg-club-gold/20"
              >
                <div className="flex items-center gap-2">
                  <span className="font-medium">{player.name}</span>
                  <span className="text-sm text-club-light-gray/70">
                    #{player.number} - {player.position}
                  </span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardContent>
    </Card>
  );
};
