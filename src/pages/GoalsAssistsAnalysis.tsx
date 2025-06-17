
import { useState } from "react";
import { Player } from "@/types";
import { useRealPlayers } from "@/hooks/use-real-players";
import { useGoalsData } from "@/hooks/use-goals-data";
import { DashboardSidebar } from "@/components/DashboardSidebar";
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
import { LanguageSelector } from "@/components/LanguageSelector";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { RefreshCw, Menu } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const GoalsAssistsAnalysis = () => {
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { data: players = [], isLoading: playersLoading, error: playersError, refetch: refetchPlayers } = useRealPlayers();
  const { goals, assists, loading: goalsLoading, refetch: refetchGoals } = useGoalsData(selectedPlayer);
  const isMobile = useIsMobile();

  const handlePlayerSelect = (playerId: number) => {
    const player = players.find(p => p.id === playerId);
    if (player) {
      setSelectedPlayer(player);
    }
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

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-club-black via-club-dark-gray to-club-black text-white w-full">
      <div className="flex h-screen overflow-hidden w-full">
        <DashboardSidebar />
        
        {/* Main content area */}
        <main className={cn(
          "flex-1 overflow-auto transition-all duration-300 ease-in-out flex flex-col",
          isMobile && "pt-16"
        )}>
          {/* Header bar aligned with sidebar */}
          <div className="border-b border-club-gold/20 bg-club-black/95 backdrop-blur-sm px-4 py-4 flex items-center justify-between min-h-[73px] flex-shrink-0 sticky top-0 z-20">
            <div className="flex items-center gap-4">
              {/* Mobile menu toggle */}
              {isMobile && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleSidebar}
                  className="text-club-gold hover:text-club-gold/80 hover:bg-club-gold/10"
                >
                  <Menu size={20} />
                </Button>
              )}
              
              <div className="flex flex-col">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-club-gold">
                  Goals & Assists Analysis
                </h1>
                <p className="text-sm text-club-light-gray/80 hidden sm:block">
                  Comprehensive analysis of goals and assists performance
                </p>
              </div>
            </div>
            
            {/* Header controls */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="text-club-gold border-club-gold/20 hover:bg-club-gold/10 hover:text-club-gold transition-colors h-9 w-9 sm:h-10 sm:w-10 bg-club-black/50 hover:border-club-gold/30"
                title="Refresh data"
              >
                <RefreshCw size={16} className={cn("sm:hidden", isRefreshing && "animate-spin")} />
                <RefreshCw size={18} className={cn("hidden sm:block", isRefreshing && "animate-spin")} />
              </Button>
              
              {/* Desktop controls */}
              <div className="hidden lg:flex items-center gap-2">
                <LanguageSelector />
                <ThemeToggle />
              </div>
            </div>
          </div>
          
          {/* Page content */}
          <div className="flex-1 overflow-auto">
            <div className="w-full max-w-7xl mx-auto space-y-4 sm:space-y-6 p-4 sm:p-6">
              {/* Player Selection */}
              <div className="w-full max-w-md">
                <PlayerSelector
                  players={players}
                  selectedPlayer={selectedPlayer}
                  onPlayerSelect={handlePlayerSelect}
                  loading={playersLoading}
                  error={playersError?.message || null}
                />
              </div>

              {selectedPlayer && (
                <div className="space-y-4 sm:space-y-6">
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

              {!selectedPlayer && (
                <div className="text-center py-12">
                  <p className="text-club-light-gray/80 text-lg">
                    Select a player to view their goals and assists analysis
                  </p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
      
      <BackToTopButton />
    </div>
  );
};

export default GoalsAssistsAnalysis;
