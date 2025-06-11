
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

  // Render appropriate content based on user role
  const renderDashboardContent = () => {
    if (profileLoading) {
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
              <p className="text-ios-body text-red-800 dark:text-red-200">Error loading user profile: {error}</p>
              <TouchFeedbackButton 
                variant="outline" 
                className="w-fit bg-white/50 dark:bg-slate-800/50 border-red-200 dark:border-red-700 hover:bg-red-50 dark:hover:bg-red-900/20" 
                onClick={handleRefresh}
              >
                <RefreshCw size={16} className="mr-2" />
                Retry Loading Data
              </TouchFeedbackButton>
            </div>
          </div>
        </div>;
    }
    
    if (!profile) {
      return <div className="p-4 sm:p-6">
          <div className="bg-amber-50/90 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-700 rounded-2xl p-6 backdrop-blur-sm">
            <div className="flex flex-col gap-4">
              <p className="text-ios-body text-amber-800 dark:text-amber-200">User profile not found. Please try refreshing the page or contact an administrator.</p>
              <TouchFeedbackButton 
                variant="outline" 
                className="w-fit bg-white/50 dark:bg-slate-800/50 border-amber-200 dark:border-amber-700 hover:bg-amber-50 dark:hover:bg-amber-900/20" 
                onClick={handleRefresh}
              >
                <RefreshCw size={16} className="mr-2" />
                Retry Loading Data
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

  return <div className="flex h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      {showSidebar && <DashboardSidebar />}
      
      <div className="flex-1 overflow-auto min-w-0">
        {/* Prominent Demo Banner */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-2 text-center">
          <div className="flex items-center justify-center gap-2 text-sm font-medium">
            <Sparkles size={16} />
            <span>Football Analytics Dashboard - Interactive Demo</span>
            <Sparkles size={16} />
          </div>
        </div>

        <header className="border-b border-white/20 dark:border-slate-700/20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl sticky top-0 z-20 transition-colors duration-300">
          <div className="flex justify-between items-center px-3 sm:px-4 lg:px-6 py-3 gap-2 sm:gap-4 sm:py-[20px]">
            {/* Left section - Title and page info */}
            <div className="flex-1 min-w-0">
              <h1 className="text-ios-headline font-bold text-blue-600 dark:text-blue-400 truncate">
                {t('header.title')}
              </h1>
              <p className="text-ios-caption text-gray-600 dark:text-gray-400 truncate">
                {profileLoading ? <div className="h-3 sm:h-4 w-24 sm:w-32 lg:w-40 bg-gray-200 dark:bg-slate-700 rounded-lg animate-pulse inline-block" /> : profile?.role ? `${profile.role.charAt(0).toUpperCase() + profile.role.slice(1)} ${t('header.dashboard')}` : t('header.dashboard')}
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
                className="bg-white/50 dark:bg-slate-800/50 border-white/30 dark:border-slate-600/30 hover:bg-white/70 dark:hover:bg-slate-700/50 h-8 w-8 sm:h-9 sm:w-9 lg:h-10 lg:w-10 backdrop-blur-sm" 
                onClick={handleRefresh} 
                title="Refresh data"
                hapticType="medium"
              >
                <RefreshCw size={14} className="sm:hidden" />
                <RefreshCw size={16} className="hidden sm:block lg:hidden" />
                <RefreshCw size={18} className="hidden lg:block" />
              </TouchFeedbackButton>
              
              {/* Menu Toggle */}
              <TouchFeedbackButton 
                variant="outline"
                size="icon"
                onClick={() => setShowSidebar(!showSidebar)} 
                className="bg-white/50 dark:bg-slate-800/50 border-white/30 dark:border-slate-600/30 hover:bg-white/70 dark:hover:bg-slate-700/50 h-8 w-8 sm:h-9 sm:w-9 lg:h-10 lg:w-10 backdrop-blur-sm" 
                title="Toggle sidebar"
                hapticType="light"
              >
                <Menu size={16} className="sm:hidden" />
                <Menu size={18} className="hidden sm:block lg:hidden" />
                <Menu size={20} className="hidden lg:block" />
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
