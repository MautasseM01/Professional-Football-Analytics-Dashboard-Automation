
import { useState } from "react";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { useShotsData } from "@/hooks/use-shots-data";
import { usePlayerData } from "@/hooks/use-player-data";
import { ShotMapFilters } from "@/components/ShotMap/ShotMapFilters";
import { ShotMapVisualization } from "@/components/ShotMap/ShotMapVisualization";
import { ShotMapLegend } from "@/components/ShotMap/ShotMapLegend";
import { BackToTopButton } from "@/components/BackToTopButton";

const ShotMap = () => {
  const { players } = usePlayerData();
  const { shots, matches, filters, updateFilters, resetFilters, loading, filterLoading, error } = useShotsData();

  return (
    <div className="flex min-h-screen bg-club-dark-bg text-club-light-gray">
      <DashboardSidebar />
      <main className="flex-1 p-3 sm:p-4 lg:p-6 xl:p-10">
        <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-club-gold">Shot Map Analysis</h1>
            <p className="text-club-light-gray/70 text-sm sm:text-base">
              Visualize and analyze shot patterns and outcomes
            </p>
          </div>

          {/* Filters */}
          <div className="bg-club-dark-gray/50 rounded-lg p-3 sm:p-4">
            <ShotMapFilters 
              players={players}
              matches={matches}
              filters={filters}
              onApplyFilters={updateFilters}
              onResetFilters={resetFilters}
            />
          </div>

          {/* Legend */}
          <div>
            <ShotMapLegend />
          </div>

          {/* Visualization */}
          <div>
            <ShotMapVisualization 
              shots={shots} 
              loading={loading} 
              filterLoading={filterLoading} 
            />
          </div>

          {error && (
            <div className="bg-red-900/30 border border-red-700 text-red-100 p-3 sm:p-4 rounded-lg">
              <p className="text-sm sm:text-base">{error}</p>
            </div>
          )}
        </div>
      </main>

      {/* Back to Top Button */}
      <BackToTopButton />
    </div>
  );
};

export default ShotMap;
