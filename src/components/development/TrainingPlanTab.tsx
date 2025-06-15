
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";

interface TrainingRecommendation {
  type: string;
  exercises: string[];
  frequency: string;
}

interface TrainingPlanTabProps {
  recommendations: TrainingRecommendation[];
}

export const TrainingPlanTab = ({ recommendations }: TrainingPlanTabProps) => {
  return (
    <div className="grid gap-6">
      {recommendations.map((rec, index) => (
        <Card key={index} className="bg-club-dark-gray border-club-gold/20">
          <CardHeader>
            <CardTitle className="text-club-gold flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              {rec.type} Training
            </CardTitle>
            <CardDescription className="text-club-light-gray/70">
              Frequency: {rec.frequency}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {rec.exercises.map((exercise, idx) => (
                <li key={idx} className="flex items-center gap-2 text-club-light-gray">
                  <div className="w-2 h-2 bg-club-gold rounded-full"></div>
                  {exercise}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
