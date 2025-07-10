
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  ClipboardList, 
  Calendar, 
  Target, 
  MessageSquare, 
  FileText,
  Plus
} from "lucide-react";
import { ResponsiveGrid } from "./ResponsiveLayout";
import { useLanguage } from "@/contexts/LanguageContext";

export const CoachQuickActions = () => {
  const { t } = useLanguage();
  
  const quickActions = [
    {
      title: t('coach.teamSelection'),
      icon: <Users className="w-5 h-5" />,
      onClick: () => console.log("Open team selection"),
      variant: "default" as const,
      className: "bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg"
    },
    {
      title: t('coach.trainingPlan'),
      icon: <ClipboardList className="w-5 h-5" />,
      onClick: () => console.log("Open training plan"),
      variant: "outline" as const,
      className: "border-primary/20 hover:bg-primary/10 hover:border-primary/40"
    },
    {
      title: t('coach.scheduleMatch'),
      icon: <Calendar className="w-5 h-5" />,
      onClick: () => console.log("Schedule match"),
      variant: "outline" as const,
      className: "border-primary/20 hover:bg-primary/10 hover:border-primary/40"
    },
    {
      title: t('coach.setGoals'),
      icon: <Target className="w-5 h-5" />,
      onClick: () => console.log("Set team goals"),
      variant: "outline" as const,
      className: "border-primary/20 hover:bg-primary/10 hover:border-primary/40"
    },
    {
      title: t('coach.playerFeedback'),
      icon: <MessageSquare className="w-5 h-5" />,
      onClick: () => console.log("Give player feedback"),
      variant: "outline" as const,
      className: "border-primary/20 hover:bg-primary/10 hover:border-primary/40"
    },
    {
      title: t('coach.matchReport'),
      icon: <FileText className="w-5 h-5" />,
      onClick: () => console.log("Create match report"),
      variant: "outline" as const,
      className: "border-primary/20 hover:bg-primary/10 hover:border-primary/40"
    }
  ];

  return (
    <Card className="bg-gradient-to-br from-background to-primary/5 border-primary/10 shadow-lg">
      <CardHeader className="p-4 sm:p-5 lg:p-6">
        <CardTitle className="text-primary flex items-center gap-2">
          <Plus className="w-5 h-5" />
          {t('coach.quickActions')}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 sm:p-5 lg:p-6 pt-0">
        <ResponsiveGrid minCardWidth="150px" className="gap-4">
          {quickActions.map((action, index) => (
            <Button
              key={index}
              variant={action.variant}
              className={`h-auto p-4 flex flex-col items-center gap-3 text-sm font-medium hover:scale-105 active:scale-95 transition-all duration-200 min-h-[80px] touch-manipulation shadow-sm hover:shadow-md ${action.className}`}
              onClick={action.onClick}
            >
              <div className="flex-shrink-0">
                {action.icon}
              </div>
              <span className="text-center leading-tight text-xs">{action.title}</span>
            </Button>
          ))}
        </ResponsiveGrid>
      </CardContent>
    </Card>
  );
};
