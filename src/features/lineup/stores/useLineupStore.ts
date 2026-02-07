
import { create } from 'zustand';
import { LineupSlot, Player } from '@/types';

// Initial positions for a 4-3-3 formation
const INITIAL_SLOTS: LineupSlot[] = [
    { id: 'gk', position: 'GK', x: 50, y: 90 },
    { id: 'lcb', position: 'LCB', x: 30, y: 75 },
    { id: 'rcb', position: 'RCB', x: 70, y: 75 },
    { id: 'lb', position: 'LB', x: 10, y: 60 },
    { id: 'rb', position: 'RB', x: 90, y: 60 },
    { id: 'cm', position: 'CM', x: 50, y: 50 },
    { id: 'lw', position: 'LW', x: 20, y: 30 },
    { id: 'rw', position: 'RW', x: 80, y: 30 },
    { id: 'st', position: 'ST', x: 50, y: 15 },
];

interface LineupState {
  slots: LineupSlot[];
  squad: Player[];
  selectedTeamId: string | null;
  
  // Actions
  setSlots: (slots: LineupSlot[]) => void;
  updateSlot: (slotId: string, player: Player) => void;
  setSquad: (players: Player[]) => void;
  setSelectedTeamId: (id: string) => void;
  resetLineup: () => void;
}

export const useLineupStore = create<LineupState>((set) => ({
  slots: INITIAL_SLOTS,
  squad: [],
  selectedTeamId: null,

  setSlots: (slots) => set({ slots }),
  
  updateSlot: (slotId, player) => 
    set((state) => ({
      slots: state.slots.map((slot) => 
        slot.id === slotId ? { ...slot, player } : slot
      ),
    })),

  setSquad: (squad) => set({ squad }),
  
  setSelectedTeamId: (id) => set({ selectedTeamId: id }),
  
  resetLineup: () => set({ slots: INITIAL_SLOTS, selectedTeamId: null, squad: [] }),
}));
