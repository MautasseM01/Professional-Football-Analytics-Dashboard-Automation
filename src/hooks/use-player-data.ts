
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Player } from "@/types";
import { useToast } from "@/hooks/use-toast";

export const usePlayerData = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  
  const fetchPlayers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from("players").select("*");
      
      if (error) {
        throw error;
      }
      
      if (data) {
        setPlayers(data as Player[]);
        // Set the first player as selected by default if available
        if (data.length > 0 && !selectedPlayer) {
          setSelectedPlayer(data[0] as Player);
        }
      }
    } catch (error: any) {
      console.error("Error fetching players:", error);
      setError(error.message || "Failed to fetch players");
      toast({
        title: "Data Fetch Error",
        description: "Failed to load player data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchPlayers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
