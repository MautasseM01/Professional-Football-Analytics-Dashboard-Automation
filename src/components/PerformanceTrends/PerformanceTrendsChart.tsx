
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
      return Math.max(380, 300 + (matchData.length * 2));
    }
    return Math.max(500, 420 + (matchData.length * 3));
  };

  // Responsive padding for right-bottom positioning
  const getContainerPadding = () => {
    if (isMobile) {
      return "pt-2 pb-6 pl-2 pr-6"; // More bottom and right padding, less top and left
    }
    return "pt-4 pb-8 pl-4 pr-10"; // More bottom and right padding on larger screens
  };

  return (
    <div className="pl-2 sm:pl-4 pr-6 sm:pr-8 pb-6"> {/* Adjusted outer container - less left, more right padding */}
      <div 
        className={cn(
          "w-full rounded-2xl transition-all duration-300 overflow-hidden",
          "flex flex-col justify-end items-end", // Changed to justify-end and items-end for right-bottom alignment
          getContainerPadding(),
          theme === 'dark' 
            ? "bg-club-black/20 border border-club-gold/10" 
            : "bg-gray-50/30 border border-club-gold/20"
        )}
        style={{ 
          height: `${calculateContainerHeight()}px`,
          contain: 'layout style paint'
        }}
      >
        <div className="w-full h-full flex items-end justify-end pb-4 pr-2"> {/* Added bottom and right offsets */}
          <div className="w-full h-full" style={{ 
            maxHeight: '100%',
            minHeight: isMobile ? '280px' : '360px'
          }}>
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
      </div>
    </div>
  );
};
