
import { useState } from "react";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { usePlayerData } from "@/hooks/use-player-data";
import { useUserProfile } from "@/hooks/use-user-profile";
import { useLanguage } from "@/contexts/LanguageProvider";
import { PlayerStats } from "@/components/PlayerStats";
import { PlayerSelector } from "@/components/PlayerSelector";
import { RoleBasedContent } from "@/components/RoleBasedContent";
import { BackToTopButton } from "@/components/BackToTopButton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LanguageSelector } from "@/components/LanguageSelector";
import { TouchFeedbackButton } from "@/components/TouchFeedbackButton";
import { Info, RotateCcw, RefreshCw, Menu, Sparkles } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

const PlayerStatsPage = () => {
  const {
    players,
    selectedPlayer,
    selectPlayer,
    loading,
    canAccessPlayerData,
    refreshData
  } = usePlayerData();
  const {
    profile
  } = useUserProfile();
  const {
    t
  } = useLanguage();
  const isMobile = useIsMobile();
  const [showSidebar, setShowSidebar] = useState(true);
  const handleRefresh = () => {
    console.log("Manual refresh triggered");
    refreshData();
  };
  return <div className="flex h-screen bg-gradient-to-br from-slate-900 via-club-black to-slate-900 dark:from-slate-900 dark:via-club-black dark:to-slate-900 light:from-gray-50 light:via-white light:to-gray-50 text-gray-100 dark:text-gray-100 light:text-gray-900 transition-colors duration-300">
      {showSidebar && <DashboardSidebar />}
      
      <div className="flex-1 overflow-auto min-w-0">
        <header className="border-b border-club-gold/20 dark:border-club-gold/20 light:border-gray-200 bg-club-black/80 dark:bg-club-black/80 light:bg-white/95 backdrop-blur-xl sticky top-0 z-20 transition-colors duration-300">
          <div className="flex justify-between items-center px-3 sm:px-4 lg:px-6 py-[23px] gap-2 sm:gap-4">
            {/* Left section - Title and page info */}
            <div className="flex-1 min-w-0">
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-club-gold dark:text-club-gold light:text-yellow-600 truncate">
                {t('nav.individualStats')}
              </h2>
              <p className="text-ios-caption text-gray-400 dark:text-gray-400 light:text-gray-600 truncate">
                {profile?.role === 'player' ? "View your individual performance statistics and development progress" : "Analyze individual player performance and statistics"}
              </p>
            </div>
            
            {/* Right section - Controls */}
            <div className="flex items-center gap-1.5 sm:gap-2 lg:gap-3 flex-shrink-0">
              {/* Language Selector */}
              <LanguageSelector />
              
              {/* Theme Toggle */}
              <ThemeToggle />
              
              {/* Refresh Button */}
              <TouchFeedbackButton variant="outline" size="icon" className="bg-club-black/50 dark:bg-club-black/50 light:bg-white/90 border-club-gold/30 dark:border-club-gold/30 light:border-gray-300 hover:bg-club-gold/10 dark:hover:bg-club-gold/10 light:hover:bg-yellow-600/20 h-8 w-8 sm:h-9 sm:w-9 lg:h-10 lg:w-10 backdrop-blur-sm" onClick={handleRefresh} title="Refresh data" hapticType="medium">
                <RefreshCw size={14} className="sm:hidden text-club-gold light:text-yellow-600" />
                <RefreshCw size={16} className="hidden sm:block lg:hidden text-club-gold light:text-yellow-600" />
                <RefreshCw size={18} className="hidden lg:block text-club-gold light:text-yellow-600" />
              </TouchFeedbackButton>
              
              {/* Menu Toggle */}
              <TouchFeedbackButton variant="outline" size="icon" onClick={() => setShowSidebar(!showSidebar)} className="bg-club-black/50 dark:bg-club-black/50 light:bg-white/90 border-club-gold/30 dark:border-club-gold/30 light:border-gray-300 hover:bg-club-gold/10 dark:hover:bg-club-gold/10 light:hover:bg-yellow-600/20 h-8 w-8 sm:h-9 sm:w-9 lg:h-10 lg:w-10 backdrop-blur-sm" title="Toggle sidebar" hapticType="light">
                <Menu size={16} className="sm:hidden text-club-gold light:text-yellow-600" />
                <Menu size={18} className="hidden sm:block lg:hidden text-club-gold light:text-yellow-600" />
                <Menu size={20} className="hidden lg:block text-club-gold light:text-yellow-600" />
              </TouchFeedbackButton>
            </div>
          </div>
        </header>
        
        <main className="bg-transparent transition-colors duration-300 w-full">
          <div className="space-y-4 sm:space-y-6 p-4 sm:p-6">
            {/* Mobile landscape orientation message */}
            {isMobile && <Alert className="bg-blue-500/10 light:bg-blue-600/20 border-blue-500/30 light:border-blue-600/40">
                <RotateCcw className="h-4 w-4" />
                <AlertDescription className="text-club-light-gray light:text-gray-700 text-sm">
                  For better chart viewing, try rotating your device to landscape mode.
                </AlertDescription>
              </Alert>}

            {/* Role-based access information */}
            <RoleBasedContent allowedRoles={['player']}>
              <Alert className="bg-club-gold/10 light:bg-yellow-600/20 border-club-gold/30 light:border-yellow-600/40">
                <Info className="h-4 w-4" />
                <AlertDescription className="text-club-light-gray light:text-gray-700 text-sm sm:text-base">
                  You can only view your own player statistics and performance data.
                </AlertDescription>
              </Alert>
            </RoleBasedContent>

            {/* Player Selector - Hidden for player role */}
            <RoleBasedContent allowedRoles={['admin', 'management', 'coach', 'analyst', 'performance_director']} fallback={null}>
              <PlayerSelector players={players} selectedPlayer={selectedPlayer} onPlayerSelect={selectPlayer} loading={loading} />
            </RoleBasedContent>

            {/* Player Stats Component */}
            {selectedPlayer && <PlayerStats player={selectedPlayer} />}

            {/* No player selected message */}
            {!selectedPlayer && !loading && <div className="flex items-center justify-center min-h-[50vh] text-center px-4">
                <div className="space-y-2">
                  <p className="text-base sm:text-lg text-club-light-gray light:text-gray-700">
                    {profile?.role === 'player' ? "Loading your player profile..." : "No player selected"}
                  </p>
                  <p className="text-xs sm:text-sm text-club-light-gray/60 light:text-gray-600">
                    {profile?.role === 'player' ? "Please wait while we load your statistics" : "Please select a player to view their statistics"}
                  </p>
                </div>
              </div>}
          </div>
        </main>
      </div>

      <BackToTopButton />
    </div>;
};
export default PlayerStatsPage;
