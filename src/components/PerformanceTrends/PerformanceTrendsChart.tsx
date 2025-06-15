
import { cn } from "@/lib/utils";
import { useTheme } from "@/contexts/ThemeContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { ChartRenderer } from "./ChartRenderer";

interface PerformanceTrendsChartProps {
  chartView: string;
  matchData: any[];
  selectedKPI: string;
  selectedKPILabel: string;
  showMovingAverage: boolean;
  getChartConfig: () => any;
}

export const PerformanceTrendsChart = ({
  chartView,
  matchData,
  selectedKPI,
  selectedKPILabel,
  showMovingAverage,
  getChartConfig
}: PerformanceTrendsChartProps) => {
  const { theme } = useTheme();
  const isMobile = useIsMobile();

  // Calculate dynamic height based on content and screen size
  const calculateContainerHeight = () => {
    if (isMobile) {
      return Math.max(320, 260 + (matchData.length * 2)); // Minimum 320px on mobile
    }
    return Math.max(400, 350 + (matchData.length * 3)); // Minimum 400px on desktop
  };

  return (
    <div className="px-4 sm:px-6 pb-6">
      <div 
        className={cn(
          "w-full rounded-2xl p-4 sm:p-6 transition-all duration-300 overflow-hidden",
          theme === 'dark' 
            ? "bg-club-black/20 border border-club-gold/10" 
            : "bg-gray-50/30 border border-club-gold/20"
        )}
        style={{ 
          height: `${calculateContainerHeight()}px`,
          contain: 'layout style paint'
        }}
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
  );
};
