
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { TrendingUp, TrendingDown, Target, BarChart3, ArrowUp, ArrowDown, Minus, Users, Calendar, Brain } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { usePlayerData } from "@/hooks/use-player-data";
import { useDevelopmentData } from "@/hooks/use-development-data";
import { LoadingOverlay } from "@/components/LoadingOverlay";
import { DevelopmentPathwayVisualizer } from "@/components/development/DevelopmentPathwayVisualizer";
import { DevelopmentMilestonesTimeline } from "@/components/development/DevelopmentMilestonesTimeline";
import { PlayerDevelopmentInsights } from "@/components/development/PlayerDevelopmentInsights";

export const DevelopmentTrajectories = () => {
  const [selectedView, setSelectedView] = useState<'overview' | 'pathways' | 'milestones' | 'insights'>('overview');
  const { players, loading: playersLoading } = usePlayerData();
  const { 
    pathways, 
    milestones, 
    assessments, 
    recommendations, 
    loading: developmentLoading 
  } = useDevelopmentData();

  const loading = playersLoading || developmentLoading;

  // Mock development data for charts - enhanced with real structure
  const developmentData = [
    {
      playerId: 1,
      name: "Marcus Johnson",
      position: "Midfielder",
      currentRating: 78,
      targetRating: 82,
      startRating: 75,
      trajectory: [
        { month: 'Aug', rating: 75, target: 76 },
        { month: 'Sep', rating: 76, target: 77 },
        { month: 'Oct', rating: 77, target: 78 },
        { month: 'Nov', rating: 78, target: 79 },
        { month: 'Dec', rating: 78, target: 80 }
      ],
      attributes: {
        passing: { current: 82, target: 85, change: +2 },
        shooting: { current: 75, target: 78, change: +1 },
        defending: { current: 68, target: 70, change: 0 },
        physical: { current: 80, target: 82, change: +3 }
      },
      velocity: 'fast'
    },
    {
      playerId: 2,
      name: "Alex Thompson",
      position: "Forward",
      currentRating: 72,
      targetRating: 76,
      startRating: 70,
      trajectory: [
        { month: 'Aug', rating: 70, target: 71 },
        { month: 'Sep', rating: 71, target: 72 },
        { month: 'Oct', rating: 71, target: 73 },
        { month: 'Nov', rating: 72, target: 74 },
        { month: 'Dec', rating: 72, target: 75 }
      ],
      attributes: {
        shooting: { current: 78, target: 82, change: +3 },
        dribbling: { current: 74, target: 77, change: +1 },
        passing: { current: 65, target: 68, change: -1 },
        physical: { current: 76, target: 78, change: +2 }
      },
      velocity: 'moderate'
    }
  ];

  const overallProgress = {
    onTrack: pathways.filter(p => p.status === 'active').length,
    ahead: pathways.filter(p => p.promotion_date).length,
    behind: pathways.filter(p => p.demotion_date).length,
    totalTargets: pathways.length || 22
  };

  const getVelocityColor = (velocity: string) => {
    switch (velocity) {
      case 'fast': return 'text-green-500';
      case 'moderate': return 'text-yellow-500';
      case 'slow': return 'text-orange-500';
      default: return 'text-gray-500';
    }
  };

  const getChangeIcon = (change: number) => {
    if (change > 0) return <ArrowUp className="h-3 w-3 text-green-500" />;
    if (change < 0) return <ArrowDown className="h-3 w-3 text-red-500" />;
    return <Minus className="h-3 w-3 text-gray-500" />;
  };

  return (
    <TooltipProvider>
      <div className="space-y-6 relative">
        <LoadingOverlay isLoading={loading} message="Loading development data..." />
        
        {/* View Toggle */}
        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedView === 'overview' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedView('overview')}
            className={selectedView === 'overview' ? 'bg-club-gold text-club-black' : ''}
          >
            <BarChart3 className="mr-2 h-4 w-4" />
            Overview
          </Button>
          <Button
            variant={selectedView === 'pathways' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedView('pathways')}
            className={selectedView === 'pathways' ? 'bg-club-gold text-club-black' : ''}
          >
            <Users className="mr-2 h-4 w-4" />
            Development Pathways
          </Button>
          <Button
            variant={selectedView === 'milestones' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedView('milestones')}
            className={selectedView === 'milestones' ? 'bg-club-gold text-club-black' : ''}
          >
            <Calendar className="mr-2 h-4 w-4" />
            Milestones Timeline
          </Button>
          <Button
            variant={selectedView === 'insights' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedView('insights')}
            className={selectedView === 'insights' ? 'bg-club-gold text-club-black' : ''}
          >
            <Brain className="mr-2 h-4 w-4" />
            Actionable Insights
          </Button>
        </div>

        {selectedView === 'overview' && (
          <Card className="bg-club-dark-gray border-club-gold/20">
            <CardHeader>
              <CardTitle className="flex items-center text-club-gold">
                <Target className="mr-2 h-5 w-5" />
                Development Progress Overview
              </CardTitle>
              <CardDescription className="text-club-light-gray/70">
                Squad development status vs season targets
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="text-center p-4 bg-club-black/40 rounded-lg hover:bg-club-gold/10 transition-colors cursor-pointer">
                      <div className="text-2xl font-bold text-green-500">{overallProgress.ahead}</div>
                      <div className="text-sm text-club-light-gray/70">Ahead of Target</div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Players exceeding their development targets</p>
                  </TooltipContent>
                </Tooltip>
                
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="text-center p-4 bg-club-black/40 rounded-lg hover:bg-club-gold/10 transition-colors cursor-pointer">
                      <div className="text-2xl font-bold text-club-gold">{overallProgress.onTrack}</div>
                      <div className="text-sm text-club-light-gray/70">On Track</div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Players meeting their development targets</p>
                  </TooltipContent>
                </Tooltip>
                
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="text-center p-4 bg-club-black/40 rounded-lg hover:bg-club-gold/10 transition-colors cursor-pointer">
                      <div className="text-2xl font-bold text-orange-500">{overallProgress.behind}</div>
                      <div className="text-sm text-club-light-gray/70">Behind Target</div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Players falling behind their development targets</p>
                  </TooltipContent>
                </Tooltip>
                
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="text-center p-4 bg-club-black/40 rounded-lg hover:bg-club-gold/10 transition-colors cursor-pointer">
                      <div className="text-2xl font-bold text-club-light-gray">
                        {Math.round(((overallProgress.ahead + overallProgress.onTrack) / overallProgress.totalTargets) * 100)}%
                      </div>
                      <div className="text-sm text-club-light-gray/70">Success Rate</div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Overall development target achievement rate</p>
                  </TooltipContent>
                </Tooltip>
              </div>

              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={developmentData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="name" stroke="#9CA3AF" fontSize={12} />
                    <YAxis stroke="#9CA3AF" fontSize={12} />
                    <RechartsTooltip 
                      contentStyle={{ 
                        backgroundColor: '#1F2937', 
                        border: '1px solid #D97706', 
                        borderRadius: '8px',
                        color: '#F3F4F6'
                      }} 
                    />
                    <Bar dataKey="currentRating" fill="#D97706" name="Current Rating" />
                    <Bar dataKey="targetRating" fill="#059669" name="Target Rating" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        )}

        {selectedView === 'pathways' && (
          <DevelopmentPathwayVisualizer players={players} pathways={pathways} />
        )}

        {selectedView === 'milestones' && (
          <DevelopmentMilestonesTimeline milestones={milestones} players={players} />
        )}

        {selectedView === 'insights' && (
          <PlayerDevelopmentInsights 
            players={players}
            pathways={pathways}
            milestones={milestones}
            recommendations={recommendations}
            assessments={assessments}
          />
        )}

        {selectedView === 'overview' && (
          <div className="space-y-6">
            {developmentData.map((player) => {
              const progressPercentage = Math.round(((player.currentRating - player.startRating) / (player.targetRating - player.startRating)) * 100);
              
              return (
                <Card key={player.playerId} className="bg-club-dark-gray border-club-gold/20">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-club-gold">{player.name}</CardTitle>
                        <CardDescription className="text-club-light-gray/70">{player.position}</CardDescription>
                      </div>
                      <div className="text-right">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Badge className={`${getVelocityColor(player.velocity)} bg-transparent border cursor-pointer`}>
                              {player.velocity} progress
                            </Badge>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Development velocity indicator</p>
                          </TooltipContent>
                        </Tooltip>
                        <p className="text-sm text-club-light-gray/70 mt-1">{progressPercentage}% to target</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Development Trajectory Chart */}
                      <div>
                        <h4 className="text-sm font-medium text-club-light-gray mb-4">Development Trajectory</h4>
                        <div className="h-48">
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={player.trajectory}>
                              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                              <XAxis dataKey="month" stroke="#9CA3AF" fontSize={12} />
                              <YAxis stroke="#9CA3AF" fontSize={12} />
                              <RechartsTooltip 
                                contentStyle={{ 
                                  backgroundColor: '#1F2937', 
                                  border: '1px solid #D97706', 
                                  borderRadius: '8px',
                                  color: '#F3F4F6'
                                }} 
                              />
                              <Line type="monotone" dataKey="rating" stroke="#D97706" strokeWidth={2} name="Actual" />
                              <Line type="monotone" dataKey="target" stroke="#059669" strokeWidth={2} strokeDasharray="5 5" name="Target" />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                      </div>

                      {/* Attribute Breakdown */}
                      <div>
                        <h4 className="text-sm font-medium text-club-light-gray mb-4">Attribute Progress</h4>
                        <div className="space-y-3">
                          {Object.entries(player.attributes).map(([attr, data]) => (
                            <Tooltip key={attr}>
                              <TooltipTrigger asChild>
                                <div className="p-3 bg-club-black/40 rounded-lg hover:bg-club-gold/10 transition-colors cursor-pointer">
                                  <div className="flex justify-between items-center mb-2">
                                    <span className="text-sm capitalize text-club-light-gray">{attr}</span>
                                    <div className="flex items-center gap-1">
                                      {getChangeIcon(data.change)}
                                      <span className="text-xs text-club-light-gray/70">
                                        {data.current}/{data.target}
                                      </span>
                                    </div>
                                  </div>
                                  <div className="w-full bg-club-black/60 rounded-full h-2">
                                    <div 
                                      className="bg-club-gold h-2 rounded-full transition-all duration-300"
                                      style={{ width: `${(data.current / data.target) * 100}%` }}
                                    />
                                  </div>
                                </div>
                              </TooltipTrigger>
                              <TooltipContent>
                                <div>
                                  <p className="font-medium capitalize">{attr}</p>
                                  <p className="text-sm">Current: {data.current} / Target: {data.target}</p>
                                  <p className="text-xs text-club-light-gray/70">
                                    {data.change > 0 ? `+${data.change}` : data.change} change this period
                                  </p>
                                </div>
                              </TooltipContent>
                            </Tooltip>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </TooltipProvider>
  );
};
