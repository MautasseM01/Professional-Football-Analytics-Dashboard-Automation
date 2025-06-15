
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
    <div className="grid gap-4 sm:gap-6">
      {recommendations.map((rec, index) => (
        <Card key={index} className="bg-club-dark-gray border-club-gold/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-club-gold flex items-center gap-2 text-sm sm:text-base">
              <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
              <span className="truncate">{rec.type} Training</span>
            </CardTitle>
            <CardDescription className="text-club-light-gray/70 text-xs sm:text-sm">
              Frequency: {rec.frequency}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <ul className="space-y-2">
              {rec.exercises.map((exercise, idx) => (
                <li key={idx} className="flex items-start gap-2 text-club-light-gray text-sm sm:text-base">
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-club-gold rounded-full mt-2 flex-shrink-0"></div>
                  <span className="leading-relaxed">{exercise}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
