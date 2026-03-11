export interface PlayerStats {
  name: string;
  team: string;
  position: string;
  gamesPlayed: number;
  goals: number;
  assists: number;
  points: number;
  pointsPerGame: number;
  corsiForPercentage: number;
  expectedGoalsForPercentage: number;
  defensivePointShares: number;
  timeOnIcePerGame: string;
  hits: number;
  blocks: number;
}

export interface ComparisonResult {
  players: PlayerStats[];
  winner: string;
  summary: string;
  marginOfVictory: "Slight" | "Moderate" | "Significant" | "Dominant";
  keyDifferences: string[];
}
