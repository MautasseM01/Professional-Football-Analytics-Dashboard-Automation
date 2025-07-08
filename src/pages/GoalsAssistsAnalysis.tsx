import { useState } from "react";
import { Player } from "@/types";
import { useRealPlayers } from "@/hooks/use-real-players";
import { useGoalsData } from "@/hooks/use-goals-data";
import { DashboardLayout } from "@/components/DashboardLayout";
import { PlayerSelector } from "@/components/PlayerSelector";
import { GoalsTimeline } from "@/components/goals-assists/GoalsTimeline";
import { GoalTypesAnalysis } from "@/components/goals-assists/GoalTypesAnalysis";
import { BodyPartAnalysis } from "@/components/goals-assists/BodyPartAnalysis";
import { AssistNetwork } from "@/components/goals-assists/AssistNetwork";
import { GoalCoordinatesHeatmap } from "@/components/goals-assists/GoalCoordinatesHeatmap";
import { AssistTypesBreakdown } from "@/components/goals-assists/AssistTypesBreakdown";
import { PartnershipAnalysis } from "@/components/goals-assists/PartnershipAnalysis";
import { ResponsiveGrid } from "@/components/ResponsiveLayout";
import { BackToTopButton } from "@/components/BackToTopButton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { RotateCcw, Menu, RefreshCw } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { toast } from "sonner";

const GoalsAssistsAnalysis = () => {
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { data: players = [], isLoading: playersLoading, error: playersError, refetch: refetchPlayers } = useRealPlayers();
  const { goals, assists, loading: goalsLoading, refetch: refetchGoals } = useGoalsData(selectedPlayer);
  const isMobile = useIsMobile();

  const handlePlayerSelect = (player: Player) => {
    setSelectedPlayer(player);
  };

  const handleRefresh = async () => {
    if (isRefreshing) return;
    
    setIsRefreshing(true);
    try {
      await Promise.all([
        refetchPlayers(),
        selectedPlayer ? refetchGoals() : Promise.resolve()
      ]);
      toast.success("Data refreshed successfully");
    } catch (error) {
      toast.error("Failed to refresh data");
      console.error("Refresh error:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <DashboardLayout 
      title="Analyse Buts et Passes Décisives"
      description="Analyse complète des performances en buts et passes décisives"
      onRefresh={handleRefresh}
    >
      <div className="container-responsive min-h-screen bg-gradient-to-br from-slate-900 via-club-black to-slate-900 dark:from-slate-900 dark:via-club-black dark:to-slate-900 light:from-gray-50 light:via-white light:to-gray-50">
        <div className="space-y-6 py-6 sm:py-8">
          {/* Mobile landscape orientation message */}
          {isMobile && (
            <Alert className="bg-blue-500/10 light:bg-blue-600/20 border-blue-500/30 light:border-blue-600/40">
              <RotateCcw className="h-4 w-4" />
              <AlertDescription className="text-club-light-gray light:text-gray-700 text-sm">
                Pour une meilleure visualisation des graphiques, essayez de faire pivoter votre appareil en mode paysage.
              </AlertDescription>
            </Alert>
          )}

          {/* Player Selector */}
          <PlayerSelector
            players={players}
            selectedPlayer={selectedPlayer}
            onPlayerSelect={handlePlayerSelect}
            loading={playersLoading}
            error={playersError?.message || null}
          />

          {/* Goals & Assists Analysis Content */}
          {selectedPlayer && (
            <div className="space-y-6">
              {/* Goals Timeline */}
              <GoalsTimeline player={selectedPlayer} />
              
              {/* Goal Analysis Row */}
              <ResponsiveGrid minCardWidth="320px">
                <GoalTypesAnalysis player={selectedPlayer} />
                <BodyPartAnalysis player={selectedPlayer} />
              </ResponsiveGrid>

              {/* Assist Analysis Row */}
              <ResponsiveGrid minCardWidth="320px">
                <AssistNetwork player={selectedPlayer} />
                <AssistTypesBreakdown player={selectedPlayer} />
              </ResponsiveGrid>

              {/* Advanced Analysis */}
              <ResponsiveGrid minCardWidth="400px">
                <GoalCoordinatesHeatmap player={selectedPlayer} />
                <PartnershipAnalysis player={selectedPlayer} />
              </ResponsiveGrid>
            </div>
          )}

          {/* No player selected message */}
          {!selectedPlayer && !playersLoading && (
            <div className="flex items-center justify-center min-h-[50vh] text-center px-4">
              <div className="space-y-2">
                <p className="text-base sm:text-lg text-club-light-gray light:text-gray-700">
                  Aucun joueur sélectionné
                </p>
                <p className="text-xs sm:text-sm text-club-light-gray/60 light:text-gray-600">
                  Veuillez sélectionner un joueur pour voir son analyse des buts et passes décisives
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      <BackToTopButton />
    </DashboardLayout>
  );
};

export default GoalsAssistsAnalysis;
