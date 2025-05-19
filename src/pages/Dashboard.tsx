
import { useState } from "react";
import { usePlayerData } from "@/hooks/use-player-data";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { PlayerStats } from "@/components/PlayerStats";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Menu, RefreshCw } from "lucide-react";

const Dashboard = () => {
  const { players, selectedPlayer, selectPlayer, loading, error, refreshData } = usePlayerData();
  const [showSidebar, setShowSidebar] = useState(true);

  const handleRefresh = () => {
    refreshData();
  };

  return (
    <div className="flex h-screen bg-club-black text-club-light-gray">
      {showSidebar && <DashboardSidebar />}
      
      <div className="flex-1 overflow-auto">
        <header className="border-b border-club-gold/20 bg-club-black sticky top-0 z-10">
          <div className="flex justify-between items-center px-6 py-4">
            <div>
              <h1 className="text-xl font-bold text-club-gold">Player Analytics Dashboard</h1>
              <p className="text-sm text-club-light-gray/70">View detailed statistics for each player</p>
            </div>
            
            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                size="icon"
                className="text-club-light-gray border-club-gold/20 hover:bg-club-gold/10 hover:text-club-gold"
                onClick={handleRefresh}
                title="Refresh player data"
              >
                <RefreshCw size={18} />
              </Button>
              <button
                onClick={() => setShowSidebar(!showSidebar)}
                className="p-2 rounded-md text-club-light-gray hover:bg-club-gold/10 hover:text-club-gold transition-colors"
              >
                <Menu size={20} />
              </button>
            </div>
          </div>
        </header>
        
        <main className="p-6">
          <Card className="border-club-gold/20 bg-club-dark-gray mb-6">
            <CardHeader className="pb-3">
              <CardTitle className="text-club-gold text-lg">Player Selection</CardTitle>
              <CardDescription>Choose a player to view their analytics</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-10 w-full bg-club-gold/10" />
              ) : players.length > 0 ? (
                <Select
                  value={selectedPlayer?.id.toString()}
                  onValueChange={(value) => selectPlayer(parseInt(value))}
                >
                  <SelectTrigger className="bg-club-black border-club-gold/30 focus:ring-club-gold/30">
                    <SelectValue placeholder="Select a player" />
                  </SelectTrigger>
                  <SelectContent className="bg-club-dark-gray border-club-gold/30">
                    {players.map((player) => (
                      <SelectItem 
                        key={player.id} 
                        value={player.id.toString()}
                        className="focus:bg-club-gold/20 focus:text-club-gold"
                      >
                        {player.name} - {player.position}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <Alert className="bg-club-gold/10 border-club-gold/30">
                  <AlertDescription>
                    No players available. Check database connection.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {loading ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                  <Skeleton key={i} className="h-24 w-full bg-club-gold/10" />
                ))}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Skeleton className="h-64 w-full md:col-span-2 bg-club-gold/10" />
                <Skeleton className="h-64 w-full bg-club-gold/10" />
              </div>
            </div>
          ) : error ? (
            <Alert className="bg-club-gold/10 border-club-gold/30">
              <AlertDescription className="flex flex-col gap-4">
                <p>{error}</p>
                <Button 
                  variant="outline" 
                  className="w-fit border-club-gold/30 hover:bg-club-gold/10 hover:text-club-gold"
                  onClick={handleRefresh}
                >
                  <RefreshCw size={16} className="mr-2" />
                  Retry Loading Data
                </Button>
              </AlertDescription>
            </Alert>
          ) : players.length > 0 && selectedPlayer ? (
            <PlayerStats player={selectedPlayer} />
          ) : (
            <Alert className="bg-club-gold/10 border-club-gold/30">
              <AlertDescription className="flex flex-col gap-4">
                <p>No player data found. Please check your Supabase database connection or add players to your database.</p>
                <Button 
                  variant="outline" 
                  className="w-fit border-club-gold/30 hover:bg-club-gold/10 hover:text-club-gold"
                  onClick={handleRefresh}
                >
                  <RefreshCw size={16} className="mr-2" />
                  Retry Loading Data
                </Button>
              </AlertDescription>
            </Alert>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
