
import { useState, useMemo } from "react";
import { Player } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";
import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/lib/utils";
import { usePerformanceData } from "@/hooks/use-performance-data";
import { useSwipeGestures } from "@/hooks/use-swipe-gestures";
import { ChartLoadingSkeleton } from "@/components/LoadingStates";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { ErrorFallback } from "@/components/ErrorStates/ErrorFallback";

import { KPI_OPTIONS } from "./constants";
import { calculateMovingAverage, calculateStats } from "./utils";
import { PerformanceTrendsHeader } from "./PerformanceTrendsHeader";
import { PerformanceTrendsControls } from "./PerformanceTrendsControls";
import { PerformanceTrendsChart } from "./PerformanceTrendsChart";

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
  
  const currentMetric = useMemo(() => {
    return KPI_OPTIONS.find(m => m.value === selectedKPI) || KPI_OPTIONS[0];
  }, [selectedKPI]);
  
  // Get the selected KPI label
  const selectedKPILabel = useMemo(() => {
    return KPI_OPTIONS.find(option => option.value === selectedKPI)?.label || "";
  }, [selectedKPI]);
  
  // Fetch real performance data with error handling
  const { data: rawMatchData, loading, error } = usePerformanceData(player, selectedKPI, selectedTimePeriod);

  // Process match data with moving average if needed
  const matchData = useMemo(() => {
    if (!rawMatchData || rawMatchData.length === 0) return [];
    
    try {
      return showMovingAverage 
        ? calculateMovingAverage(rawMatchData, 3)
        : rawMatchData;
    } catch (err) {
      console.error('Error processing match data:', err);
      return rawMatchData;
    }
  }, [rawMatchData, showMovingAverage]);

  // Calculate performance statistics
  const stats = useMemo(() => {
    try {
      return calculateStats(matchData);
    } catch (err) {
      console.error('Error calculating stats:', err);
      return { min: 0, max: 0, average: 0, trend: 'stable' as const };
    }
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

  // Validate player data
  if (!player?.id) {
    return (
      <ErrorFallback 
        title="Invalid player data"
        description="Player information is missing or invalid"
      />
    );
  }

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
          <ErrorFallback 
            title="Performance data error"
            description={`Failed to load performance data: ${error}`}
          />
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
        <PerformanceTrendsHeader
          player={player}
          stats={stats}
        />
        <CardContent className="p-6">
          <ErrorFallback 
            title="No data available"
            description="No performance data available for the selected time period."
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <ErrorBoundary
      fallback={
        <ErrorFallback 
          title="Performance trends error"
          description="Failed to render performance trends component"
        />
      }
    >
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
        <PerformanceTrendsHeader
          player={player}
          stats={stats}
        />

        <CardContent className="p-0">
          <PerformanceTrendsControls
            selectedKPI={selectedKPI}
            selectedTimePeriod={selectedTimePeriod}
            chartView={chartView}
            showMovingAverage={showMovingAverage}
            showStatistics={showStatistics}
            currentMetricIndex={currentMetricIndex}
            currentMetric={currentMetric}
            stats={stats}
            matchDataLength={matchData.length}
            setSelectedKPI={setSelectedKPI}
            setSelectedTimePeriod={setSelectedTimePeriod}
            setChartView={setChartView}
            setShowMovingAverage={setShowMovingAverage}
            setShowStatistics={setShowStatistics}
            prevMetric={prevMetric}
            nextMetric={nextMetric}
          />

          <PerformanceTrendsChart
            chartView={chartView}
            matchData={matchData}
            selectedKPI={selectedKPI}
            selectedKPILabel={selectedKPILabel}
            showMovingAverage={showMovingAverage}
            getChartConfig={getChartConfig}
          />
        </CardContent>
      </Card>
    </ErrorBoundary>
  );
};
