
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
        setAttributes(null);
        setPositionalAverage(null);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        console.log('Fetching attributes for player:', player.id, player.name);
        
        // Fetch player attributes - use maybeSingle() to handle no results gracefully
        const { data: playerAttrData, error: playerAttrError } = await supabase
          .from('player_attributes')
          .select('*')
          .eq('player_id', player.id)
          .maybeSingle();

        if (playerAttrError) {
          console.error('Player attributes error:', playerAttrError);
          throw new Error(`Error fetching player attributes: ${playerAttrError.message}`);
        }

        console.log('Player attributes data:', playerAttrData);
        setAttributes(playerAttrData as PlayerAttributes);

        // Fetch positional average for the player's position
        const position = player.position || 'Striker';
        console.log('Fetching positional average for position:', position);
        
        const { data: avgData, error: avgError } = await supabase
          .from('positional_averages')
          .select('*')
          .eq('position', position)
          .maybeSingle();

        if (avgError) {
          console.warn(`Warning: Could not fetch positional average: ${avgError.message}`);
        } else {
          console.log('Positional average data:', avgData);
          setPositionalAverage(avgData as PositionalAverage);
        }

      } catch (err: any) {
        console.error('Error in usePlayerAttributes:', err);
        setError(err.message);
        toast("Data fetch error", {
          description: `Could not load player attributes: ${err.message}`,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [player?.id]); // Depend on player.id instead of entire player object

  return { attributes, positionalAverage, loading, error };
};
