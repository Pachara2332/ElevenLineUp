
import { create } from 'zustand';
import { LineupSlot, Player } from '@/types';

// Formations
const FORMATIONS: Record<string, LineupSlot[]> = {
    '4-3-3': [
        { id: 'gk', position: 'GK', x: 50, y: 90 },
        { id: 'lb', position: 'LB', x: 10, y: 70 },
        { id: 'lcb', position: 'LCB', x: 35, y: 75 },
        { id: 'rcb', position: 'RCB', x: 65, y: 75 },
        { id: 'rb', position: 'RB', x: 90, y: 70 },
        { id: 'lcm', position: 'CM', x: 35, y: 45 },
        { id: 'rcm', position: 'CM', x: 65, y: 45 },
        { id: 'cdm', position: 'CDM', x: 50, y: 60 },
        { id: 'lw', position: 'LW', x: 15, y: 25 },
        { id: 'rw', position: 'RW', x: 85, y: 25 },
        { id: 'st', position: 'ST', x: 50, y: 15 },
    ],
    '4-2-3-1': [
        { id: 'gk', position: 'GK', x: 50, y: 90 },
        { id: 'lb', position: 'LB', x: 10, y: 70 },
        { id: 'lcb', position: 'LCB', x: 35, y: 75 },
        { id: 'rcb', position: 'RCB', x: 65, y: 75 },
        { id: 'rb', position: 'RB', x: 90, y: 70 },
        { id: 'lcdm', position: 'CDM', x: 35, y: 60 },
        { id: 'rcdm', position: 'CDM', x: 65, y: 60 },
        { id: 'cam', position: 'CAM', x: 50, y: 40 },
        { id: 'lm', position: 'LM', x: 15, y: 40 },
        { id: 'rm', position: 'RM', x: 85, y: 40 },
        { id: 'st', position: 'ST', x: 50, y: 15 },
    ],
    '3-4-3': [
        { id: 'gk', position: 'GK', x: 50, y: 90 },
        { id: 'lcb', position: 'CB', x: 25, y: 75 },
        { id: 'cb', position: 'CB', x: 50, y: 80 },
        { id: 'rcb', position: 'CB', x: 75, y: 75 },
        { id: 'lm', position: 'LM', x: 10, y: 50 },
        { id: 'lcm', position: 'CM', x: 40, y: 55 },
        { id: 'rcm', position: 'CM', x: 60, y: 55 },
        { id: 'rm', position: 'RM', x: 90, y: 50 },
        { id: 'lw', position: 'LW', x: 20, y: 25 },
        { id: 'rw', position: 'RW', x: 80, y: 25 },
        { id: 'st', position: 'ST', x: 50, y: 15 },
    ],
    '5-3-2': [
        { id: 'gk', position: 'GK', x: 50, y: 90 },
        { id: 'lwb', position: 'LWB', x: 10, y: 60 },
        { id: 'lcb', position: 'CB', x: 30, y: 75 },
        { id: 'cb', position: 'CB', x: 50, y: 80 },
        { id: 'rcb', position: 'CB', x: 70, y: 75 },
        { id: 'rwb', position: 'RWB', x: 90, y: 60 },
        { id: 'lcm', position: 'CM', x: 35, y: 50 },
        { id: 'rcm', position: 'CM', x: 65, y: 50 },
        { id: 'cdm', position: 'CDM', x: 50, y: 60 },
        { id: 'lst', position: 'ST', x: 35, y: 20 },
        { id: 'rst', position: 'ST', x: 65, y: 20 },
    ],
    '4-1-4-1': [
        { id: 'gk', position: 'GK', x: 50, y: 90 },
        { id: 'lb', position: 'LB', x: 10, y: 70 },
        { id: 'lcb', position: 'CB', x: 35, y: 75 },
        { id: 'rcb', position: 'CB', x: 65, y: 75 },
        { id: 'rb', position: 'RB', x: 90, y: 70 },
        { id: 'cdm', position: 'CDM', x: 50, y: 60 },
        { id: 'lm', position: 'LM', x: 15, y: 40 },
        { id: 'lcm', position: 'CM', x: 35, y: 40 },
        { id: 'rcm', position: 'CM', x: 65, y: 40 },
        { id: 'rm', position: 'RM', x: 85, y: 40 },
        { id: 'st', position: 'ST', x: 50, y: 15 },
    ],
    '3-4-2-1': [
        { id: 'gk', position: 'GK', x: 50, y: 90 },
        { id: 'lcb', position: 'CB', x: 25, y: 75 },
        { id: 'cb', position: 'CB', x: 50, y: 80 },
        { id: 'rcb', position: 'CB', x: 75, y: 75 },
        { id: 'lm', position: 'LM', x: 10, y: 50 },
        { id: 'lcm', position: 'CM', x: 40, y: 60 },
        { id: 'rcm', position: 'CM', x: 60, y: 60 },
        { id: 'rm', position: 'RM', x: 90, y: 50 },
        { id: 'lf', position: 'LF', x: 35, y: 30 },
        { id: 'rf', position: 'RF', x: 65, y: 30 },
        { id: 'st', position: 'ST', x: 50, y: 15 },
    ]
};

