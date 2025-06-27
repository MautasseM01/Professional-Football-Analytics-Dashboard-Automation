
import { usePlayerData } from "@/hooks/use-player-data";
import { useSquadAvailability } from "@/hooks/use-squad-availability";
import { useDevelopmentProgress } from "@/hooks/use-development-progress";
import { useAnalystAnalytics } from "@/hooks/use-analyst-analytics";
import { useExportData } from "@/hooks/use-export-data";
import { UserProfile } from "@/types";
import { PlayerStats } from "@/components/PlayerStats";
import { PlayerSelector } from "@/components/PlayerSelector";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TouchFeedbackButton } from "@/components/TouchFeedbackButton";
import { 
  BarChart3, 
  PieChart, 
  TrendingUp, 
  FileText, 
  Download,
  Database,
  Settings,
  RefreshCw
} from "lucide-react";
import { ResponsiveGrid } from "../ResponsiveLayout";

interface AnalystDashboardProps {
  profile: UserProfile;
}

export const AnalystDashboard = ({ profile }: AnalystDashboardProps) => {
  const { players, selectedPlayer, selectPlayer, loading } = usePlayerData();
  const squadAvailabilityQuery = useSquadAvailability();
  const developmentProgressQuery = useDevelopmentProgress();
  const analyticsQuery = useAnalystAnalytics();
  const { exportLoading, handleExport } = useExportData();

  // Extract data from query results
  const squadAvailability = squadAvailabilityQuery.data;
  const squadLoading = squadAvailabilityQuery.isLoading;
  const developmentProgress = developmentProgressQuery.data;
  const devLoading = developmentProgressQuery.isLoading;
  const analytics = analyticsQuery.data;
  const analyticsLoading = analyticsQuery.isLoading;

  const handleRefreshData = () => {
    analyticsQuery.refetch();
    squadAvailabilityQuery.refetch();
    developmentProgressQuery.refetch();
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  return (
    <div className="space-y-4 sm:space-y-6 p-4 sm:p-6">
      <div className="mb-4 sm:mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-club-gold mb-2">
            Analytics Dashboard
          </h1>
          <p className="text-sm sm:text-base text-club-light-gray/70">
            Real-time performance analytics and data insights
          </p>
        </div>
        <TouchFeedbackButton
          variant="outline"
          onClick={handleRefreshData}
          className="border-club-gold/30 hover:border-club-gold/50"
          disabled={analyticsLoading}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${analyticsLoading ? 'animate-spin' : ''}`} />
          Refresh
        </TouchFeedbackButton>
      </div>

      {/* Analytics Overview Cards */}
      <ResponsiveGrid 
        minCardWidth="250px"
        className="grid-cols-2 md:grid-cols-4"
      >
        <Card className="bg-club-dark-gray border-club-gold/20 hover:bg-club-gold/10 transition-all duration-300 group">
          <CardHeader className="p-4 sm:p-6 pb-2">
            <CardTitle className="flex items-center justify-between text-club-gold text-sm font-medium">
              <span>Data Points</span>
              <Database className="h-4 w-4 text-club-gold/60 group-hover:text-club-gold transition-colors duration-300" />
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            <div className="text-2xl sm:text-3xl font-bold text-club-gold mb-1">
              {analyticsLoading ? '...' : formatNumber(analytics?.totalDataPoints || 0)}
            </div>
            <p className="text-xs text-club-light-gray/70">Performance Records</p>
          </CardContent>
        </Card>

        <Card className="bg-club-dark-gray border-club-gold/20 hover:bg-club-gold/10 transition-all duration-300 group">
          <CardHeader className="p-4 sm:p-6 pb-2">
            <CardTitle className="flex items-center justify-between text-club-gold text-sm font-medium">
              <span>Active Players</span>
              <PieChart className="h-4 w-4 text-club-gold/60 group-hover:text-club-gold transition-colors duration-300" />
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            <div className="text-2xl sm:text-3xl font-bold text-club-gold mb-1">
              {analyticsLoading ? '...' : analytics?.playerCount || 0}
            </div>
            <p className="text-xs text-club-light-gray/70">Current Season</p>
          </CardContent>
        </Card>

        <Card className="bg-club-dark-gray border-club-gold/20 hover:bg-club-gold/10 transition-all duration-300 group">
          <CardHeader className="p-4 sm:p-6 pb-2">
            <CardTitle className="flex items-center justify-between text-club-gold text-sm font-medium">
              <span>Goals Scored</span>
              <TrendingUp className="h-4 w-4 text-club-gold/60 group-hover:text-club-gold transition-colors duration-300" />
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            <div className="text-2xl sm:text-3xl font-bold text-club-gold mb-1">
              {analyticsLoading ? '...' : analytics?.goalCount || 0}
            </div>
            <p className="text-xs text-club-light-gray/70">Total Goals</p>
          </CardContent>
        </Card>

        <Card className="bg-club-dark-gray border-club-gold/20 hover:bg-club-gold/10 transition-all duration-300 group">
          <CardHeader className="p-4 sm:p-6 pb-2">
            <CardTitle className="flex items-center justify-between text-club-gold text-sm font-medium">
              <span>Assists</span>
              <FileText className="h-4 w-4 text-club-gold/60 group-hover:text-club-gold transition-colors duration-300" />
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            <div className="text-2xl sm:text-3xl font-bold text-club-gold mb-1">
              {analyticsLoading ? '...' : analytics?.assistCount || 0}
            </div>
            <p className="text-xs text-club-light-gray/70">Total Assists</p>
          </CardContent>
        </Card>
      </ResponsiveGrid>

      {/* Secondary Analytics Row */}
      <ResponsiveGrid 
        minCardWidth="200px"
        className="grid-cols-2 md:grid-cols-4"
      >
        <Card className="bg-club-dark-gray border-club-gold/20">
          <CardContent className="p-4 text-center">
            <div className="text-lg font-bold text-club-gold">
              {analyticsLoading ? '...' : analytics?.matchCount || 0}
            </div>
            <p className="text-xs text-club-light-gray/70">Matches Analyzed</p>
          </CardContent>
        </Card>

        <Card className="bg-club-dark-gray border-club-gold/20">
          <CardContent className="p-4 text-center">
            <div className="text-lg font-bold text-club-gold">
              {analyticsLoading ? '...' : analytics?.metricsTracked || 0}
            </div>
            <p className="text-xs text-club-light-gray/70">Metrics Tracked</p>
          </CardContent>
        </Card>

        <Card className="bg-club-dark-gray border-club-gold/20">
          <CardContent className="p-4 text-center">
            <div className="text-lg font-bold text-club-gold">
              {analyticsLoading ? '...' : analytics?.avgMatchRating || 0}
            </div>
            <p className="text-xs text-club-light-gray/70">Avg Match Rating</p>
          </CardContent>
        </Card>

        <Card className="bg-club-dark-gray border-club-gold/20">
          <CardContent className="p-4 text-center">
            <div className="text-lg font-bold text-club-gold">
              {analyticsLoading ? '...' : analytics?.reportsGenerated || 0}
            </div>
            <p className="text-xs text-club-light-gray/70">Reports Generated</p>
          </CardContent>
        </Card>
      </ResponsiveGrid>

      {/* Advanced Analytics Tools */}
      <Card className="bg-club-dark-gray border-club-gold/20">
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="text-club-gold text-lg sm:text-xl">Database Export Tools</CardTitle>
          <CardDescription className="text-club-light-gray/70">
            Export and analyze real-time data from the database
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-0">
          <ResponsiveGrid 
            minCardWidth="280px"
            className="grid-cols-1 sm:grid-cols-2 gap-3"
          >
            <TouchFeedbackButton
              variant="outline"
              onClick={() => handleExport('player-data')}
              disabled={exportLoading === 'player-data'}
              className="
                min-h-[44px] w-full justify-start 
                border-club-gold/30 hover:border-club-gold/50 
                hover:bg-club-gold/10 transition-all duration-300
                text-club-light-gray hover:text-club-gold
                disabled:opacity-50 disabled:cursor-not-allowed
              "
            >
              <Download className="mr-2 h-4 w-4" />
              {exportLoading === 'player-data' ? 'Exporting...' : `Export Player Data (${analytics?.playerCount || 0})`}
            </TouchFeedbackButton>

            <TouchFeedbackButton
              variant="outline"
              onClick={() => handleExport('team-report')}
              disabled={exportLoading === 'team-report'}
              className="
                min-h-[44px] w-full justify-start 
                border-club-gold/30 hover:border-club-gold/50 
                hover:bg-club-gold/10 transition-all duration-300
                text-club-light-gray hover:text-club-gold
                disabled:opacity-50 disabled:cursor-not-allowed
              "
            >
              <FileText className="mr-2 h-4 w-4" />
              {exportLoading === 'team-report' ? 'Generating...' : 'Generate Team Report'}
            </TouchFeedbackButton>

            <TouchFeedbackButton
              variant="outline"
              onClick={() => handleExport('performance-trends')}
              disabled={exportLoading === 'performance-trends'}
              className="
                min-h-[44px] w-full justify-start 
                border-club-gold/30 hover:border-club-gold/50 
                hover:bg-club-gold/10 transition-all duration-300
                text-club-light-gray hover:text-club-gold
                disabled:opacity-50 disabled:cursor-not-allowed
              "
            >
              <BarChart3 className="mr-2 h-4 w-4" />
              {exportLoading === 'performance-trends' ? 'Analyzing...' : 'Performance Trends'}
            </TouchFeedbackButton>

            <TouchFeedbackButton
              variant="outline"
              onClick={() => handleExport('predictive-analysis')}
              disabled={exportLoading === 'predictive-analysis'}
              className="
                min-h-[44px] w-full justify-start 
                border-club-gold/30 hover:border-club-gold/50 
                hover:bg-club-gold/10 transition-all duration-300
                text-club-light-gray hover:text-club-gold
                disabled:opacity-50 disabled:cursor-not-allowed
              "
            >
              <Settings className="mr-2 h-4 w-4" />
              {exportLoading === 'predictive-analysis' ? 'Processing...' : 'Predictive Analysis'}
            </TouchFeedbackButton>
          </ResponsiveGrid>
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
