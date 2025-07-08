
import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { PlayerSelectionCard } from "@/components/comparison/PlayerSelectionCard";
import { ProfessionalPerformanceTable } from "@/components/comparison/ProfessionalPerformanceTable";
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

  const handleRefresh = () => {
    console.log("Manual refresh triggered for player comparison");
    // Reset selections on refresh
    setSelectedPlayers([]);
  };

  return (
    <DashboardLayout 
      title="Comparaison des Joueurs"
      description="Comparez jusqu'à 4 joueurs selon diverses métriques de performance"
      onRefresh={handleRefresh}
    >
      <div className="container-responsive min-h-screen bg-gradient-to-br from-slate-900 via-club-black to-slate-900 dark:from-slate-900 dark:via-club-black dark:to-slate-900 light:from-gray-50 light:via-white light:to-gray-50">
        <div className="space-y-6 py-6 sm:py-8">
          {/* Player Selection Card */}
          <PlayerSelectionCard
            selectedPlayers={selectedPlayers}
            onPlayerSelect={handlePlayerSelect}
            onPlayerRemove={handlePlayerRemove}
          />

          {/* Comparison Content */}
          {selectedPlayers.length >= 2 && (
            <div className="space-y-6">
              <ProfessionalPerformanceTable 
                selectedPlayers={selectedPlayers}
                loading={playersLoading}
              />
              
              <div className="flex justify-center">
                <div className="w-full max-w-2xl">
                  <PerformanceRadarChart 
                    selectedPlayers={selectedPlayers}
                    loading={playersLoading}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Empty States */}
          {selectedPlayers.length === 1 && (
            <div className="text-center py-12">
              <p className="body-normal text-club-light-gray/70 dark:text-gray-400 light:text-gray-500 text-lg">
                Sélectionnez au moins un autre joueur pour commencer la comparaison
              </p>
            </div>
          )}

          {selectedPlayers.length === 0 && (
            <div className="text-center py-12">
              <p className="body-normal text-club-light-gray/70 dark:text-gray-400 light:text-gray-500 text-lg">
                Sélectionnez des joueurs pour commencer à comparer leurs performances
              </p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PlayerComparison;
