
import { useState } from "react";
import { usePlayerData } from "@/hooks/use-player-data";
import { useUserProfile } from "@/hooks/use-user-profile";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { PlayerDashboard } from "@/components/dashboards/PlayerDashboard";
import { CoachDashboard } from "@/components/dashboards/CoachDashboard";
import { AnalystDashboard } from "@/components/dashboards/AnalystDashboard";
import { PerformanceDirectorDashboard } from "@/components/dashboards/PerformanceDirectorDashboard";
import { ManagementDashboard } from "@/components/dashboards/ManagementDashboard";
import { AdminDashboard } from "@/components/dashboards/AdminDashboard";
import { UnassignedRoleDashboard } from "@/components/dashboards/UnassignedRoleDashboard";
import { ComplianceWidget } from "@/components/ComplianceWidget";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Menu, RefreshCw, UserIcon } from "lucide-react";

const Dashboard = () => {
  const { loading: playerDataLoading, refreshData } = usePlayerData();
  const { profile, loading: profileLoading, error } = useUserProfile();
  const [showSidebar, setShowSidebar] = useState(true);

  const handleRefresh = () => {
    console.log("Manual refresh triggered");
    refreshData();
  };

  // Render appropriate content based on user role
  const renderDashboardContent = () => {
    if (profileLoading) {
      return (
        <div className="space-y-6">
          <Skeleton className="h-8 w-64 bg-club-gold/10" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Skeleton className="h-80 w-full bg-club-gold/10" />
            <Skeleton className="h-80 w-full bg-club-gold/10" />
            <Skeleton className="h-80 w-full bg-club-gold/10" />
          </div>
        </div>
      );
    }

    if (error) {
      return (
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
      );
    }

    if (!profile) {
      return (
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
    <div className="flex h-screen bg-club-black text-club-light-gray">
      {showSidebar && <DashboardSidebar />}
      
      <div className="flex-1 overflow-auto">
        <header className="border-b border-club-gold/20 bg-club-black sticky top-0 z-10">
          <div className="flex justify-between items-center px-6 py-4">
            <div>
              <h1 className="text-xl font-bold text-club-gold">Striker Insights Arena</h1>
              <p className="text-sm text-club-light-gray/70">
                {profileLoading ? (
                  <Skeleton className="h-4 w-40 bg-club-gold/10 inline-block" />
                ) : profile?.role ? (
                  `${profile.role.charAt(0).toUpperCase() + profile.role.slice(1)} Dashboard`
                ) : (
                  "Dashboard"
                )}
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              {!profileLoading && profile && (
                <div className="flex items-center mr-2 px-3 py-1.5 bg-club-dark-gray rounded-full border border-club-gold/20">
                  <UserIcon size={16} className="text-club-gold mr-2" />
                  <span className="text-club-light-gray text-sm">
                    {profile.full_name || profile.email || "User"}
                  </span>
                </div>
              )}
              <Button 
                variant="outline" 
                size="icon"
                className="text-club-light-gray border-club-gold/20 hover:bg-club-gold/10 hover:text-club-gold"
                onClick={handleRefresh}
                title="Refresh data"
              >
                <RefreshCw size={18} />
              </Button>
              <button
                onClick={() => setShowSidebar(!showSidebar)}
                className="p-2 rounded-md text-club-light-gray hover:bg-club-gold/10 hover:text-club-gold transition-colors"
              >
                <Menu size={20} />
              </button>
            </div>
          </div>
        </header>
        
        <main className="p-6">
          <div className="mb-6" data-compliance-widget>
            <ComplianceWidget />
          </div>
          {renderDashboardContent()}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
