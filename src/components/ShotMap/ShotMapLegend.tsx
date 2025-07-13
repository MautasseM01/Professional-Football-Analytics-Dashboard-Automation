
import { CircleCheck, CircleX, Target, Square } from "lucide-react";

export const ShotMapLegend = () => {
  return (
    <div className="bg-card/80 backdrop-blur-sm border border-border rounded-lg p-4 space-y-3">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-2 h-2 rounded-full bg-primary"></div>
        <h3 className="text-sm font-semibold text-foreground">Shot Legend</h3>
      </div>
      
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="flex items-center gap-2 p-2 rounded-md bg-muted/50">
          <CircleCheck size={18} className="text-orange-500 fill-orange-500 stroke-white stroke-2 drop-shadow-sm" />
          <span className="text-foreground text-sm font-medium">Goal</span>
        </div>
        
        <div className="flex items-center gap-2 p-2 rounded-md bg-muted/50">
          <Target size={18} className="text-blue-500 fill-blue-500 stroke-white stroke-2 drop-shadow-sm" />
          <span className="text-foreground text-sm font-medium">On Target</span>
        </div>
        
        <div className="flex items-center gap-2 p-2 rounded-md bg-muted/50">
          <CircleX size={18} className="text-gray-500 fill-gray-500 stroke-white stroke-2 drop-shadow-sm" />
          <span className="text-foreground text-sm font-medium">Off Target</span>
        </div>
        
        <div className="flex items-center gap-2 p-2 rounded-md bg-muted/50">
          <Square size={18} className="text-gray-600 fill-gray-600 stroke-white stroke-2 drop-shadow-sm" />
          <span className="text-foreground text-sm font-medium">Blocked</span>
        </div>
      </div>
      
      <div className="border-t border-border pt-3 text-xs text-muted-foreground">
        <p>Click on any shot to view detailed information • Zoom and pan to explore different areas</p>
      </div>
    </div>
  );
};
