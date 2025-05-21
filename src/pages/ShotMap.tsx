
import { useState } from "react";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { useShotsData } from "@/hooks/use-shots-data";
import { usePlayerData } from "@/hooks/use-player-data";
import { ShotMapFilters } from "@/components/ShotMap/ShotMapFilters";
import { ShotMapVisualization } from "@/components/ShotMap/ShotMapVisualization";

const ShotMap = () => {
  const { 
    shots, 
    matches, 
    filters, 
    updateFilters, 
    resetFilters, 
    loading 
  } = useShotsData();
  
  const { players } = usePlayerData();

  return (
    <div className="flex min-h-screen bg-club-dark-bg text-club-light-gray">
      <DashboardSidebar />
      <main className="flex-1 p-6 lg:p-10">
        <div className="max-w-7xl mx-auto">
          <div className="mb-10">
            <h1 className="text-3xl font-bold text-club-gold mb-2">
              Shot Map
            </h1>
            <p className="text-club-light-gray/70">
              Visualize where shots were taken and their outcomes
            </p>
          </div>

          <div className="space-y-8">
            {/* Filters Section */}
            <div className="bg-club-black/40 rounded-lg p-6">
              <ShotMapFilters 
                players={players}
                matches={matches}
                filters={filters}
                onUpdateFilters={updateFilters}
                onResetFilters={resetFilters}
              />
            </div>
            
            {/* Shot Map Visualization */}
            <ShotMapVisualization shots={shots} loading={loading} />
            
            {/* Summary Stats - Could be added later */}
            <div className="bg-club-black/40 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-club-gold mb-4">Shot Summary</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="bg-club-dark-gray p-4 rounded-lg">
                  <div className="text-3xl font-bold text-club-gold">
                    {shots.filter(s => s.outcome === "Goal").length}
                  </div>
                  <div className="text-sm text-club-light-gray/70">Goals</div>
                </div>
                <div className="bg-club-dark-gray p-4 rounded-lg">
                  <div className="text-3xl font-bold text-club-gold">
                    {shots.filter(s => s.outcome === "Shot on Target").length}
                  </div>
                  <div className="text-sm text-club-light-gray/70">Shots on Target</div>
                </div>
                <div className="bg-club-dark-gray p-4 rounded-lg">
                  <div className="text-3xl font-bold text-club-gold">
                    {shots.filter(s => s.outcome === "Shot Off Target").length}
                  </div>
                  <div className="text-sm text-club-light-gray/70">Shots off Target</div>
                </div>
                <div className="bg-club-dark-gray p-4 rounded-lg">
                  <div className="text-3xl font-bold text-club-gold">
                    {shots.filter(s => s.outcome === "Blocked Shot").length}
                  </div>
                  <div className="text-sm text-club-light-gray/70">Blocked Shots</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ShotMap;
