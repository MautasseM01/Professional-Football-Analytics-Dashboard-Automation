
import React from "react";
import { FootballPitch } from "./FootballPitch";
import { ShotPoint } from "./ShotPoint";
import { Shot } from "@/types/shot";
import { LoadingOverlay } from "../LoadingOverlay";

interface ShotMapVisualizationProps {
  shots: Shot[];
  loading: boolean;
  filterLoading: boolean;
}

export const ShotMapVisualization = ({ shots, loading, filterLoading }: ShotMapVisualizationProps) => {
  if (loading) {
    return (
      <div className="w-full p-6 flex justify-center items-center min-h-[500px] bg-club-dark-gray rounded-lg">
        <Loader className="h-8 w-8 text-club-gold animate-spin" />
      </div>
    );
  }

  return (
    <div className="relative w-full">
      <LoadingOverlay isLoading={filterLoading} />
      <div className="w-full bg-club-dark-gray p-6 rounded-lg relative">
        <FootballPitch>
          {shots.map((shot) => (
            <ShotPoint key={shot.id} shot={shot} />
          ))}
        </FootballPitch>
      </div>
    </div>
  );
};

// Import Loader component
import { Loader } from "lucide-react";
