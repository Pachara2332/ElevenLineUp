import { create } from "zustand";
import { formations } from "@/lib/formations";


type Slot = {
  id: string;
  role: string;
  x: number;
  y: number;
  playerId?: string | null;
};

type LineupState = {
  formationName: string;
  slots: Slot[];
  setFormation: (name: string) => void;
  reset: () => void;
  assignPlayer: (slotId: string, playerId: string) => void;
};

function buildSlots(name: string): Slot[] {
  return formations[name].map((p, i) => ({
    id: `${p.role}-${i}`,
    role: p.role,
    x: p.x,
    y: p.y,
    playerId: null,
  }));
}

export const useLineupStore = create<LineupState>((set) => ({
  formationName: "4-3-3",
  slots: buildSlots("4-3-3"),

  setFormation: (name) =>
    set({
      formationName: name,
      slots: buildSlots(name),
    }),

  reset: () =>
    set({
      formationName: "4-3-3",
      slots: buildSlots("4-3-3"),
    }),

  assignPlayer: (slotId: string, playerId: string) =>
    set((state) => ({
      slots: state.slots.map((s) =>
        s.id === slotId ? { ...s, playerId } : s
      ),
    })),

}));
