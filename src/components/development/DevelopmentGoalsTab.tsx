
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
    <div className="grid gap-4 sm:gap-6">
      {goals.map((goal) => (
        <Card key={goal.id} className="bg-club-dark-gray border-club-gold/20">
          <CardHeader className="pb-3">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
              <CardTitle className="text-club-gold flex items-center gap-2 text-sm sm:text-base">
                <Target className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                <span className="break-words">{goal.title}</span>
              </CardTitle>
              <Badge className={`${getStatusColor(goal.status)} text-white text-xs flex-shrink-0 self-start`}>
                {getStatusText(goal.status)}
              </Badge>
            </div>
            <CardDescription className="text-club-light-gray/70 text-xs sm:text-sm break-words">
              <span className="block sm:inline">Category: {goal.category}</span>
              <span className="hidden sm:inline"> • </span>
              <span className="block sm:inline">Deadline: {new Date(goal.deadline).toLocaleDateString()}</span>
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-3">
              <div className="flex justify-between text-xs sm:text-sm">
                <span>Progress</span>
                <span>{goal.current}% / {goal.target}%</span>
              </div>
              <Progress 
                value={(goal.current / goal.target) * 100} 
                className="h-2"
              />
              <div className="text-xs sm:text-sm text-club-light-gray/60">
                {Math.round((goal.current / goal.target) * 100)}% complete
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
