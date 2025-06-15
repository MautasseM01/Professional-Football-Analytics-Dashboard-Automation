
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
import { ErrorFallback } from "@/components/ErrorStates/ErrorFallback";
import { DataLoadingSkeleton } from "@/components/LoadingStates/DataLoadingSkeleton";

interface PlayerSelectorProps {
  players: Player[];
  selectedPlayer: Player | null;
  onPlayerSelect: (playerId: number) => void;
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
  const { profile } = useUserProfile();
  const [selectError, setSelectError] = useState<string | null>(null);

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

  // Don't show selector if user is a player (they can only see their own data)
  if (profile?.role === 'player') {
    if (loading) {
      return <DataLoadingSkeleton count={1} />;
    }

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
    }
  };

  return (
    <Card className="bg-club-black/90 dark:bg-club-dark-bg light:bg-white border-club-gold/20 light:border-gray-200">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center text-club-gold light:text-yellow-600 text-lg">
          <Users className="mr-2 h-5 w-5" />
          Select Player
        </CardTitle>
      </CardHeader>
      <CardContent>
        {selectError && (
          <div className="mb-3 p-2 bg-red-500/10 border border-red-500/20 rounded text-red-600 text-sm">
            {selectError}
          </div>
        )}
        
        <Select 
          value={selectedPlayer?.id?.toString() || ""} 
          onValueChange={handlePlayerSelect}
        >
          <SelectTrigger className="w-full bg-club-black/80 light:bg-white border-club-gold/30 light:border-gray-300 text-club-light-gray light:text-gray-900 hover:border-club-gold/50 light:hover:border-yellow-600/60">
            <SelectValue placeholder="Choose a player" />
          </SelectTrigger>
          <SelectContent className="bg-club-black light:bg-white border-club-gold/30 light:border-gray-200 text-club-light-gray light:text-gray-900">
            {players.map((player) => {
              if (!player?.id || !player?.name) return null;
              
              const isSelected = selectedPlayer?.id === player.id;
              return (
                <SelectItem 
                  key={`player-${player.id}`}
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
