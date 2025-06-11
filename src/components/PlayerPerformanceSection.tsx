
import { Player } from "@/types";
import { LineChart } from "lucide-react";
import { PerformanceTrendsCard } from "./PerformanceTrendsCard";
import { MobilePerformanceTrends } from "./MobilePerformanceTrends";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { useTheme } from "@/contexts/ThemeContext";

interface PlayerPerformanceSectionProps {
  player: Player;
}

export const PlayerPerformanceSection = ({ player }: PlayerPerformanceSectionProps) => {
  const isMobile = useIsMobile();
  const { theme } = useTheme();

  return (
    <section className={cn(
      "w-full space-y-4 transition-all duration-300",
      isMobile ? "px-3 py-4" : "px-4 py-6"
    )}>
      <header className={cn(
        "flex items-center gap-2 w-full",
        isMobile && "flex-wrap"
      )}>
        <LineChart className={cn(
          "text-club-gold flex-shrink-0",
          isMobile ? "w-4 h-4" : "w-5 h-5"
        )} />
        <h2 className={cn(
          "font-bold text-club-gold mb-0 flex-1",
          isMobile ? "text-lg" : "text-xl lg:text-2xl",
          theme === 'dark' ? "text-club-gold" : "text-yellow-600"
        )}>
          Performance Trends
        </h2>
      </header>
      
      <div className="w-full">
        {isMobile ? (
          <MobilePerformanceTrends player={player} />
        ) : (
          <PerformanceTrendsCard player={player} />
        )}
      </div>
    </section>
  );
};
