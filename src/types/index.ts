export interface User {
  userId: string;
  name: string;
  email: string;
}

export interface Player {
  id: string;
  name: string;
  position: string;
  teamId?: string;
  image?: string | null;
  nationality?: string;
  dateOfBirth?: string;
  height?: number;
  foot?: string;
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
  player?: Player | null;
}

export interface Lineup {
  lineupId: string;
  name: string;
  formation: string;
  teamId: string;
  slots: LineupSlot[];
}
