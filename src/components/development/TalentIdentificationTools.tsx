
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, 
  Eye, 
  Star, 
  TrendingUp, 
  MapPin, 
  Calendar,
  DollarSign,
  Users,
  Target,
  Award
} from 'lucide-react';

export const TalentIdentificationTools = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAgeGroup, setSelectedAgeGroup] = useState<string>('all');
  const [selectedPosition, setSelectedPosition] = useState<string>('all');

  const scoutingRecommendations = [
    {
      id: 1,
      name: 'James Mitchell',
      age: 16,
      position: 'Central Midfielder',
      club: 'Local Youth FC',
      potentialScore: 87,
      marketValue: 25000,
      keyAttributes: ['Vision', 'Passing', 'Work Rate'],
      scoutNotes: 'Exceptional passing range and game intelligence. Needs physical development.',
      priority: 'high'
    },
    {
      id: 2,
      name: 'Marcus Thompson',
      age: 17,
      position: 'Right Winger',
      club: 'School District League',
      potentialScore: 82,
      marketValue: 18000,
      keyAttributes: ['Pace', 'Dribbling', 'Crossing'],
      scoutNotes: 'Natural pace and dribbling ability. Good crossing technique.',
      priority: 'medium'
    },
    {
      id: 3,
      name: 'Oliver Davis',
      age: 15,
      position: 'Centre Back',
      club: 'County Academy',
      potentialScore: 79,
      marketValue: 15000,
      keyAttributes: ['Heading', 'Tackling', 'Leadership'],
      scoutNotes: 'Strong aerial presence and natural leadership qualities.',
      priority: 'medium'
    }
  ];

  const talentMetrics = {
    identification: {
      successRate: 73,
      scoutsActive: 12,
      playersTracked: 156,
      trialsScheduled: 8
    },
    development: {
      conversionRate: 45,
      averageTime: 18,
      successStories: 23,
      currentPipeline: 34
    },
    financial: {
      totalInvestment: 450000,
      averageROI: 156,
      marketValueGenerated: 2100000,
      costPerAcquisition: 12500
    }
  };

  const recentSuccessStories = [
    { name: 'Alex Johnson', acquired: '2022', currentValue: '£180k', position: 'First Team' },
    { name: 'Sam Wilson', acquired: '2021', currentValue: '£120k', position: 'U23s' },
    { name: 'Tom Baker', acquired: '2023', currentValue: '£65k', position: 'Academy U18s' }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500/20 text-red-400';
      case 'medium': return 'bg-amber-500/20 text-amber-400';
      case 'low': return 'bg-green-500/20 text-green-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  return (
    <div className="space-y-6">
      {/* Scouting Dashboard */}
      <Card className="bg-club-dark-gray border-club-gold/20">
        <CardHeader>
          <CardTitle className="flex items-center text-club-gold">
            <Eye className="mr-2 h-5 w-5" />
            Advanced Scouting Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Search and Filters */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Search players..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-club-black/40 border-club-gold/30"
                />
              </div>
              <Select value={selectedAgeGroup} onValueChange={setSelectedAgeGroup}>
                <SelectTrigger className="w-40 bg-club-black/40 border-club-gold/30">
                  <SelectValue placeholder="Age Group" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Ages</SelectItem>
                  <SelectItem value="u15">U15</SelectItem>
                  <SelectItem value="u17">U17</SelectItem>
                  <SelectItem value="u19">U19</SelectItem>
                </SelectContent>
              </Select>
              <Select value={selectedPosition} onValueChange={setSelectedPosition}>
                <SelectTrigger className="w-40 bg-club-black/40 border-club-gold/30">
                  <SelectValue placeholder="Position" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Positions</SelectItem>
                  <SelectItem value="gk">Goalkeeper</SelectItem>
                  <SelectItem value="def">Defender</SelectItem>
                  <SelectItem value="mid">Midfielder</SelectItem>
                  <SelectItem value="att">Attacker</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Player Recommendations */}
            <div className="space-y-3">
              {scoutingRecommendations.map((player) => (
                <Card key={player.id} className="bg-club-black/40 border-club-gold/20">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-medium text-club-light-gray">{player.name}</h4>
                          <Badge className={getPriorityColor(player.priority)}>
                            {player.priority} priority
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-club-light-gray/70">Age: </span>
                            <span className="text-club-light-gray">{player.age}</span>
                          </div>
                          <div>
                            <span className="text-club-light-gray/70">Position: </span>
                            <span className="text-club-light-gray">{player.position}</span>
                          </div>
                          <div>
                            <span className="text-club-light-gray/70">Club: </span>
                            <span className="text-club-light-gray">{player.club}</span>
                          </div>
                          <div>
                            <span className="text-club-light-gray/70">Value: </span>
                            <span className="text-club-light-gray">£{player.marketValue.toLocaleString()}</span>
                          </div>
                        </div>

                        <div className="mt-3">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-sm text-club-light-gray/70">Potential Score:</span>
                            <span className="font-medium text-club-gold">{player.potentialScore}/100</span>
                          </div>
                          <Progress value={player.potentialScore} className="h-2 mb-3" />
                        </div>

                        <div className="flex flex-wrap gap-2 mb-3">
                          {player.keyAttributes.map((attr, index) => (
                            <Badge key={index} variant="outline" className="border-club-gold/30 text-club-light-gray">
                              {attr}
                            </Badge>
                          ))}
                        </div>

                        <p className="text-sm text-club-light-gray/80">{player.scoutNotes}</p>
                      </div>

                      <div className="flex flex-col gap-2 ml-4">
                        <Button size="sm" className="bg-club-gold text-club-black hover:bg-club-gold/90">
                          <Eye className="mr-1 h-3 w-3" />
                          View Profile
                        </Button>
                        <Button size="sm" variant="outline" className="border-club-gold/30">
                          Schedule Trial
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Talent Metrics */}
      <Card className="bg-club-dark-gray border-club-gold/20">
        <CardHeader>
          <CardTitle className="text-club-gold">Talent Identification Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="identification">
            <TabsList className="grid w-full grid-cols-3 bg-club-black/40">
              <TabsTrigger value="identification">Identification</TabsTrigger>
              <TabsTrigger value="development">Development</TabsTrigger>
              <TabsTrigger value="financial">Financial</TabsTrigger>
            </TabsList>
            
            <TabsContent value="identification" className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-club-black/40 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-club-gold">{talentMetrics.identification.successRate}%</div>
                  <div className="text-sm text-club-light-gray/70">Success Rate</div>
                </div>
                <div className="bg-club-black/40 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-club-gold">{talentMetrics.identification.scoutsActive}</div>
                  <div className="text-sm text-club-light-gray/70">Active Scouts</div>
                </div>
                <div className="bg-club-black/40 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-club-gold">{talentMetrics.identification.playersTracked}</div>
                  <div className="text-sm text-club-light-gray/70">Players Tracked</div>
                </div>
                <div className="bg-club-black/40 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-club-gold">{talentMetrics.identification.trialsScheduled}</div>
                  <div className="text-sm text-club-light-gray/70">Trials Scheduled</div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="development" className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-club-black/40 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-club-gold">{talentMetrics.development.conversionRate}%</div>
                  <div className="text-sm text-club-light-gray/70">Conversion Rate</div>
                </div>
                <div className="bg-club-black/40 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-club-gold">{talentMetrics.development.averageTime}mo</div>
                  <div className="text-sm text-club-light-gray/70">Avg Development</div>
                </div>
                <div className="bg-club-black/40 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-club-gold">{talentMetrics.development.successStories}</div>
                  <div className="text-sm text-club-light-gray/70">Success Stories</div>
                </div>
                <div className="bg-club-black/40 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-club-gold">{talentMetrics.development.currentPipeline}</div>
                  <div className="text-sm text-club-light-gray/70">In Pipeline</div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="financial" className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-club-black/40 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-club-gold">£{(talentMetrics.financial.totalInvestment / 1000).toFixed(0)}k</div>
                  <div className="text-sm text-club-light-gray/70">Total Investment</div>
                </div>
                <div className="bg-club-black/40 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-club-gold">{talentMetrics.financial.averageROI}%</div>
                  <div className="text-sm text-club-light-gray/70">Average ROI</div>
                </div>
                <div className="bg-club-black/40 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-club-gold">£{(talentMetrics.financial.marketValueGenerated / 1000000).toFixed(1)}M</div>
                  <div className="text-sm text-club-light-gray/70">Value Generated</div>
                </div>
                <div className="bg-club-black/40 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-club-gold">£{(talentMetrics.financial.costPerAcquisition / 1000).toFixed(1)}k</div>
                  <div className="text-sm text-club-light-gray/70">Cost per Player</div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Success Stories */}
      <Card className="bg-club-dark-gray border-club-gold/20">
        <CardHeader>
          <CardTitle className="flex items-center text-club-gold">
            <Award className="mr-2 h-5 w-5" />
            Recent Success Stories
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentSuccessStories.map((story, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-club-black/40 rounded-lg">
                <div>
                  <h4 className="font-medium text-club-light-gray">{story.name}</h4>
                  <p className="text-sm text-club-light-gray/70">Acquired {story.acquired} • Now at {story.position}</p>
                </div>
                <div className="text-right">
                  <div className="font-medium text-club-gold">{story.currentValue}</div>
                  <div className="text-sm text-club-light-gray/70">Current Value</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
