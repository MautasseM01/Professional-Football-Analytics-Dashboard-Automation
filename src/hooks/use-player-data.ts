
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
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
      console.log("Fetching players from Supabase...");
      
      // Make sure we're using the correct client from integrations
      const { data, error: fetchError } = await supabase
        .from("players")
        .select("*");
      
      if (fetchError) {
        throw fetchError;
      }
      
      console.log("Players data received:", data);
      
      if (data && data.length > 0) {
        setPlayers(data as Player[]);
        // Set the first player as selected by default
        setSelectedPlayer(data[0] as Player);
      } else {
        console.log("No players found in the database");
        toast("No player data found in the Supabase database");
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
