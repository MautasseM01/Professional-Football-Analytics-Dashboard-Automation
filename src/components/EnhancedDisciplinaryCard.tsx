
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertTriangle, Download, BarChart3, Clock } from "lucide-react";
import { usePlayerDisciplinaryDetails } from "@/hooks/use-player-disciplinary-details";
import { DisciplinaryTimeline } from "./DisciplinaryTimeline";
import { DisciplinaryRiskPanel } from "./DisciplinaryRiskPanel";
import { Skeleton } from "@/components/ui/skeleton";

interface EnhancedDisciplinaryCardProps {
  playerId: number | null;
}

export const EnhancedDisciplinaryCard = ({ playerId }: EnhancedDisciplinaryCardProps) => {
  const { data: disciplinaryData, isLoading } = usePlayerDisciplinaryDetails(playerId);
  const [activeTab, setActiveTab] = useState("overview");

  const handleExportData = () => {
    if (!disciplinaryData) return;
    
    // Create CSV data
    const csvData = [
      ['Date', 'Card Type', 'Opposition', 'Competition', 'Minute', 'Score'].join(','),
      ...disciplinaryData.events.map(event => [
        event.match_date || '',
        event.card_type,
        event.opposition || '',
        event.competition,
        event.minute || '',
        event.home_score !== undefined ? `${event.home_score}-${event.away_score}` : ''
      ].join(','))
    ].join('\n');
    
    // Download CSV
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `disciplinary-record-player-${playerId}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <Card className="bg-club-black border-club-gold/20">
        <CardHeader className="pb-3">
          <CardTitle className="text-club-gold flex items-center gap-2 text-base">
            <AlertTriangle className="w-4 h-4" />
            Disciplinary Profile
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="space-y-3">
            <Skeleton className="h-6 w-32 bg-club-gold/10" />
            <Skeleton className="h-4 w-48 bg-club-gold/10" />
            <Skeleton className="h-16 w-full bg-club-gold/10" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!disciplinaryData) {
    return (
      <Card className="bg-club-black border-club-gold/20">
        <CardContent className="p-4 text-center">
          <AlertTriangle className="w-6 h-6 mx-auto text-club-gold/50 mb-2" />
          <p className="text-club-light-gray text-sm">No disciplinary data available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-club-black border-club-gold/20">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-club-gold flex items-center gap-2 text-base">
            <AlertTriangle className="w-4 h-4" />
            Disciplinary Profile
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportData}
            className="bg-club-dark-gray border-club-gold/30 text-club-gold hover:bg-club-gold/10 h-7 px-2 text-xs"
          >
            <Download className="w-3 h-3 mr-1" />
            Export
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-club-dark-gray h-8">
            <TabsTrigger 
              value="overview" 
              className="data-[state=active]:bg-club-gold data-[state=active]:text-club-black text-xs py-1"
            >
              <BarChart3 className="w-3 h-3 mr-1" />
              Overview
            </TabsTrigger>
            <TabsTrigger 
              value="timeline"
              className="data-[state=active]:bg-club-gold data-[state=active]:text-club-black text-xs py-1"
            >
              <Clock className="w-3 h-3 mr-1" />
              Timeline
            </TabsTrigger>
            <TabsTrigger 
              value="risk"
              className="data-[state=active]:bg-club-gold data-[state=active]:text-club-black text-xs py-1"
            >
              <AlertTriangle className="w-3 h-3 mr-1" />
              Risk
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-3 bg-club-dark-gray/50 rounded-lg">
                <div className="text-lg font-bold text-club-gold mb-1">
                  {disciplinaryData.totalCards}
                </div>
                <div className="text-xs text-club-light-gray/70">Total Cards</div>
              </div>
              
              <div className="text-center p-3 bg-club-dark-gray/50 rounded-lg">
                <div className="text-lg font-bold text-club-gold mb-1">
                  {disciplinaryData.fairPlayRating}/10
                </div>
                <div className="text-xs text-club-light-gray/70">Fair Play</div>
              </div>
              
              <div className="text-center p-3 bg-club-dark-gray/50 rounded-lg">
                <div className="text-lg font-bold text-club-gold mb-1">
                  {disciplinaryData.missedMatches}
                </div>
                <div className="text-xs text-club-light-gray/70">Missed Matches</div>
              </div>
            </div>

            {/* Card visualization */}
            <div className="flex justify-center gap-1 mt-4">
              {Array.from({ length: disciplinaryData.yellowCards }).map((_, i) => (
                <div key={`yellow-${i}`} className="bg-[#FCD34D] text-black text-xs font-bold w-5 h-6 rounded-sm flex items-center justify-center border border-gray-300">
                  Y
                </div>
              ))}
              {Array.from({ length: disciplinaryData.redCards }).map((_, i) => (
                <div key={`red-${i}`} className="bg-[#EF4444] text-black text-xs font-bold w-5 h-6 rounded-sm flex items-center justify-center border border-gray-300">
                  R
                </div>
              ))}
              {disciplinaryData.totalCards === 0 && (
                <span className="text-green-500 text-sm">Clean Record</span>
              )}
            </div>
          </TabsContent>

          <TabsContent value="timeline" className="mt-4">
            <DisciplinaryTimeline events={disciplinaryData.events} />
          </TabsContent>

          <TabsContent value="risk" className="mt-4">
            <DisciplinaryRiskPanel 
              riskLevel={disciplinaryData.riskLevel}
              riskColor={disciplinaryData.riskColor}
              cardsUntilSuspension={disciplinaryData.cardsUntilSuspension}
              totalCards={disciplinaryData.totalCards}
              fairPlayRating={disciplinaryData.fairPlayRating}
              teamAverageFairPlay={disciplinaryData.teamAverageFairPlay}
              missedMatches={disciplinaryData.missedMatches}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
