
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface CoachNotesTextareaProps {
  onChange: (notes: string) => void;
  value: string;
}

export const CoachNotesTextarea = ({ onChange, value }: CoachNotesTextareaProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="coach-notes" className="text-club-gold font-medium">
        Coach's Notes
      </Label>
      <Textarea
        id="coach-notes"
        placeholder="Enter performance notes and feedback for this player..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="min-h-[120px] bg-club-black/70 border-club-gold/30 text-club-light-gray placeholder:text-club-light-gray/50"
      />
      <p className="text-xs text-club-light-gray/70">
        These notes will be included in the generated PDF report.
      </p>
    </div>
  );
};
