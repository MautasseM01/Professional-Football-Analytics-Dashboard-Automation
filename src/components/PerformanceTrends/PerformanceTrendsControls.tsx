
import { useIsMobile } from "@/hooks/use-mobile";
import { Player } from "@/types";
import { MobileControls } from "./MobileControls";
import { DesktopControls } from "./DesktopControls";
import { PerformanceStats } from "./PerformanceStats";
import { KPI_OPTIONS } from "./constants";

interface PerformanceTrendsControlsProps {
  selectedKPI: string;
  selectedTimePeriod: string;
  chartView: string;
  showMovingAverage: boolean;
  showStatistics: boolean;
  currentMetricIndex: number;
  currentMetric: typeof KPI_OPTIONS[0];
  stats: {
    avg: number;
    max: number;
    min: number;
    trend: string;
  };
  matchDataLength: number;
  setSelectedKPI: (value: string) => void;
  setSelectedTimePeriod: (value: string) => void;
  setChartView: (value: string) => void;
  setShowMovingAverage: (value: boolean) => void;
  setShowStatistics: (value: boolean) => void;
  prevMetric: () => void;
  nextMetric: () => void;
}

export const PerformanceTrendsControls = ({
  selectedKPI,
  selectedTimePeriod,
  chartView,
  showMovingAverage,
  showStatistics,
  currentMetricIndex,
  currentMetric,
  stats,
  matchDataLength,
  setSelectedKPI,
  setSelectedTimePeriod,
  setChartView,
  setShowMovingAverage,
  setShowStatistics,
  prevMetric,
  nextMetric
}: PerformanceTrendsControlsProps) => {
  const isMobile = useIsMobile();

  return (
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
            <PerformanceStats stats={stats} matchDataLength={matchDataLength} />
          </div>
        )}
      </div>
    </div>
  );
};
