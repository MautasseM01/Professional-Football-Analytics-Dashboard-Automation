
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
      <div className="overflow-x-auto">
        <TabsList className="bg-club-dark-gray border-club-gold/20 w-full min-w-fit grid grid-cols-3 h-auto p-1">
          <TabsTrigger 
            value="goals" 
            className="data-[state=active]:bg-club-gold/20 px-2 py-2 text-xs sm:text-sm whitespace-nowrap"
          >
            <span className="hidden sm:inline">Development Goals</span>
            <span className="sm:hidden">Goals</span>
          </TabsTrigger>
          <TabsTrigger 
            value="training" 
            className="data-[state=active]:bg-club-gold/20 px-2 py-2 text-xs sm:text-sm whitespace-nowrap"
          >
            <span className="hidden sm:inline">Training Plan</span>
            <span className="sm:hidden">Training</span>
          </TabsTrigger>
          <TabsTrigger 
            value="feedback" 
            className="data-[state=active]:bg-club-gold/20 px-2 py-2 text-xs sm:text-sm whitespace-nowrap"
          >
            <span className="hidden sm:inline">Coach Feedback</span>
            <span className="sm:hidden">Feedback</span>
          </TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="goals" className="space-y-6 mt-4">
        <DevelopmentGoalsTab goals={developmentData.goals} />
      </TabsContent>

      <TabsContent value="training" className="space-y-6 mt-4">
        <TrainingPlanTab recommendations={developmentData.trainingRecommendations} />
      </TabsContent>

      <TabsContent value="feedback" className="space-y-6 mt-4">
        <CoachFeedbackTab feedback={developmentData.coachFeedback} />
      </TabsContent>
    </Tabs>
  );
};
