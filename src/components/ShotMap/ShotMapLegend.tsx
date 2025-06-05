
import { CircleCheck, CircleX, Target, Square } from "lucide-react";

export const ShotMapLegend = () => {
  return (
    <div className="flex flex-wrap gap-3 sm:gap-4 p-3 sm:p-4 bg-club-black/40 rounded-lg">
      <div className="flex items-center gap-1.5 sm:gap-2">
        <CircleCheck size={16} className="text-[#F97316] fill-[#F97316] stroke-white sm:size-4" />
        <span className="text-club-light-gray text-xs sm:text-sm">Goal</span>
      </div>
      <div className="flex items-center gap-1.5 sm:gap-2">
        <Target size={16} className="text-[#0EA5E9] fill-[#0EA5E9] stroke-white sm:size-4" />
        <span className="text-club-light-gray text-xs sm:text-sm">Shot on Target</span>
      </div>
      <div className="flex items-center gap-1.5 sm:gap-2">
        <CircleX size={16} className="text-[#888888] fill-[#888888] stroke-white sm:size-4" />
        <span className="text-club-light-gray text-xs sm:text-sm">Shot Off Target</span>
      </div>
      <div className="flex items-center gap-1.5 sm:gap-2">
        <Square size={16} className="text-[#555555] fill-[#555555] stroke-white sm:size-4" />
        <span className="text-club-light-gray text-xs sm:text-sm">Blocked Shot</span>
      </div>
    </div>
  );
};
