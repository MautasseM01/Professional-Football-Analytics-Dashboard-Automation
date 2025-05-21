
import { Loader } from "lucide-react";

interface LoadingOverlayProps {
  isLoading: boolean;
}

export const LoadingOverlay = ({ isLoading }: LoadingOverlayProps) => {
  if (!isLoading) return null;
  
  return (
    <div className="absolute inset-0 bg-club-black/40 backdrop-blur-[2px] flex items-center justify-center z-10 rounded-lg">
      <div className="flex flex-col items-center justify-center space-y-2">
        <Loader className="h-8 w-8 text-club-gold animate-spin" />
        <p className="text-sm text-club-light-gray">Loading data...</p>
      </div>
    </div>
  );
};
