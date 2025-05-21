import { usePlayerData } from "@/hooks/use-player-data";
import { usePlayerAttributes } from "@/hooks/use-player-attributes";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { PlayerStats as PlayerStatsComponent } from "@/components/PlayerStats";
import { RoleRadarChart } from "@/components/RoleRadarChart";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User } from "lucide-react";
import { useState, useEffect } from "react";

const PlayerStats = () => {
  const { players, selectedPlayer, selectPlayer, loading, error } = usePlayerData();
  const { attributes, positionalAverage, loading: attrLoading, error: attrError } = usePlayerAttributes(selectedPlayer);
  const [selectedPlayerId, setSelectedPlayerId] = useState<string>("");

  // Set the selected player ID when players data is loaded
  useEffect(() => {
    if (players.length > 0 && !selectedPlayerId) {
      setSelectedPlayerId(players[0].id.toString());
      selectPlayer(players[0].id);
    }
  }, [players, selectedPlayerId, selectPlayer]);

  const handlePlayerChange = (value: string) => {
    setSelectedPlayerId(value);
    selectPlayer(Number(value));
  };

  return (
    <div className="flex min-h-screen bg-club-dark-bg text-club-light-gray">
      <DashboardSidebar />
      <main className="flex-1 p-6 lg:p-10">
        <div className="max-w-7xl mx-auto">
          <div className="mb-10">
            <h1 className="text-3xl font-bold text-club-gold mb-2">
              Player Analytics Dashboard
            </h1>
            <p className="text-club-light-gray/70">
              View detailed statistics for each player
            </p>
          </div>

          <div className="bg-club-black/40 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-club-gold mb-4">Player Selection</h2>
            <p className="text-club-light-gray/70 mb-6">Choose a player to view their analytics</p>
            
            <div className="w-full max-w-xl">
              <Select value={selectedPlayerId} onValueChange={handlePlayerChange}>
                <SelectTrigger className="bg-club-black border-club-gold/30 text-club-light-gray">
                  <div className="flex items-center gap-2">
                    <User size={18} className="text-club-gold" />
                    <SelectValue placeholder="Select a player" />
                  </div>
                </SelectTrigger>
                <SelectContent className="bg-club-black border-club-gold/30 text-club-light-gray">
                  {players.map((player) => (
                    <SelectItem key={player.id} value={player.id.toString()}>
                      {player.name} - {player.position}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-8">Loading player data...</div>
          ) : error ? (
            <div className="text-red-500 py-8">Error loading player data: {error}</div>
          ) : (
            <>
              {/* Role Radar Chart */}
              <div className="mb-8">
                <RoleRadarChart 
                  player={selectedPlayer}
                  attributes={attributes}
                  positionalAverage={positionalAverage}
                  loading={attrLoading}
                  error={attrError}
                />
              </div>
              
              {/* Existing Player Stats Component */}
              <PlayerStatsComponent player={selectedPlayer} />
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default PlayerStats;
