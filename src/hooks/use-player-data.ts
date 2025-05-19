import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Player } from "@/types";
import { toast } from "@/components/ui/sonner";
import { useToast } from "@/hooks/use-toast";

// Demo player data
const DEMO_PLAYERS: Player[] = [
  {
    id: 1,
    name: "Marcus Johnson",
    position: "Forward",
    matches: 12,
    distance: 124.5,
    passes_attempted: 342,
    passes_completed: 297,
    shots_total: 28,
    shots_on_target: 17,
    tackles_attempted: 45,
    tackles_won: 32,
    heatmapUrl: "https://i.imgur.com/dNXW5pT.png",
    reportUrl: "https://example.com/reports/player1.pdf"
  },
  {
    id: 2,
    name: "Alex Thompson",
    position: "Midfielder",
    matches: 14,
    distance: 156.2,
    passes_attempted: 512,
    passes_completed: 478,
    shots_total: 12,
    shots_on_target: 5,
    tackles_attempted: 78,
    tackles_won: 52,
    heatmapUrl: "https://i.imgur.com/PDwZzv5.png",
    reportUrl: "https://example.com/reports/player2.pdf"
  },
  {
    id: 3,
    name: "David Rodriguez",
    position: "Defender",
    matches: 15,
    distance: 132.8,
    passes_attempted: 265,
    passes_completed: 241,
    shots_total: 4,
    shots_on_target: 1,
    tackles_attempted: 126,
    tackles_won: 98,
    heatmapUrl: "https://i.imgur.com/3b7I4RR.png",
    reportUrl: "https://example.com/reports/player3.pdf"
  }
];

export const usePlayerData = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast: uiToast } = useToast();
  
  const fetchPlayers = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log("Fetching players from Supabase...");
      const { data, error } = await supabase
        .from("players")
        .select("*");
      
      if (error) {
        throw error;
      }
      
      console.log("Players data received:", data);
      
      if (data && data.length > 0) {
        // Make sure we're mapping the data correctly based on the actual column names
        const mappedPlayers = data.map(player => ({
          id: player.id,
          name: player.name || '',
          position: player.position || '',
          matches: player.matches || 0,
          distance: player.distance || 0,
          passes_attempted: player.passes_attempted || 0,
          passes_completed: player.passes_completed || 0,
          shots_total: player.shots_total || 0,
          shots_on_target: player.shots_on_target || 0,
          tackles_attempted: player.tackles_attempted || 0,
          tackles_won: player.tackles_won || 0,
          heatmapUrl: player.heatmapUrl || '',
          reportUrl: player.reportUrl || ''
        })) as Player[];
        
        console.log("Mapped player data:", mappedPlayers);
        setPlayers(mappedPlayers);
        // Set the first player as selected by default
        setSelectedPlayer(mappedPlayers[0]);
        toast("Player data loaded successfully!");
      } else {
        console.log("No players found in the database, using demo data");
        // Fallback to demo data if no players found
        setPlayers(DEMO_PLAYERS);
        setSelectedPlayer(DEMO_PLAYERS[0]);
        toast("No data found in Supabase. Using demo data instead!");
      }
    } catch (error: any) {
      console.error("Error fetching players:", error);
      setError(error.message || "Failed to fetch players");
      
      // Fallback to demo data on error
      console.log("Using demo data as fallback due to error");
      setPlayers(DEMO_PLAYERS);
      setSelectedPlayer(DEMO_PLAYERS[0]);
      
      uiToast({
        title: "Data Fetch Error",
        description: "Failed to load player data from Supabase: " + error.message + ". Using demo data instead.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchPlayers();
    
    // Set up a subscription to player changes
    const playersSubscription = supabase
      .channel('public:players')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'players' 
      }, (payload) => {
        console.log('Players table changed, payload:', payload);
        fetchPlayers();
      })
      .subscribe();
    
    return () => {
      playersSubscription.unsubscribe();
    };
  }, []);
  
  const selectPlayer = (id: number) => {
    const player = players.find(p => p.id === id);
    if (player) {
      setSelectedPlayer(player);
    }
  };
  
  return {
    players,
    selectedPlayer,
    selectPlayer,
    loading,
    error,
    refreshData: fetchPlayers
  };
};
