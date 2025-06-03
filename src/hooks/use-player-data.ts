
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Player } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { useUserProfile } from "@/hooks/use-user-profile";
import { toast } from "@/components/ui/sonner";

export const usePlayerData = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast: uiToast } = useToast();
  const { profile } = useUserProfile();
  
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
        console.log("First player structure:", data[0]);
        console.log("Player numbers in database:", data.map(p => ({ name: p.name, id: p.id, number: p.number })));
        
        // Apply role-based filtering
        let filteredData = data as Player[];
        
        if (profile?.role === 'player') {
          // Players can only see their own data
          // Assuming player profile has a player_id field or we match by email/name
          // For now, we'll show first player as demo - in real app, match by user profile
          filteredData = data.slice(0, 1) as Player[];
          console.log("Player role: showing only own data");
        }
        
        setPlayers(filteredData);
        
        // Set the first available player as selected by default
        if (filteredData.length > 0) {
          setSelectedPlayer(filteredData[0] as Player);
        }
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
    // Only fetch data if profile is loaded
    if (profile) {
      fetchPlayers();
    }
  }, [profile]);
  
  useEffect(() => {
    if (!profile) return;
    
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
  }, [profile]);
  
  const selectPlayer = (id: number) => {
    const player = players.find(p => p.id === id);
    if (player) {
      // Check role-based access
      if (profile?.role === 'player' && players.length === 1 && player.id !== players[0].id) {
        uiToast({
          title: "Access Denied",
          description: "You can only view your own player data.",
          variant: "destructive",
        });
        return;
      }
      
      console.log(`Selected player: ${player.name}, Number: ${player.number}`);
      setSelectedPlayer(player);
    }
  };
  
  const canAccessPlayerData = (playerId: number): boolean => {
    if (!profile) return false;
    
    switch (profile.role) {
      case 'admin':
      case 'management':
      case 'coach':
      case 'analyst':
      case 'performance_director':
        return true;
      case 'player':
        // Players can only access their own data
        return players.length === 1 && players[0].id === playerId;
      default:
        return false;
    }
  };
  
  return {
    players,
    selectedPlayer,
    selectPlayer,
    loading,
    error,
    refreshData: fetchPlayers,
    canAccessPlayerData
  };
};
