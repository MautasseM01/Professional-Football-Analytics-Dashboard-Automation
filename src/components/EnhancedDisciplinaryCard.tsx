
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
        <CardHeader>
          <CardTitle className="text-club-gold flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            Disciplinary Profile
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            <Skeleton className="h-8 w-32 bg-club-gold/10" />
            <Skeleton className="h-4 w-48 bg-club-gold/10" />
            <Skeleton className="h-20 w-full bg-club-gold/10" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!disciplinaryData) {
    return (
      <Card className="bg-club-black border-club-gold/20">
        <CardContent className="p-6 text-center">
          <AlertTriangle className="w-8 h-8 mx-auto text-club-gold/50 mb-2" />
          <p className="text-club-light-gray">No disciplinary data available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-club-black border-club-gold/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-club-gold flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            Disciplinary Profile
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportData}
            className="bg-club-dark-gray border-club-gold/30 text-club-gold hover:bg-club-gold/10"
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-club-dark-gray">
            <TabsTrigger 
              value="overview" 
              className="data-[state=active]:bg-club-gold data-[state=active]:text-club-black"
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger 
              value="timeline"
              className="data-[state=active]:bg-club-gold data-[state=active]:text-club-black"
            >
              <Clock className="w-4 h-4 mr-2" />
              Timeline
            </TabsTrigger>
            <TabsTrigger 
              value="risk"
              className="data-[state=active]:bg-club-gold data-[state=active]:text-club-black"
            >
              <AlertTriangle className="w-4 h-4 mr-2" />
              Risk
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="text-center p-4 bg-club-dark-gray/50 rounded-lg">
                  <div className="text-2xl font-bold text-club-gold mb-1">
                    {disciplinaryData.totalCards}
                  </div>
                  <div className="text-sm text-club-light-gray/70">Total Cards</div>
                </div>
                
                <div className="flex justify-center gap-2">
                  {Array.from({ length: disciplinaryData.yellowCards }).map((_, i) => (
                    <div key={`yellow-${i}`} className="bg-[#FCD34D] text-black text-xs font-bold w-6 h-8 rounded-sm flex items-center justify-center border border-gray-300">
                      Y
                    </div>
                  ))}
                  {Array.from({ length: disciplinaryData.redCards }).map((_, i) => (
                    <div key={`red-${i}`} className="bg-[#EF4444] text-black text-xs font-bold w-6 h-8 rounded-sm flex items-center justify-center border border-gray-300">
                      R
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-club-light-gray text-sm">Status</span>
                  <span className={`text-sm font-medium ${disciplinaryData.riskColor}`}>
                    {disciplinaryData.riskLevel}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-club-light-gray text-sm">Fair Play</span>
                  <span className="text-club-gold text-sm font-medium">
                    {disciplinaryData.fairPlayRating}/10
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-club-light-gray text-sm">Missed Matches</span>
                  <span className="text-club-gold text-sm font-medium">
                    {disciplinaryData.missedMatches}
                  </span>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="timeline" className="mt-6">
            <DisciplinaryTimeline events={disciplinaryData.events} />
          </TabsContent>

          <TabsContent value="risk" className="mt-6">
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
