
import { useState } from "react";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { usePlayerData } from "@/hooks/use-player-data";
import { useUserProfile } from "@/hooks/use-user-profile";
import { PlayerStats } from "@/components/PlayerStats";
import { PlayerSelector } from "@/components/PlayerSelector";
import { RoleBasedContent } from "@/components/RoleBasedContent";
import { BackToTopButton } from "@/components/BackToTopButton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info, RotateCcw } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

const PlayerStatsPage = () => {
  const { players, selectedPlayer, selectPlayer, loading, canAccessPlayerData } = usePlayerData();
  const { profile } = useUserProfile();
  const isMobile = useIsMobile();

  return (
    <div className="flex min-h-screen bg-club-dark-bg text-club-light-gray">
      <DashboardSidebar />
      <main className={`flex-1 transition-all duration-300 ease-in-out ${isMobile ? 'pt-16' : ''}`}>
        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6">
          <div className="mb-4 sm:mb-6">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-club-gold mb-2">
              Player Analysis
            </h1>
            <p className="text-sm sm:text-base text-club-light-gray/70">
              {profile?.role === 'player' 
                ? "View your individual performance statistics and development progress"
                : "Analyze individual player performance and statistics"
              }
            </p>
          </div>

          {/* Mobile landscape orientation message */}
          {isMobile && (
            <Alert className="bg-blue-500/10 border-blue-500/30">
              <RotateCcw className="h-4 w-4" />
              <AlertDescription className="text-club-light-gray text-sm">
                For better chart viewing, try rotating your device to landscape mode.
              </AlertDescription>
            </Alert>
          )}

          {/* Role-based access information */}
          <RoleBasedContent allowedRoles={['player']}>
            <Alert className="bg-club-gold/10 border-club-gold/30">
              <Info className="h-4 w-4" />
              <AlertDescription className="text-club-light-gray text-sm sm:text-base">
                You can only view your own player statistics and performance data.
              </AlertDescription>
            </Alert>
          </RoleBasedContent>

          {/* Player Selector - Hidden for player role */}
          <RoleBasedContent 
            allowedRoles={['admin', 'management', 'coach', 'analyst', 'performance_director']}
            fallback={null}
          >
            <PlayerSelector
              players={players}
              selectedPlayer={selectedPlayer}
              onPlayerSelect={selectPlayer}
              loading={loading}
            />
          </RoleBasedContent>

          {/* Player Stats Component */}
          {selectedPlayer && (
            <PlayerStats player={selectedPlayer} />
          )}

          {/* No player selected message */}
          {!selectedPlayer && !loading && (
            <div className="flex items-center justify-center min-h-[50vh] text-center px-4">
              <div className="space-y-2">
                <p className="text-base sm:text-lg text-club-light-gray">
                  {profile?.role === 'player' 
                    ? "Loading your player profile..."
                    : "No player selected"
                  }
                </p>
                <p className="text-xs sm:text-sm text-club-light-gray/60">
                  {profile?.role === 'player' 
                    ? "Please wait while we load your statistics"
                    : "Please select a player to view their statistics"
                  }
                </p>
              </div>
            </div>
          )}
        </div>
      </main>

      <BackToTopButton />
    </div>
  );
};

export default PlayerStatsPage;
