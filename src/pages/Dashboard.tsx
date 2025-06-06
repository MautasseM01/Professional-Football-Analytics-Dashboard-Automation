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
import { Menu, RefreshCw } from "lucide-react";

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
      return <div className="space-y-4 sm:space-y-6 p-3 sm:p-4 lg:p-6">
          <Skeleton className="h-6 sm:h-8 w-48 sm:w-64 bg-club-gold/10" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
            <Skeleton className="h-40 sm:h-60 lg:h-80 w-full bg-club-gold/10" />
            <Skeleton className="h-40 sm:h-60 lg:h-80 w-full bg-club-gold/10" />
            <Skeleton className="h-40 sm:h-60 lg:h-80 w-full bg-club-gold/10" />
          </div>
        </div>;
    }
    if (error) {
      return <div className="p-3 sm:p-4 lg:p-6">
          <Alert className="bg-club-gold/10 border-club-gold/30">
            <AlertDescription className="flex flex-col gap-4">
              <p className="text-sm sm:text-base">Error loading user profile: {error}</p>
              <Button variant="outline" className="w-fit border-club-gold/30 hover:bg-club-gold/10 hover:text-club-gold min-h-[44px]" onClick={handleRefresh}>
                <RefreshCw size={16} className="mr-2" />
                Retry Loading Data
              </Button>
            </AlertDescription>
          </Alert>
        </div>;
    }
    if (!profile) {
      return <div className="p-3 sm:p-4 lg:p-6">
          <Alert className="bg-club-gold/10 border-club-gold/30">
            <AlertDescription className="flex flex-col gap-4">
              <p className="text-sm sm:text-base">User profile not found. Please try refreshing the page or contact an administrator.</p>
              <Button variant="outline" className="w-fit border-club-gold/30 hover:bg-club-gold/10 hover:text-club-gold min-h-[44px]" onClick={handleRefresh}>
                <RefreshCw size={16} className="mr-2" />
                Retry Loading Data
              </Button>
            </AlertDescription>
          </Alert>
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
  return <div className="flex h-screen bg-club-black text-club-light-gray transition-colors duration-300">
      {showSidebar && <DashboardSidebar />}
      
      <div className="flex-1 overflow-auto min-w-0">
        <header className="border-b border-club-gold/20 bg-club-black sticky top-0 z-20 transition-colors duration-300">
          <div className="flex justify-between items-center px-3 sm:px-4 lg:px-6 py-3 gap-2 sm:gap-4">
            {/* Left section - Title and page info */}
            <div className="flex-1 min-w-0">
              <h1 className="text-sm sm:text-base lg:text-lg xl:text-xl font-bold text-club-gold truncate">
                {t('header.title')}
              </h1>
              <p className="text-xs sm:text-sm text-club-light-gray/70 truncate">
                {profileLoading ? <Skeleton className="h-3 sm:h-4 w-20 sm:w-24 lg:w-32 bg-club-gold/10 inline-block" /> : profile?.role ? `${profile.role.charAt(0).toUpperCase() + profile.role.slice(1)} ${t('header.dashboard')}` : t('header.dashboard')}
              </p>
            </div>
            
            {/* Right section - Controls */}
            <div className="flex items-center gap-1.5 sm:gap-2 lg:gap-3 flex-shrink-0">
              {/* Language Selector */}
              <LanguageSelector />
              
              {/* Theme Toggle */}
              <ThemeToggle />
              
              {/* Refresh Button */}
              <Button variant="outline" size="icon" className="text-club-light-gray border-club-gold/20 hover:bg-club-gold/10 hover:text-club-gold h-9 w-9 sm:h-10 sm:w-10" onClick={handleRefresh} title="Refresh data">
                <RefreshCw size={16} className="sm:hidden" />
                <RefreshCw size={18} className="hidden sm:block" />
              </Button>
              
              {/* Menu Toggle */}
              <button onClick={() => setShowSidebar(!showSidebar)} className="p-2 rounded-md text-club-light-gray hover:bg-club-gold/10 hover:text-club-gold transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center" title="Toggle sidebar">
                <Menu size={16} className="sm:hidden" />
                <Menu size={18} className="hidden sm:block" />
              </button>
            </div>
          </div>
        </header>
        
        <main className="bg-club-black transition-colors duration-300 w-full">
          {/* TEST MODE indicator as first element */}
          {!profileLoading && profile && <div className="p-3 sm:p-4 lg:p-6 pb-0">
              <RoleTester />
            </div>}
          
          {renderDashboardContent()}
        </main>
      </div>

      {/* Back to Top Button */}
      <BackToTopButton />
    </div>;
};
export default Dashboard;
