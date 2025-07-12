import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
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
  TrendingDown, 
  Target, 
  Clock,
  CheckCircle,
  AlertTriangle,
  Star,
  Trophy,
  Brain,
  Zap,
  Calendar,
  BarChart3,
  Users,
  BookOpen
} from 'lucide-react';

interface EnhancedDevelopmentDashboardProps {
  player: Player;
  pathway?: DevelopmentPathway;
  milestones: DevelopmentMilestone[];
  recommendations: DevelopmentRecommendation[];
  assessments: CoachAssessment[];
}

export const EnhancedDevelopmentDashboard = ({ 
  player, 
  pathway, 
  milestones, 
  recommendations,
  assessments 
}: EnhancedDevelopmentDashboardProps) => {
  
  // Calculate development metrics
  const completedMilestones = milestones.filter(m => m.status === 'completed').length;
  const totalMilestones = milestones.length;
  const progressPercentage = totalMilestones > 0 ? (completedMilestones / totalMilestones) * 100 : 0;
  
  const highPriorityRecommendations = recommendations.filter(r => r.priority_level >= 4);
  const latestAssessment = assessments.sort((a, b) => 
    new Date(b.assessment_date).getTime() - new Date(a.assessment_date).getTime()
  )[0];

  const getPathwayProgress = () => {
    if (!pathway) return 0;
    const levels = ['Academy U12', 'Academy U15', 'Academy U18', 'U23s', 'First Team'];
    const currentIndex = levels.indexOf(pathway.current_level);
    const targetIndex = pathway.target_level ? levels.indexOf(pathway.target_level) : levels.length - 1;
    
    if (currentIndex === -1 || targetIndex === -1) return 50;
    return Math.max(0, ((currentIndex + 1) / (targetIndex + 1)) * 100);
  };

  const pathwayProgress = getPathwayProgress();

  return (
    <div className="space-y-6">
      {/* Player Header */}
      <Card className="bg-gradient-to-r from-club-dark-gray to-club-black border-club-gold/30">
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-club-gold/20 rounded-full flex items-center justify-center">
              <Users className="h-8 w-8 text-club-gold" />
            </div>
            <div className="flex-1">
              <CardTitle className="text-xl text-club-light-gray">{player.name}</CardTitle>
              <p className="text-club-light-gray/70">{player.position}</p>
              {pathway && (
                <Badge className="mt-2 bg-club-gold/20 text-club-gold border-club-gold/30">
                  {pathway.current_level}
                </Badge>
              )}
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-club-gold">
                {Math.round(progressPercentage)}%
              </div>
              <p className="text-xs text-club-light-gray/70">Development Progress</p>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-club-dark-gray border-club-gold/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-xl font-bold text-green-500">{completedMilestones}</p>
                <p className="text-xs text-club-light-gray/70">Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-club-dark-gray border-club-gold/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <Clock className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-xl font-bold text-blue-500">{totalMilestones - completedMilestones}</p>
                <p className="text-xs text-club-light-gray/70">In Progress</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-club-dark-gray border-club-gold/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-500/20 rounded-lg">
                <Zap className="h-5 w-5 text-amber-500" />
              </div>
              <div>
                <p className="text-xl font-bold text-amber-500">{highPriorityRecommendations.length}</p>
                <p className="text-xs text-club-light-gray/70">Priority Areas</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-club-dark-gray border-club-gold/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-club-gold/20 rounded-lg">
                <Star className="h-5 w-5 text-club-gold" />
              </div>
              <div>
                <p className="text-xl font-bold text-club-gold">
                  {latestAssessment?.overall_rating || 'N/A'}
                </p>
                <p className="text-xs text-club-light-gray/70">Latest Rating</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Development Pathway Progress */}
      {pathway && (
        <Card className="bg-club-dark-gray border-club-gold/20">
          <CardHeader>
            <CardTitle className="flex items-center text-club-gold">
              <TrendingUp className="mr-2 h-5 w-5" />
              Development Pathway
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-club-light-gray font-medium">Current Level</p>
                <Badge className="mt-1 bg-blue-500/20 text-blue-400">
                  {pathway.current_level}
                </Badge>
              </div>
              {pathway.target_level && (
                <div className="text-right">
                  <p className="text-club-light-gray font-medium">Target Level</p>
                  <Badge className="mt-1 bg-club-gold/20 text-club-gold border-club-gold/30">
                    {pathway.target_level}
                  </Badge>
                </div>
              )}
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-club-light-gray/70">Pathway Progress</span>
                <span className="text-club-gold">{Math.round(pathwayProgress)}%</span>
              </div>
              <Progress value={pathwayProgress} className="h-3" />
            </div>

            {pathway.pathway_stage && (
              <div className="bg-club-black/40 rounded-lg p-3">
                <p className="text-xs text-club-light-gray/70 mb-1">Current Stage</p>
                <p className="text-club-light-gray">{pathway.pathway_stage}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* High Priority Recommendations */}
      {highPriorityRecommendations.length > 0 && (
        <Card className="bg-club-dark-gray border-amber-500/30">
          <CardHeader>
            <CardTitle className="flex items-center text-amber-500">
              <AlertTriangle className="mr-2 h-5 w-5" />
              Priority Development Areas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {highPriorityRecommendations.map(rec => (
                <div key={rec.id} className="p-3 bg-amber-500/10 rounded-lg border border-amber-500/20">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-medium text-amber-400">{rec.focus_area}</p>
                      <p className="text-xs text-club-light-gray/70">{rec.recommendation_type}</p>
                    </div>
                    <Badge className="bg-amber-500/20 text-amber-400">
                      Priority {rec.priority_level}
                    </Badge>
                  </div>
                  {rec.specific_recommendations && (
                    <p className="text-sm text-club-light-gray/80 mt-2">
                      {rec.specific_recommendations}
                    </p>
                  )}
                  {rec.target_completion_date && (
                    <div className="flex items-center gap-2 mt-2 text-xs text-club-light-gray/60">
                      <Calendar className="h-3 w-3" />
                      Target: {new Date(rec.target_completion_date).toLocaleDateString()}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Performance Assessment */}
      {latestAssessment && (
        <Card className="bg-club-dark-gray border-club-gold/20">
          <CardHeader>
            <CardTitle className="flex items-center text-club-gold">
              <Brain className="mr-2 h-5 w-5" />
              Latest Assessment
            </CardTitle>
            <p className="text-xs text-club-light-gray/70">
              {new Date(latestAssessment.assessment_date).toLocaleDateString()}
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Rating Breakdown */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: 'Technical', value: latestAssessment.technical_rating, color: 'blue' },
                { label: 'Tactical', value: latestAssessment.tactical_rating, color: 'green' },
                { label: 'Physical', value: latestAssessment.physical_rating, color: 'purple' },
                { label: 'Mental', value: latestAssessment.mental_rating, color: 'orange' }
              ].map(rating => (
                <div key={rating.label} className="text-center">
                  <div className={`text-lg font-bold text-${rating.color}-500`}>
                    {rating.value || 'N/A'}
                  </div>
                  <p className="text-xs text-club-light-gray/70">{rating.label}</p>
                </div>
              ))}
            </div>

            {latestAssessment.strengths && (
              <div>
                <p className="text-sm font-medium text-green-400 mb-1">Strengths</p>
                <p className="text-sm text-club-light-gray/80">{latestAssessment.strengths}</p>
              </div>
            )}

            {latestAssessment.areas_for_improvement && (
              <div>
                <p className="text-sm font-medium text-amber-400 mb-1">Areas for Improvement</p>
                <p className="text-sm text-club-light-gray/80">{latestAssessment.areas_for_improvement}</p>
              </div>
            )}

            {latestAssessment.recommendation && (
              <div>
                <p className="text-sm font-medium text-club-gold mb-1">Coach Recommendation</p>
                <p className="text-sm text-club-light-gray/80">{latestAssessment.recommendation}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <Card className="bg-club-dark-gray border-club-gold/20">
        <CardHeader>
          <CardTitle className="flex items-center text-club-gold">
            <BarChart3 className="mr-2 h-5 w-5" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <Button variant="outline" size="sm" className="border-club-gold/30">
              <Target className="mr-2 h-4 w-4" />
              Add Milestone
            </Button>
            <Button variant="outline" size="sm" className="border-club-gold/30">
              <BookOpen className="mr-2 h-4 w-4" />
              Schedule Assessment
            </Button>
            <Button variant="outline" size="sm" className="border-club-gold/30">
              <Trophy className="mr-2 h-4 w-4" />
              Record Achievement
            </Button>
            <Button variant="outline" size="sm" className="border-club-gold/30">
              <Calendar className="mr-2 h-4 w-4" />
              Plan Session
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};