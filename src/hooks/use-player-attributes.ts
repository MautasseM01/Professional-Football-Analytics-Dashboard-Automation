
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Player } from "@/types";
import { toast } from "sonner";

export interface PlayerAttributes {
  id: number;
  player_id: number;
  // Physical attributes
  pace: number;
  acceleration: number;
  speed: number;
  agility: number;
  strength: number;
  stamina: number;
  jumping: number;
  // Technical attributes
  finishing: number;
  heading: number;
  crossing: number;
  passing: number;
  ball_control: number;
  dribbling: number;
  tackling: number;
  marking: number;
  positioning: number;
  vision: number;
  // Mental attributes
  decision_making: number;
  mental_strength: number;
  leadership: number;
  communication: number;
  // Work rates and playing style
  work_rate_attacking: number;
  work_rate_defensive: number;
  aerial_duels_won: number;
  holdup_play: number;
  // Other attributes
  preferred_foot: string;
  weak_foot_rating: number;
  skill_moves_rating: number;
  created_at?: string;
  updated_at?: string;
}

export interface PositionalAverage {
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
        console.log('Fetching enhanced attributes for player:', player.id, player.name);
        
        // Fetch all player attributes
        const { data: playerAttrData, error: playerAttrError } = await supabase
          .from('player_attributes')
          .select('*')
          .eq('player_id', player.id)
          .maybeSingle();

        if (playerAttrError) {
          console.error('Player attributes error:', playerAttrError);
          // Don't throw error if no attributes found, just log warning
          console.warn(`No attributes found for player ${player.id}: ${playerAttrError.message}`);
        }

        // Transform the data to match our interface
        let transformedAttributes: PlayerAttributes | null = null;
        if (playerAttrData) {
          transformedAttributes = {
            id: playerAttrData.id,
            player_id: playerAttrData.player_id,
            // Physical attributes
            pace: playerAttrData.pace || 50,
            acceleration: playerAttrData.acceleration || 50,
            speed: playerAttrData.speed || 50,
            agility: playerAttrData.agility || 50,
            strength: playerAttrData.strength || 50,
            stamina: playerAttrData.stamina || 50,
            jumping: playerAttrData.jumping || 50,
            // Technical attributes
            finishing: playerAttrData.finishing || 50,
            heading: playerAttrData.heading || 50,
            crossing: playerAttrData.crossing || 50,
            passing: playerAttrData.passing || 50,
            ball_control: playerAttrData.ball_control || 50,
            dribbling: playerAttrData.dribbling || 50,
            tackling: playerAttrData.tackling || 50,
            marking: playerAttrData.marking || 50,
            positioning: playerAttrData.positioning || 50,
            vision: playerAttrData.vision || 50,
            // Mental attributes
            decision_making: playerAttrData.decision_making || 50,
            mental_strength: playerAttrData.mental_strength || 50,
            leadership: playerAttrData.leadership || 50,
            communication: playerAttrData.communication || 50,
            // Work rates and playing style
            work_rate_attacking: playerAttrData.work_rate_attacking || 50,
            work_rate_defensive: playerAttrData.work_rate_defensive || 50,
            aerial_duels_won: playerAttrData.aerial_duels_won || 50,
            holdup_play: playerAttrData.holdup_play || 50,
            // Other attributes
            preferred_foot: playerAttrData.preferred_foot || 'Right',
            weak_foot_rating: playerAttrData.weak_foot_rating || 3,
            skill_moves_rating: playerAttrData.skill_moves_rating || 3,
            created_at: playerAttrData.created_at,
            updated_at: playerAttrData.updated_at,
          };
        }

        console.log('Enhanced player attributes data:', transformedAttributes);
        setAttributes(transformedAttributes);

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
        toast.error(`Could not load player attributes: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [player?.id]);

  return { attributes, positionalAverage, loading, error };
};
