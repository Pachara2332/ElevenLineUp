export interface User {
  userId: string;
  name: string;
  email: string;
}

export interface Player {
  id: string; // Player ID from JSON/External API might still be 'id', let's check seed.ts regarding players. 
  // In seed.ts players have 'id'. In schema, players is Json. So this persists as 'id'.
  name: string;
  position: string;
  teamId: string;
  image: string;
}

export interface Team {
  teamId: string;
  name: string;
  league: string;
  logo: string;
  players: Player[];
}

export interface LineupSlot {
  slotId?: string; // Optional because templates don't have DB IDs yet.
  id: string; // Kept as id for UI (dnd-kit)
  position: string;
  x: number;
  y: number;
  player?: Player;
}

export interface Lineup {
  lineupId: string;
  name: string;
  formation: string;
  teamId: string;
  slots: LineupSlot[];
}
