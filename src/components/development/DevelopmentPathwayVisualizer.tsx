
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { PlayerAvatar } from '@/components/PlayerAvatar';
import { Player } from '@/types';
import { DevelopmentPathway } from '@/hooks/use-development-data';
import { 
  TrendingUp, 
  TrendingDown, 
  ArrowRight, 
  Calendar,
  Trophy,
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react';

interface DevelopmentPathwayVisualizerProps {
  players: Player[];
  pathways: DevelopmentPathway[];
}

export const DevelopmentPathwayVisualizer = ({ players, pathways }: DevelopmentPathwayVisualizerProps) => {
  const getPathwayProgress = (currentLevel: string, targetLevel?: string) => {
    const levels = ['Academy U12', 'Academy U15', 'Academy U18', 'U23s', 'First Team', 'Loan'];
    const currentIndex = levels.indexOf(currentLevel);
    const targetIndex = targetLevel ? levels.indexOf(targetLevel) : levels.length - 1;
    
    if (currentIndex === -1 || targetIndex === -1) return 50;
    return Math.max(0, (currentIndex / targetIndex) * 100);
  };

  const getStatusIcon = (pathway: DevelopmentPathway) => {
    if (pathway.promotion_date) {
      return <TrendingUp className="h-4 w-4 text-green-500" />;
    }
    if (pathway.demotion_date) {
      return <TrendingDown className="h-4 w-4 text-red-500" />;
    }
    return <ArrowRight className="h-4 w-4 text-blue-500" />;
  };

  const getStatusColor = (pathway: DevelopmentPathway) => {
    if (pathway.promotion_date) return 'bg-green-500/20 text-green-400';
    if (pathway.demotion_date) return 'bg-red-500/20 text-red-400';
    return 'bg-blue-500/20 text-blue-400';
  };

  const playersWithPathways = players.map(player => {
    const pathway = pathways.find(p => p.player_id === player.id);
    return { player, pathway };
  }).filter(item => item.pathway);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {playersWithPathways.map(({ player, pathway }) => {
        const progress = getPathwayProgress(pathway!.current_level, pathway!.target_level);
        
        return (
          <Card key={player.id} className="bg-club-dark-gray border-club-gold/20 hover:bg-club-dark-gray/80 transition-all duration-300">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <PlayerAvatar player={player} size="sm" />
                <div className="flex-1">
                  <CardTitle className="text-club-gold text-sm">{player.name}</CardTitle>
                  <p className="text-xs text-club-light-gray/70">{player.position}</p>
                </div>
                {getStatusIcon(pathway!)}
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Current Status */}
              <div className="flex justify-between items-center">
                <span className="text-xs text-club-light-gray/70">Current Level</span>
                <Badge className={`text-xs ${getStatusColor(pathway!)}`}>
                  {pathway!.current_level}
                </Badge>
              </div>

              {/* Development Progress */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-club-light-gray/70">Development Progress</span>
                  <span className="text-xs text-club-gold">{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>

              {/* Target Level */}
              {pathway!.target_level && (
                <div className="flex justify-between items-center">
                  <span className="text-xs text-club-light-gray/70">Target Level</span>
                  <Badge variant="outline" className="text-xs border-club-gold/30">
                    {pathway!.target_level}
                  </Badge>
                </div>
              )}

              {/* Pathway Stage */}
              {pathway!.pathway_stage && (
                <div className="bg-club-black/40 rounded-lg p-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-3 w-3 text-club-gold" />
                    <span className="text-xs text-club-light-gray">{pathway!.pathway_stage}</span>
                  </div>
                </div>
              )}

              {/* Recent Movement */}
              {pathway!.promotion_date && (
                <div className="flex items-center gap-2 text-green-400">
                  <Trophy className="h-3 w-3" />
                  <span className="text-xs">
                    Promoted {new Date(pathway!.promotion_date).toLocaleDateString()}
                  </span>
                </div>
              )}

              {pathway!.demotion_date && (
                <div className="flex items-center gap-2 text-red-400">
                  <AlertTriangle className="h-3 w-3" />
                  <span className="text-xs">
                    Demoted {new Date(pathway!.demotion_date).toLocaleDateString()}
                  </span>
                </div>
              )}

              {/* Action Indicators */}
              <div className="pt-2 border-t border-club-gold/20">
                {progress >= 80 && (
                  <div className="flex items-center gap-2 text-green-400">
                    <CheckCircle className="h-3 w-3" />
                    <span className="text-xs">Ready for promotion</span>
                  </div>
                )}
                
                {progress < 40 && (
                  <div className="flex items-center gap-2 text-amber-400">
                    <Clock className="h-3 w-3" />
                    <span className="text-xs">Needs additional support</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
