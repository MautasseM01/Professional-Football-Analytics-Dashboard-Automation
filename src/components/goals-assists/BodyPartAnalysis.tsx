
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Player } from "@/types";
import { useGoalsData } from "@/hooks/use-goals-data";
import { LoadingStates } from "@/components/LoadingStates";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface BodyPartAnalysisProps {
  player: Player;
}

export const BodyPartAnalysis = ({ player }: BodyPartAnalysisProps) => {
  const { goals, loading, error } = useGoalsData(player);

  if (loading) return <LoadingStates.Card />;
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Goals by Body Part</CardTitle>
      </CardHeader>
      <CardContent>
        {goals.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">No goals data available</p>
        ) : (
          <div className="space-y-4">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value, name) => [value, 'Goals']}
                    labelFormatter={(label) => `Body Part: ${label}`}
                  />
                  <Bar dataKey="goals" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-1 gap-2">
              {chartData.map((item) => (
                <div key={item.name} className="flex items-center justify-between p-2 rounded border">
                  <span className="text-sm font-medium">{item.name}</span>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-medium">{item.goals}</span>
                    <span className="text-muted-foreground">({item.percentage}%)</span>
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
