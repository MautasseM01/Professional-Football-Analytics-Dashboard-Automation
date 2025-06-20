
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingDown, TrendingUp, AlertTriangle } from 'lucide-react';
import { ResponsiveGrid } from '@/components/ResponsiveLayout';

interface SeasonData {
  pointsEarned: number;
  pointsDeducted: number;
  netPoints: number;
  currentPosition: number;
  positionWithoutPenalty: number;
  season: string;
}

interface SeasonOverviewCardProps {
  data: SeasonData;
}

export const SeasonOverviewCard = ({ data }: SeasonOverviewCardProps) => {
  const positionChange = data.currentPosition - data.positionWithoutPenalty;
  
  return (
    <Card className="bg-club-dark-gray border-club-gold/20">
      <CardHeader>
        <CardTitle className="text-club-gold flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" />
          Season {data.season} Overview
        </CardTitle>
        <CardDescription className="text-club-light-gray/70">
          Current standing and penalty impact analysis
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveGrid className="grid-cols-2 md:grid-cols-4">
          
          {/* Points Earned */}
          <div className="text-center p-4 bg-club-black/30 rounded-lg">
            <div className="text-2xl font-bold text-green-400">{data.pointsEarned}</div>
            <div className="text-sm text-club-light-gray/70">Points Earned</div>
            <div className="text-xs text-club-light-gray/50 mt-1">On Field Performance</div>
          </div>

          {/* Points Deducted */}
          <div className="text-center p-4 bg-club-black/30 rounded-lg">
            <div className="text-2xl font-bold text-red-400">-{data.pointsDeducted}</div>
            <div className="text-sm text-club-light-gray/70">Points Deducted</div>
            <div className="text-xs text-club-light-gray/50 mt-1">Administrative Penalties</div>
          </div>

          {/* Net Points */}
          <div className="text-center p-4 bg-club-black/30 rounded-lg">
            <div className="text-2xl font-bold text-club-gold">{data.netPoints}</div>
            <div className="text-sm text-club-light-gray/70">Net Points</div>
            <div className="text-xs text-club-light-gray/50 mt-1">Current Standing</div>
          </div>

          {/* Position Impact */}
          <div className="text-center p-4 bg-club-black/30 rounded-lg">
            <div className="flex items-center justify-center gap-2">
              <div className="text-2xl font-bold text-club-light-gray">{data.currentPosition}</div>
              {positionChange > 0 && (
                <div className="flex items-center text-red-400">
                  <TrendingDown className="h-4 w-4" />
                  <span className="text-sm">+{positionChange}</span>
                </div>
              )}
            </div>
            <div className="text-sm text-club-light-gray/70">League Position</div>
            <div className="text-xs text-club-light-gray/50 mt-1">
              Without penalties: {data.positionWithoutPenalty}
            </div>
          </div>

        </ResponsiveGrid>

        {/* Impact Summary */}
        <div className="mt-6 p-4 bg-red-900/20 border border-red-600/30 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="h-4 w-4 text-red-400" />
            <span className="font-medium text-red-400">Penalty Impact</span>
          </div>
          <p className="text-sm text-club-light-gray/70">
            Administrative penalties have cost the team {data.pointsDeducted} points this season, 
            resulting in a drop of {positionChange} position{positionChange !== 1 ? 's' : ''} in the league table.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
