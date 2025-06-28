
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
  RefreshCw,
  AlertCircle
} from "lucide-react";
import { ResponsiveGrid } from "../ResponsiveLayout";
import { EnhancedDashboardLayout } from "../EnhancedDashboardLayout";
import { IOSDashboardGrid } from "../IOSDashboardGrid";
import { toast } from "sonner";

interface AnalystDashboardProps {
  profile: UserProfile;
}

export const AnalystDashboard = ({ profile }: AnalystDashboardProps) => {
  const { players, selectedPlayer, selectPlayer, loading, error } = usePlayerData();
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

  const handleRefreshData = async () => {
    await Promise.all([
      analyticsQuery.refetch(),
      squadAvailabilityQuery.refetch(),
      developmentProgressQuery.refetch()
    ]);
    toast.success("Analytics data refreshed");
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  // Check if user has analyst access
  const hasAnalystAccess = profile?.role === 'analyst' || 
                          profile?.role === 'admin' || 
                          profile?.role === 'management' ||
                          profile?.role === 'performance_director';

  if (!hasAnalystAccess) {
    return (
      <div className="flex items-center justify-center min-h-[400px] p-6">
        <Card className="bg-club-dark-gray border-club-gold/20 max-w-md">
          <CardContent className="p-6 text-center">
            <AlertCircle className="h-16 w-16 text-club-gold mx-auto mb-4" />
            <h2 className="text-xl font-bold text-club-gold mb-2">Access Restricted</h2>
            <p className="text-club-light-gray/70">
              You need analyst-level permissions to access this dashboard.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <EnhancedDashboardLayout>
      <IOSDashboardGrid
        title="Analytics Dashboard"
        subtitle="Real-time performance analytics and data insights"
        onRefresh={handleRefreshData}
        className="bg-gradient-to-br from-club-black via-club-dark-gray to-club-black"
      >
        {/* Analytics Overview Cards */}
        <ResponsiveGrid 
          minCardWidth="260px"
          className="col-span-full grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
        >
          <Card className="bg-club-dark-gray border-club-gold/20 hover:bg-club-gold/5 transition-all duration-300 group touch-manipulation">
            <CardHeader className="p-4 pb-2">
              <CardTitle className="flex items-center justify-between text-club-gold text-sm font-medium">
                <span>Data Points</span>
                <Database className="h-4 w-4 text-club-gold/60 group-hover:text-club-gold transition-colors duration-300" />
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="text-2xl sm:text-3xl font-bold text-club-gold mb-1">
                {analyticsLoading ? '...' : formatNumber(analytics?.totalDataPoints || 0)}
              </div>
              <p className="text-xs text-club-light-gray/70">Performance Records</p>
            </CardContent>
          </Card>

          <Card className="bg-club-dark-gray border-club-gold/20 hover:bg-club-gold/5 transition-all duration-300 group touch-manipulation">
            <CardHeader className="p-4 pb-2">
              <CardTitle className="flex items-center justify-between text-club-gold text-sm font-medium">
                <span>Active Players</span>
                <PieChart className="h-4 w-4 text-club-gold/60 group-hover:text-club-gold transition-colors duration-300" />
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="text-2xl sm:text-3xl font-bold text-club-gold mb-1">
                {analyticsLoading ? '...' : analytics?.playerCount || 0}
              </div>
              <p className="text-xs text-club-light-gray/70">Current Season</p>
            </CardContent>
          </Card>

          <Card className="bg-club-dark-gray border-club-gold/20 hover:bg-club-gold/5 transition-all duration-300 group touch-manipulation">
            <CardHeader className="p-4 pb-2">
              <CardTitle className="flex items-center justify-between text-club-gold text-sm font-medium">
                <span>Goals Scored</span>
                <TrendingUp className="h-4 w-4 text-club-gold/60 group-hover:text-club-gold transition-colors duration-300" />
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="text-2xl sm:text-3xl font-bold text-club-gold mb-1">
                {analyticsLoading ? '...' : analytics?.goalCount || 0}
              </div>
              <p className="text-xs text-club-light-gray/70">Total Goals</p>
            </CardContent>
          </Card>

          <Card className="bg-club-dark-gray border-club-gold/20 hover:bg-club-gold/5 transition-all duration-300 group touch-manipulation">
            <CardHeader className="p-4 pb-2">
              <CardTitle className="flex items-center justify-between text-club-gold text-sm font-medium">
                <span>Assists</span>
                <FileText className="h-4 w-4 text-club-gold/60 group-hover:text-club-gold transition-colors duration-300" />
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="text-2xl sm:text-3xl font-bold text-club-gold mb-1">
                {analyticsLoading ? '...' : analytics?.assistCount || 0}
              </div>
              <p className="text-xs text-club-light-gray/70">Total Assists</p>
            </CardContent>
          </Card>
        </ResponsiveGrid>

        {/* Secondary Analytics Row */}
        <ResponsiveGrid 
          minCardWidth="180px"
          className="col-span-full grid-cols-2 sm:grid-cols-4"
        >
          <Card className="bg-club-dark-gray border-club-gold/20 hover:bg-club-gold/5 transition-colors duration-300 touch-manipulation">
            <CardContent className="p-3 sm:p-4 text-center">
              <div className="text-lg sm:text-xl font-bold text-club-gold">
                {analyticsLoading ? '...' : analytics?.matchCount || 0}
              </div>
              <p className="text-xs text-club-light-gray/70">Matches</p>
            </CardContent>
          </Card>

          <Card className="bg-club-dark-gray border-club-gold/20 hover:bg-club-gold/5 transition-colors duration-300 touch-manipulation">
            <CardContent className="p-3 sm:p-4 text-center">
              <div className="text-lg sm:text-xl font-bold text-club-gold">
                {analyticsLoading ? '...' : analytics?.metricsTracked || 0}
              </div>
              <p className="text-xs text-club-light-gray/70">Metrics</p>
            </CardContent>
          </Card>

          <Card className="bg-club-dark-gray border-club-gold/20 hover:bg-club-gold/5 transition-colors duration-300 touch-manipulation">
            <CardContent className="p-3 sm:p-4 text-center">
              <div className="text-lg sm:text-xl font-bold text-club-gold">
                {analyticsLoading ? '...' : analytics?.avgMatchRating || 0}
              </div>
              <p className="text-xs text-club-light-gray/70">Avg Rating</p>
            </CardContent>
          </Card>

          <Card className="bg-club-dark-gray border-club-gold/20 hover:bg-club-gold/5 transition-colors duration-300 touch-manipulation">
            <CardContent className="p-3 sm:p-4 text-center">
              <div className="text-lg sm:text-xl font-bold text-club-gold">
                {analyticsLoading ? '...' : analytics?.reportsGenerated || 0}
              </div>
              <p className="text-xs text-club-light-gray/70">Reports</p>
            </CardContent>
          </Card>
        </ResponsiveGrid>

        {/* Export Tools */}
        <Card className="col-span-full bg-club-dark-gray border-club-gold/20">
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-club-gold text-lg sm:text-xl">Export Tools</CardTitle>
            <CardDescription className="text-club-light-gray/70">
              Export and analyze real-time data
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            <ResponsiveGrid 
              minCardWidth="240px"
              className="grid-cols-1 sm:grid-cols-2"
            >
              <TouchFeedbackButton
                variant="outline"
                onClick={() => handleExport('player-data')}
                disabled={exportLoading === 'player-data'}
                className="min-h-[44px] w-full justify-start border-club-gold/30 hover:border-club-gold/50 hover:bg-club-gold/10 text-club-light-gray hover:text-club-gold"
              >
                <Download className="mr-2 h-4 w-4" />
                {exportLoading === 'player-data' ? 'Exporting...' : `Player Data (${analytics?.playerCount || 0})`}
              </TouchFeedbackButton>

              <TouchFeedbackButton
                variant="outline"
                onClick={() => handleExport('performance-trends')}
                disabled={exportLoading === 'performance-trends'}
                className="min-h-[44px] w-full justify-start border-club-gold/30 hover:border-club-gold/50 hover:bg-club-gold/10 text-club-light-gray hover:text-club-gold"
              >
                <BarChart3 className="mr-2 h-4 w-4" />
                {exportLoading === 'performance-trends' ? 'Analyzing...' : 'Performance Trends'}
              </TouchFeedbackButton>
            </ResponsiveGrid>
          </CardContent>
        </Card>

        {/* Player Selector */}
        <div className="col-span-full bg-club-dark-gray/50 rounded-lg p-4 sm:p-6 border border-club-gold/10">
          <PlayerSelector
            players={players}
            selectedPlayer={selectedPlayer}
            onPlayerSelect={selectPlayer}
            loading={loading}
            error={error}
          />
        </div>

        {/* Player Stats */}
        {selectedPlayer && (
          <div className="col-span-full bg-club-dark-gray/50 rounded-lg p-4 sm:p-6 border border-club-gold/10">
            <PlayerStats 
              player={selectedPlayer} 
              analystMode={true}
            />
          </div>
        )}
      </IOSDashboardGrid>
    </EnhancedDashboardLayout>
  );
};
