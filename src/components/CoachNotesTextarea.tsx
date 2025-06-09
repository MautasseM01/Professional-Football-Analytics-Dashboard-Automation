
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useIsMobile } from "@/hooks/use-mobile";

interface CoachNotesTextareaProps {
  onChange: (notes: string) => void;
  value: string;
}

export const CoachNotesTextarea = ({ onChange, value }: CoachNotesTextareaProps) => {
  const isMobile = useIsMobile();
  
  return (
    <div className="space-y-2">
      <Label 
        htmlFor="coach-notes" 
        className={`text-club-gold font-medium ${isMobile ? 'text-base' : 'text-sm'}`}
      >
        Coach's Notes
      </Label>
      <Textarea
        id="coach-notes"
        placeholder="Enter performance notes and feedback for this player..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`bg-club-black/70 border-club-gold/30 text-club-light-gray placeholder:text-club-light-gray/50 focus:border-club-gold focus:ring-club-gold/20 ${
          isMobile 
            ? 'min-h-[140px] text-base p-4' 
            : 'min-h-[120px] text-sm'
        }`}
      />
      <p className={`text-club-light-gray/70 ${isMobile ? 'text-sm' : 'text-xs'}`}>
        These notes will be included in the generated PDF report.
      </p>
    </div>
  );
};
