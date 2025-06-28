
import React, { Suspense, useMemo } from 'react';
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveGrid } from "@/components/ResponsiveLayout";
import { TouchFeedbackButton } from "@/components/TouchFeedbackButton";
import { ChartLoadingSkeleton } from "@/components/LoadingStates";
import { OptimizedDataTable } from "./OptimizedDataTable";
import { ProgressiveDataLoader } from "./ProgressiveDataLoader";
import { AdvancedExportDialog } from "./AdvancedExportDialog";
import { ScheduledReportsManager } from "./ScheduledReportsManager";
import { 
  useOptimizedAnalytics, 
  useOptimizedMatches,
  useDebouncedSearch 
} from "@/hooks/use-optimized-analytics";
import { 
  Database, 
  PieChart, 
  TrendingUp, 
  FileText,
  RefreshCw,
  Activity,
  Target,
  Star,
  BarChart3
} from "lucide-react";
import { UserProfile } from "@/types";
import { toast } from "sonner";

interface OptimizedAnalystDashboardProps {
  profile: UserProfile;
}

const MetricCard = React.memo(({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  loading 
}: {
  title: string;
  value: string | number;
  subtitle: string;
  icon: any;
  loading: boolean;
}) => (
  <Card className="bg-club-dark-gray border-club-gold/20 hover:bg-club-gold/10 transition-all duration-300 group">
    <CardHeader className="p-4 sm:p-6 pb-2">
      <CardTitle className="flex items-center justify-between text-club-gold text-sm font-medium">
        <span>{title}</span>
        <Icon className="h-4 w-4 text-club-gold/60 group-hover:text-club-gold transition-colors duration-300" />
      </CardTitle>
    </CardHeader>
    <CardContent className="p-4 sm:p-6 pt-0">
      <div className="text-2xl sm:text-3xl font-bold text-club-gold mb-1">
        {loading ? '...' : value}
      </div>
      <p className="text-xs text-club-light-gray/70">{subtitle}</p>
    </CardContent>
  </Card>
));

