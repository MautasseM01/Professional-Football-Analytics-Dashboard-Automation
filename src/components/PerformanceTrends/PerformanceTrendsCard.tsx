
import { useState, useMemo } from "react";
import { Player } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { usePlayerMatchPerformance } from "@/hooks/use-player-match-performance";
import { Loader } from "lucide-react";
import { ErrorFallback } from "@/components/ErrorStates/ErrorFallback";
import { cn } from "@/lib/utils";
import { useTheme } from "@/contexts/ThemeContext";
import { PerformanceTrendsHeader } from "./PerformanceTrendsHeader";
import { PerformanceTrendsControls } from "./PerformanceTrendsControls";
import { PerformanceTrendsChart } from "./PerformanceTrendsChart";
import { KPI_OPTIONS } from "./constants";
import { processChartData, calculateStats } from "./utils";

interface PerformanceTrendsCardProps {
  player: Player;
}

export const PerformanceTrendsCard = ({ player }: PerformanceTrendsCardProps) => {
  const [selectedKPI, setSelectedKPI] = useState("distance_covered");
  const [selectedTimePeriod, setSelectedTimePeriod] = useState("season");
  const [chartView, setChartView] = useState("area");
  const [showMovingAverage, setShowMovingAverage] = useState(true);
  const [showStatistics, setShowStatistics] = useState(true);
  const { theme } = useTheme();
  
  const { performances, loading, error } = usePlayerMatchPerformance(player, undefined, 15);

  // Process data for chart
  const chartData = useMemo(() => {
    return processChartData(performances, selectedKPI);
  }, [performances, selectedKPI]);

  // Calculate statistics
  const stats = useMemo(() => {
    return calculateStats(chartData, selectedKPI);
  }, [chartData, selectedKPI]);

  const selectedKPIOption = KPI_OPTIONS.find(option => option.value === selectedKPI);
  
  // Navigation for mobile metric switching
  const currentMetricIndex = KPI_OPTIONS.findIndex(option => option.value === selectedKPI);
  const currentMetric = KPI_OPTIONS[currentMetricIndex];
  
  const nextMetric = () => {
    const nextIndex = (currentMetricIndex + 1) % KPI_OPTIONS.length;
    setSelectedKPI(KPI_OPTIONS[nextIndex].value);
  };

  const prevMetric = () => {
    const prevIndex = currentMetricIndex === 0 ? KPI_OPTIONS.length - 1 : currentMetricIndex - 1;
    setSelectedKPI(KPI_OPTIONS[prevIndex].value);
  };

  const getChartConfig = () => ({
    theme,
    selectedKPIOption,
    selectedKPI
  });

  if (loading) {
    return (
      <Card className={cn("border-club-gold/20", theme === 'dark' ? "bg-club-dark-gray" : "bg-white")}>
        <PerformanceTrendsHeader player={player} stats={stats} />
        <CardContent className="flex items-center justify-center py-12">
          <div className="flex flex-col items-center space-y-2">
            <Loader className="h-8 w-8 text-club-gold animate-spin" />
            <p className="text-sm text-club-light-gray">Loading performance trends...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={cn("border-club-gold/20", theme === 'dark' ? "bg-club-dark-gray" : "bg-white")}>
        <PerformanceTrendsHeader player={player} stats={stats} />
        <CardContent className="p-6">
          <ErrorFallback 
            title="Performance trends error" 
            description={`Failed to load performance trends: ${error}`} 
          />
        </CardContent>
      </Card>
    );
  }

  if (!performances || performances.length === 0 || chartData.length === 0) {
    return (
      <Card className={cn("border-club-gold/20", theme === 'dark' ? "bg-club-dark-gray" : "bg-white")}>
        <PerformanceTrendsHeader player={player} stats={stats} />
        <CardContent className="text-center py-12">
          <div className="space-y-4">
            <div className="w-12 h-12 mx-auto text-club-light-gray/40 light:text-gray-400" />
            <div>
              <p className="text-club-light-gray light:text-gray-700">No performance data available</p>
              <p className="text-sm text-club-light-gray/60 light:text-gray-500 mt-1">
                No match performance data to create trends analysis
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn(
      "border-club-gold/20 transition-all duration-300",
      theme === 'dark' ? "bg-club-dark-gray hover:bg-club-dark-gray/80" : "bg-white hover:bg-gray-50"
    )}>
      <PerformanceTrendsHeader player={player} stats={stats} />
      <CardContent className="space-y-6">
        <PerformanceTrendsControls
          selectedKPI={selectedKPI}
          selectedTimePeriod={selectedTimePeriod}
          chartView={chartView}
          showMovingAverage={showMovingAverage}
          showStatistics={showStatistics}
          currentMetricIndex={currentMetricIndex}
          currentMetric={currentMetric}
          stats={stats}
          matchDataLength={chartData.length}
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
          matchData={chartData}
          selectedKPI={selectedKPI}
          selectedKPILabel={selectedKPIOption?.label || ""}
          showMovingAverage={showMovingAverage}
          getChartConfig={getChartConfig}
        />
      </CardContent>
    </Card>
  );
};
