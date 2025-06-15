
import { ResponsiveContainer, LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, AreaChart, Area } from "recharts";
import { ChartTooltip } from "@/components/ui/chart";
import { useTheme } from "@/contexts/ThemeContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { CustomTooltip } from "./CustomTooltip";

interface ChartRendererProps {
  chartView: string;
  matchData: any[];
  selectedKPI: string;
  selectedKPILabel: string;
  showMovingAverage: boolean;
  getChartConfig: () => any;
}

export const ChartRenderer = ({
  chartView,
  matchData,
  selectedKPI,
  selectedKPILabel,
  showMovingAverage,
  getChartConfig
}: ChartRendererProps) => {
  const { theme } = useTheme();
  const isMobile = useIsMobile();

  // Enhanced margins with better spacing for proper centering
  const getMargins = () => {
    if (isMobile) {
      return { 
        top: 30,      // Increased top margin for better balance
        right: 25,    // Adequate right margin
        left: 45,     // Sufficient left margin for Y-axis labels
        bottom: 80    // Generous bottom margin for rotated X-axis labels
      };
    }
    return { 
      top: 40,       // More generous top margin on desktop
      right: 35,     // Better right margin for larger screens
      left: 60,      // More space for Y-axis labels
      bottom: 100    // Ample bottom margin for rotated labels
    };
  };

  const margins = getMargins();

  return (
    <div className="w-full h-full flex items-center justify-center" style={{ contain: 'layout' }}>
      <div className="w-full h-full" style={{ 
        padding: isMobile ? '8px' : '12px', // Responsive inner padding
        minHeight: '100%'
      }}>
        <ResponsiveContainer width="100%" height="100%">
          {chartView === 'line' ? (
            <RechartsLineChart data={matchData} margin={margins}>
              <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? "#333" : "#e5e7eb"} opacity={0.3} />
              <XAxis 
                dataKey="match" 
                stroke={theme === 'dark' ? "#9CA3AF" : "#6B7280"}
                tick={{ 
                  fill: theme === 'dark' ? "#9CA3AF" : "#6B7280", 
                  fontSize: isMobile ? 10 : 12, // Slightly larger font for better readability
                  textAnchor: 'end'
                }}
                tickLine={false}
                axisLine={false}
                angle={-45}
                interval={0}
                height={margins.bottom}
                minTickGap={0}
              />
              <YAxis 
                stroke={theme === 'dark' ? "#9CA3AF" : "#6B7280"}
                tick={{ 
                  fill: theme === 'dark' ? "#9CA3AF" : "#6B7280", 
                  fontSize: isMobile ? 10 : 12
                }}
                tickLine={false}
                axisLine={false}
                width={margins.left}
              />
              
              <ChartTooltip 
                content={
                  <CustomTooltip 
                    selectedKPI={selectedKPI} 
                    selectedKPILabel={selectedKPILabel} 
                    showMovingAverage={showMovingAverage} 
                  />
                } 
              />
              
              <Line
                type="monotone"
                dataKey="value"
                name={selectedKPILabel}
                stroke="#D4AF37"
                strokeWidth={isMobile ? 2 : 2.5}
                dot={{ r: isMobile ? 3 : 4, strokeWidth: 2, fill: "#D4AF37" }}
                activeDot={{ r: isMobile ? 5 : 6, strokeWidth: 2, fill: "#D4AF37" }}
              />

              {showMovingAverage && !isMobile && (
                <Line
                  type="monotone"
                  dataKey="movingAvg"
                  name="3-Match Average"
                  stroke="#9CA3AF"
                  strokeDasharray="5 5"
                  strokeWidth={2}
                  dot={false}
                />
              )}
            </RechartsLineChart>
          ) : (
            <AreaChart data={matchData} margin={margins}>
              <defs>
                <linearGradient id="metricGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#D4AF37" stopOpacity={0.05}/>
                </linearGradient>
              </defs>
              
              <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? "#333" : "#e5e7eb"} opacity={0.3} />
              <XAxis 
                dataKey="match" 
                stroke={theme === 'dark' ? "#9CA3AF" : "#6B7280"}
                tick={{ 
                  fill: theme === 'dark' ? "#9CA3AF" : "#6B7280", 
                  fontSize: isMobile ? 10 : 12,
                  textAnchor: 'end'
                }}
                tickLine={false}
                axisLine={false}
                angle={-45}
                interval={0}
                height={margins.bottom}
                minTickGap={0}
              />
              <YAxis 
                stroke={theme === 'dark' ? "#9CA3AF" : "#6B7280"}
                tick={{ 
                  fill: theme === 'dark' ? "#9CA3AF" : "#6B7280", 
                  fontSize: isMobile ? 10 : 12
                }}
                tickLine={false}
                axisLine={false}
                width={margins.left}
              />
              
              <ChartTooltip 
                content={
                  <CustomTooltip 
                    selectedKPI={selectedKPI} 
                    selectedKPILabel={selectedKPILabel} 
                    showMovingAverage={showMovingAverage} 
                  />
                } 
              />
              
              <Area
                type="monotone"
                dataKey="value"
                stroke="#D4AF37"
                strokeWidth={isMobile ? 2 : 2.5}
                fill="url(#metricGradient)"
                dot={{ fill: "#D4AF37", strokeWidth: 2, r: isMobile ? 3 : 4 }}
                activeDot={{ r: isMobile ? 5 : 6, stroke: "#D4AF37", strokeWidth: 2 }}
              />

              {showMovingAverage && !isMobile && (
                <Line
                  type="monotone"
                  dataKey="movingAvg"
                  stroke="#9CA3AF"
                  strokeDasharray="5 5"
                  strokeWidth={2}
                  dot={false}
                />
              )}
            </AreaChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
};
