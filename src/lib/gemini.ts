import { GoogleGenAI, Type } from "@google/genai";
import { ComparisonResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function comparePlayers(playerNames: string[]): Promise<ComparisonResult> {
  const prompt = `
    You are an expert NHL analyst and statistician.
    Compare the following NHL players head-to-head using their most recent full season or career average stats (if retired).
    Players to compare: ${playerNames.join(', ')}.
    
    Provide a detailed statistical comparison including standard stats (goals, assists, points) and advanced stats (points per game, Corsi For %, Expected Goals For %, Defensive Point Shares, Time on Ice, Hits, Blocks).
    Determine who is the better player overall and by how much (margin of victory).
    Provide a summary explaining your reasoning and key differences.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3.1-pro-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          players: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                team: { type: Type.STRING, description: "Current or most notable team" },
                position: { type: Type.STRING },
                gamesPlayed: { type: Type.NUMBER },
                goals: { type: Type.NUMBER },
                assists: { type: Type.NUMBER },
                points: { type: Type.NUMBER },
                pointsPerGame: { type: Type.NUMBER },
                corsiForPercentage: { type: Type.NUMBER, description: "Corsi For % (CF%)" },
                expectedGoalsForPercentage: { type: Type.NUMBER, description: "Expected Goals For % (xGF%)" },
                defensivePointShares: { type: Type.NUMBER, description: "Defensive Point Shares (DPS)" },
                timeOnIcePerGame: { type: Type.STRING, description: "Format MM:SS" },
                hits: { type: Type.NUMBER },
                blocks: { type: Type.NUMBER }
              },
              required: ["name", "team", "position", "gamesPlayed", "goals", "assists", "points", "pointsPerGame", "corsiForPercentage", "expectedGoalsForPercentage", "defensivePointShares", "timeOnIcePerGame", "hits", "blocks"]
            }
          },
          winner: { type: Type.STRING, description: "Name of the winning player" },
          summary: { type: Type.STRING, description: "Detailed explanation of why the winner was chosen" },
          marginOfVictory: { type: Type.STRING, description: "One of: Slight, Moderate, Significant, Dominant" },
          keyDifferences: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "List of 3-4 key statistical or stylistic differences"
          }
        },
        required: ["players", "winner", "summary", "marginOfVictory", "keyDifferences"]
      }
    }
  });

  const text = response.text;
  if (!text) {
    throw new Error("Failed to generate comparison.");
  }

  return JSON.parse(text) as ComparisonResult;
}
