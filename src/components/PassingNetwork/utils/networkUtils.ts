
export const getEdgeColor = (count: number, connections: { count: number }[]): string => {
  const maxCount = Math.max(...(connections.length ? connections.map(c => c.count) : [1]));
  const intensity = Math.min(0.2 + (count / maxCount) * 0.8, 1);
  return `rgba(212, 175, 55, ${intensity})`; // Gold color with varying opacity
};

export const getEdgeWidth = (count: number, connections: { count: number }[]): number => {
  const maxCount = Math.max(...(connections.length ? connections.map(c => c.count) : [1]));
  return 1 + (count / maxCount) * 4;
};
