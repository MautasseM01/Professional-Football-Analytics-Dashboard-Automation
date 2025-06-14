
import { useState, useMemo } from "react";
import { Player } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";
import { TrendingUp } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/lib/utils";
import { usePerformanceData } from "@/hooks/use-performance-data";
import { useSwipeGestures } from "@/hooks/use-swipe-gestures";
import { ChartLoadingSkeleton } from "@/components/LoadingStates";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { Alert, AlertDescription } from "@/components/ui/alert";

import { KPI_OPTIONS } from "./constants";
import { calculateMovingAverage, calculateStats } from "./utils";
import { PerformanceStats } from "./PerformanceStats";
import { MobileControls } from "./MobileControls";
import { DesktopControls } from "./DesktopControls";
import { ChartRenderer } from "./ChartRenderer";

interface PerformanceTrendsCardProps {
  player: Player;
}

export const PerformanceTrendsCard = ({ player }: PerformanceTrendsCardProps) => {
  const [selectedKPI, setSelectedKPI] = useState("distance");
  const [selectedTimePeriod, setSelectedTimePeriod] = useState("last5");
  const [chartView, setChartView] = useState("area");
  const [showMovingAverage, setShowMovingAverage] = useState(false);
  const [showStatistics, setShowStatistics] = useState(true);
  const [currentMetricIndex, setCurrentMetricIndex] = useState(0);
  const isMobile = useIsMobile();
  const { theme } = useTheme();
  
  const currentMetric = KPI_OPTIONS.find(m => m.value === selectedKPI) || KPI_OPTIONS[0];
  
  // Get the selected KPI label
  const selectedKPILabel = KPI_OPTIONS.find(option => option.value === selectedKPI)?.label || "";
  
  // Fetch real performance data
  const { data: rawMatchData, loading, error } = usePerformanceData(player, selectedKPI, selectedTimePeriod);

  // Process match data with moving average if needed
  const matchData = useMemo(() => {
    if (!rawMatchData || rawMatchData.length === 0) return [];
    
    return showMovingAverage 
      ? calculateMovingAverage(rawMatchData, 3)
      : rawMatchData;
  }, [rawMatchData, showMovingAverage]);

  // Calculate performance statistics
  const stats = useMemo(() => {
    return calculateStats(matchData);
  }, [matchData]);

  // Enhanced navigation with swipe gestures
  const nextMetric = () => {
    const nextIndex = (currentMetricIndex + 1) % KPI_OPTIONS.length;
    setCurrentMetricIndex(nextIndex);
    setSelectedKPI(KPI_OPTIONS[nextIndex].value);
  };

  const prevMetric = () => {
    const prevIndex = (currentMetricIndex - 1 + KPI_OPTIONS.length) % KPI_OPTIONS.length;
    setCurrentMetricIndex(prevIndex);
    setSelectedKPI(KPI_OPTIONS[prevIndex].value);
  };

  // Swipe gestures for mobile
  const { swipeProps } = useSwipeGestures({
    onSwipeLeft: nextMetric,
    onSwipeRight: prevMetric,
    threshold: 50,
    preventScroll: false
  });

  // Enhanced chart configuration for better mobile experience
  const getChartConfig = () => ({
    value: { color: "#D4AF37" },
    average: { color: "#9CA3AF" }
  });

  // Show loading state
  if (loading) {
    return <ChartLoadingSkeleton />;
  }

  // Show error state
  if (error) {
    return (
      <Card className={cn(
        "border-club-gold/20 w-full overflow-hidden backdrop-blur-sm",
        theme === 'dark' 
          ? "bg-club-dark-gray/50" 
          : "bg-white/80",
        "shadow-xl transition-all duration-300"
      )}>
        <CardContent className="p-6">
          <Alert className="border-red-500/20 bg-red-500/10">
            <AlertDescription className="text-red-600 dark:text-red-400">
              Failed to load performance data: {error}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  // Show no data state
  if (!matchData || matchData.length === 0) {
    return (
      <Card className={cn(
        "border-club-gold/20 w-full overflow-hidden backdrop-blur-sm",
        theme === 'dark' 
          ? "bg-club-dark-gray/50" 
          : "bg-white/80",
        "shadow-xl transition-all duration-300"
      )}>
        <CardHeader className="pb-3">
          <CardTitle className={cn(
            "text-sm sm:text-base lg:text-lg font-semibold",
            theme === 'dark' ? "text-club-light-gray" : "text-gray-900"
          )}>
            {player.name}'s Performance Trends
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <Alert className="border-yellow-500/20 bg-yellow-500/10">
            <AlertDescription className="text-yellow-600 dark:text-yellow-400">
              No performance data available for the selected time period.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <ErrorBoundary>
      <Card 
        className={cn(
          "border-club-gold/20 w-full overflow-hidden backdrop-blur-sm transition-all duration-300 hover:shadow-2xl",
          theme === 'dark' 
            ? "bg-club-dark-gray/60 hover:bg-club-dark-gray/70" 
            : "bg-white/80 hover:bg-white/90",
          "shadow-xl animate-fade-in"
        )}
        {...(isMobile ? swipeProps : {})}
      >
        <CardHeader className="pb-3 px-4 sm:px-6">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <CardTitle className={cn(
                "text-sm sm:text-base lg:text-lg font-semibold",
                theme === 'dark' ? "text-club-light-gray" : "text-gray-900"
              )}>
                {player.name}'s Performance
              </CardTitle>
              <div className="flex items-center gap-2 mt-1">
                {stats.trend !== 'neutral' && (
                  <div className={cn(
                    "flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium animate-scale-in",
                    stats.trend === 'up' 
                      ? "bg-club-gold/20 text-club-gold"
                      : "bg-red-500/20 text-red-400"
                  )}>
                    <TrendingUp 
                      size={10} 
                      className={cn(
                        "transition-transform duration-200",
                        stats.trend === 'down' && "rotate-180"
                      )} 
                    />
                    <span>
                      {stats.trend === 'up' ? 'Improving' : 'Declining'}
                    </span>
                  </div>
                )}
              </div>
            </div>
            
            {/* Mobile navigation controls */}
            {isMobile && (
              <MobileControls
                currentMetricIndex={currentMetricIndex}
                selectedTimePeriod={selectedTimePeriod}
                currentMetric={currentMetric}
                prevMetric={prevMetric}
                nextMetric={nextMetric}
              />
            )}
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="px-4 sm:px-6 pb-4">
            <div className="space-y-3 sm:space-y-4">
              {/* Controls */}
              {isMobile ? (
                <MobileControls
                  currentMetricIndex={currentMetricIndex}
                  selectedTimePeriod={selectedTimePeriod}
                  currentMetric={currentMetric}
                  prevMetric={prevMetric}
                  nextMetric={nextMetric}
                />
              ) : (
                <DesktopControls
                  selectedKPI={selectedKPI}
                  selectedTimePeriod={selectedTimePeriod}
                  chartView={chartView}
                  showMovingAverage={showMovingAverage}
                  showStatistics={showStatistics}
                  setSelectedKPI={setSelectedKPI}
                  setSelectedTimePeriod={setSelectedTimePeriod}
                  setChartView={setChartView}
                  setShowMovingAverage={setShowMovingAverage}
                  setShowStatistics={setShowStatistics}
                />
              )}
              
              {/* Performance Statistics - conditionally rendered */}
              {showStatistics && (
                <div className="transition-all duration-300 ease-in-out">
                  <PerformanceStats stats={stats} matchDataLength={matchData.length} />
                </div>
              )}
            </div>
          </div>

          {/* Chart Container */}
          <div className="px-4 sm:px-6 pb-4">
            <div 
              className={cn(
                "w-full rounded-2xl p-3 sm:p-4 transition-all duration-300",
                theme === 'dark' 
                  ? "bg-club-black/20 border border-club-gold/10" 
                  : "bg-gray-50/30 border border-club-gold/20"
              )}
              style={{ height: isMobile ? '220px' : '300px' }}
            >
              <ChartRenderer
                chartView={chartView}
                matchData={matchData}
                selectedKPI={selectedKPI}
                selectedKPILabel={selectedKPILabel}
                showMovingAverage={showMovingAverage}
                getChartConfig={getChartConfig}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </ErrorBoundary>
  );
};
