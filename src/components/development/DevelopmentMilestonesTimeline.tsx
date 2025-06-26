
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DevelopmentMilestone } from '@/hooks/use-development-data';
import { Player } from '@/types';
import { 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  Calendar,
  Target,
  Star,
  TrendingUp
} from 'lucide-react';

interface DevelopmentMilestonesTimelineProps {
  milestones: DevelopmentMilestone[];
  players: Player[];
  selectedPlayerId?: number;
}

export const DevelopmentMilestonesTimeline = ({ 
  milestones, 
  players, 
  selectedPlayerId 
}: DevelopmentMilestonesTimelineProps) => {
  const filteredMilestones = selectedPlayerId 
    ? milestones.filter(m => m.player_id === selectedPlayerId)
    : milestones;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'in_progress':
        return <Clock className="h-4 w-4 text-blue-500" />;
      case 'overdue':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Target className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500/20 text-green-400';
      case 'in_progress':
        return 'bg-blue-500/20 text-blue-400';
      case 'overdue':
        return 'bg-red-500/20 text-red-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getPriorityIcon = (level: number) => {
    if (level >= 4) return <Star className="h-3 w-3 text-yellow-500" />;
    if (level >= 3) return <TrendingUp className="h-3 w-3 text-blue-500" />;
    return null;
  };

  const getPlayerName = (playerId: number) => {
    return players.find(p => p.id === playerId)?.name || 'Unknown Player';
  };

  const sortedMilestones = [...filteredMilestones].sort((a, b) => {
    // Sort by target date, then by importance level
    const dateA = a.target_date ? new Date(a.target_date).getTime() : Infinity;
    const dateB = b.target_date ? new Date(b.target_date).getTime() : Infinity;
    
    if (dateA !== dateB) return dateA - dateB;
    return b.importance_level - a.importance_level;
  });

  return (
    <Card className="bg-club-dark-gray border-club-gold/20">
      <CardHeader>
        <CardTitle className="flex items-center text-club-gold">
          <Calendar className="mr-2 h-5 w-5" />
          Development Milestones Timeline
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {sortedMilestones.length === 0 ? (
            <div className="text-center py-8">
              <Target className="h-8 w-8 text-club-light-gray/50 mx-auto mb-2" />
              <p className="text-club-light-gray/70">No milestones found</p>
            </div>
          ) : (
            sortedMilestones.map((milestone, index) => (
              <div key={milestone.id} className="relative">
                {/* Timeline Line */}
                {index < sortedMilestones.length - 1 && (
                  <div className="absolute left-6 top-12 w-0.5 h-8 bg-club-gold/30" />
                )}
                
                <div className="flex gap-4 p-4 bg-club-black/40 rounded-lg hover:bg-club-gold/10 transition-colors">
                  {/* Status Icon */}
                  <div className="flex-shrink-0 mt-1">
                    {getStatusIcon(milestone.status)}
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium text-club-light-gray">
                          {milestone.milestone_type}
                        </h4>
                        {!selectedPlayerId && (
                          <p className="text-sm text-club-light-gray/70">
                            {getPlayerName(milestone.player_id)}
                          </p>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {getPriorityIcon(milestone.importance_level)}
                        <Badge className={`text-xs ${getStatusColor(milestone.status)}`}>
                          {milestone.status.replace('_', ' ')}
                        </Badge>
                      </div>
                    </div>
                    
                    {milestone.milestone_description && (
                      <p className="text-sm text-club-light-gray/80">
                        {milestone.milestone_description}
                      </p>
                    )}
                    
                    <div className="flex items-center justify-between text-xs text-club-light-gray/60">
                      {milestone.target_date && (
                        <span>Target: {new Date(milestone.target_date).toLocaleDateString()}</span>
                      )}
                      {milestone.completed_date && (
                        <span className="text-green-400">
                          Completed: {new Date(milestone.completed_date).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        
        {sortedMilestones.length > 0 && (
          <div className="pt-4 border-t border-club-gold/20 mt-4">
            <Button variant="outline" size="sm" className="border-club-gold/30">
              Add New Milestone
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
