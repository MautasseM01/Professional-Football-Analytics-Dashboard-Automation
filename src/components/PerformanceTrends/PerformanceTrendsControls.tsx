
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
    trend: 'up' | 'down' | 'neutral';
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
  return (
    <div className="pb-4">
      <div className="space-y-3 sm:space-y-4">
        {/* Always use responsive desktop controls */}
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
