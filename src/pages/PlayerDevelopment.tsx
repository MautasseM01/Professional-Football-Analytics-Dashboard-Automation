
import { useState } from "react";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { usePlayerData } from "@/hooks/use-player-data";
import { useDevelopmentData } from "@/hooks/use-development-data";
import { useUserProfile } from "@/hooks/use-user-profile";
import { PlayerSelector } from "@/components/PlayerSelector";
import { RoleBasedContent } from "@/components/RoleBasedContent";
import { BackToTopButton } from "@/components/BackToTopButton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { PlayerDevelopmentHeader } from "@/components/development/PlayerDevelopmentHeader";
import { PlayerDevelopmentTabs } from "@/components/development/PlayerDevelopmentTabs";
import { DevelopmentPathwayVisualizer } from "@/components/development/DevelopmentPathwayVisualizer";
import { DevelopmentMilestonesTimeline } from "@/components/development/DevelopmentMilestonesTimeline";
import { PlayerDevelopmentInsights } from "@/components/development/PlayerDevelopmentInsights";
import { Target, Award } from "lucide-react";

const PlayerDevelopment = () => {
  const { players, selectedPlayer, selectPlayer, loading, refreshData } = usePlayerData();
  const { 
    pathways, 
    milestones, 
    assessments, 
    communications, 
    educationalProgress, 
    recommendations,
    loading: developmentLoading,
    error: developmentError
  } = useDevelopmentData();
  const { profile } = useUserProfile();
  const [showSidebar, setShowSidebar] = useState(true);

  const handleRefresh = () => {
    console.log("Manual refresh triggered");
    refreshData();
  };

  // Mock development data for fallback - in real app this would come from API
  const developmentData = {
    goals: [
      {
        id: 1,
        title: "Improve Shot Accuracy",
        target: 75,
        current: 68,
        deadline: "2024-03-15",
        status: "in_progress",
        category: "Technical"
      },
      {
        id: 2,
        title: "Increase Pass Completion Rate",
        target: 85,
        current: 82,
        deadline: "2024-02-28",
        status: "on_track",
        category: "Technical"
      },
      {
        id: 3,
        title: "Build Physical Strength",
        target: 100,
        current: 75,
        deadline: "2024-04-01",
        status: "in_progress",
        category: "Physical"
      }
    ],
    trainingRecommendations: [
      {
        type: "Technical",
        exercises: ["1v1 finishing drills", "Target practice", "Weak foot training"],
        frequency: "3x per week"
      },
      {
        type: "Physical", 
        exercises: ["Strength training", "Sprint intervals", "Agility ladders"],
        frequency: "2x per week"
      },
      {
        type: "Tactical",
        exercises: ["Position play", "Movement patterns", "Decision making"],
        frequency: "Daily"
      }
    ],
    coachFeedback: [
      {
        date: "2024-01-15",
        coach: "John Smith",
        feedback: "Great improvement in positioning. Continue working on first touch under pressure.",
        rating: 4
      },
      {
        date: "2024-01-08",
        coach: "John Smith", 
        feedback: "Excellent work rate in training. Focus on communication with teammates during matches.",
        rating: 5
      }
    ]
  };

  const isLoading = loading || developmentLoading;

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-900 via-club-black to-slate-900 dark:from-slate-900 dark:via-club-black dark:to-slate-900 text-gray-100 dark:text-gray-100 transition-colors duration-300">
      {showSidebar && <DashboardSidebar />}
      
      <div className="flex-1 overflow-auto min-w-0">
        <PlayerDevelopmentHeader 
          onRefresh={handleRefresh}
          onToggleSidebar={() => setShowSidebar(!showSidebar)}
        />
        
        <main className="bg-transparent transition-colors duration-300 w-full">
          <div className="space-y-4 sm:space-y-6 p-4 sm:p-6">
            {/* Role-based access information */}
            <RoleBasedContent allowedRoles={['player']}>
              <Alert className="bg-club-gold/10 border-club-gold/30">
                <Target className="h-4 w-4" />
                <AlertDescription className="text-club-light-gray">
                  You can view your personal development goals and track your progress.
                </AlertDescription>
              </Alert>
            </RoleBasedContent>

            {/* Development Error State */}
            {developmentError && (
              <Alert className="bg-red-500/10 border-red-500/30">
                <AlertDescription className="text-red-400">
                  Error loading development data: {developmentError}
                </AlertDescription>
              </Alert>
            )}

            {/* Player Selector - Hidden for player role */}
            <RoleBasedContent 
              allowedRoles={['admin', 'management', 'coach', 'analyst', 'performance_director']}
              fallback={null}
            >
              <PlayerSelector
                players={players}
                selectedPlayer={selectedPlayer}
                onPlayerSelect={selectPlayer}
                loading={isLoading}
              />
            </RoleBasedContent>

            {/* Loading State */}
            {isLoading && (
              <div className="flex items-center justify-center min-h-[50vh]">
                <div className="animate-spin w-8 h-8 border-4 border-club-gold border-t-transparent rounded-full"></div>
              </div>
            )}

            {/* Main Content */}
            {selectedPlayer && !isLoading ? (
              <div className="space-y-6">
                {/* Enhanced Development Components */}
                <RoleBasedContent 
                  allowedRoles={['admin', 'management', 'coach', 'analyst', 'performance_director']}
                  fallback={null}
                >
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <DevelopmentPathwayVisualizer 
                      players={[selectedPlayer]} 
                      pathways={pathways.filter(p => p.player_id === selectedPlayer.id)} 
                    />
                    <DevelopmentMilestonesTimeline 
                      milestones={milestones.filter(m => m.player_id === selectedPlayer.id)} 
                      players={[selectedPlayer]}
                      selectedPlayerId={selectedPlayer.id}
                    />
                  </div>
                  
                  <PlayerDevelopmentInsights 
                    pathways={pathways.filter(p => p.player_id === selectedPlayer.id)}
                    milestones={milestones.filter(m => m.player_id === selectedPlayer.id)}
                    assessments={assessments.filter(a => a.player_id === selectedPlayer.id)}
                    communications={communications.filter(c => c.player_id === selectedPlayer.id)}
                    educationalProgress={educationalProgress.filter(e => e.player_id === selectedPlayer.id)}
                    recommendations={recommendations.filter(r => r.player_id === selectedPlayer.id)}
                    players={[selectedPlayer]}
                  />
                </RoleBasedContent>

                {/* Original Development Tabs */}
                <PlayerDevelopmentTabs developmentData={developmentData} />
              </div>
            ) : !isLoading && (
              <div className="flex items-center justify-center min-h-[50vh] text-center px-4">
                <div className="space-y-2">
                  <Award className="h-12 w-12 text-club-gold/50 mx-auto" />
                  <p className="text-base sm:text-lg text-club-light-gray">
                    {profile?.role === 'player' 
                      ? "Loading your development plan..."
                      : "No player selected"
                    }
                  </p>
                  <p className="text-xs sm:text-sm text-club-light-gray/60">
                    {profile?.role === 'player' 
                      ? "Please wait while we load your goals"
                      : "Please select a player to view their development plan"
                    }
                  </p>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      <BackToTopButton />
    </div>
  );
};

export default PlayerDevelopment;
