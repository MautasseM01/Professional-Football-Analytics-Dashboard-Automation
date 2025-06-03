
import { useState } from "react";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { usePlayerData } from "@/hooks/use-player-data";
import { useRoleAccess } from "@/hooks/use-role-access";
import { PlayerStats } from "@/components/PlayerStats";
import { PlayerSelector } from "@/components/PlayerSelector";
import { RoleBasedContent } from "@/components/RoleBasedContent";
import { BackToTopButton } from "@/components/BackToTopButton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info, RotateCcw, Lock } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

const PlayerStatsPage = () => {
  const { players, selectedPlayer, selectPlayer, loading, canAccessPlayerData } = usePlayerData();
  const { profile, canViewOwnDataOnly, canViewAllPlayers, currentRole } = useRoleAccess();
  const isMobile = useIsMobile();

  return (
    <div className="flex min-h-screen bg-club-dark-bg text-club-light-gray">
      <DashboardSidebar />
      <main className={`flex-1 p-4 sm:p-6 lg:p-8 ${isMobile ? 'pt-16' : ''}`}>
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-club-gold mb-2">
              Player Analysis
            </h1>
            <p className="text-sm sm:text-base text-club-light-gray/70">
              {canViewOwnDataOnly()
                ? "View your individual performance statistics and development progress"
                : canViewAllPlayers()
                ? "Analyze individual player performance and statistics"
                : "Access to player statistics is restricted for your role"
              }
            </p>
          </div>

          {/* Mobile landscape orientation message */}
          {isMobile && (
            <Alert className="mb-6 bg-blue-500/10 border-blue-500/30">
              <RotateCcw className="h-4 w-4" />
              <AlertDescription className="text-club-light-gray text-sm">
                For better chart viewing, try rotating your device to landscape mode.
              </AlertDescription>
            </Alert>
          )}

          {/* Role-based access information for players */}
          {canViewOwnDataOnly() && (
            <Alert className="mb-6 bg-club-gold/10 border-club-gold/30">
              <Info className="h-4 w-4" />
              <AlertDescription className="text-club-light-gray text-sm sm:text-base">
                You can only view your own player statistics and performance data.
              </AlertDescription>
            </Alert>
          )}

          {/* Access denied message for unauthorized roles */}
          {!canViewAllPlayers() && !canViewOwnDataOnly() && (
            <Alert className="mb-6 bg-red-500/10 border-red-500/30">
              <Lock className="h-4 w-4" />
              <AlertDescription className="text-club-light-gray text-sm sm:text-base">
                Your current role ({currentRole}) does not have access to player statistics. 
                Please contact an administrator if you believe this is an error.
              </AlertDescription>
            </Alert>
          )}

          {/* Player Selector - Always show but with role-based content */}
          <div className="mb-6">
            <PlayerSelector
              players={players}
              selectedPlayer={selectedPlayer}
              onPlayerSelect={selectPlayer}
              loading={loading}
            />
          </div>

          {/* Player Stats Component - Only show if user has access */}
          {(canViewAllPlayers() || canViewOwnDataOnly()) && selectedPlayer && (
            <PlayerStats player={selectedPlayer} />
          )}

          {/* No player selected message */}
          {(canViewAllPlayers() || canViewOwnDataOnly()) && !selectedPlayer && !loading && (
            <div className="flex items-center justify-center min-h-[50vh] text-center px-4">
              <div className="space-y-2">
                <p className="text-base sm:text-lg text-club-light-gray">
                  {canViewOwnDataOnly()
                    ? "Loading your player profile..."
                    : "No player selected"
                  }
                </p>
                <p className="text-xs sm:text-sm text-club-light-gray/60">
                  {canViewOwnDataOnly()
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
