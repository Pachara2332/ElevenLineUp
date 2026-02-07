
export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Player {
  id: string;
  name: string;
  position: string;
  teamId: string;
  image: string;
}

export interface Team {
  id: string;
  name: string;
  logo: string;
  players: Player[];
}

export interface LineupSlot {
  id: string;
  position: string;
  x: number;
  y: number;
  player?: Player;
}

export interface Lineup {
  id: string;
  name: string;
  formation: string;
  teamId: string;
  slots: LineupSlot[];
}
