
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";

interface UpcomingEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  type: 'match' | 'training' | 'meeting';
  location?: string;
}

export const CoachMiniCalendar = () => {
  const { t } = useLanguage();
  
  const upcomingEvents: UpcomingEvent[] = [
    {
      id: '1',
      title: 'vs Arsenal FC',
      date: 'Today',
      time: '15:00',
      type: 'match',
      location: 'Emirates Stadium'
    },
    {
      id: '2',
      title: 'Team Training',
      date: 'Tomorrow',
      time: '10:00',
      type: 'training',
      location: 'Training Ground'
    },
    {
      id: '3',
      title: 'vs Chelsea FC',
      date: 'Dec 28',
      time: '17:30',
      type: 'match',
      location: 'Stamford Bridge'
    },
    {
      id: '4',
      title: 'Tactical Meeting',
      date: 'Dec 29',
      time: '09:00',
      type: 'meeting',
      location: 'Conference Room'
    }
  ];

  const getEventBadgeColor = (type: string) => {
    switch (type) {
      case 'match':
        return 'bg-gradient-to-r from-red-500/20 to-red-600/20 text-red-400 border-red-500/30';
      case 'training':
        return 'bg-gradient-to-r from-blue-500/20 to-blue-600/20 text-blue-400 border-blue-500/30';
      case 'meeting':
        return 'bg-gradient-to-r from-amber-500/20 to-amber-600/20 text-amber-400 border-amber-500/30';
      default:
        return 'bg-gradient-to-r from-muted/20 to-muted/30 text-muted-foreground border-muted/30';
    }
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'match':
        return '⚽';
      case 'training':
        return '🏃';
      case 'meeting':
        return '📋';
      default:
        return '📅';
    }
  };

  return (
    <Card className="bg-gradient-to-br from-background to-secondary/20 border-border/50 shadow-lg">
      <CardHeader className="p-4 sm:p-5 lg:p-6">
        <CardTitle className="text-primary flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          {t('coach.upcomingSchedule')}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 sm:p-5 lg:p-6 pt-0">
        <div className="space-y-3">
          {upcomingEvents.map((event) => (
            <div 
              key={event.id} 
              className="flex items-center gap-4 p-4 bg-gradient-to-r from-card/80 to-card/50 border border-border/50 rounded-xl hover:from-card hover:to-card/80 hover:border-primary/20 transition-all duration-300 cursor-pointer min-h-[60px] touch-manipulation hover:shadow-md active:scale-98"
            >
              <div className="text-2xl flex-shrink-0 p-2 bg-primary/10 rounded-lg">
                {getEventIcon(event.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-semibold text-sm text-foreground truncate">
                    {event.title}
                  </span>
                  <Badge className={`text-xs px-2 py-1 font-medium rounded-md ${getEventBadgeColor(event.type)}`}>
                    {event.type}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    <span className="font-medium">{event.date} à {event.time}</span>
                  </div>
                  {event.location && (
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5" />
                      <span className="truncate font-medium">{event.location}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
