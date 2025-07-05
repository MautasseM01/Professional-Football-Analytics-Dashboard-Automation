
import { usePlayerData } from "@/hooks/use-player-data";
import { UserProfile } from "@/types";
import { PlayerStats } from "@/components/PlayerStats";
import { PlayerSelector } from "@/components/PlayerSelector";
import { EnhancedStatCard } from "@/components/EnhancedStatCard";
import { CoachQuickActions } from "@/components/CoachQuickActions";
import { CoachMiniCalendar } from "@/components/CoachMiniCalendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, AlertTriangle, Target, TrendingUp, UserCheck, Clock, Ban } from "lucide-react";
import { ResponsiveGrid } from "../ResponsiveLayout";
import SuspensionRiskWidget from "../SuspensionRiskWidget";
import { IOSLoadingState } from "../IOSLoadingState";
import { toast } from "sonner";
import { useTeamMetrics } from "@/hooks/use-team-metrics";

interface CoachDashboardProps {
  profile: UserProfile;
}

export const CoachDashboard = ({ profile }: CoachDashboardProps) => {
  const { players, selectedPlayer, selectPlayer, loading } = usePlayerData();
  const { data: teamMetrics, isLoading: metricsLoading } = useTeamMetrics();

  const handleSquadSizeClick = () => {
    toast.info("Opening player list...");
  };

  const handleInjuriesClick = () => {
    toast.info("Opening injury report...");
  };

  const handleAvailablePlayersClick = () => {
    toast.info("Showing available players...");
  };

  const handleTrainingAttendanceClick = () => {
    toast.info("Opening training attendance...");
  };

  const handleSuspensionsClick = () => {
    toast.info("Showing suspension alerts...");
  };

  const isDataLoading = loading || metricsLoading;

  return (
    <div className="space-y-4 sm:space-y-6 p-4 sm:p-6">
      {/* Welcome Header */}
      <div className="mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-primary mb-2">
          Welcome back, {profile.full_name || "Coach"}
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Manage your team's performance and track player development
        </p>
      </div>

      {/* Enhanced Team Overview Cards */}
      <IOSLoadingState isLoading={isDataLoading} suppressDemoLoading={false}>
        <ResponsiveGrid 
          minCardWidth="200px"
          className="grid-cols-1 sm:grid-cols-2 md:grid-cols-4"
        >
          <EnhancedStatCard
            title="Squad Size"
            value={teamMetrics?.totalPlayers || 0}
            subValue="Active Players"
            icon={<Users className="w-4 h-4 sm:w-5 sm:h-5" />}
            animateCounter={true}
            onClick={handleSquadSizeClick}
            trend={{
              direction: 'neutral',
              label: 'Total registered'
            }}
            hoverDetails={{
              title: 'Squad Breakdown',
              items: [
                { label: 'Available', value: teamMetrics?.availablePlayers || 0 },
                { label: 'Injured', value: teamMetrics?.injuredPlayers || 0 },
                { label: 'Suspended', value: teamMetrics?.suspendedPlayers || 0 }
              ]
            }}
          />

          <EnhancedStatCard
            title="Players Available"
            value={teamMetrics?.availablePlayers || 0}
            subValue="Ready for Selection"
            icon={<UserCheck className="w-4 h-4 sm:w-5 sm:h-5" />}
            animateCounter={true}
            onClick={handleAvailablePlayersClick}
            trend={{
              direction: 'neutral',
              label: 'Match ready'
            }}
            hoverDetails={{
              title: 'Availability Status',
              items: [
                { label: 'Fully Fit', value: teamMetrics?.availablePlayers || 0 },
                { label: 'Injured', value: teamMetrics?.injuredPlayers || 0 },
                { label: 'Suspended', value: teamMetrics?.suspendedPlayers || 0 }
              ]
            }}
          />

          <EnhancedStatCard
            title="Injuries"
            value={teamMetrics?.injuredPlayers || 0}
            subValue="Players Injured"
            icon={<AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5" />}
            priority={(teamMetrics?.injuredPlayers || 0) > 3 ? "critical" : (teamMetrics?.injuredPlayers || 0) > 1 ? "warning" : "normal"}
            onClick={handleInjuriesClick}
            trend={{
              direction: 'down',
              percentage: 12,
              label: 'vs last month'
            }}
            hoverDetails={{
              title: 'Injury Status',
              items: [
                { label: 'Active Injuries', value: teamMetrics?.injuredPlayers || 0 },
                { label: 'Recovering', value: 0 },
                { label: 'Expected Returns', value: '1-2 weeks' }
              ]
            }}
          />

          <EnhancedStatCard
            title="Training Attendance"
            value={`${teamMetrics?.trainingAttendance || 0}%`}
            subValue="This Week"
            icon={<Clock className="w-4 h-4 sm:w-5 sm:h-5" />}
            onClick={handleTrainingAttendanceClick}
            priority={(teamMetrics?.trainingAttendance || 0) < 80 ? "warning" : "normal"}
            trend={{
              direction: (teamMetrics?.trainingAttendance || 0) >= 85 ? 'up' : 'down',
              percentage: 3,
              label: 'vs last week'
            }}
            hoverDetails={{
              title: 'Attendance Details',
              items: [
                { label: 'Sessions This Week', value: 3 },
                { label: 'Average Attendance', value: `${teamMetrics?.trainingAttendance || 0}%` },
                { label: 'Best Attendee', value: 'View Report' }
              ]
            }}
          />
        </ResponsiveGrid>
      </IOSLoadingState>

      {/* Second Row with Additional Metrics */}
      <IOSLoadingState isLoading={isDataLoading} suppressDemoLoading={false}>
        <ResponsiveGrid 
          minCardWidth="200px"
          className="grid-cols-1 sm:grid-cols-2 md:grid-cols-4"
        >
          <EnhancedStatCard
            title="Team Goals"
            value={teamMetrics?.teamGoals || 0}
            subValue="This Season"
            icon={<Target className="w-4 h-4 sm:w-5 sm:h-5" />}
            className="border-primary/20 bg-primary/10"
            animateCounter={true}
            trend={{
              direction: 'up',
              percentage: 15,
              label: 'vs last season'
            }}
            hoverDetails={{
              title: 'Goals Breakdown',
              items: [
                { label: 'League Goals', value: teamMetrics?.teamGoals || 0 },
                { label: 'Cup Goals', value: 0 },
                { label: 'Top Scorer', value: 'View Stats' }
              ]
            }}
          />

          <EnhancedStatCard
            title="Upcoming Suspensions"
            value={teamMetrics?.suspendedPlayers || 0}
            subValue="Next 3 Matches"
            icon={<Ban className="w-4 h-4 sm:w-5 sm:h-5" />}
            priority={(teamMetrics?.suspendedPlayers || 0) > 0 ? "warning" : "normal"}
            onClick={handleSuspensionsClick}
            trend={{
              direction: 'neutral',
              label: 'Disciplinary risk'
            }}
            hoverDetails={{
              title: 'Suspension Details',
              items: [
                { label: 'Currently Suspended', value: teamMetrics?.suspendedPlayers || 0 },
                { label: 'At Risk (4+ cards)', value: 'Check Report' },
                { label: 'Recent Cards', value: 'View List' }
              ]
            }}
          />

          <EnhancedStatCard
            title="Win Rate"
            value={`${teamMetrics?.winRate || 0}%`}
            subValue="This Season"
            icon={<TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" />}
            className="border-primary/20 bg-primary/10"
            trend={{
              direction: (teamMetrics?.winRate || 0) >= 50 ? 'up' : 'down',
              percentage: 8,
              label: 'vs last season'
            }}
            hoverDetails={{
              title: 'Season Performance',
              items: [
                { label: 'Matches Played', value: teamMetrics?.matchesPlayed || 0 },
                { label: 'Win Rate', value: `${teamMetrics?.winRate || 0}%` },
                { label: 'Recent Form', value: 'W-W-D' }
              ]
            }}
          />

          <EnhancedStatCard
            title="Form"
            value="W-W-D"
            subValue="Last 3 Games"
            icon={<TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" />}
            className="border-accent/40 bg-accent/20"
            trend={{
              direction: 'up',
              label: 'Good momentum'
            }}
            hoverDetails={{
              title: 'Recent Form Analysis',
              items: [
                { label: 'Goals For', value: 6 },
                { label: 'Goals Against', value: 2 },
                { label: 'Clean Sheets', value: 1 }
              ]
            }}
          />
        </ResponsiveGrid>
      </IOSLoadingState>

      {/* Quick Actions and Calendar Row */}
      <ResponsiveGrid 
        minCardWidth="300px"
        className="grid-cols-1 lg:grid-cols-2"
      >
        <CoachQuickActions />
        <CoachMiniCalendar />
      </ResponsiveGrid>

      {/* Suspension Risk Widget */}
      <SuspensionRiskWidget />

      {/* Compliance Alerts for Team */}
      <Card className="bg-card border-border">
        <CardHeader className="p-4 sm:p-5 lg:p-6">
          <CardTitle className="text-primary">Team Compliance Alerts</CardTitle>
          <CardDescription className="text-muted-foreground">
            Important notices for your team
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-5 lg:p-6 pt-0">
          <div className="space-y-3">
            {(teamMetrics?.injuredPlayers || 0) > 0 && (
              <div className="flex items-start gap-3 p-3 sm:p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
                <div className="min-w-0 flex-1">
                  <p className="font-medium">Player Injuries</p>
                  <p className="text-muted-foreground text-sm mt-1">
                    {teamMetrics?.injuredPlayers} player{(teamMetrics?.injuredPlayers || 0) > 1 ? 's' : ''} currently injured
                  </p>
                </div>
              </div>
            )}
            
            {(teamMetrics?.trainingAttendance || 0) < 80 && (
              <div className="flex items-start gap-3 p-3 sm:p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <div className="min-w-0 flex-1">
                  <p className="font-medium">Low Training Attendance</p>
                  <p className="text-muted-foreground text-sm mt-1">
                    Training attendance is at {teamMetrics?.trainingAttendance}% - below target of 85%
                  </p>
                </div>
              </div>
            )}

            {((teamMetrics?.injuredPlayers || 0) === 0 && (teamMetrics?.trainingAttendance || 0) >= 80) && (
              <div className="flex items-start gap-3 p-3 sm:p-4 bg-primary/10 border border-primary/20 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <div className="min-w-0 flex-1">
                  <p className="font-medium">All Systems Green</p>
                  <p className="text-muted-foreground text-sm mt-1">No critical issues detected with your squad</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Player Selector */}
      <PlayerSelector
        players={players}
        selectedPlayer={selectedPlayer}
        onPlayerSelect={selectPlayer}
        loading={loading}
      />

      {/* Player Stats Component */}
      {selectedPlayer && <PlayerStats player={selectedPlayer} />}
    </div>
  );
};
