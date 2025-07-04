import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserProfile, Player } from "@/types";
import { HeartPulse, TrendingUp, BarChart3, Star, Target, Users, Calendar, Activity } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { PerformanceTrendsCard } from "../PerformanceTrends";
import { SquadAvailabilityCalendar } from "./performance-director/SquadAvailabilityCalendar";
import { DevelopmentTrajectories } from "./performance-director/DevelopmentTrajectories";
import { PerformanceBenchmarking } from "./performance-director/PerformanceBenchmarking";
import { PlayerPerformanceMonitor } from "./performance-director/PlayerPerformanceMonitor";
import { useState } from "react";
import { useSquadAvailability } from "@/hooks/use-squad-availability";
import { useDevelopmentProgress } from "@/hooks/use-development-progress";
import { usePerformanceBenchmarks } from "@/hooks/use-performance-benchmarks";
import { useYouthTeams } from "@/hooks/use-youth-teams";
import { usePlayerData } from "@/hooks/use-player-data";
import { LoadingOverlay } from "@/components/LoadingOverlay";

interface PerformanceDirectorDashboardProps {
  profile: UserProfile;
}

export const PerformanceDirectorDashboard = ({ profile }: PerformanceDirectorDashboardProps) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'availability' | 'development' | 'benchmarking' | 'performance'>('overview');

  // Fetch real data from database
  const { data: squadAvailability, isLoading: squadLoading } = useSquadAvailability();
  const { data: developmentProgress, isLoading: developmentLoading } = useDevelopmentProgress();
  const { data: performanceBenchmarks, isLoading: benchmarksLoading } = usePerformanceBenchmarks();
  const { data: youthTeams, isLoading: teamsLoading } = useYouthTeams();
  const { players } = usePlayerData();

  // Use first available player for performance trends
  const samplePlayer = players && players.length > 0 ? players[0] : {
    id: 1,
    name: "Loading Player Data...",
    position: "Midfielder",
    matches: 0,
    distance_covered: 0,
    passes_attempted: 0,
    passes_completed: 0,
    shots_total: 0,
    shots_on_target: 0,
    tackles_attempted: 0,
    tackles_won: 0,
    sprintDistance: 0,
    maxSpeed: 0,
    number: 0,
    heatmapUrl: "",
    reportUrl: "",
    goals: 0,
    assists: 0,
    match_rating: 0,
    pass_accuracy: 0,
    minutes_played: 0,
    aerial_duels_won: 0,
    aerial_duels_attempted: 0,
    clearances: 0,
    interceptions: 0,
    dribbles_successful: 0,
    dribbles_attempted: 0,
    crosses_completed: 0,
    crosses_attempted: 0,
    corners_taken: 0,
    fouls_suffered: 0,
    fouls_committed: 0,
    clean_sheets: 0,
    saves: 0,
    season: "2024-25",
    touches: 0,
    possession_won: 0,
    possession_lost: 0
  } as Player;

  const isLoading = squadLoading || developmentLoading || benchmarksLoading || teamsLoading;

  return (
    <div className="space-y-3 xs:space-y-4 sm:space-y-5 md:space-y-6 lg:space-y-8 p-2 xs:p-3 sm:p-4 md:p-6 lg:p-8 relative">
      <LoadingOverlay isLoading={isLoading} message="Loading performance data..." />
      
      {/* Welcome Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-lg xs:text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-club-gold px-1">
          Performance Director Dashboard
        </h1>
        <p className="text-sm xs:text-base sm:text-lg text-club-light-gray/70 px-1">
          Advanced player development and performance analysis
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        <Button
          variant={activeTab === 'overview' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setActiveTab('overview')}
          className={activeTab === 'overview' ? 'bg-club-gold text-club-black' : 'border-club-gold/30'}
        >
          <BarChart3 className="mr-2 h-4 w-4" />
          Overview
        </Button>
        <Button
          variant={activeTab === 'performance' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setActiveTab('performance')}
          className={activeTab === 'performance' ? 'bg-club-gold text-club-black' : 'border-club-gold/30'}
        >
          <Activity className="mr-2 h-4 w-4" />
          Performance Monitor
        </Button>
        <Button
          variant={activeTab === 'availability' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setActiveTab('availability')}
          className={activeTab === 'availability' ? 'bg-club-gold text-club-black' : 'border-club-gold/30'}
        >
          <Calendar className="mr-2 h-4 w-4" />
          Squad Availability
        </Button>
        <Button
          variant={activeTab === 'development' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setActiveTab('development')}
          className={activeTab === 'development' ? 'bg-club-gold text-club-black' : 'border-club-gold/30'}
        >
          <Target className="mr-2 h-4 w-4" />
          Development
        </Button>
        <Button
          variant={activeTab === 'benchmarking' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setActiveTab('benchmarking')}
          className={activeTab === 'benchmarking' ? 'bg-club-gold text-club-black' : 'border-club-gold/30'}
        >
          <TrendingUp className="mr-2 h-4 w-4" />
          Benchmarking
        </Button>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <>
          {/* Main Stats Cards - Now using real data */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
            {/* Squad Availability - Real Data */}
            <Card className="bg-club-dark-gray border-club-gold/20 hover:bg-club-dark-gray/80 transition-all duration-300">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center text-club-gold text-base sm:text-lg">
                  <HeartPulse className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                  Squad Availability
                </CardTitle>
                <CardDescription className="text-club-light-gray/70 text-xs sm:text-sm">
                  Player fitness status
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-club-gold">
                    {squadAvailability?.availablePlayers || 0}
                  </div>
                  <div className="text-xs sm:text-sm text-club-light-gray/70">Available</div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-center">
                  <div className="bg-club-black/40 rounded py-2 px-1">
                    <div className="text-lg font-bold text-amber-500">
                      {squadAvailability?.lightTraining || 0}
                    </div>
                    <div className="text-xs text-club-light-gray/70">Light Training</div>
                  </div>
                  <div className="bg-club-black/40 rounded py-2 px-1">
                    <div className="text-lg font-bold text-red-500">
                      {squadAvailability?.injuredPlayers || 0}
                    </div>
                    <div className="text-xs text-club-light-gray/70">Injured</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Development Progress - Real Data */}
            <Card className="bg-club-dark-gray border-club-gold/20 hover:bg-club-dark-gray/80 transition-all duration-300">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center text-club-gold text-base sm:text-lg">
                  <TrendingUp className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                  Development Progress
                </CardTitle>
                <CardDescription className="text-club-light-gray/70 text-xs sm:text-sm">
                  Player improvement tracking
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-club-gold">
                    {developmentProgress?.targetsMetPercentage || 0}%
                  </div>
                  <div className="text-xs sm:text-sm text-club-light-gray/70">Targets Met</div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-center">
                  <div className="bg-club-black/40 rounded py-2 px-1">
                    <div className="text-lg font-bold text-green-500">
                      {developmentProgress?.onTrackCount || 0}
                    </div>
                    <div className="text-xs text-club-light-gray/70">On Track</div>
                  </div>
                  <div className="bg-club-black/40 rounded py-2 px-1">
                    <div className="text-lg font-bold text-amber-500">
                      {developmentProgress?.needFocusCount || 0}
                    </div>
                    <div className="text-xs text-club-light-gray/70">Need Focus</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Performance Analysis - Real Data */}
            <Card className="bg-club-dark-gray border-club-gold/20 hover:bg-club-dark-gray/80 transition-all duration-300">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center text-club-gold text-base sm:text-lg">
                  <BarChart3 className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                  Performance Analysis
                </CardTitle>
                <CardDescription className="text-club-light-gray/70 text-xs sm:text-sm">
                  League comparisons
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-club-gold">
                    {performanceBenchmarks?.leaguePercentile || 0}th
                  </div>
                  <div className="text-xs sm:text-sm text-club-light-gray/70">Percentile</div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-center">
                  <div className="bg-club-black/40 rounded py-2 px-1">
                    <div className="text-lg font-bold text-green-500">
                      Rank {performanceBenchmarks?.leagueRanking || 0}
                    </div>
                    <div className="text-xs text-club-light-gray/70">League Position</div>
                  </div>
                  <div className="bg-club-black/40 rounded py-2 px-1">
                    <div className="text-lg font-bold text-blue-500">
                      {performanceBenchmarks?.trendDirection === 'up' ? '↗' : '→'}
                    </div>
                    <div className="text-xs text-club-light-gray/70">
                      {performanceBenchmarks?.trendDirection === 'up' ? 'Improving' : 'Stable'}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Enhanced Performance Trends */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <div className="lg:col-span-2">
              <PerformanceTrendsCard player={samplePlayer} />
            </div>
          </div>

          {/* Quick Actions */}
          <Card className="bg-club-dark-gray border-club-gold/20">
            <CardHeader>
              <CardTitle className="flex items-center text-club-gold">
                <Star className="mr-2 h-5 w-5" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <Button 
                variant="outline" 
                className="border-club-gold/20 hover:bg-club-gold/10"
                onClick={() => setActiveTab('performance')}
              >
                Performance Monitor
              </Button>
              <Button 
                variant="outline" 
                className="border-club-gold/20 hover:bg-club-gold/10"
                onClick={() => setActiveTab('development')}
              >
                Development Report
              </Button>
              <Button 
                variant="outline" 
                className="border-club-gold/20 hover:bg-club-gold/10"
                onClick={() => setActiveTab('benchmarking')}
              >
                Performance Benchmarks
              </Button>
              <Button 
                variant="outline" 
                className="border-club-gold/20 hover:bg-club-gold/10"
                onClick={() => setActiveTab('availability')}
              >
                Squad Availability
              </Button>
              <Button 
                variant="outline" 
                className="border-club-gold/20 hover:bg-club-gold/10"
              >
                Export Reports
              </Button>
            </CardContent>
          </Card>
        </>
      )}

      {activeTab === 'performance' && <PlayerPerformanceMonitor />}
      {activeTab === 'availability' && <SquadAvailabilityCalendar />}
      {activeTab === 'development' && <DevelopmentTrajectories />}
      {activeTab === 'benchmarking' && <PerformanceBenchmarking />}
    </div>
  );
};
