
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Player } from '@/types';
import { 
  DevelopmentPathway, 
  DevelopmentMilestone, 
  DevelopmentRecommendation,
  CoachAssessment 
} from '@/hooks/use-development-data';
import { 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  Users, 
  Target, 
  Brain,
  Trophy,
  Clock,
  Star
} from 'lucide-react';

interface PlayerDevelopmentInsightsProps {
  players: Player[];
  pathways: DevelopmentPathway[];
  milestones: DevelopmentMilestone[];
  recommendations: DevelopmentRecommendation[];
  assessments: CoachAssessment[];
}

export const PlayerDevelopmentInsights = ({ 
  players, 
  pathways, 
  milestones, 
  recommendations,
  assessments 
}: PlayerDevelopmentInsightsProps) => {
  // Calculate insights
  const playersReadyForPromotion = pathways.filter(p => {
    const completedMilestones = milestones.filter(m => 
      m.player_id === p.player_id && m.status === 'completed'
    ).length;
    const totalMilestones = milestones.filter(m => m.player_id === p.player_id).length;
    return totalMilestones > 0 && (completedMilestones / totalMilestones) >= 0.8;
  });

  const playersNeedingSupport = recommendations.filter(r => 
    r.priority_level >= 4 && r.status === 'active'
  );

  const upcomingTransitions = players.filter(player => {
    // Mock age group transition logic
    const age = Math.floor(Math.random() * 10) + 16; // Mock age
    return [17, 18, 20, 23].includes(age);
  });

  const recentAssessments = assessments
    .sort((a, b) => new Date(b.assessment_date).getTime() - new Date(a.assessment_date).getTime())
    .slice(0, 5);

  const getPlayerName = (playerId: number) => {
    return players.find(p => p.id === playerId)?.name || 'Unknown Player';
  };

  return (
    <div className="space-y-6">
      {/* Key Insights Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-club-dark-gray border-club-gold/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <TrendingUp className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-green-500">{playersReadyForPromotion.length}</p>
                <p className="text-xs text-club-light-gray/70">Ready for Promotion</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-club-dark-gray border-club-gold/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-500/20 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-amber-500">{playersNeedingSupport.length}</p>
                <p className="text-xs text-club-light-gray/70">Need Support</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-club-dark-gray border-club-gold/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <Users className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-500">{upcomingTransitions.length}</p>
                <p className="text-xs text-club-light-gray/70">Age Transitions</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-club-dark-gray border-club-gold/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-club-gold/20 rounded-lg">
                <Target className="h-5 w-5 text-club-gold" />
              </div>
              <div>
                <p className="text-2xl font-bold text-club-gold">{milestones.length}</p>
                <p className="text-xs text-club-light-gray/70">Active Milestones</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actionable Alerts */}
      <div className="space-y-4">
        {playersReadyForPromotion.length > 0 && (
          <Alert className="bg-green-500/10 border-green-500/30">
            <Trophy className="h-4 w-4 text-green-500" />
            <AlertDescription className="text-green-400">
              <strong>{playersReadyForPromotion.length} players</strong> are ready for promotion to the next level.
              <div className="mt-2 flex flex-wrap gap-2">
                {playersReadyForPromotion.slice(0, 3).map(pathway => (
                  <Badge key={pathway.id} className="bg-green-500/20 text-green-400">
                    {getPlayerName(pathway.player_id)}
                  </Badge>
                ))}
                {playersReadyForPromotion.length > 3 && (
                  <Badge className="bg-green-500/20 text-green-400">
                    +{playersReadyForPromotion.length - 3} more
                  </Badge>
                )}
              </div>
            </AlertDescription>
          </Alert>
        )}

        {playersNeedingSupport.length > 0 && (
          <Alert className="bg-amber-500/10 border-amber-500/30">
            <AlertTriangle className="h-4 w-4 text-amber-500" />
            <AlertDescription className="text-amber-400">
              <strong>{playersNeedingSupport.length} players</strong> need additional support or intervention.
              <div className="mt-2 flex flex-wrap gap-2">
                {playersNeedingSupport.slice(0, 3).map(rec => (
                  <Badge key={rec.id} className="bg-amber-500/20 text-amber-400">
                    {getPlayerName(rec.player_id)} - {rec.focus_area}
                  </Badge>
                ))}
              </div>
            </AlertDescription>
          </Alert>
        )}

        {upcomingTransitions.length > 0 && (
          <Alert className="bg-blue-500/10 border-blue-500/30">
            <Clock className="h-4 w-4 text-blue-500" />
            <AlertDescription className="text-blue-400">
              <strong>{upcomingTransitions.length} players</strong> are approaching age group transitions.
              <div className="mt-2">
                <Button variant="outline" size="sm" className="border-blue-500/30">
                  Review Transition Plans
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        )}
      </div>

      {/* Recent Coach Assessments */}
      {recentAssessments.length > 0 && (
        <Card className="bg-club-dark-gray border-club-gold/20">
          <CardHeader>
            <CardTitle className="flex items-center text-club-gold">
              <Brain className="mr-2 h-5 w-5" />
              Recent Coach Assessments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentAssessments.map(assessment => (
                <div key={assessment.id} className="p-3 bg-club-black/40 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-medium text-club-light-gray">
                        {getPlayerName(assessment.player_id)}
                      </p>
                      <p className="text-xs text-club-light-gray/70">
                        {new Date(assessment.assessment_date).toLocaleDateString()}
                      </p>
                    </div>
                    {assessment.overall_rating && (
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 text-club-gold" />
                        <span className="text-sm text-club-gold">{assessment.overall_rating}/10</span>
                      </div>
                    )}
                  </div>
                  
                  {assessment.recommendation && (
                    <p className="text-sm text-club-light-gray/80">
                      <span className="text-club-gold">Recommendation:</span> {assessment.recommendation}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
