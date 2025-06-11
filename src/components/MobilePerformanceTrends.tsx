
import { Player } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, TrendingUp, TrendingDown, Activity } from "lucide-react";
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { cn } from "@/lib/utils";
import { useTheme } from "@/contexts/ThemeContext";
import { useIsMobile } from "@/hooks/use-mobile";

interface MobilePerformanceTrendsProps {
  player: Player;
}

export const MobilePerformanceTrends = ({ player }: MobilePerformanceTrendsProps) => {
  const { theme } = useTheme();
  const isMobile = useIsMobile();

  // Mock trend data - in real implementation, this would come from props or API
  const trendData = [
    { label: "Goals", current: 8, previous: 6, trend: "up" },
    { label: "Assists", current: 12, previous: 10, trend: "up" },
    { label: "Distance", current: 11.2, previous: 10.8, trend: "up" },
    { label: "Pass Accuracy", current: 87, previous: 89, trend: "down" }
  ];

  // Mock performance data for charts
  const performanceData = [
    { match: 'Match 1', goals: 1, assists: 2, distance: 10.5, passAccuracy: 85 },
    { match: 'Match 2', goals: 0, assists: 1, distance: 11.2, passAccuracy: 88 },
    { match: 'Match 3', goals: 2, assists: 0, distance: 10.8, passAccuracy: 82 },
    { match: 'Match 4', goals: 1, assists: 3, distance: 11.5, passAccuracy: 91 },
    { match: 'Match 5', goals: 0, assists: 1, distance: 10.2, passAccuracy: 87 },
  ];

  return (
    <Card className={cn(
      "w-full overflow-hidden transition-all duration-300",
      theme === 'dark' 
        ? "bg-club-dark-gray/50 border-club-gold/20" 
        : "bg-white/90 border-club-gold/30"
    )}>
      <CardHeader className={cn(
        "border-b pb-4",
        theme === 'dark' 
          ? "bg-club-black/40 border-club-gold/20" 
          : "bg-blue-50/80 border-club-gold/30",
        isMobile ? "p-4" : "p-6"
      )}>
        <CardTitle className={cn(
          "font-bold tracking-tight flex items-center gap-2",
          isMobile ? "text-base" : "text-lg",
          theme === 'dark' ? "text-club-light-gray" : "text-gray-900"
        )}>
          <Activity className={cn(
            "text-club-gold",
            isMobile ? "w-4 h-4" : "w-5 h-5"
          )} />
          Key Performance Trends
        </CardTitle>
      </CardHeader>

      <CardContent className={cn(
        "w-full",
        isMobile ? "p-4 space-y-4" : "p-6 space-y-6"
      )}>
        {/* Performance Stats Cards */}
        <div className={cn(
          "grid gap-3 w-full",
          isMobile ? "grid-cols-2" : "grid-cols-2 lg:grid-cols-4"
        )}>
          {trendData.map((item, index) => (
            <div
              key={index}
              className={cn(
                "rounded-lg p-3 border border-club-gold/20 transition-all duration-200",
                theme === 'dark' 
                  ? "bg-club-black/30 hover:bg-club-black/40" 
                  : "bg-white/50 hover:bg-white/70",
                isMobile && "min-h-[70px] flex flex-col justify-center"
              )}
            >
              <div className="flex items-center justify-between mb-1">
                <span className={cn(
                  "font-medium",
                  isMobile ? "text-xs" : "text-sm",
                  theme === 'dark' ? "text-club-light-gray" : "text-gray-700"
                )}>
                  {item.label}
                </span>
                {item.trend === "up" ? (
                  <TrendingUp className="w-3 h-3 text-green-500" />
                ) : (
                  <TrendingDown className="w-3 h-3 text-red-500" />
                )}
              </div>
              
              <div className="space-y-1">
                <div className={cn(
                  "font-bold text-club-gold",
                  isMobile ? "text-sm" : "text-lg"
                )}>
                  {typeof item.current === 'number' && item.current % 1 !== 0 
                    ? item.current.toFixed(1) 
                    : item.current}
                  {item.label === "Pass Accuracy" && "%"}
                  {item.label === "Distance" && "km"}
                </div>
                
                <div className={cn(
                  "text-xs",
                  theme === 'dark' ? "text-club-light-gray/60" : "text-gray-500"
                )}>
                  Prev: {item.previous}
                  {item.label === "Pass Accuracy" && "%"}
                  {item.label === "Distance" && "km"}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Goals & Assists Chart */}
        <div className={cn(
          "rounded-lg border border-club-gold/20 p-4 w-full",
          theme === 'dark' 
            ? "bg-club-black/20" 
            : "bg-gray-50/50"
        )}>
          <h4 className={cn(
            "font-medium mb-3 text-club-gold",
            isMobile ? "text-sm" : "text-base"
          )}>
            Goals & Assists Trend
          </h4>
          <div className={cn(
            "w-full",
            isMobile ? "h-[200px]" : "h-[250px]"
          )}>
            <ResponsiveContainer width="100%" height="100%">
              <RechartsLineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#374151' : '#e5e7eb'} />
                <XAxis 
                  dataKey="match" 
                  tick={{ fontSize: isMobile ? 10 : 12, fill: theme === 'dark' ? '#9ca3af' : '#6b7280' }}
                />
                <YAxis 
                  tick={{ fontSize: isMobile ? 10 : 12, fill: theme === 'dark' ? '#9ca3af' : '#6b7280' }}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff',
                    border: '1px solid #d97706',
                    borderRadius: '8px',
                    fontSize: isMobile ? '12px' : '14px'
                  }}
                />
                <Line type="monotone" dataKey="goals" stroke="#d97706" strokeWidth={2} dot={{ fill: '#d97706', r: 4 }} />
                <Line type="monotone" dataKey="assists" stroke="#059669" strokeWidth={2} dot={{ fill: '#059669', r: 4 }} />
              </RechartsLineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Performance Metrics Chart */}
        <div className={cn(
          "rounded-lg border border-club-gold/20 p-4 w-full",
          theme === 'dark' 
            ? "bg-club-black/20" 
            : "bg-gray-50/50"
        )}>
          <h4 className={cn(
            "font-medium mb-3 text-club-gold",
            isMobile ? "text-sm" : "text-base"
          )}>
            Distance & Pass Accuracy
          </h4>
          <div className={cn(
            "w-full",
            isMobile ? "h-[200px]" : "h-[250px]"
          )}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#374151' : '#e5e7eb'} />
                <XAxis 
                  dataKey="match" 
                  tick={{ fontSize: isMobile ? 10 : 12, fill: theme === 'dark' ? '#9ca3af' : '#6b7280' }}
                />
                <YAxis 
                  tick={{ fontSize: isMobile ? 10 : 12, fill: theme === 'dark' ? '#9ca3af' : '#6b7280' }}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff',
                    border: '1px solid #d97706',
                    borderRadius: '8px',
                    fontSize: isMobile ? '12px' : '14px'
                  }}
                />
                <Bar dataKey="distance" fill="#3b82f6" />
                <Bar dataKey="passAccuracy" fill="#8b5cf6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
