
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, LineChart, Line, BarChart, Bar } from "recharts";
import { cn } from "@/lib/utils";
import { useTheme } from "@/contexts/ThemeContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { CustomTooltip } from "./CustomTooltip";

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

  const CustomTooltipWrapper = (props: any) => (
    <CustomTooltip 
      {...props}
      selectedKPI={selectedKPI}
      selectedKPILabel={selectedKPILabel}
      showMovingAverage={showMovingAverage}
    />
  );

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        {chartView === "area" ? (
          <AreaChart data={matchData}>
            <defs>
              <linearGradient id="metricGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#D4AF37" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke={theme === 'dark' ? "#333" : "#e5e7eb"} 
              opacity={0.3} 
            />
            <XAxis 
              dataKey="match" 
              stroke={theme === 'dark' ? "#9CA3AF" : "#6B7280"}
              tick={{
                fill: theme === 'dark' ? "#9CA3AF" : "#6B7280",
                fontSize: 12
              }}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis 
              stroke={theme === 'dark' ? "#9CA3AF" : "#6B7280"}
              tick={{
                fill: theme === 'dark' ? "#9CA3AF" : "#6B7280",
                fontSize: 12
              }}
            />
            <CustomTooltipWrapper />
            <Area 
              type="monotone" 
              dataKey="value" 
              stroke="#D4AF37" 
              strokeWidth={2} 
              fill="url(#metricGradient)"
              dot={{
                fill: "#D4AF37",
                strokeWidth: 2,
                r: 4
              }}
            />
            {showMovingAverage && (
              <Area 
                type="monotone" 
                dataKey="movingAvg" 
                stroke="#9CA3AF" 
                strokeDasharray="5 5" 
                strokeWidth={2} 
                fill="transparent" 
                dot={false} 
              />
            )}
          </AreaChart>
        ) : chartView === "line" ? (
          <LineChart data={matchData}>
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke={theme === 'dark' ? "#333" : "#e5e7eb"} 
              opacity={0.3} 
            />
            <XAxis 
              dataKey="match" 
              stroke={theme === 'dark' ? "#9CA3AF" : "#6B7280"}
              tick={{
                fill: theme === 'dark' ? "#9CA3AF" : "#6B7280",
                fontSize: 12
              }}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis 
              stroke={theme === 'dark' ? "#9CA3AF" : "#6B7280"}
              tick={{
                fill: theme === 'dark' ? "#9CA3AF" : "#6B7280",
                fontSize: 12
              }}
            />
            <CustomTooltipWrapper />
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke="#D4AF37" 
              strokeWidth={2}
              dot={{
                fill: "#D4AF37",
                strokeWidth: 2,
                r: 4
              }}
            />
            {showMovingAverage && (
              <Line 
                type="monotone" 
                dataKey="movingAvg" 
                stroke="#9CA3AF" 
                strokeDasharray="5 5" 
                strokeWidth={2} 
                dot={false} 
              />
            )}
          </LineChart>
        ) : (
          <BarChart data={matchData}>
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke={theme === 'dark' ? "#333" : "#e5e7eb"} 
              opacity={0.3} 
            />
            <XAxis 
              dataKey="match" 
              stroke={theme === 'dark' ? "#9CA3AF" : "#6B7280"}
              tick={{
                fill: theme === 'dark' ? "#9CA3AF" : "#6B7280",
                fontSize: 12
              }}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis 
              stroke={theme === 'dark' ? "#9CA3AF" : "#6B7280"}
              tick={{
                fill: theme === 'dark' ? "#9CA3AF" : "#6B7280",
                fontSize: 12
              }}
            />
            <CustomTooltipWrapper />
            <Bar 
              dataKey="value" 
              fill="#D4AF37" 
              radius={[4, 4, 0, 0]} 
            />
          </BarChart>
        )}
      </ResponsiveContainer>
    </div>
  );
};
