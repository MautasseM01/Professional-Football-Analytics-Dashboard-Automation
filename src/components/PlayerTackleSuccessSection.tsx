
import { Player } from "@/types";
import { Shield } from "lucide-react";
import { TackleSuccessCard } from "./TackleSuccessCard";

interface PlayerTackleSuccessSectionProps {
  player: Player;
}

export const PlayerTackleSuccessSection = ({ player }: PlayerTackleSuccessSectionProps) => {
  return (
    <section className="space-y-4 sm:space-y-6">
      <header className="flex items-center gap-2 px-4 sm:px-0">
        <Shield className="w-5 h-5 text-club-gold flex-shrink-0" />
        <h2 className="heading-tertiary mb-0 text-club-light-gray">
          Tackle Success
        </h2>
      </header>
      <div className="sm:px-0 px-0 py-0">
        <TackleSuccessCard player={player} />
      </div>
    </section>
  );
};
