
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

export const CoachQuickActions = () => {
  const quickActions = [
    {
      title: "Team Selection",
      icon: <Users className="w-4 h-4" />,
      onClick: () => console.log("Open team selection"),
      variant: "default" as const
    },
    {
      title: "Training Plan",
      icon: <ClipboardList className="w-4 h-4" />,
      onClick: () => console.log("Open training plan"),
      variant: "outline" as const
    },
    {
      title: "Schedule Match",
      icon: <Calendar className="w-4 h-4" />,
      onClick: () => console.log("Schedule match"),
      variant: "outline" as const
    },
    {
      title: "Set Goals",
      icon: <Target className="w-4 h-4" />,
      onClick: () => console.log("Set team goals"),
      variant: "outline" as const
    },
    {
      title: "Player Feedback",
      icon: <MessageSquare className="w-4 h-4" />,
      onClick: () => console.log("Give player feedback"),
      variant: "outline" as const
    },
    {
      title: "Match Report",
      icon: <FileText className="w-4 h-4" />,
      onClick: () => console.log("Create match report"),
      variant: "outline" as const
    }
  ];

  return (
    <Card className="bg-club-dark-gray border-club-gold/20 light:bg-white light:border-gray-200">
      <CardHeader className="p-4 sm:p-5 lg:p-6">
        <CardTitle className="text-club-gold light:text-yellow-600 flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 sm:p-5 lg:p-6 pt-0">
        <ResponsiveGrid minCardWidth="140px" className="gap-3">
          {quickActions.map((action, index) => (
            <Button
              key={index}
              variant={action.variant}
              className="h-auto p-3 flex flex-col items-center gap-2 text-xs hover:scale-105 transition-transform duration-200"
              onClick={action.onClick}
            >
              {action.icon}
              <span className="text-center leading-tight">{action.title}</span>
            </Button>
          ))}
        </ResponsiveGrid>
      </CardContent>
    </Card>
  );
};
