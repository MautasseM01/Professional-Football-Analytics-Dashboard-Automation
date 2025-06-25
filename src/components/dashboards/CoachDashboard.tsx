
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

interface CoachDashboardProps {
  profile: UserProfile;
}

export const CoachDashboard = ({ profile }: CoachDashboardProps) => {
  const { players, selectedPlayer, selectPlayer, loading } = usePlayerData();

  const handleSquadSizeClick = () => {
    toast.info("Opening player list...");
    // Navigate to player list or show modal
  };

  const handleInjuriesClick = () => {
    toast.info("Opening injury report...");
    // Navigate to injury report
  };

  const handleAvailablePlayersClick = () => {
    toast.info("Showing available players...");
    // Show available players modal
  };

  const handleTrainingAttendanceClick = () => {
    toast.info("Opening training attendance...");
    // Navigate to training attendance
  };

  const handleSuspensionsClick = () => {
    toast.info("Showing suspension alerts...");
    // Navigate to suspensions
  };

  // Calculate injured players (mock data for demo)
  const injuredPlayers = 2;
  const availablePlayers = players.length - injuredPlayers;
  const trainingAttendance = 85; // percentage
  const upcomingSuspensions = 1;

  return (
    <div className="space-y-4 sm:space-y-6 p-4 sm:p-6">
      {/* Welcome Header */}
      <div className="mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-club-gold mb-2">
          Welcome back, {profile.full_name || "Coach"}
        </h1>
        <p className="text-sm sm:text-base text-club-light-gray/70">
          Manage your team's performance and track player development
        </p>
      </div>

      {/* Enhanced Team Overview Cards */}
      <IOSLoadingState isLoading={loading} suppressDemoLoading={false}>
        <ResponsiveGrid 
          minCardWidth="200px"
          className="grid-cols-1 sm:grid-cols-2 md:grid-cols-4"
        >
          <EnhancedStatCard
            title="Squad Size"
            value={players.length}
            subValue="Active Players"
            icon={<Users className="w-4 h-4 sm:w-5 sm:h-5" />}
            animateCounter={true}
            onClick={handleSquadSizeClick}
            trend={{
              direction: 'up',
              percentage: 5,
              label: 'vs last month'
            }}
            hoverDetails={{
              title: 'Squad Breakdown',
              items: [
                { label: 'Goalkeepers', value: 3 },
                { label: 'Defenders', value: 8 },
                { label: 'Midfielders', value: 6 },
                { label: 'Forwards', value: 5 }
              ]
            }}
          />

          <EnhancedStatCard
            title="Players Available"
            value={availablePlayers}
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
                { label: 'Fully Fit', value: availablePlayers - 2 },
                { label: 'Minor Issues', value: 2 },
                { label: 'Injured', value: injuredPlayers },
                { label: 'Suspended', value: 0 }
              ]
            }}
          />

          <EnhancedStatCard
            title="Injuries"
            value={injuredPlayers}
            subValue="Players Injured"
            icon={<AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5" />}
            priority={injuredPlayers > 0 ? "critical" : "normal"}
            onClick={handleInjuriesClick}
            trend={{
              direction: injuredPlayers > 3 ? 'up' : 'down',
              percentage: 25,
              label: 'vs last week'
            }}
            hoverDetails={{
              title: 'Injury Details',
              items: [
                { label: 'Muscle Injuries', value: 1 },
                { label: 'Joint Issues', value: 1 },
                { label: 'Expected Return', value: '1-2 weeks' }
              ]
            }}
          />

          <EnhancedStatCard
            title="Training Attendance"
            value={`${trainingAttendance}%`}
            subValue="This Week"
            icon={<Clock className="w-4 h-4 sm:w-5 sm:h-5" />}
            onClick={handleTrainingAttendanceClick}
            priority={trainingAttendance < 80 ? "warning" : "normal"}
            trend={{
              direction: trainingAttendance >= 85 ? 'up' : 'down',
              percentage: 3,
              label: 'vs last week'
            }}
            hoverDetails={{
              title: 'Attendance Breakdown',
              items: [
                { label: 'Perfect Attendance', value: 18 },
                { label: 'Missed 1 Session', value: 3 },
                { label: 'Missed 2+ Sessions', value: 1 }
              ]
            }}
          />
        </ResponsiveGrid>
      </IOSLoadingState>

      {/* Second Row with Additional Metrics */}
      <IOSLoadingState isLoading={loading} suppressDemoLoading={false}>
        <ResponsiveGrid 
          minCardWidth="200px"
          className="grid-cols-1 sm:grid-cols-2 md:grid-cols-4"
        >
          <EnhancedStatCard
            title="Team Goals"
            value="24"
            subValue="This Season"
            icon={<Target className="w-4 h-4 sm:w-5 sm:h-5" />}
            className="border-green-500/20 bg-green-500/10"
            animateCounter={true}
            trend={{
              direction: 'up',
              percentage: 12,
              label: 'vs last season'
            }}
          />

          <EnhancedStatCard
            title="Upcoming Suspensions"
            value={upcomingSuspensions}
            subValue="Next 3 Matches"
            icon={<Ban className="w-4 h-4 sm:w-5 sm:h-5" />}
            priority={upcomingSuspensions > 0 ? "warning" : "normal"}
            onClick={handleSuspensionsClick}
            trend={{
              direction: 'neutral',
              label: 'Disciplinary risk'
            }}
            hoverDetails={{
              title: 'Suspension Risk',
              items: [
                { label: 'Next Match', value: 1 },
                { label: 'Following Match', value: 0 },
                { label: 'High Risk Players', value: 3 }
              ]
            }}
          />

          <EnhancedStatCard
            title="Form"
            value="W-W-D"
            subValue="Last 3 Games"
            icon={<TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" />}
            className="border-blue-500/20 bg-blue-500/10"
            trend={{
              direction: 'up',
              label: 'Good momentum'
            }}
          />

          <EnhancedStatCard
            title="Win Rate"
            value="75%"
            subValue="This Season"
            icon={<TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" />}
            className="border-green-500/20 bg-green-500/10"
            trend={{
              direction: 'up',
              percentage: 8,
              label: 'vs last season'
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
      <Card className="bg-club-dark-gray border-club-gold/20 light:bg-white light:border-gray-200">
        <CardHeader className="p-4 sm:p-5 lg:p-6">
          <CardTitle className="text-club-gold light:text-yellow-600">Team Compliance Alerts</CardTitle>
          <CardDescription className="text-club-light-gray/70 light:text-gray-600">
            Important notices for your team
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-5 lg:p-6 pt-0">
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 sm:p-4 bg-yellow-900/20 light:bg-yellow-50 border border-yellow-600/30 light:border-yellow-200 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-yellow-500 light:text-yellow-600 flex-shrink-0 mt-0.5" />
              <div className="min-w-0 flex-1">
                <p className="text-club-light-gray light:text-gray-900 font-medium">Player Registration Reminder</p>
                <p className="text-club-light-gray/70 light:text-gray-600 text-sm mt-1">3 players need registration renewal before next match</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 sm:p-4 bg-blue-900/20 light:bg-blue-50 border border-blue-600/30 light:border-blue-200 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-blue-500 light:text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="min-w-0 flex-1">
                <p className="text-club-light-gray light:text-gray-900 font-medium">Medical Checks</p>
                <p className="text-club-light-gray/70 light:text-gray-600 text-sm mt-1">Annual medical assessments due for 5 players</p>
              </div>
            </div>
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
