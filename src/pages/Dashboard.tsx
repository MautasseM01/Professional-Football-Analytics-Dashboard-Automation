
import { useState, useEffect } from "react";
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
import { RoleTester } from "@/components/RoleTester";
import { PullToRefresh } from "@/components/ui/pull-to-refresh";
import { RefreshCw } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

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
  const isMobile = useIsMobile();

  // PWA installation
  useEffect(() => {
    // Register service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('SW registered: ', registration);
        })
        .catch((registrationError) => {
          console.log('SW registration failed: ', registrationError);
        });
    }

    // Add manifest link if not present
    if (!document.querySelector('link[rel="manifest"]')) {
      const manifestLink = document.createElement('link');
      manifestLink.rel = 'manifest';
      manifestLink.href = '/manifest.json';
      document.head.appendChild(manifestLink);
    }

    // Add meta tags for mobile
    const viewport = document.querySelector('meta[name="viewport"]');
    if (!viewport) {
      const viewportMeta = document.createElement('meta');
      viewportMeta.name = 'viewport';
      viewportMeta.content = 'width=device-width, initial-scale=1.0, viewport-fit=cover';
      document.head.appendChild(viewportMeta);
    }

    // Add theme color
    const themeColor = document.querySelector('meta[name="theme-color"]');
    if (!themeColor) {
      const themeColorMeta = document.createElement('meta');
      themeColorMeta.name = 'theme-color';
      themeColorMeta.content = '#d4af37';
      document.head.appendChild(themeColorMeta);
    }
  }, []);

  const handleRefresh = async () => {
    console.log("Manual refresh triggered");
    await refreshData();
  };

  // Render appropriate content based on user role
  const renderDashboardContent = () => {
    if (profileLoading) {
      return <div className="space-y-3 sm:space-y-4 lg:space-y-6 p-2 sm:p-3 lg:p-6">
          <Skeleton className="h-6 sm:h-8 w-32 sm:w-48 lg:w-64 bg-club-gold/10" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 lg:gap-6">
            <Skeleton className="h-32 sm:h-48 lg:h-60 w-full bg-club-gold/10" />
            <Skeleton className="h-32 sm:h-48 lg:h-60 w-full bg-club-gold/10" />
            <Skeleton className="h-32 sm:h-48 lg:h-60 w-full bg-club-gold/10" />
          </div>
        </div>;
    }
    if (error) {
      return <div className="p-2 sm:p-3 lg:p-6">
          <Alert className="bg-club-gold/10 border-club-gold/30">
            <AlertDescription className="flex flex-col gap-3">
              <p className="text-sm">Error loading user profile: {error}</p>
              <Button variant="outline" className="w-fit border-club-gold/30 hover:bg-club-gold/10 hover:text-club-gold min-h-[44px]" onClick={handleRefresh}>
                <RefreshCw size={16} className="mr-2" />
                Retry Loading Data
              </Button>
            </AlertDescription>
          </Alert>
        </div>;
    }
    if (!profile) {
      return <div className="p-2 sm:p-3 lg:p-6">
          <Alert className="bg-club-gold/10 border-club-gold/30">
            <AlertDescription className="flex flex-col gap-3">
              <p className="text-sm">User profile not found. Please try refreshing the page or contact an administrator.</p>
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

  return (
    <div className="flex h-screen bg-club-black text-club-light-gray transition-colors duration-300 w-full">
      {/* Sidebar - only show on desktop */}
      {!isMobile && <DashboardSidebar />}
      
      {/* Mobile sidebar - handled within DashboardSidebar component */}
      {isMobile && <DashboardSidebar />}
      
      <div className={`flex-1 overflow-auto min-w-0 ${isMobile ? 'pt-12' : ''}`}>
        <header className="border-b border-club-gold/20 bg-club-black sticky top-0 z-20 transition-colors duration-300">
          <div className={`flex justify-between items-center py-2 gap-2 ${isMobile ? 'px-14 pr-2' : 'px-3 sm:px-4 lg:px-6'}`}>
            {/* Left section - Title and page info */}
            <div className="flex-1 min-w-0">
              <h1 className={`font-bold text-club-gold truncate ${isMobile ? 'text-sm' : 'text-sm sm:text-base lg:text-lg xl:text-xl'}`}>
                {t('header.title')}
              </h1>
              <p className={`text-club-light-gray/70 truncate ${isMobile ? 'text-xs' : 'text-xs sm:text-sm'}`}>
                {profileLoading ? <Skeleton className="h-3 w-16 bg-club-gold/10 inline-block" /> : profile?.role ? `${profile.role.charAt(0).toUpperCase() + profile.role.slice(1)} ${t('header.dashboard')}` : t('header.dashboard')}
              </p>
            </div>
            
            {/* Right section - Controls */}
            <div className="flex items-center gap-1 flex-shrink-0">
              {/* Language Selector */}
              <LanguageSelector />
              
              {/* Theme Toggle */}
              <ThemeToggle />
              
              {/* Refresh Button */}
              <Button variant="outline" size="icon" className="text-club-light-gray border-club-gold/20 hover:bg-club-gold/10 hover:text-club-gold h-9 w-9 min-h-[44px] min-w-[44px]" onClick={handleRefresh} title="Refresh data">
                <RefreshCw size={16} />
              </Button>
            </div>
          </div>
        </header>
        
        <main className="bg-club-black transition-colors duration-300 w-full">
          {/* Pull to refresh wrapper */}
          <PullToRefresh onRefresh={handleRefresh} enabled={isMobile}>
            {/* TEST MODE indicator as first element */}
            {!profileLoading && profile && <div className="p-2 sm:p-3 lg:p-6 pb-0">
                <RoleTester />
              </div>}
            
            {renderDashboardContent()}
          </PullToRefresh>
        </main>
      </div>

      {/* Back to Top Button */}
      <BackToTopButton />
    </div>
  );
};

export default Dashboard;
