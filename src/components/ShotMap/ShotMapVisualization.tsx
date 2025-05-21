
import { FootballPitch } from "./FootballPitch";
import { ShotPoint } from "./ShotPoint";
import { ShotMapLegend } from "./ShotMapLegend";
import { Shot } from "@/types/shot";

interface ShotMapVisualizationProps {
  shots: Shot[];
  loading: boolean;
}

export const ShotMapVisualization = ({ 
  shots, 
  loading 
}: ShotMapVisualizationProps) => {
  return (
    <div className="space-y-4">
      <div className="bg-club-black/40 p-4 rounded-lg">
        <div className="relative">
          <FootballPitch className="rounded-lg overflow-hidden shadow-xl">
            {!loading && shots.map((shot) => (
              <ShotPoint key={shot.id} shot={shot} />
            ))}
          </FootballPitch>
          
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-club-black/60 rounded-lg">
              <div className="text-club-light-gray">Loading shot data...</div>
            </div>
          )}
          
          {!loading && shots.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center bg-club-black/60 rounded-lg">
              <div className="text-club-light-gray">No shots match the selected filters</div>
            </div>
          )}
        </div>
      </div>
      
      <ShotMapLegend />
    </div>
  );
};
