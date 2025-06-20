
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, ReferenceLine, Legend } from 'recharts';
import { TrendingDown, TrendingUp, Target } from 'lucide-react';

export const ImpactVisualization = () => {
  // Mock league table data
  const leagueData = [
    { position: 1, team: 'Team A', points: 58, pointsWithoutPenalty: 58 },
    { position: 2, team: 'Team B', points: 54, pointsWithoutPenalty: 54 },
    { position: 3, team: 'Team C', points: 52, pointsWithoutPenalty: 52 },
    { position: 4, team: 'Team D', points: 49, pointsWithoutPenalty: 49 },
    { position: 5, team: 'Team E', points: 47, pointsWithoutPenalty: 47 },
    { position: 6, team: 'Our Team', points: 39, pointsWithoutPenalty: 45 },
    { position: 7, team: 'Team F', points: 41, pointsWithoutPenalty: 41 },
    { position: 8, team: 'Team G', points: 38, pointsWithoutPenalty: 38 },
    { position: 9, team: 'Team H', points: 35, pointsWithoutPenalty: 35 },
    { position: 10, team: 'Team I', points: 32, pointsWithoutPenalty: 32 },
  ].sort((a, b) => b.points - a.points).map((team, index) => ({ ...team, actualPosition: index + 1 }));

  const promotionThreshold = 45; // Points typically needed for promotion playoff
  const relegationThreshold = 30; // Points typically needed to avoid relegation

  return (
    <Card className="bg-club-dark-gray border-club-gold/20">
      <CardHeader>
        <CardTitle className="text-club-gold flex items-center gap-2">
          <Target className="h-5 w-5" />
          League Position Impact
        </CardTitle>
        <CardDescription className="text-club-light-gray/70">
          Visualization of penalty impact on league standing
        </CardDescription>
      </CardHeader>
      <CardContent>
        
        {/* Position Comparison */}
        <div className="mb-6">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="text-center p-3 bg-red-900/20 border border-red-600/30 rounded-lg">
              <div className="text-2xl font-bold text-red-400">8th</div>
              <div className="text-sm text-club-light-gray/70">Current Position</div>
              <div className="text-xs text-red-400">With Penalties</div>
            </div>
            <div className="text-center p-3 bg-green-900/20 border border-green-600/30 rounded-lg">
              <div className="text-2xl font-bold text-green-400">6th</div>
              <div className="text-sm text-club-light-gray/70">Potential Position</div>
              <div className="text-xs text-green-400">Without Penalties</div>
            </div>
          </div>
        </div>

        {/* League Table Chart */}
        <div className="h-80 mb-6">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={leagueData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="team" 
                stroke="#9CA3AF" 
                fontSize={12}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis stroke="#9CA3AF" fontSize={12} />
              <Legend />
              <ReferenceLine 
                y={promotionThreshold} 
                stroke="#10B981" 
                strokeDasharray="5 5" 
                label={{ value: "Promotion Zone", position: "insideTopRight", fill: "#10B981" }}
              />
              <ReferenceLine 
                y={relegationThreshold} 
                stroke="#EF4444" 
                strokeDasharray="5 5" 
                label={{ value: "Relegation Zone", position: "insideBottomRight", fill: "#EF4444" }}
              />
              <Bar 
                dataKey="points" 
                fill="#DC2626" 
                name="Current Points"
                opacity={0.8}
              />
              <Bar 
                dataKey="pointsWithoutPenalty" 
                fill="#10B981" 
                name="Points Without Penalties"
                opacity={0.6}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Impact Summary */}
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 bg-yellow-900/20 border border-yellow-600/30 rounded">
            <TrendingDown className="h-5 w-5 text-yellow-500 flex-shrink-0" />
            <div>
              <p className="text-club-light-gray font-medium">Playoff Qualification Impact</p>
              <p className="text-club-light-gray/70 text-sm">
                Without penalties, the team would be in 6th place (playoff position)
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 bg-blue-900/20 border border-blue-600/30 rounded">
            <Target className="h-5 w-5 text-blue-500 flex-shrink-0" />
            <div>
              <p className="text-club-light-gray font-medium">Points to Safety</p>
              <p className="text-club-light-gray/70 text-sm">
                Currently 9 points above relegation threshold
              </p>
            </div>
          </div>
        </div>

      </CardContent>
    </Card>
  );
};
