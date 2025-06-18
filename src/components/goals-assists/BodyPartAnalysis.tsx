
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Player } from "@/types";
import { useGoalsData } from "@/hooks/use-goals-data";
import { ChartLoadingSkeleton } from "@/components/LoadingStates";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface BodyPartAnalysisProps {
  player: Player;
}

export const BodyPartAnalysis = ({ player }: BodyPartAnalysisProps) => {
  const { goals, loading, error } = useGoalsData(player);

  if (loading) return <ChartLoadingSkeleton />;
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
        <div className="bg-club-black/95 dark:bg-club-black/95 light:bg-white/95 border border-club-gold/30 dark:border-club-gold/30 light:border-gray-200 rounded-lg p-3 shadow-lg backdrop-blur-sm">
          <p className="text-club-gold dark:text-club-gold light:text-gray-900 font-medium">{label}</p>
          <p className="text-club-light-gray dark:text-club-light-gray light:text-gray-700">
            Goals: <span className="font-bold text-club-gold dark:text-club-gold light:text-gray-900">{payload[0].value}</span>
          </p>
          <p className="text-club-light-gray dark:text-club-light-gray light:text-gray-700">
            Percentage: <span className="font-bold text-club-gold dark:text-club-gold light:text-gray-900">{payload[0].payload.percentage}%</span>
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
          Goals by Body Part
        </CardTitle>
      </CardHeader>
      <CardContent>
        {goals.length === 0 ? (
          <p className="text-club-light-gray/60 dark:text-club-light-gray/60 light:text-gray-500 text-center py-8">No goals data available</p>
        ) : (
          <div className="space-y-6">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                  <CartesianGrid 
                    strokeDasharray="3 3" 
                    stroke="rgba(212, 175, 55, 0.1)"
                    vertical={false}
                  />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fontSize: 12, fill: 'var(--club-light-gray)' }}
                    axisLine={{ stroke: 'rgba(212, 175, 55, 0.2)' }}
                    tickLine={{ stroke: 'rgba(212, 175, 55, 0.2)' }}
                  />
                  <YAxis 
                    tick={{ fontSize: 12, fill: 'var(--club-light-gray)' }}
                    axisLine={{ stroke: 'rgba(212, 175, 55, 0.2)' }}
                    tickLine={{ stroke: 'rgba(212, 175, 55, 0.2)' }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar 
                    dataKey="goals" 
                    fill="#D4AF37"
                    radius={[6, 6, 0, 0]}
                    style={{
                      filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))',
                    }}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-1 gap-3">
              {chartData.map((item) => (
                <div key={item.name} className="flex items-center justify-between p-3 rounded-lg border border-club-gold/10 dark:border-club-gold/10 light:border-gray-100 bg-club-black/20 dark:bg-club-black/20 light:bg-gray-50/50">
                  <span className="text-sm font-medium text-club-light-gray dark:text-club-light-gray light:text-gray-700">{item.name}</span>
                  <div className="flex items-center gap-3 text-sm">
                    <span className="font-bold text-club-gold dark:text-club-gold light:text-gray-900">{item.goals}</span>
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
