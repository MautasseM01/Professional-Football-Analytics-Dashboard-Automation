
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Player } from "@/types";
import { useGoalsData } from "@/hooks/use-goals-data";
import { ChartSkeleton } from "@/components/charts/ChartSkeleton";
import { ResponsiveChartContainer } from "@/components/ResponsiveChartContainer";
import { chartAxisConfig, chartTooltipConfig, chartAnimationConfig } from "@/components/charts/ChartTheme";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface BodyPartAnalysisProps {
  player: Player;
}

export const BodyPartAnalysis = ({ player }: BodyPartAnalysisProps) => {
  const { goals, loading, error } = useGoalsData(player);

  if (loading) return <ChartSkeleton height={400} showLegend={false} />;
  if (error) return <div className="text-red-500">Error: {error}</div>;

  const bodyPartData = goals.reduce((acc, goal) => {
    const part = goal.body_part || 'Right Foot';
    acc[part] = (acc[part] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const chartData = Object.entries(bodyPartData).map(([part, count]) => ({
    name: part,
    goals: count,
    percentage: goals.length > 0 ? ((count / goals.length) * 100).toFixed(1) : 0
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div 
          className="bg-club-black/95 border border-club-gold/30 rounded-lg p-3 shadow-lg backdrop-blur-sm"
          style={chartTooltipConfig.contentStyle}
        >
          <p className="text-club-gold font-medium" style={chartTooltipConfig.labelStyle}>
            {label}
          </p>
          <p className="text-club-light-gray">
            Goals: <span className="font-bold text-club-gold">{payload[0].value}</span>
          </p>
          <p className="text-club-light-gray">
            Percentage: <span className="font-bold text-club-gold">{payload[0].payload.percentage}%</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="bg-club-dark-gray border-club-gold/20 hover:bg-club-gold/5 transition-all duration-300">
      <CardHeader className="pb-3">
        <CardTitle className="text-club-gold text-lg font-semibold flex items-center gap-2">
          Goals by Body Part
          <div className="w-2 h-2 bg-club-gold rounded-full animate-pulse" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        {goals.length === 0 ? (
          <p className="text-club-light-gray/60 text-center py-8">No goals data available</p>
        ) : (
          <div className="space-y-6">
            <ResponsiveChartContainer minHeight={320} showInteractions={true}>
              <BarChart 
                data={chartData} 
                {...chartAnimationConfig}
              >
                <CartesianGrid 
                  strokeDasharray="3 3" 
                  stroke="rgba(212, 175, 55, 0.1)"
                  vertical={false}
                />
                <XAxis 
                  dataKey="name" 
                  {...chartAxisConfig}
                />
                <YAxis 
                  {...chartAxisConfig}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar 
                  dataKey="goals" 
                  fill="#D4AF37"
                  radius={[6, 6, 0, 0]}
                  style={{
                    filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.3))',
                  }}
                />
              </BarChart>
            </ResponsiveChartContainer>
            
            <div className="grid grid-cols-1 gap-3">
              {chartData.map((item, index) => (
                <div 
                  key={item.name} 
                  className="flex items-center justify-between p-3 rounded-lg border border-club-gold/10 bg-club-black/20 hover:bg-club-gold/5 transition-all duration-300"
                  style={{ 
                    animationDelay: `${index * 0.1}s`,
                    animation: 'fade-in 0.5s ease-out forwards'
                  }}
                >
                  <span className="text-sm font-medium text-club-light-gray">{item.name}</span>
                  <div className="flex items-center gap-3 text-sm">
                    <span className="font-bold text-club-gold">{item.goals}</span>
                    <span className="text-club-light-gray/70">({item.percentage}%)</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
