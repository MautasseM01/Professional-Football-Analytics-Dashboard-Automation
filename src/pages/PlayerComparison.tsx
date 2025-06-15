import { useState, useMemo } from "react";
import { usePlayerData } from "@/hooks/use-player-data";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { BackToTopButton } from "@/components/BackToTopButton";
import { useIsMobile } from "@/hooks/use-mobile";
import { useTheme } from "@/contexts/ThemeContext";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LanguageSelector } from "@/components/LanguageSelector";
import { TouchFeedbackButton } from "@/components/TouchFeedbackButton";
import { PlayerSelectionCard } from "@/components/comparison/PlayerSelectionCard";
import { PerformanceMetricsTable } from "@/components/comparison/PerformanceMetricsTable";
import { PerformanceRadarChart } from "@/components/comparison/PerformanceRadarChart";
import { Menu, RefreshCw, Sparkles } from "lucide-react";

export default function PlayerComparison() {
  const {
    players,
    loading,
    refreshData
  } = usePlayerData();
  const [selectedPlayerIds, setSelectedPlayerIds] = useState<number[]>([]);
  const [showSidebar, setShowSidebar] = useState(true);
  const isMobile = useIsMobile();
  const {
    theme
  } = useTheme();
  const handleRefresh = () => {
    console.log("Manual refresh triggered");
    refreshData();
  };
  const selectedPlayers = useMemo(() => {
    if (!players?.length || !selectedPlayerIds.length) return [];
    return players.filter(player => selectedPlayerIds.includes(player.id));
  }, [players, selectedPlayerIds]);
  const handlePlayerSelectionChange = (playerIds: number[]) => {
    // Limit to a maximum of 4 players
    if (playerIds.length <= 4) {
      setSelectedPlayerIds(playerIds);
    }
  };
  return <ErrorBoundary>
      <div className="flex h-screen bg-gradient-to-br from-slate-900 via-club-black to-slate-900 dark:from-slate-900 dark:via-club-black dark:to-slate-900 text-gray-100 dark:text-gray-100 transition-colors duration-300">
        {showSidebar && <DashboardSidebar />}
        
        <div className="flex-1 overflow-auto min-w-0">
          {/* Prominent Demo Banner */}
          

          <header className="border-b border-club-gold/20 dark:border-club-gold/20 bg-club-black/80 dark:bg-club-black/80 backdrop-blur-xl sticky top-0 z-20 transition-colors duration-300">
            <div className="flex justify-between items-center px-3 sm:px-4 lg:px-6 py-[23px] gap-2 sm:gap-4">
              {/* Left section - Title and page info */}
              <div className="flex-1 min-w-0">
                <h1 className="font-bold text-club-gold dark:text-club-gold truncate md:line-clamp-2 lg:line-clamp-none text-base md:text-lg lg:text-2xl">
                  Player Comparison
                </h1>
                <p className="text-gray-400 dark:text-gray-400 truncate md:line-clamp-2 lg:line-clamp-none text-xs md:text-sm lg:text-base">
                  Compare performance metrics between multiple players
                </p>
              </div>
              
              {/* Right section - Controls */}
              <div className="flex items-center gap-1.5 sm:gap-2 lg:gap-3 flex-shrink-0">
                {/* Language Selector */}
                <LanguageSelector />
                
                {/* Theme Toggle */}
                <ThemeToggle />
                
                {/* Refresh Button */}
                <TouchFeedbackButton variant="outline" size="icon" className="bg-club-black/50 dark:bg-club-black/50 border-club-gold/30 dark:border-club-gold/30 hover:bg-club-gold/10 dark:hover:bg-club-gold/10 h-8 w-8 sm:h-9 sm:w-9 lg:h-10 lg:w-10 backdrop-blur-sm" onClick={handleRefresh} title="Refresh data" hapticType="medium">
                  <RefreshCw size={14} className="sm:hidden text-club-gold" />
                  <RefreshCw size={16} className="hidden sm:block lg:hidden text-club-gold" />
                  <RefreshCw size={18} className="hidden lg:block text-club-gold" />
                </TouchFeedbackButton>
                
                {/* Menu Toggle */}
                <TouchFeedbackButton variant="outline" size="icon" onClick={() => setShowSidebar(!showSidebar)} className="bg-club-black/50 dark:bg-club-black/50 border-club-gold/30 dark:border-club-gold/30 hover:bg-club-gold/10 dark:hover:bg-club-gold/10 h-8 w-8 sm:h-9 sm:w-9 lg:h-10 lg:w-10 backdrop-blur-sm" title="Toggle sidebar" hapticType="light">
                  <Menu size={16} className="sm:hidden text-club-gold" />
                  <Menu size={18} className="hidden sm:block lg:hidden text-club-gold" />
                  <Menu size={20} className="hidden lg:block text-club-gold" />
                </TouchFeedbackButton>
              </div>
            </div>
          </header>
          
          <main className="bg-transparent transition-colors duration-300 w-full">
            <div className="space-y-4 sm:space-y-6 p-4 sm:p-6">
              {/* Player Selection */}
              <PlayerSelectionCard players={players || []} selectedPlayerIds={selectedPlayerIds} onChange={handlePlayerSelectionChange} loading={loading} />

              {selectedPlayers.length > 0 && <>
                  {/* Performance Metrics Table */}
                  <PerformanceMetricsTable selectedPlayers={selectedPlayers} loading={loading} />

                  {/* Radar Chart */}
                  <PerformanceRadarChart selectedPlayers={selectedPlayers} loading={loading} />
                </>}
            </div>
          </main>
        </div>

        {/* Back to Top Button */}
        <BackToTopButton />
      </div>
    </ErrorBoundary>;
}
