
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Player } from "@/types";
import { toast } from "@/components/ui/sonner";
import { useToast } from "@/hooks/use-toast";

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
        console.log("No players found in the database");
        toast("No player data found in the Supabase database");
        setError("No player data available");
      }
    } catch (error: any) {
      console.error("Error fetching players:", error);
      setError(error.message || "Failed to fetch players");
      uiToast({
        title: "Data Fetch Error",
        description: "Failed to load player data: " + error.message,
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
