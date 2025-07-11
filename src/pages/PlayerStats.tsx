
import { useState } from "react";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { usePlayerData } from "@/hooks/use-player-data";
import { useUserProfile } from "@/hooks/use-user-profile";
import { useLanguage } from "@/contexts/LanguageContext";
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
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold bg-gradient-to-r from-primary to-primary-variant bg-clip-text text-transparent truncate">
                {t('nav.individualStats')}
              </h2>
              <p className="text-ios-caption text-muted-foreground truncate">
                {t('page.playerStats.description')}
              </p>
            </div>
            
            {/* Right section - Controls */}
            <div className="flex items-center gap-1.5 sm:gap-2 lg:gap-3 flex-shrink-0">
              {/* Language Selector */}
              <LanguageSelector />
              
              {/* Theme Toggle */}
              <ThemeToggle />
              
              {/* Refresh Button */}
              <TouchFeedbackButton variant="outline" size="icon" className="bg-background/80 border-border hover:bg-accent h-8 w-8 sm:h-9 sm:w-9 lg:h-10 lg:w-10 backdrop-blur-sm transition-all duration-200 hover:scale-105" onClick={handleRefresh} title={t('common.refreshData')} hapticType="medium">
                <RefreshCw size={14} className="sm:hidden text-primary" />
                <RefreshCw size={16} className="hidden sm:block lg:hidden text-primary" />
                <RefreshCw size={18} className="hidden lg:block text-primary" />
              </TouchFeedbackButton>
              
              {/* Menu Toggle */}
              <TouchFeedbackButton variant="outline" size="icon" onClick={() => setShowSidebar(!showSidebar)} className="bg-background/80 border-border hover:bg-accent h-8 w-8 sm:h-9 sm:w-9 lg:h-10 lg:w-10 backdrop-blur-sm transition-all duration-200 hover:scale-105" title={t('common.toggleSidebar')} hapticType="light">
                <Menu size={16} className="sm:hidden text-primary" />
                <Menu size={18} className="hidden sm:block lg:hidden text-primary" />
                <Menu size={20} className="hidden lg:block text-primary" />
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
                  {t('mobile.rotateDevice')}
                </AlertDescription>
              </Alert>}

            {/* Role-based access information */}
            <RoleBasedContent allowedRoles={['player']}>
            <Alert className="bg-gradient-to-r from-accent/20 to-accent/10 border-accent/30">
                <Info className="h-4 w-4 text-primary" />
                <AlertDescription className="text-foreground text-sm sm:text-base">
                  {profile?.role === 'player' ? t('playerStats.roleAccess.player') : t('message.selectPlayerToView')}
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
                  <p className="text-base sm:text-lg text-foreground">
                    {profile?.role === 'player' ? t('playerStats.roleAccess.loading') : t('error.noPlayerSelected')}
                  </p>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    {profile?.role === 'player' ? t('playerStats.roleAccess.loadingStats') : t('message.selectPlayerToView')}
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
