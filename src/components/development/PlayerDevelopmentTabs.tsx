
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DevelopmentGoalsTab } from "./DevelopmentGoalsTab";
import { TrainingPlanTab } from "./TrainingPlanTab";
import { CoachFeedbackTab } from "./CoachFeedbackTab";

interface Goal {
  id: number;
  title: string;
  target: number;
  current: number;
  deadline: string;
  status: string;
  category: string;
}

interface TrainingRecommendation {
  type: string;
  exercises: string[];
  frequency: string;
}

interface CoachFeedback {
  date: string;
  coach: string;
  feedback: string;
  rating: number;
}

interface DevelopmentData {
  goals: Goal[];
  trainingRecommendations: TrainingRecommendation[];
  coachFeedback: CoachFeedback[];
}

interface PlayerDevelopmentTabsProps {
  developmentData: DevelopmentData;
}

export const PlayerDevelopmentTabs = ({ developmentData }: PlayerDevelopmentTabsProps) => {
  return (
    <Tabs defaultValue="goals" className="space-y-6">
      <TabsList className="bg-club-dark-gray border-club-gold/20">
        <TabsTrigger value="goals" className="data-[state=active]:bg-club-gold/20">
          Development Goals
        </TabsTrigger>
        <TabsTrigger value="training" className="data-[state=active]:bg-club-gold/20">
          Training Plan
        </TabsTrigger>
        <TabsTrigger value="feedback" className="data-[state=active]:bg-club-gold/20">
          Coach Feedback
        </TabsTrigger>
      </TabsList>

      <TabsContent value="goals" className="space-y-6">
        <DevelopmentGoalsTab goals={developmentData.goals} />
      </TabsContent>

      <TabsContent value="training" className="space-y-6">
        <TrainingPlanTab recommendations={developmentData.trainingRecommendations} />
      </TabsContent>

      <TabsContent value="feedback" className="space-y-6">
        <CoachFeedbackTab feedback={developmentData.coachFeedback} />
      </TabsContent>
    </Tabs>
  );
};
