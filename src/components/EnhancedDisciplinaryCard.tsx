
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
        <CardContent className="p-4 sm:p-6">
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
        <CardContent className="p-4 sm:p-6 text-center">
          <AlertTriangle className="w-8 h-8 mx-auto text-club-gold/50 mb-2" />
          <p className="text-club-light-gray">No disciplinary data available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-club-black border-club-gold/20">
      <CardHeader className="pb-4">
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
      <CardContent className="p-4 sm:p-6 pt-0">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-muted border border-border mb-6 h-auto p-1">
            <TabsTrigger 
              value="overview" 
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-all"
            >
              <BarChart3 className="w-4 h-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger 
              value="timeline"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-all"
            >
              <Clock className="w-4 h-4" />
              Timeline
            </TabsTrigger>
            <TabsTrigger 
              value="risk"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-all"
            >
              <AlertTriangle className="w-4 h-4" />
              Risk
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="text-center p-6 bg-club-dark-gray/50 rounded-lg border border-club-gold/10">
                  <div className="text-3xl font-bold text-club-gold mb-2">
                    {disciplinaryData.totalCards}
                  </div>
                  <div className="text-sm text-club-light-gray/70 mb-4">Total Cards This Season</div>
                  
                  {/* Card Visual Representation */}
                  <div className="flex justify-center gap-1 flex-wrap">
                    {Array.from({ length: disciplinaryData.yellowCards }).map((_, i) => (
                      <div 
                        key={`yellow-${i}`} 
                        className="bg-yellow-400 text-black text-xs font-bold w-5 h-7 rounded-sm flex items-center justify-center border border-yellow-600 shadow-sm"
                        title="Yellow Card"
                      >
                        Y
                      </div>
                    ))}
                    {Array.from({ length: disciplinaryData.redCards }).map((_, i) => (
                      <div 
                        key={`red-${i}`} 
                        className="bg-red-500 text-white text-xs font-bold w-5 h-7 rounded-sm flex items-center justify-center border border-red-700 shadow-sm"
                        title="Red Card"
                      >
                        R
                      </div>
                    ))}
                    {disciplinaryData.totalCards === 0 && (
                      <div className="text-green-500 text-sm font-medium">Clean Record ✓</div>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-club-dark-gray/30 rounded-lg border border-club-gold/10">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-club-light-gray text-sm">Disciplinary Status</span>
                      <span className={`text-sm font-medium px-2 py-1 rounded-full text-xs ${
                        disciplinaryData.riskLevel === 'SAFE' 
                          ? 'bg-green-500/20 text-green-400' 
                          : disciplinaryData.riskLevel === 'AT RISK'
                          ? 'bg-amber-500/20 text-amber-400'
                          : 'bg-red-500/20 text-red-400'
                      }`}>
                        {disciplinaryData.riskLevel}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-club-light-gray text-sm">Fair Play Rating</span>
                      <div className="flex items-center gap-2">
                        <span className="text-club-gold text-sm font-medium">
                          {disciplinaryData.fairPlayRating}/10
                        </span>
                        <div className="w-16 bg-club-black rounded-full h-2">
                          <div 
                            className="bg-club-gold h-2 rounded-full transition-all duration-300" 
                            style={{ width: `${(disciplinaryData.fairPlayRating / 10) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-club-light-gray text-sm">Matches Missed</span>
                      <span className="text-club-gold text-sm font-medium">
                        {disciplinaryData.missedMatches}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-club-light-gray text-sm">Cards Until Suspension</span>
                      <span className={`text-sm font-medium ${
                        disciplinaryData.cardsUntilSuspension <= 1 ? 'text-red-400' : 'text-club-gold'
                      }`}>
                        {disciplinaryData.cardsUntilSuspension > 0 ? disciplinaryData.cardsUntilSuspension : 'At Risk'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="timeline" className="mt-0">
            <DisciplinaryTimeline events={disciplinaryData.events} />
          </TabsContent>

          <TabsContent value="risk" className="mt-0">
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
