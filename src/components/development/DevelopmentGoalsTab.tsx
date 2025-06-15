
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Target } from "lucide-react";

interface Goal {
  id: number;
  title: string;
  target: number;
  current: number;
  deadline: string;
  status: string;
  category: string;
}

interface DevelopmentGoalsTabProps {
  goals: Goal[];
}

export const DevelopmentGoalsTab = ({ goals }: DevelopmentGoalsTabProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-500";
      case "on_track": return "bg-blue-500";
      case "behind": return "bg-red-500";
      default: return "bg-yellow-500";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "completed": return "Completed";
      case "on_track": return "On Track";
      case "behind": return "Behind Schedule";
      default: return "In Progress";
    }
  };

  return (
    <div className="grid gap-6">
      {goals.map((goal) => (
        <Card key={goal.id} className="bg-club-dark-gray border-club-gold/20">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-club-gold flex items-center gap-2">
                <Target className="h-5 w-5" />
                {goal.title}
              </CardTitle>
              <Badge className={`${getStatusColor(goal.status)} text-white`}>
                {getStatusText(goal.status)}
              </Badge>
            </div>
            <CardDescription className="text-club-light-gray/70">
              Category: {goal.category} • Deadline: {new Date(goal.deadline).toLocaleDateString()}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span>{goal.current}% / {goal.target}%</span>
              </div>
              <Progress 
                value={(goal.current / goal.target) * 100} 
                className="h-2"
              />
              <div className="text-sm text-club-light-gray/60">
                {Math.round((goal.current / goal.target) * 100)}% complete
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