export const OptimizedAnalystDashboard = ({ profile }: OptimizedAnalystDashboardProps) => {
  const { 
    data: analytics, 
    isLoading: analyticsLoading, 
    error: analyticsError,
    refetch: refetchAnalytics 
  } = useOptimizedAnalytics();

  const { 
    data: recentMatches, 
    isLoading: matchesLoading,
    refetch: refetchMatches 
  } = useOptimizedMatches(5);

  const handleRefreshAll = React.useCallback(() => {
    refetchAnalytics();
    refetchMatches();
    toast.success("Data refreshed successfully");
  }, [refetchAnalytics, refetchMatches]);

  const formatNumber = React.useCallback((num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  }, []);

  // Progressive loading stages with proper typing
  const loadingStages = useMemo(() => [
    {
      name: 'Analytics Overview',
      status: (analyticsLoading ? 'loading' : analytics ? 'complete' : 'pending') as 'pending' | 'loading' | 'complete' | 'error',
      progress: analyticsLoading ? 50 : analytics ? 100 : 0,
      message: analyticsLoading ? 'Loading performance metrics...' : undefined
    },
    {
      name: 'Recent Matches',
      status: (matchesLoading ? 'loading' : recentMatches ? 'complete' : 'pending') as 'pending' | 'loading' | 'complete' | 'error',
      progress: matchesLoading ? 70 : recentMatches ? 100 : 0,
      message: matchesLoading ? 'Fetching match data...' : undefined
    },
    {
      name: 'Player Database',
      status: 'complete' as const,
      progress: 100,
    }
  ], [analyticsLoading, analytics, matchesLoading, recentMatches]);

  if (analyticsError) {
    return (
      <div className="p-6">
        <Card className="bg-club-dark-gray border-club-gold/20">
          <CardContent className="p-6 text-center">
            <div className="text-red-400 mb-4">Failed to load analytics data</div>
            <TouchFeedbackButton onClick={handleRefreshAll} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </TouchFeedbackButton>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="space-y-4 sm:space-y-6 p-4 sm:p-6 bg-club-black min-h-screen">
        {/* Optimized Header */}
        <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-club-gold mb-2">
              Analytics Dashboard
            </h1>
            <p className="text-sm sm:text-base text-club-light-gray/70">
              Optimized for large datasets and real-time performance
            </p>
          </div>
          <div className="flex items-center gap-3">
            <AdvancedExportDialog />
            <TouchFeedbackButton
              variant="outline"
              onClick={handleRefreshAll}
              className="border-club-gold/30 hover:border-club-gold/50 hover:bg-club-gold/10 text-club-light-gray"
              disabled={analyticsLoading || matchesLoading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${analyticsLoading || matchesLoading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </TouchFeedbackButton>
          </div>
        </div>

        {/* Progressive Loading Indicator */}
        {(analyticsLoading || matchesLoading) && (
          <ProgressiveDataLoader 
            stages={loadingStages}
            title="Loading Analytics Data"
            className="mb-6"
          />
        )}

        {/* Optimized Metrics Grid */}
        <ResponsiveGrid 
          minCardWidth="280px"
          className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
        >
          <MetricCard
            title="Data Points"
            value={formatNumber(analytics?.totalDataPoints || 0)}
            subtitle="Performance Records"
            icon={Database}
            loading={analyticsLoading}
          />
          <MetricCard
            title="Active Players"
            value={analytics?.playerCount || 0}
            subtitle="Current Season"
            icon={PieChart}
            loading={analyticsLoading}
          />
          <MetricCard
            title="Goals Scored"
            value={analytics?.goalCount || 0}
            subtitle="Total Goals"
            icon={TrendingUp}
            loading={analyticsLoading}
          />
          <MetricCard
            title="Assists"
            value={analytics?.assistCount || 0}
            subtitle="Total Assists"
            icon={FileText}
            loading={analyticsLoading}
          />
        </ResponsiveGrid>

        {/* Secondary Metrics */}
        <ResponsiveGrid 
          minCardWidth="280px"
          className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
        >
          <MetricCard
            title="Matches Analyzed"
            value={analytics?.matchCount || 0}
            subtitle="Total Matches"
            icon={BarChart3}
            loading={analyticsLoading}
          />
          <MetricCard
            title="Metrics Tracked"
            value={analytics?.metricsTracked || 0}
            subtitle="Performance Metrics"
            icon={Target}
            loading={analyticsLoading}
          />
          <MetricCard
            title="Avg Match Rating"
            value={analytics?.avgMatchRating || 0}
            subtitle="Team Average"
            icon={Star}
            loading={analyticsLoading}
          />
          <MetricCard
            title="System Load"
            value="Optimal"
            subtitle="Performance Status"
            icon={Activity}
            loading={false}
          />
        </ResponsiveGrid>

        {/* Optimized Data Table with Virtualization */}
        <Suspense fallback={<ChartLoadingSkeleton />}>
          <OptimizedDataTable />
        </Suspense>

        {/* Scheduled Reports Manager */}
        <Suspense fallback={<ChartLoadingSkeleton />}>
          <ScheduledReportsManager />
        </Suspense>

        {/* Recent Matches Summary */}
        {recentMatches && recentMatches.length > 0 && (
          <Card className="bg-club-dark-gray border-club-gold/20">
            <CardHeader>
              <CardTitle className="text-club-gold">Recent Matches</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {recentMatches.map((match, index) => (
                  <div key={match.id} className="flex items-center justify-between p-3 rounded-lg bg-club-black/40">
                    <div>
                      <div className="font-medium text-club-light-gray">{match.opponent}</div>
                      <div className="text-sm text-club-light-gray/60">{match.competition}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-club-gold">{match.result}</div>
                      <div className="text-sm text-club-light-gray/60">{match.date}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </ErrorBoundary>
  );
};
