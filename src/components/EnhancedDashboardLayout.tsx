
import React, { useState } from "react";
import { IOSDashboardGrid } from "./IOSDashboardGrid";
import { IOSBottomSheet } from "./IOSBottomSheet";
import { useUserProfile } from "@/hooks/use-user-profile";
import { usePlayerData } from "@/hooks/use-player-data";

interface EnhancedDashboardLayoutProps {
  children: React.ReactNode;
}

export const EnhancedDashboardLayout = ({ children }: EnhancedDashboardLayoutProps) => {
  const { profile } = useUserProfile();
  const { refreshData } = usePlayerData();
  const [selectedPlayer, setSelectedPlayer] = useState<any>(null);
  const [bottomSheetOpen, setBottomSheetOpen] = useState(false);

  const handleRefresh = async () => {
    await refreshData();
  };

  const handlePlayerSelect = (player: any) => {
    setSelectedPlayer(player);
    setBottomSheetOpen(true);
  };

  const getDashboardTitle = () => {
    if (!profile?.role) return "Dashboard";
    
    const roleNames = {
      player: "Player Dashboard",
      coach: "Coach Dashboard", 
      analyst: "Analyst Dashboard",
      performance_director: "Performance Director",
      management: "Management Dashboard",
      admin: "Admin Dashboard",
      unassigned: "Dashboard"
    };

    return roleNames[profile.role as keyof typeof roleNames] || "Dashboard";
  };

  const getWelcomeMessage = () => {
    if (!profile?.full_name) return "Welcome back";
    return `Welcome back, ${profile.full_name.split(' ')[0]}`;
  };

  return (
    <>
      <IOSDashboardGrid
        title={getDashboardTitle()}
        subtitle={getWelcomeMessage()}
        onRefresh={handleRefresh}
        className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900"
      >
        {children}
      </IOSDashboardGrid>

      {/* Player Details Bottom Sheet */}
      <IOSBottomSheet
        isOpen={bottomSheetOpen}
        onClose={() => setBottomSheetOpen(false)}
        title={selectedPlayer ? `${selectedPlayer.name} - Details` : "Player Details"}
        initialHeight="half"
      >
        {selectedPlayer && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {selectedPlayer.goals || 0}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Goals</div>
              </div>
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {selectedPlayer.assists || 0}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Assists</div>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold text-gray-900 dark:text-white">Performance Metrics</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Pass Accuracy</span>
                  <span className="font-medium">{selectedPlayer.pass_accuracy || 0}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Distance Covered</span>
                  <span className="font-medium">{selectedPlayer.distance_covered || 0} km</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Tackles Won</span>
                  <span className="font-medium">{selectedPlayer.tackles_won || 0}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </IOSBottomSheet>
    </>
  );
};
