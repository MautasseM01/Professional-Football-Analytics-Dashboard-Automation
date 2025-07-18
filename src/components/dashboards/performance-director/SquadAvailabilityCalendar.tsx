
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Calendar, Users, AlertTriangle, Clock, ChevronLeft, ChevronRight, Info } from "lucide-react";
import { usePlayerInjuries } from "@/hooks/use-player-injuries";
import { usePlayerData } from "@/hooks/use-player-data";
import { format, addDays, startOfWeek } from "date-fns";
import { PlayerAvatar } from "@/components/PlayerAvatar";
import { LoadingOverlay } from "@/components/LoadingOverlay";

export const SquadAvailabilityCalendar = () => {
  const [currentWeek, setCurrentWeek] = useState(startOfWeek(new Date()));
  const { data: injuries, isLoading: injuriesLoading } = usePlayerInjuries();
  const { players, loading: playersLoading } = usePlayerData();

  const nextMatches = [
    { date: addDays(new Date(), 3), opponent: "Arsenal", competition: "Premier League" },
    { date: addDays(new Date(), 10), opponent: "Bayern Munich", competition: "Champions League" },
    { date: addDays(new Date(), 17), opponent: "Chelsea", competition: "Premier League" },
    { date: addDays(new Date(), 24), opponent: "Liverpool", competition: "Premier League" },
    { date: addDays(new Date(), 31), opponent: "Real Madrid", competition: "Champions League" }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'minor': return 'bg-amber-500';
      case 'moderate': return 'bg-orange-500';
      case 'major': return 'bg-destructive';
      default: return 'bg-muted';
    }
  };

  const getAvailabilityForMatch = (matchDate: Date) => {
    const injuredPlayers = injuries?.filter(injury => {
      const returnDate = new Date(injury.expected_return_date || '');
      return injury.status === 'active' && returnDate > matchDate;
    }) || [];

    const availablePlayers = (players?.length || 0) - injuredPlayers.length;
    
    return {
      available: availablePlayers,
      total: players?.length || 0,
      injured: injuredPlayers,
      percentage: players?.length ? Math.round((availablePlayers / players.length) * 100) : 0
    };
  };

  const getTrainingLoadRecommendation = (injury: any) => {
    const daysUntilReturn = Math.ceil((new Date(injury.expected_return_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysUntilReturn <= 7) return { level: "Light", color: "text-emerald-600", description: "Individual training only" };
    if (daysUntilReturn <= 14) return { level: "Moderate", color: "text-amber-600", description: "Limited group training" };
    return { level: "Rest", color: "text-destructive", description: "Complete rest required" };
  };

  const isLoading = injuriesLoading || playersLoading;

  return (
    <TooltipProvider>
      <div className="space-y-6 relative">
        <LoadingOverlay isLoading={isLoading} message="Loading squad availability..." />
        
        {/* Match Availability Overview */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center text-primary">
              <Calendar className="mr-2 h-5 w-5" />
              Squad Availability - Next 5 Matches
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Player availability forecast for upcoming fixtures
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {nextMatches.map((match, index) => {
                const availability = getAvailabilityForMatch(match.date);
                return (
                  <Tooltip key={index}>
                    <TooltipTrigger asChild>
                      <div className="p-4 bg-muted/40 rounded-lg hover:bg-muted/60 transition-colors cursor-pointer min-h-[var(--touch-target-min)]">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="font-medium text-primary">{match.opponent}</p>
                            <p className="text-xs text-muted-foreground">{format(match.date, 'MMM dd')}</p>
                            <p className="text-xs text-muted-foreground/70">{match.competition}</p>
                          </div>
                          <Badge 
                            className={`${availability.percentage >= 90 ? 'bg-emerald-600' : availability.percentage >= 80 ? 'bg-amber-600' : 'bg-destructive'} text-white`}
                          >
                            {availability.percentage}%
                          </Badge>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Available:</span>
                            <span className="text-primary font-medium">{availability.available}/{availability.total}</span>
                          </div>
                          
                          {availability.injured.length > 0 && (
                            <div className="mt-2">
                              <p className="text-xs text-muted-foreground/70 mb-1">Injured players:</p>
                              <div className="flex flex-wrap gap-1">
                                {availability.injured.slice(0, 3).map((injury: any) => (
                                  <Badge key={injury.id} variant="outline" className="text-xs bg-destructive/10 text-destructive border-destructive/30">
                                    {players?.find(p => p.id === injury.player_id)?.name?.split(' ').pop()}
                                  </Badge>
                                ))}
                                {availability.injured.length > 3 && (
                                  <Badge variant="outline" className="text-xs">+{availability.injured.length - 3}</Badge>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <div className="p-2">
                        <p className="font-medium">{match.opponent}</p>
                        <p className="text-sm text-muted-foreground">{format(match.date, 'EEEE, MMMM dd')}</p>
                        <p className="text-xs text-muted-foreground/70">Click for detailed breakdown</p>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Detailed Injury Overview */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center text-primary">
              <AlertTriangle className="mr-2 h-5 w-5" />
              Injury Status & Recovery Timeline
            </CardTitle>
          </CardHeader>
          <CardContent>
            {injuries && injuries.length > 0 ? (
              <div className="space-y-4">
                {injuries.map((injury) => {
                  const player = players?.find(p => p.id === injury.player_id);
                  const trainingRec = getTrainingLoadRecommendation(injury);
                  const daysUntilReturn = Math.ceil((new Date(injury.expected_return_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                  
                  return (
                    <Tooltip key={injury.id}>
                      <TooltipTrigger asChild>
                        <div className="p-4 bg-muted/40 rounded-lg hover:bg-muted/60 transition-colors cursor-pointer min-h-[var(--touch-target-min)]">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                              <PlayerAvatar player={player} size="sm" />
                              <div>
                                <p className="font-medium text-primary">{player?.name}</p>
                                <p className="text-sm text-muted-foreground">{player?.position}</p>
                              </div>
                            </div>
                            
                            <div className="text-right">
                              <Badge className={`${getSeverityColor(injury.severity)} text-white mb-1`}>
                                {injury.severity}
                              </Badge>
                              <p className="text-xs text-muted-foreground">
                                {daysUntilReturn > 0 ? `${daysUntilReturn} days` : 'Overdue'}
                              </p>
                            </div>
                          </div>
                          
                          <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div>
                              <p className="text-muted-foreground/70">Injury Type</p>
                              <p className="text-foreground">{injury.injury_type}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground/70">Expected Return</p>
                              <p className="text-foreground">{format(new Date(injury.expected_return_date), 'MMM dd, yyyy')}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground/70">Training Load</p>
                              <p className={trainingRec.color}>{trainingRec.level}</p>
                              <p className="text-xs text-muted-foreground/70">{trainingRec.description}</p>
                            </div>
                          </div>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <div className="p-2">
                          <p className="font-medium">{player?.name}</p>
                          <p className="text-sm">{injury.injury_type} - {injury.body_part}</p>
                          {injury.notes && (
                            <p className="text-xs text-muted-foreground mt-1">{injury.notes}</p>
                          )}
                          <p className="text-xs text-muted-foreground/70 mt-1">Click for detailed report</p>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <Users className="mx-auto h-12 w-12 text-muted-foreground/30" />
                <p className="mt-2 text-muted-foreground">No current injuries - squad fully available!</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  );
};
