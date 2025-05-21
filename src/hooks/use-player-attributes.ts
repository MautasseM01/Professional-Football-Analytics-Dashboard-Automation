
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Player } from "@/types";
import { toast } from "@/components/ui/sonner";

export type PlayerAttributes = {
  id: number;
  player_id: number;
  finishing: number;
  aerial_duels_won: number;
  holdup_play: number;
  pace: number;
  work_rate_attacking: number;
  created_at?: string;
  updated_at?: string;
}

export type PositionalAverage = {
  id: number;
  position: string;
  finishing: number;
  aerial_duels_won: number;
  holdup_play: number;
  pace: number;
  work_rate_attacking: number;
  created_at?: string;
  updated_at?: string;
}

export const usePlayerAttributes = (player: Player | null) => {
  const [attributes, setAttributes] = useState<PlayerAttributes | null>(null);
  const [positionalAverage, setPositionalAverage] = useState<PositionalAverage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!player) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        // Fetch player attributes
        const { data: playerAttrData, error: playerAttrError } = await supabase
          .from('player_attributes')
          .select('*')
          .eq('player_id', player.id)
          .single();

        if (playerAttrError) {
          throw new Error(`Error fetching player attributes: ${playerAttrError.message}`);
        }

        setAttributes(playerAttrData as PlayerAttributes);

        // Fetch positional average for strikers (or the player's position if available)
        const position = player.position || 'Striker';
        
        const { data: avgData, error: avgError } = await supabase
          .from('positional_averages')
          .select('*')
          .eq('position', position)
          .single();

        if (avgError) {
          console.warn(`Warning: Could not fetch positional average: ${avgError.message}`);
        } else {
          setPositionalAverage(avgData as PositionalAverage);
        }

      } catch (err: any) {
        console.error('Error in usePlayerAttributes:', err);
        setError(err.message);
        toast({
          title: "Data fetch error",
          description: `Could not load player attributes: ${err.message}`,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [player]);

  return { attributes, positionalAverage, loading, error };
};
