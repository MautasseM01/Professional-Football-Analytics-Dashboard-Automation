
import { useState } from "react";
import { usePlayerData } from "@/hooks/use-player-data";
import { useUserProfile } from "@/hooks/use-user-profile";
import { useLanguage } from "@/contexts/LanguageContext";
import { DashboardSidebar } from "@/components/DashboardSidebar";
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
import { Menu, RefreshCw, UserIcon } from "lucide-react";

const Dashboard = () => {
  const { loading: playerDataLoading, refreshData } = usePlayerData();
  const { profile, loading: profileLoading, error } = useUserProfile();
  const { t } = useLanguage();
  const [showSidebar, setShowSidebar] = useState(true);

  const handleRefresh = () => {
    console.log("Manual refresh triggered");
    refreshData();
  };

  // Render appropriate content based on user role
  const renderDashboardContent = () => {
    if (profileLoading) {
      return (
        <div className="space-y-4 sm:space-y-6 p-4 sm:p-6">
          <Skeleton className="h-6 sm:h-8 w-48 sm:w-64 bg-club-gold/10" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <Skeleton className="h-60 sm:h-80 w-full bg-club-gold/10" />
            <Skeleton className="h-60 sm:h-80 w-full bg-club-gold/10" />
            <Skeleton className="h-60 sm:h-80 w-full bg-club-gold/10" />
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="p-4 sm:p-6">
          <Alert className="bg-club-gold/10 border-club-gold/30">
            <AlertDescription className="flex flex-col gap-4">
              <p>Error loading user profile: {error}</p>
              <Button 
                variant="outline" 
                className="w-fit border-club-gold/30 hover:bg-club-gold/10 hover:text-club-gold"
                onClick={handleRefresh}
              >
                <RefreshCw size={16} className="mr-2" />
                Retry Loading Data
              </Button>
            </AlertDescription>
          </Alert>
        </div>
      );
    }

    if (!profile) {
      return (
        <div className="p-4 sm:p-6">
          <Alert className="bg-club-gold/10 border-club-gold/30">
            <AlertDescription className="flex flex-col gap-4">
              <p>User profile not found. Please try refreshing the page or contact an administrator.</p>
              <Button 
                variant="outline" 
                className="w-fit border-club-gold/30 hover:bg-club-gold/10 hover:text-club-gold"
                onClick={handleRefresh}
              >
                <RefreshCw size={16} className="mr-2" />
                Retry Loading Data
              </Button>
            </AlertDescription>
          </Alert>
        </div>
      );
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

  return (
    <div className="flex h-screen bg-club-black text-club-light-gray transition-colors duration-300">
      {showSidebar && <DashboardSidebar />}
      
      <div className="flex-1 overflow-auto min-w-0">
        <header className="border-b border-club-gold/20 bg-club-black sticky top-0 z-20 transition-colors duration-300">
          <div className="flex justify-between items-center px-3 sm:px-4 lg:px-6 py-3 sm:py-4 gap-2 sm:gap-4">
            {/* Left section - Title and page info */}
            <div className="flex-1 min-w-0">
              <h1 className="text-base sm:text-lg lg:text-xl font-bold text-club-gold truncate">
                {t('header.title')}
              </h1>
              <p className="text-xs sm:text-sm text-club-light-gray/70 truncate">
                {profileLoading ? (
                  <Skeleton className="h-3 sm:h-4 w-24 sm:w-32 lg:w-40 bg-club-gold/10 inline-block" />
                ) : profile?.role ? (
                  `${profile.role.charAt(0).toUpperCase() + profile.role.slice(1)} ${t('header.dashboard')}`
                ) : (
                  t('header.dashboard')
                )}
              </p>
            </div>
            
            {/* Right section - Controls */}
            <div className="flex items-center gap-1.5 sm:gap-2 lg:gap-3 flex-shrink-0">
              {/* User Profile - Hidden on mobile and small tablets */}
              {!profileLoading && profile && (
                <div className="hidden lg:flex items-center px-2 lg:px-3 py-1.5 bg-club-dark-gray rounded-full border border-club-gold/20 transition-colors duration-300">
                  <UserIcon size={14} className="text-club-gold mr-1.5 lg:mr-2" />
                  <span className="text-club-light-gray text-xs lg:text-sm truncate max-w-20 lg:max-w-none">
                    {profile.full_name || profile.email || "User"}
                  </span>
                </div>
              )}
              
              {/* Language Selector */}
              <LanguageSelector />
              
              {/* Theme Toggle */}
              <ThemeToggle />
              
              {/* Refresh Button */}
              <Button 
                variant="outline" 
                size="icon"
                className="text-club-light-gray border-club-gold/20 hover:bg-club-gold/10 hover:text-club-gold h-8 w-8 sm:h-9 sm:w-9 lg:h-10 lg:w-10"
                onClick={handleRefresh}
                title="Refresh data"
              >
                <RefreshCw size={14} className="sm:hidden" />
                <RefreshCw size={16} className="hidden sm:block lg:hidden" />
                <RefreshCw size={18} className="hidden lg:block" />
              </Button>
              
              {/* Menu Toggle */}
              <button
                onClick={() => setShowSidebar(!showSidebar)}
                className="p-1.5 sm:p-2 rounded-md text-club-light-gray hover:bg-club-gold/10 hover:text-club-gold transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                title="Toggle sidebar"
              >
                <Menu size={16} className="sm:hidden" />
                <Menu size={18} className="hidden sm:block lg:hidden" />
                <Menu size={20} className="hidden lg:block" />
              </button>
            </div>
          </div>
        </header>
        
        <main className="bg-club-black transition-colors duration-300 w-full">
          {renderDashboardContent()}
        </main>
      </div>

      {/* Back to Top Button */}
      <BackToTopButton />
    </div>
  );
};

export default Dashboard;
