
import { usePlayerData } from "@/hooks/use-player-data";
import { UserProfile } from "@/types";
import { PlayerStats } from "@/components/PlayerStats";
import { PlayerSelector } from "@/components/PlayerSelector";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart3, PieChart, TrendingUp, FileText, Download } from "lucide-react";
import { ResponsiveGrid } from "../ResponsiveLayout";
import { useIsMobile } from "@/hooks/use-mobile";

interface AnalystDashboardProps {
  profile: UserProfile;
}

export const AnalystDashboard = ({ profile }: AnalystDashboardProps) => {
  const { players, selectedPlayer, selectPlayer, loading } = usePlayerData();
  const isMobile = useIsMobile();

  return (
    <div className={`space-y-3 sm:space-y-4 lg:space-y-6 ${isMobile ? 'p-2' : 'p-3 sm:p-4 lg:p-6'} w-full max-w-7xl mx-auto`}>
      <div className="mb-3 sm:mb-4 lg:mb-6">
        <h1 className={`font-bold text-club-gold mb-1 sm:mb-2 ${isMobile ? 'text-lg' : 'text-lg sm:text-xl lg:text-2xl xl:text-3xl'}`}>
          Analytics Dashboard
        </h1>
        <p className={`text-club-light-gray/70 ${isMobile ? 'text-sm' : 'text-xs sm:text-sm lg:text-base'}`}>
          Deep dive into player and team performance analytics
        </p>
      </div>

      {/* Analytics Overview Cards with Responsive Grid */}
      <ResponsiveGrid mobileCols={1} className="grid-cols-1 sm:grid-cols-2 md:grid-cols-4">
        <Card className="bg-club-dark-gray border-club-gold/20">
          <CardHeader className={`pb-2 ${isMobile ? 'p-3' : 'p-3 sm:p-4'}`}>
            <CardTitle className={`flex items-center text-club-gold ${isMobile ? 'text-sm' : 'text-xs sm:text-sm'}`}>
              <BarChart3 className={`mr-2 flex-shrink-0 ${isMobile ? 'h-4 w-4' : 'h-3 w-3 sm:h-4 sm:w-4'}`} />
              Data Points
            </CardTitle>
          </CardHeader>
          <CardContent className={`pt-0 ${isMobile ? 'p-3' : 'p-3 sm:p-4'}`}>
            <div className={`font-bold text-club-light-gray ${isMobile ? 'text-xl' : 'text-lg sm:text-xl lg:text-2xl'}`}>15.2K</div>
            <p className={`text-club-light-gray/70 ${isMobile ? 'text-sm' : 'text-xs'}`}>This Season</p>
          </CardContent>
        </Card>

        <Card className="bg-club-dark-gray border-club-gold/20">
          <CardHeader className={`pb-2 ${isMobile ? 'p-3' : 'p-3 sm:p-4'}`}>
            <CardTitle className={`flex items-center text-club-gold ${isMobile ? 'text-sm' : 'text-xs sm:text-sm'}`}>
              <PieChart className={`mr-2 flex-shrink-0 ${isMobile ? 'h-4 w-4' : 'h-3 w-3 sm:h-4 sm:w-4'}`} />
              Metrics
            </CardTitle>
          </CardHeader>
          <CardContent className={`pt-0 ${isMobile ? 'p-3' : 'p-3 sm:p-4'}`}>
            <div className={`font-bold text-club-light-gray ${isMobile ? 'text-xl' : 'text-lg sm:text-xl lg:text-2xl'}`}>47</div>
            <p className={`text-club-light-gray/70 ${isMobile ? 'text-sm' : 'text-xs'}`}>Active KPIs</p>
          </CardContent>
        </Card>

        <Card className="bg-club-dark-gray border-club-gold/20">
          <CardHeader className={`pb-2 ${isMobile ? 'p-3' : 'p-3 sm:p-4'}`}>
            <CardTitle className={`flex items-center text-club-gold ${isMobile ? 'text-sm' : 'text-xs sm:text-sm'}`}>
              <TrendingUp className={`mr-2 flex-shrink-0 ${isMobile ? 'h-4 w-4' : 'h-3 w-3 sm:h-4 sm:w-4'}`} />
              Models
            </CardTitle>
          </CardHeader>
          <CardContent className={`pt-0 ${isMobile ? 'p-3' : 'p-3 sm:p-4'}`}>
            <div className={`font-bold text-club-light-gray ${isMobile ? 'text-xl' : 'text-lg sm:text-xl lg:text-2xl'}`}>8</div>
            <p className={`text-club-light-gray/70 ${isMobile ? 'text-sm' : 'text-xs'}`}>Predictive Models</p>
          </CardContent>
        </Card>

        <Card className="bg-club-dark-gray border-club-gold/20">
          <CardHeader className={`pb-2 ${isMobile ? 'p-3' : 'p-3 sm:p-4'}`}>
            <CardTitle className={`flex items-center text-club-gold ${isMobile ? 'text-sm' : 'text-xs sm:text-sm'}`}>
              <FileText className={`mr-2 flex-shrink-0 ${isMobile ? 'h-4 w-4' : 'h-3 w-3 sm:h-4 sm:w-4'}`} />
              Reports
            </CardTitle>
          </CardHeader>
          <CardContent className={`pt-0 ${isMobile ? 'p-3' : 'p-3 sm:p-4'}`}>
            <div className={`font-bold text-club-light-gray ${isMobile ? 'text-xl' : 'text-lg sm:text-xl lg:text-2xl'}`}>23</div>
            <p className={`text-club-light-gray/70 ${isMobile ? 'text-sm' : 'text-xs'}`}>This Month</p>
          </CardContent>
        </Card>
      </ResponsiveGrid>

      {/* Advanced Analytics Tools */}
      <Card className="bg-club-dark-gray border-club-gold/20">
        <CardHeader className={isMobile ? 'p-3' : 'p-3 sm:p-4'}>
          <CardTitle className={`text-club-gold ${isMobile ? 'text-base' : 'text-sm sm:text-base'}`}>Advanced Analytics Tools</CardTitle>
          <CardDescription className={`text-club-light-gray/70 ${isMobile ? 'text-sm' : 'text-xs sm:text-sm'}`}>
            Generate comprehensive reports and analysis
          </CardDescription>
        </CardHeader>
        <CardContent className={`pt-0 ${isMobile ? 'p-3' : 'p-3 sm:p-4'}`}>
          <ResponsiveGrid mobileCols={1} className="grid-cols-1 sm:grid-cols-2">
            <Button variant="outline" className={`border-club-gold/20 hover:bg-club-gold/10 flex items-center gap-2 justify-start min-h-[44px] ${isMobile ? 'text-sm' : 'text-xs sm:text-sm'}`}>
              <Download className={`flex-shrink-0 ${isMobile ? 'h-4 w-4' : 'h-3 w-3 sm:h-4 sm:w-4'}`} />
              Export Player Data
            </Button>
            <Button variant="outline" className={`border-club-gold/20 hover:bg-club-gold/10 flex items-center gap-2 justify-start min-h-[44px] ${isMobile ? 'text-sm' : 'text-xs sm:text-sm'}`}>
              <FileText className={`flex-shrink-0 ${isMobile ? 'h-4 w-4' : 'h-3 w-3 sm:h-4 sm:w-4'}`} />
              Generate Team Report
            </Button>
            <Button variant="outline" className={`border-club-gold/20 hover:bg-club-gold/10 flex items-center gap-2 justify-start min-h-[44px] ${isMobile ? 'text-sm' : 'text-xs sm:text-sm'}`}>
              <BarChart3 className={`flex-shrink-0 ${isMobile ? 'h-4 w-4' : 'h-3 w-3 sm:h-4 sm:w-4'}`} />
              Performance Trends
            </Button>
            <Button variant="outline" className={`border-club-gold/20 hover:bg-club-gold/10 flex items-center gap-2 justify-start min-h-[44px] ${isMobile ? 'text-sm' : 'text-xs sm:text-sm'}`}>
              <TrendingUp className={`flex-shrink-0 ${isMobile ? 'h-4 w-4' : 'h-3 w-3 sm:h-4 sm:w-4'}`} />
              Predictive Analysis
            </Button>
          </ResponsiveGrid>
        </CardContent>
      </Card>

      {/* Player Selector */}
      <PlayerSelector
        players={players}
        selectedPlayer={selectedPlayer}
        onPlayerSelect={selectPlayer}
        loading={loading}
      />

      {/* Player Stats Component */}
      {selectedPlayer && <PlayerStats player={selectedPlayer} />}
    </div>
  );
};
