
import React, { useState } from "react";
import { IOSDashboardGrid } from "./IOSDashboardGrid";
import { IOSBottomSheet } from "./IOSBottomSheet";
import { IOSContextMenu } from "./IOSContextMenu";
import { IOSLoadingState } from "./IOSLoadingState";
import { TouchFeedbackButton } from "./TouchFeedbackButton";
import { useUserProfile } from "@/hooks/use-user-profile";
import { usePlayerData } from "@/hooks/use-player-data";
import { useContextMenu } from "@/hooks/use-context-menu";
import { useSwipeGestures } from "@/hooks/use-swipe-gestures";
import { Share, BookOpen, TrendingUp, User, MoreHorizontal } from "lucide-react";

interface EnhancedDashboardLayoutProps {
  children: React.ReactNode;
}

export const EnhancedDashboardLayout = ({ children }: EnhancedDashboardLayoutProps) => {
  const { profile } = useUserProfile();
  const { refreshData, loading, error } = usePlayerData();
  const [selectedPlayer, setSelectedPlayer] = useState<any>(null);
  const [bottomSheetOpen, setBottomSheetOpen] = useState(false);
  const [currentSection, setCurrentSection] = useState(0);

  const handleRefresh = async () => {
    await refreshData();
  };

  const handlePlayerSelect = (player: any) => {
    setSelectedPlayer(player);
    setBottomSheetOpen(true);
  };

  // Context menu for quick actions
  const contextMenuOptions = [
    {
      label: "Share Dashboard",
      icon: Share,
      action: () => {
        if (navigator.share) {
          navigator.share({
            title: "Football Dashboard",
            url: window.location.href
          });
        }
      }
    },
    {
      label: "View Reports",
      icon: BookOpen,
      action: () => console.log("View reports")
    },
    {
      label: "Analytics",
      icon: TrendingUp,
      action: () => console.log("View analytics")
    },
    {
      label: "Profile Settings",
      icon: User,
      action: () => console.log("Profile settings")
    }
  ];

  const {
    isVisible: contextMenuVisible,
    position: contextMenuPosition,
    contextMenuProps,
    handleOptionSelect,
    closeMenu
  } = useContextMenu({ options: contextMenuOptions });

  // Swipe gestures for section navigation
  const sections = ['Overview', 'Performance', 'Analytics', 'Reports'];
  
  const { swipeProps } = useSwipeGestures({
    onSwipeLeft: () => {
      if (currentSection < sections.length - 1) {
        setCurrentSection(currentSection + 1);
      }
    },
    onSwipeRight: () => {
      if (currentSection > 0) {
        setCurrentSection(currentSection - 1);
      }
    },
    threshold: 100
  });

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
    <div {...swipeProps}>
      <IOSLoadingState
        isLoading={loading}
        error={error}
        onRetry={handleRefresh}
        skeletonRows={4}
      >
        <IOSDashboardGrid
          title={getDashboardTitle()}
          subtitle={getWelcomeMessage()}
          onRefresh={handleRefresh}
          className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900"
        >
          {/* Section Navigation */}
          <div className="col-span-full mb-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex space-x-2 overflow-x-auto">
                {sections.map((section, index) => (
                  <TouchFeedbackButton
                    key={section}
                    variant={currentSection === index ? "default" : "outline"}
                    size="sm"
                    className={`whitespace-nowrap ${
                      currentSection === index 
                        ? "bg-blue-600 text-white" 
                        : "bg-white/50 dark:bg-slate-800/50"
                    }`}
                    onClick={() => setCurrentSection(index)}
                  >
                    {section}
                  </TouchFeedbackButton>
                ))}
              </div>
              
              {/* Context menu trigger */}
              <div {...contextMenuProps}>
                <TouchFeedbackButton
                  variant="outline"
                  size="sm"
                  className="bg-white/50 dark:bg-slate-800/50"
                >
                  <MoreHorizontal size={16} />
                </TouchFeedbackButton>
              </div>
            </div>
            
            {/* Section indicator */}
            <div className="flex space-x-1 justify-center">
              {sections.map((_, index) => (
                <div
                  key={index}
                  className={`h-1 w-8 rounded-full transition-all duration-300 ${
                    currentSection === index 
                      ? "bg-blue-600" 
                      : "bg-gray-300 dark:bg-gray-600"
                  }`}
                />
              ))}
            </div>
          </div>

          {children}
        </IOSDashboardGrid>
      </IOSLoadingState>

      {/* Context Menu */}
      <IOSContextMenu
        isVisible={contextMenuVisible}
        position={contextMenuPosition}
        options={contextMenuOptions}
        onOptionSelect={handleOptionSelect}
        onClose={closeMenu}
      />

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
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-xl ios-touch-feedback">
                <div className="text-ios-title2 font-bold text-blue-600 dark:text-blue-400">
                  {selectedPlayer.goals || 0}
                </div>
                <div className="text-ios-caption text-gray-600 dark:text-gray-400">Goals</div>
              </div>
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-xl ios-touch-feedback">
                <div className="text-ios-title2 font-bold text-green-600 dark:text-green-400">
                  {selectedPlayer.assists || 0}
                </div>
                <div className="text-ios-caption text-gray-600 dark:text-gray-400">Assists</div>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-ios-headline font-semibold text-gray-900 dark:text-white">
                Performance Metrics
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-ios-body text-gray-600 dark:text-gray-400">Pass Accuracy</span>
                  <span className="text-ios-body font-medium">{selectedPlayer.pass_accuracy || 0}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ios-body text-gray-600 dark:text-gray-400">Distance Covered</span>
                  <span className="text-ios-body font-medium">{selectedPlayer.distance_covered || 0} km</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ios-body text-gray-600 dark:text-gray-400">Tackles Won</span>
                  <span className="text-ios-body font-medium">{selectedPlayer.tackles_won || 0}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </IOSBottomSheet>
    </div>
  );
};
