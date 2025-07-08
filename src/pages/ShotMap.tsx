
import { useState } from "react";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { useShotsData } from "@/hooks/use-shots-data";
import { usePlayerData } from "@/hooks/use-player-data";
import { ShotMapFilters } from "@/components/ShotMap/ShotMapFilters";
import { ShotMapVisualization } from "@/components/ShotMap/ShotMapVisualization";
import { ShotMapLegend } from "@/components/ShotMap/ShotMapLegend";
import { BackToTopButton } from "@/components/BackToTopButton";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LanguageSelector } from "@/components/LanguageSelector";
import { TouchFeedbackButton } from "@/components/TouchFeedbackButton";
import { Menu, RefreshCw } from "lucide-react";

const ShotMap = () => {
  const { players } = usePlayerData();
  const { shots, matches, filters, updateFilters, resetFilters, loading, filterLoading, error } = useShotsData();
  const [showSidebar, setShowSidebar] = useState(true);

  const handleRefresh = () => {
    console.log("Manual refresh triggered for shot map");
    resetFilters();
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-900 via-club-black to-slate-900 dark:from-slate-900 dark:via-club-black dark:to-slate-900 text-gray-100 dark:text-gray-100 transition-colors duration-300">
      {showSidebar && <DashboardSidebar />}
      
      <div className="flex-1 overflow-auto min-w-0">
        <header className="border-b border-club-gold/20 dark:border-club-gold/20 bg-club-black/80 dark:bg-club-black/80 backdrop-blur-xl sticky top-0 z-20 transition-colors duration-300">
          <div className="max-w-[calc(100%-2rem)] mx-auto">
            <div className="flex justify-between items-center px-3 sm:px-4 lg:px-6 py-[23px] gap-2 sm:gap-4">
              {/* Left section - Title and page info */}
              <div className="flex-1 min-w-0">
                <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-club-gold dark:text-club-gold truncate">
                  Analyse Carte des Tirs
                </h2>
                <p className="text-ios-caption text-gray-400 dark:text-gray-400 truncate">
                  Visualisez et analysez les modèles et résultats de tirs
                </p>
              </div>
              
              {/* Right section - Controls */}
              <div className="flex items-center gap-1.5 sm:gap-2 lg:gap-3 flex-shrink-0">
                {/* Language Selector */}
                <LanguageSelector />
                
                {/* Theme Toggle */}
                <ThemeToggle />
                
                {/* Refresh Button */}
                <TouchFeedbackButton 
                  variant="outline" 
                  size="icon" 
                  className="bg-club-black/50 dark:bg-club-black/50 border-club-gold/30 dark:border-club-gold/30 hover:bg-club-gold/10 dark:hover:bg-club-gold/10 h-8 w-8 sm:h-9 sm:w-9 lg:h-10 lg:w-10 backdrop-blur-sm" 
                  onClick={handleRefresh} 
                  title="Actualiser les données" 
                  hapticType="medium"
                >
                  <RefreshCw size={14} className="sm:hidden text-club-gold" />
                  <RefreshCw size={16} className="hidden sm:block lg:hidden text-club-gold" />
                  <RefreshCw size={18} className="hidden lg:block text-club-gold" />
                </TouchFeedbackButton>
                
                {/* Menu Toggle */}
                <TouchFeedbackButton 
                  variant="outline" 
                  size="icon" 
                  onClick={() => setShowSidebar(!showSidebar)} 
                  className="bg-club-black/50 dark:bg-club-black/50 border-club-gold/30 dark:border-club-gold/30 hover:bg-club-gold/10 dark:hover:bg-club-gold/10 h-8 w-8 sm:h-9 sm:w-9 lg:h-10 lg:w-10 backdrop-blur-sm" 
                  title="Basculer la barre latérale" 
                  hapticType="light"
                >
                  <Menu size={16} className="sm:hidden text-club-gold" />
                  <Menu size={18} className="hidden sm:block lg:hidden text-club-gold" />
                  <Menu size={20} className="hidden lg:block text-club-gold" />
                </TouchFeedbackButton>
              </div>
            </div>
          </div>
        </header>
        
        <main className="bg-transparent transition-colors duration-300 w-full">
          <div className="space-y-4 sm:space-y-6 p-4 sm:p-6">
            {/* Filters */}
            <div className="bg-club-dark-gray/50 rounded-lg p-3 sm:p-4">
              <ShotMapFilters 
                players={players}
                matches={matches}
                filters={filters}
                onApplyFilters={updateFilters}
                onResetFilters={resetFilters}
              />
            </div>

            {/* Legend */}
            <div>
              <ShotMapLegend />
            </div>

            {/* Visualization */}
            <div>
              <ShotMapVisualization 
                shots={shots} 
                loading={loading} 
                filterLoading={filterLoading} 
              />
            </div>

            {error && (
              <div className="bg-red-900/30 border border-red-700 text-red-100 p-3 sm:p-4 rounded-lg">
                <p className="text-sm sm:text-base">{error}</p>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Back to Top Button */}
      <BackToTopButton />
    </div>
  );
};

export default ShotMap;
