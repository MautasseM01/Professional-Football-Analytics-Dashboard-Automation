
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface UpcomingEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  type: 'match' | 'training' | 'meeting';
  location?: string;
}

export const CoachMiniCalendar = () => {
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
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'training':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'meeting':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
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
    <Card className="bg-club-dark-gray border-club-gold/20 light:bg-white light:border-gray-200">
      <CardHeader className="p-4 sm:p-5 lg:p-6">
        <CardTitle className="text-club-gold light:text-yellow-600 flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Upcoming Schedule
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 sm:p-5 lg:p-6 pt-0">
        <div className="space-y-3">
          {upcomingEvents.map((event) => (
            <div 
              key={event.id} 
              className="flex items-center gap-3 p-3 bg-club-black/40 light:bg-gray-50 rounded-lg hover:bg-club-black/60 light:hover:bg-gray-100 transition-colors duration-200 cursor-pointer"
            >
              <div className="text-lg flex-shrink-0">
                {getEventIcon(event.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-club-light-gray light:text-gray-900 font-medium text-sm truncate">
                    {event.title}
                  </span>
                  <Badge className={`text-xs px-2 py-0.5 ${getEventBadgeColor(event.type)}`}>
                    {event.type}
                  </Badge>
                </div>
                <div className="flex items-center gap-3 text-xs text-gray-400 light:text-gray-600">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{event.date} at {event.time}</span>
                  </div>
                  {event.location && (
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      <span className="truncate">{event.location}</span>
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
