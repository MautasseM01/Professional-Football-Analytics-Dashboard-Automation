
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Player } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { toast } from "@/components/ui/sonner";

export const usePlayerData = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast: uiToast } = useToast();
  
  const fetchPlayers = async () => {
    setLoading(true);
    try {
      console.log("Fetching data from players table...");
      
      const { data, error: fetchError } = await supabase
        .from("players")
        .select("*");
      
      if (fetchError) {
        throw fetchError;
      }
      
      console.log("Players data received:", data);
      
      if (data && data.length > 0) {
        // Log the first player to see its structure
        console.log("First player structure:", data[0]);
        
        // IMPORTANT: Always use the data from Supabase, no hardcoded override
        setPlayers(data as Player[]);
        
        // Set the first player as selected by default
        setSelectedPlayer(data[0] as Player);
      } else {
        console.log("No data found in the players table");
        toast("No player data found in the Supabase players table");
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
      }, () => {
        console.log('Players table changed, refreshing data');
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
