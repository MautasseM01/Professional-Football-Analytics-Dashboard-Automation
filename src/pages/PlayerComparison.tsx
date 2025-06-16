
import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { PlayerSelectionCard } from "@/components/comparison/PlayerSelectionCard";
import { ProfessionalPerformanceTable } from "@/components/comparison/ProfessionalPerformanceTable";
import { PerformanceMetricsTable } from "@/components/comparison/PerformanceMetricsTable";
import { PerformanceRadarChart } from "@/components/comparison/PerformanceRadarChart";
import { Player } from "@/types";
import { useRealPlayers } from "@/hooks/use-real-players";

const PlayerComparison = () => {
  const [selectedPlayers, setSelectedPlayers] = useState<Player[]>([]);
  const { isLoading: playersLoading } = useRealPlayers();

  const handlePlayerSelect = (player: Player) => {
    if (selectedPlayers.length < 4 && !selectedPlayers.some(p => p.id === player.id)) {
      setSelectedPlayers([...selectedPlayers, player]);
    }
  };

  const handlePlayerRemove = (playerId: number) => {
    setSelectedPlayers(selectedPlayers.filter(player => player.id !== playerId));
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 p-4 sm:p-6 lg:p-8">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-club-light-gray mb-2">
            Player Comparison
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
            Compare up to 4 players across various performance metrics
          </p>
        </div>

        <PlayerSelectionCard
          selectedPlayers={selectedPlayers}
          onPlayerSelect={handlePlayerSelect}
          onPlayerRemove={handlePlayerRemove}
        />

        {selectedPlayers.length >= 2 && (
          <div className="space-y-6">
            <ProfessionalPerformanceTable 
              selectedPlayers={selectedPlayers}
              loading={playersLoading}
            />
            
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <PerformanceMetricsTable 
                selectedPlayers={selectedPlayers}
                loading={playersLoading}
              />
              
              <PerformanceRadarChart 
                selectedPlayers={selectedPlayers}
                loading={playersLoading}
              />
            </div>
          </div>
        )}

        {selectedPlayers.length === 1 && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              Select at least one more player to start comparing
            </p>
          </div>
        )}

        {selectedPlayers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              Select players to start comparing their performance
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default PlayerComparison;
