import { useState } from "react";
import { usePlayerData } from "@/hooks/use-player-data";
import { useUserProfile } from "@/hooks/use-user-profile";
import { useLanguage } from "@/contexts/LanguageContext";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { TestModeIndicator } from "@/components/TestModeIndicator";
import { PlayerDashboard } from "@/components/dashboards/PlayerDashboard";
import { CoachDashboard } from "@/components/dashboards/CoachDashboard";
import { AnalystDashboard } from "@/components/dashboards/AnalystDashboard";
import { PerformanceDirectorDashboard } from "@/components/dashboards/PerformanceDirectorDashboard";
import { ManagementDashboard } from "@/components/dashboards/ManagementDashboard";
import { AdminDashboard } from "@/components/dashboards/AdminDashboard";
import { UnassignedRoleDashboard } from "@/components/dashboards/UnassignedRoleDashboard";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LanguageSelector } from "@/components/LanguageSelector";
import { BackToTopButton } from "@/components/BackToTopButton";
import { RoleTester } from "@/components/RoleTester";
import { Menu, RefreshCw, Sparkles } from "lucide-react";
import { TouchFeedbackButton } from "@/components/TouchFeedbackButton";

const Dashboard = () => {
  const {
    loading: playerDataLoading,
    refreshData
  } = usePlayerData();
  const {
    profile,
    loading: profileLoading,
    error
  } = useUserProfile();
  const {
    t
  } = useLanguage();
  const [showSidebar, setShowSidebar] = useState(true);
  const handleRefresh = () => {
    console.log("Manual refresh triggered");
    refreshData();
  };

  const renderDashboardContent = () => {
    // In demo mode, show minimal loading to ensure instant content
    if (profileLoading && !profile) {
      return <div className="space-y-4 sm:space-y-6 p-4 sm:p-6">
          <div className="h-6 sm:h-8 w-48 sm:w-64 bg-white/20 dark:bg-slate-700/20 rounded-xl animate-pulse" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <div className="h-60 sm:h-80 w-full bg-white/20 dark:bg-slate-700/20 rounded-2xl animate-pulse" />
            <div className="h-60 sm:h-80 w-full bg-white/20 dark:bg-slate-700/20 rounded-2xl animate-pulse" />
            <div className="h-60 sm:h-80 w-full bg-white/20 dark:bg-slate-700/20 rounded-2xl animate-pulse" />
          </div>
        </div>;
    }
    if (error) {
      return <div className="p-4 sm:p-6">
          <div className="bg-red-50/90 dark:bg-red-900/30 border border-red-200 dark:border-red-700 rounded-2xl p-6 backdrop-blur-sm">
            <div className="flex flex-col gap-4">
              <p className="text-ios-body text-red-800 dark:text-red-200">Erreur lors du chargement du profil utilisateur : {error}</p>
              <TouchFeedbackButton variant="outline" className="w-fit bg-white/50 dark:bg-slate-800/50 border-red-200 dark:border-red-700 hover:bg-red-50 dark:hover:bg-red-900/20" onClick={handleRefresh}>
                <RefreshCw size={16} className="mr-2" />
                Réessayer
              </TouchFeedbackButton>
            </div>
          </div>
        </div>;
    }
    if (!profile) {
      return <div className="p-4 sm:p-6">
          <div className="bg-amber-50/90 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-700 rounded-2xl p-6 backdrop-blur-sm">
            <div className="flex flex-col gap-4">
              <p className="text-ios-body text-amber-800 dark:text-amber-200">Profil utilisateur introuvable. Veuillez actualiser la page ou contacter un administrateur.</p>
              <TouchFeedbackButton variant="outline" className="w-fit bg-white/50 dark:bg-slate-800/50 border-amber-200 dark:border-amber-700 hover:bg-amber-50 dark:hover:bg-amber-900/20" onClick={handleRefresh}>
                <RefreshCw size={16} className="mr-2" />
                Réessayer
              </TouchFeedbackButton>
            </div>
          </div>
        </div>;
    }

    // Return the appropriate dashboard based on user role
    switch (profile.role) {
      case 'player':
        return <PlayerDashboard profile={profile} />;
      case 'coach':
        return <CoachDashboard profile={profile} />;
      case 'analyst':
        return <AnalystDashboard profile={profile} />;
      case 'performance_director':
        return <PerformanceDirectorDashboard profile={profile} />;
      case 'management':
        return <ManagementDashboard profile={profile} />;
      case 'admin':
        return <AdminDashboard profile={profile} />;
      case 'unassigned':
      default:
        return <UnassignedRoleDashboard profile={profile} />;
    }
  };

  // Log current state for debugging external access
  console.log('Dashboard render - Profile:', profile?.role, 'Loading:', profileLoading, 'Error:', error);
  return <div className="flex h-screen bg-gradient-to-br from-slate-900 via-club-black to-slate-900 dark:from-slate-900 dark:via-club-black dark:to-slate-900 text-gray-100 dark:text-gray-100 transition-colors duration-300">
      {showSidebar && <DashboardSidebar />}
      
      <div className="flex-1 overflow-auto min-w-0">
        {/* Prominent Demo Banner */}
        

        <header className="border-b border-club-gold/20 dark:border-club-gold/20 bg-club-black/80 dark:bg-club-black/80 backdrop-blur-xl sticky top-0 z-20 transition-colors duration-300">
          <div className="flex justify-between items-center px-3 sm:px-4 lg:px-6 py-[23px] gap-2 sm:gap-4 sm:py-[20px]">
            {/* Left section - Title and page info */}
            <div className="flex-1 min-w-0">
              <h1 className="text-ios-headline font-bold text-club-gold dark:text-club-gold truncate">
                {t('header.title')}
              </h1>
              <p className="text-ios-caption text-gray-400 dark:text-gray-400 truncate">
                {profile?.role ? `${profile.role.charAt(0).toUpperCase() + profile.role.slice(1)} ${t('header.dashboard')}` : t('header.dashboard')}
              </p>
            </div>
            
            {/* Right section - Controls */}
            <div className="flex items-center gap-1.5 sm:gap-2 lg:gap-3 flex-shrink-0">
              {/* Language Selector */}
              <LanguageSelector />
              
              {/* Theme Toggle */}
              <ThemeToggle />
              
              {/* Refresh Button */}
              <TouchFeedbackButton variant="outline" size="icon" className="bg-club-black/50 dark:bg-club-black/50 border-club-gold/30 dark:border-club-gold/30 hover:bg-club-gold/10 dark:hover:bg-club-gold/10 h-8 w-8 sm:h-9 sm:w-9 lg:h-10 lg:w-10 backdrop-blur-sm" onClick={handleRefresh} title="Actualiser les données" hapticType="medium">
                <RefreshCw size={14} className="sm:hidden text-club-gold" />
                <RefreshCw size={16} className="hidden sm:block lg:hidden text-club-gold" />
                <RefreshCw size={18} className="hidden lg:block text-club-gold" />
              </TouchFeedbackButton>
              
              {/* Menu Toggle */}
              <TouchFeedbackButton variant="outline" size="icon" onClick={() => setShowSidebar(!showSidebar)} className="bg-club-black/50 dark:bg-club-black/50 border-club-gold/30 dark:border-club-gold/30 hover:bg-club-gold/10 dark:hover:bg-club-gold/10 h-8 w-8 sm:h-9 sm:w-9 lg:h-10 lg:w-10 backdrop-blur-sm" title="Basculer la barre latérale" hapticType="light">
                <Menu size={16} className="sm:hidden text-club-gold" />
                <Menu size={18} className="hidden sm:block lg:hidden text-club-gold" />
                <Menu size={20} className="hidden lg:block text-club-gold" />
              </TouchFeedbackButton>
            </div>
          </div>
        </header>
        
        <main className="bg-transparent transition-colors duration-300 w-full">
          {/* Role Tester - prominently displayed */}
          <div className="p-4 sm:p-6 pb-4">
            <RoleTester />
          </div>
          
          {renderDashboardContent()}
        </main>
      </div>

      {/* Back to Top Button */}
      <BackToTopButton />
    </div>;
};
export default Dashboard;
