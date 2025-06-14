
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

  return (
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
  );
};
