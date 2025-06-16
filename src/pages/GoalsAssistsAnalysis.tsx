
import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { PlayerSelector } from "@/components/PlayerSelector";
import { Player } from "@/types";
import { GoalsTimeline } from "@/components/goals-assists/GoalsTimeline";
import { GoalTypesAnalysis } from "@/components/goals-assists/GoalTypesAnalysis";
import { BodyPartAnalysis } from "@/components/goals-assists/BodyPartAnalysis";
import { AssistNetwork } from "@/components/goals-assists/AssistNetwork";
import { GoalCoordinatesHeatmap } from "@/components/goals-assists/GoalCoordinatesHeatmap";
import { AssistTypesBreakdown } from "@/components/goals-assists/AssistTypesBreakdown";
import { PartnershipAnalysis } from "@/components/goals-assists/PartnershipAnalysis";
import { ResponsiveGrid } from "@/components/ResponsiveLayout";

const GoalsAssistsAnalysis = () => {
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);

  return (
    <DashboardLayout>
      <div className="space-y-6 p-4 sm:p-6">
        <div className="flex flex-col space-y-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
            Goals & Assists Analysis
          </h1>
          <div className="w-full max-w-md">
            <PlayerSelector
              selectedPlayer={selectedPlayer}
              onPlayerSelect={setSelectedPlayer}
              placeholder="Select a player to analyze goals & assists"
            />
          </div>
        </div>

        {selectedPlayer && (
          <div className="space-y-6">
            {/* Goals Timeline */}
            <GoalsTimeline player={selectedPlayer} />
            
            {/* Goal Analysis Row */}
            <ResponsiveGrid minCardWidth="320px">
              <GoalTypesAnalysis player={selectedPlayer} />
              <BodyPartAnalysis player={selectedPlayer} />
            </ResponsiveGrid>

            {/* Assist Analysis Row */}
            <ResponsiveGrid minCardWidth="320px">
              <AssistNetwork player={selectedPlayer} />
              <AssistTypesBreakdown player={selectedPlayer} />
            </ResponsiveGrid>

            {/* Advanced Analysis */}
            <ResponsiveGrid minCardWidth="400px">
              <GoalCoordinatesHeatmap player={selectedPlayer} />
              <PartnershipAnalysis player={selectedPlayer} />
            </ResponsiveGrid>
          </div>
        )}

        {!selectedPlayer && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              Select a player to view their goals and assists analysis
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default GoalsAssistsAnalysis;
