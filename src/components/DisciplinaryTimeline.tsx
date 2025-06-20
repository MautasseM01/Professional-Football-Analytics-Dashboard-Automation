
import { format } from "date-fns";
import { Calendar, Clock, Users, TrendingDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface DisciplinaryEvent {
  id: number;
  card_type: string;
  match_date: string;
  competition: string;
  opposition?: string;
  home_score?: number;
  away_score?: number;
  minute?: number;
}

interface DisciplinaryTimelineProps {
  events: DisciplinaryEvent[];
}

const CardIcon = ({ type }: { type: 'yellow' | 'red' }) => {
  const bgColor = type === 'yellow' ? 'bg-[#FCD34D]' : 'bg-[#EF4444]';
  const letter = type === 'yellow' ? 'Y' : 'R';
  
  return (
    <div className={`${bgColor} text-black text-xs font-bold w-6 h-8 rounded-sm flex items-center justify-center shadow-sm border border-gray-300`}>
      {letter}
    </div>
  );
};

export const DisciplinaryTimeline = ({ events }: DisciplinaryTimelineProps) => {
  if (events.length === 0) {
    return (
      <Card className="bg-club-dark-gray border-club-gold/20">
        <CardContent className="p-6 text-center">
          <div className="text-green-500 mb-2">
            <Users className="w-8 h-8 mx-auto" />
          </div>
          <p className="text-club-light-gray">No disciplinary incidents recorded</p>
          <p className="text-xs text-club-light-gray/60 mt-1">Exemplary conduct this season</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-club-dark-gray border-club-gold/20">
      <CardHeader>
        <CardTitle className="text-club-gold flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Disciplinary Timeline
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          {events.map((event, index) => (
            <div key={event.id} className="relative">
              {index !== events.length - 1 && (
                <div className="absolute left-3 top-10 w-0.5 h-16 bg-club-gold/20" />
              )}
              
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 mt-1">
                  <CardIcon type={event.card_type.toLowerCase() as 'yellow' | 'red'} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-club-light-gray font-medium">
                        vs {event.opposition || 'Unknown'}
                      </span>
                      <Badge variant="outline" className="text-xs border-club-gold/30 text-club-gold">
                        {event.competition}
                      </Badge>
                    </div>
                    <span className="text-xs text-club-light-gray/60">
                      {event.match_date ? format(new Date(event.match_date), 'MMM dd, yyyy') : 'Date unknown'}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-4 text-xs text-club-light-gray/70">
                    {event.minute && (
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{event.minute}'</span>
                      </div>
                    )}
                    
                    {event.home_score !== undefined && event.away_score !== undefined && (
                      <div className="flex items-center gap-1">
                        <span>Score: {event.home_score}-{event.away_score}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {index !== events.length - 1 && <Separator className="mt-4 bg-club-gold/10" />}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
