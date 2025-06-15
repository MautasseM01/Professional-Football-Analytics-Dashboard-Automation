
import { Player } from "@/types";

export const formatPercentage = (value: number): string => {
  return `${value.toFixed(1)}%`;
};

export const getPassCompletionPercentage = (player: Player): number => {
  if (!player.passes_attempted || player.passes_attempted === 0) return 0;
  return (player.passes_completed / player.passes_attempted) * 100;
};

export const getHighestValuesInRow = (
  selectedPlayers: Player[], 
  statFunction: (player: Player) => number | null | undefined
) => {
  if (!selectedPlayers.length) return {};
  
  const validValues = selectedPlayers
    .map(player => ({ id: player.id, value: statFunction(player) }))
    .filter(item => item.value !== null && item.value !== undefined);
    
  if (!validValues.length) return {};
  
  const maxValue = Math.max(...validValues.map(item => Number(item.value)));
  
  return validValues.reduce((acc, item) => {
    if (Number(item.value) === maxValue) {
      acc[item.id] = true;
    }
    return acc;
  }, {} as Record<number, boolean>);
};

export const prepareRadarData = (selectedPlayers: Player[]) => {
  console.log("prepareRadarData called with players:", selectedPlayers);
  
  if (!selectedPlayers || selectedPlayers.length === 0) {
    console.log("No players provided to prepareRadarData");
    return [];
  }

  // Find max values to normalize data (ensure we don't divide by 0)
  const maxValues = {
    distance: Math.max(...selectedPlayers.map(p => p.distance || 0), 1),
    shots_on_target: Math.max(...selectedPlayers.map(p => p.shots_on_target || 0), 1),
    passes_completed: Math.max(...selectedPlayers.map(p => p.passes_completed || 0), 1),
    tackles_won: Math.max(...selectedPlayers.map(p => p.tackles_won || 0), 1)
  };

  console.log("Max values for normalization:", maxValues);

  // Create the base data structure
  const radarData = [
    { category: "Distance", fullMark: 100 },
    { category: "Shots on Target", fullMark: 100 },
    { category: "Passes Completed", fullMark: 100 },
    { category: "Tackles Won", fullMark: 100 }
  ];

  // Add each player's data to each category
  selectedPlayers.forEach((player, playerIndex) => {
    console.log(`Processing player ${player.name} (${playerIndex})`);
    
    // Distance
    const distanceValue = player.distance ? (player.distance / maxValues.distance) * 100 : 0;
    radarData[0][player.name] = Math.round(distanceValue);
    
    // Shots on Target
    const shotsValue = player.shots_on_target ? (player.shots_on_target / maxValues.shots_on_target) * 100 : 0;
    radarData[1][player.name] = Math.round(shotsValue);
    
    // Passes Completed
    const passesValue = player.passes_completed ? (player.passes_completed / maxValues.passes_completed) * 100 : 0;
    radarData[2][player.name] = Math.round(passesValue);
    
    // Tackles Won
    const tacklesValue = player.tackles_won ? (player.tackles_won / maxValues.tackles_won) * 100 : 0;
    radarData[3][player.name] = Math.round(tacklesValue);
    
    console.log(`Player ${player.name} normalized values:`, {
      distance: distanceValue,
      shots: shotsValue,
      passes: passesValue,
      tackles: tacklesValue
    });
  });

  console.log("Final radar data:", radarData);
  return radarData;
};
