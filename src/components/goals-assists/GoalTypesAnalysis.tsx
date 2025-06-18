
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Player } from "@/types";
import { useGoalsData } from "@/hooks/use-goals-data";
import { ChartLoadingSkeleton } from "@/components/LoadingStates";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

interface GoalTypesAnalysisProps {
  player: Player;
}

const COLORS = ['#D4AF37', '#FFD700', '#B8860B', '#DAA520', '#F0E68C', '#FFFF8C'];

export const GoalTypesAnalysis = ({ player }: GoalTypesAnalysisProps) => {
  const { goals, loading, error } = useGoalsData(player);

  if (loading) return <ChartLoadingSkeleton />;
  if (error) return <div className="text-red-500">Error: {error}</div>;

  const goalTypeData = goals.reduce((acc, goal) => {
    const type = goal.goal_type || 'Open Play';
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const chartData = Object.entries(goalTypeData).map(([type, count]) => ({
    name: type,
    value: count,
    percentage: ((count / goals.length) * 100).toFixed(1)
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-club-black/95 dark:bg-club-black/95 light:bg-white/95 border border-club-gold/30 dark:border-club-gold/30 light:border-gray-200 rounded-lg p-3 shadow-lg backdrop-blur-sm">
          <p className="text-club-gold dark:text-club-gold light:text-gray-900 font-medium">{data.payload.name}</p>
          <p className="text-club-light-gray dark:text-club-light-gray light:text-gray-700">
            Goals: <span className="font-bold text-club-gold dark:text-club-gold light:text-gray-900">{data.value}</span>
          </p>
          <p className="text-club-light-gray dark:text-club-light-gray light:text-gray-700">
            Percentage: <span className="font-bold text-club-gold dark:text-club-gold light:text-gray-900">{data.payload.percentage}%</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="bg-club-black/40 dark:bg-club-black/40 light:bg-white/90 border-club-gold/20 dark:border-club-gold/20 light:border-gray-200 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-club-gold dark:text-club-gold light:text-gray-900 text-lg font-semibold">
          Goal Types Distribution
        </CardTitle>
      </CardHeader>
      <CardContent>
        {goals.length === 0 ? (
          <p className="text-club-light-gray/60 dark:text-club-light-gray/60 light:text-gray-500 text-center py-8">No goals data available</p>
        ) : (
          <div className="space-y-6">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={120}
                    paddingAngle={2}
                    dataKey="value"
                    stroke="none"
                  >
                    {chartData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={COLORS[index % COLORS.length]}
                        style={{
                          filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))',
                        }}
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend 
                    wrapperStyle={{
                      fontSize: '14px',
                      color: 'var(--club-light-gray)'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-1 gap-3">
              {chartData.map((item, index) => (
                <div key={item.name} className="flex items-center justify-between p-3 rounded-lg border border-club-gold/10 dark:border-club-gold/10 light:border-gray-100 bg-club-black/20 dark:bg-club-black/20 light:bg-gray-50/50">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-4 h-4 rounded-full shadow-sm" 
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span className="text-sm font-medium text-club-light-gray dark:text-club-light-gray light:text-gray-700">{item.name}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <span className="font-bold text-club-gold dark:text-club-gold light:text-gray-900">{item.value}</span>
                    <span className="text-club-light-gray/70 dark:text-club-light-gray/70 light:text-gray-500">({item.percentage}%)</span>
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