interface LineupState {
  slots: LineupSlot[];
  squad: Player[];
  selectedTeamId: string | null;
  selectedSlotId: string | null;
  formation: string;
  
  // Actions
  setSlots: (slots: LineupSlot[]) => void;
  updateSlot: (slotId: string, player: Player) => void;
  setSquad: (players: Player[]) => void;
  setSelectedTeamId: (id: string) => void;
  setSelectedSlotId: (id: string | null) => void;
  setFormation: (formation: string) => void;
  resetLineup: () => void;
  saveLineup: (name: string) => Promise<any>;
  loadLineup: (lineupId: string) => Promise<void>;
}

export const useLineupStore = create<LineupState>((set, get) => ({
  slots: FORMATIONS['4-3-3'],
  squad: [],
  selectedTeamId: null,
  selectedSlotId: null,
  formation: '4-3-3',

  setSlots: (slots) => set({ slots }),
  
  updateSlot: (slotId, player) => 
    set((state) => {
        const targetSlot = state.slots.find(s => s.id === slotId);
        if (!targetSlot) return state;

        // 1. Strict GK Rules
        // Rule A: GK player can ONLY go into a GK slot
        if (player.position === 'GK' && targetSlot.position !== 'GK') {
            return state; // Silently reject
        }
        // Rule B: GK slot can ONLY accept a GK player
        if (targetSlot.position === 'GK' && player.position !== 'GK') {
            return state; // Silently reject
        }

        // 2. Prevent Duplicates (Move player if already on pitch)
        // Remove this player from any other slots they might occupy
        const slotsWithoutPlayer = state.slots.map(slot => 
            (slot.player && slot.player.id === player.id) 
                ? { ...slot, player: undefined } 
                : slot
        );

        // 3. Place player in target slot
        return {
            slots: slotsWithoutPlayer.map((slot) => 
                slot.id === slotId ? { ...slot, player } : slot
            ),
            selectedSlotId: null, // Clear selection
        };
    }),

  setSquad: (squad) => set({ squad }),
  
  setSelectedTeamId: (id) => set({ selectedTeamId: id }),
  
  setSelectedSlotId: (id) => set({ selectedSlotId: id }),

  setFormation: (formation) => set((state) => {
      const newSlots = FORMATIONS[formation];
      if (!newSlots) return state;

      const currentPlayers = state.slots.reduce((acc, slot) => {
          if (slot.player) acc[slot.id] = slot.player;
          return acc;
      }, {} as Record<string, Player>);

      const mappedSlots = newSlots.map(slot => ({
          ...slot,
          player: currentPlayers[slot.id]
      }));

      return { formation, slots: mappedSlots, selectedSlotId: null };
  }),
  
  resetLineup: () => set({ slots: FORMATIONS['4-3-3'], selectedTeamId: null, squad: [], selectedSlotId: null, formation: '4-3-3' }),

  saveLineup: async (name: string) => {
      const state = get();
      if (!state.selectedTeamId) throw new Error("No team selected");

      const payload = {
          name,
          teamId: state.selectedTeamId,
          formation: state.formation,
          slots: state.slots,
      };

      const res = await fetch('/api/lineups', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Failed to save lineup');
      return await res.json();
  },

  // ✅ ใหม่ - โหลดแผนเฉยๆ ไม่ดาวน์โหลด PDF
loadLineup: async (id: string) => {
  try {
    const res = await fetch(`/api/lineups/${id}`);
    if (!res.ok) {
      throw new Error('Failed to load lineup');
    }
    
    const { data } = await res.json();
    
    // Update formation
    set({ formation: data.formation });
    
    // Map slots back to state structure
    const loadedSlots = data.slots.map((slot: any) => ({
      id: slot.slotId || slot.id, // รองรับทั้ง slotId (ถ้ามี) และ id
      position: slot.position,
      x: slot.x,
      y: slot.y,
      player: slot.playerId ? {
        id: slot.playerId,
        name: slot.playerName || 'Unknown',
        image: slot.playerImage || null,
      } : null,
    }));
    
    // Update slots in store
    set({ slots: loadedSlots });
    
    console.log('✅ Lineup loaded successfully:', data.name);
    
  } catch (error) {
    console.error('❌ Failed to load lineup:', error);
    throw error;
  }
}

}));
