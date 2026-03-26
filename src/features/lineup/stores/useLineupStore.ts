import { create } from "zustand";
import { LineupSlot, Player } from "@/types";

// Formations - แบ่งตามจำนวนกองหลัง
const FORMATIONS: Record<string, LineupSlot[]> = {
  // ===== 2 Defenders (Historical) =====
  "2-3-5": [
    { id: "gk", position: "GK", x: 50, y: 90 },
    { id: "lb", position: "LB", x: 30, y: 75 },
    { id: "rb", position: "RB", x: 70, y: 75 },
    { id: "lhm", position: "LCM", x: 25, y: 60 },
    { id: "cm", position: "CM", x: 50, y: 60 },
    { id: "rhm", position: "RCM", x: 75, y: 60 },
    { id: "lw", position: "LW", x: 10, y: 30 },
    { id: "lf", position: "LF", x: 30, y: 25 },
    { id: "cf", position: "CF", x: 50, y: 20 },
    { id: "rf", position: "RF", x: 70, y: 25 },
    { id: "rw", position: "RW", x: 90, y: 30 },
  ],
  "2-3-2-3": [
    { id: "gk", position: "GK", x: 50, y: 90 },
    { id: "lb", position: "LB", x: 30, y: 75 },
    { id: "rb", position: "RB", x: 70, y: 75 },
    { id: "lhm", position: "LCM", x: 25, y: 60 },
    { id: "cm", position: "CM", x: 50, y: 60 },
    { id: "rhm", position: "RCM", x: 75, y: 60 },
    { id: "lam", position: "LAM", x: 30, y: 40 },
    { id: "ram", position: "RAM", x: 70, y: 40 },
    { id: "lw", position: "LW", x: 20, y: 20 },
    { id: "cf", position: "CF", x: 50, y: 15 },
    { id: "rw", position: "RW", x: 80, y: 20 },
  ],

  // ===== 3 Defenders =====
  "3-2-5": [
    { id: "gk", position: "GK", x: 50, y: 90 },
    { id: "lcb", position: "LCB", x: 25, y: 75 },
    { id: "cb", position: "CB", x: 50, y: 80 },
    { id: "rcb", position: "RCB", x: 75, y: 75 },
    { id: "lhm", position: "LCM", x: 35, y: 60 },
    { id: "rhm", position: "RCM", x: 65, y: 60 },
    { id: "lw", position: "LW", x: 10, y: 30 },
    { id: "lf", position: "LF", x: 30, y: 25 },
    { id: "cf", position: "CF", x: 50, y: 20 },
    { id: "rf", position: "RF", x: 70, y: 25 },
    { id: "rw", position: "RW", x: 90, y: 30 },
  ],
  "3-2-2-3": [
    { id: "gk", position: "GK", x: 50, y: 90 },
    { id: "lcb", position: "LCB", x: 25, y: 75 },
    { id: "cb", position: "CB", x: 50, y: 80 },
    { id: "rcb", position: "RCB", x: 75, y: 75 },
    { id: "lhm", position: "LCM", x: 35, y: 60 },
    { id: "rhm", position: "RCM", x: 65, y: 60 },
    { id: "lam", position: "LAM", x: 30, y: 40 },
    { id: "ram", position: "RAM", x: 70, y: 40 },
    { id: "lw", position: "LW", x: 20, y: 20 },
    { id: "cf", position: "CF", x: 50, y: 15 },
    { id: "rw", position: "RW", x: 80, y: 20 },
  ],
  "3-2-3-2": [
    { id: "gk", position: "GK", x: 50, y: 90 },
    { id: "lcb", position: "LCB", x: 25, y: 75 },
    { id: "cb", position: "CB", x: 50, y: 80 },
    { id: "rcb", position: "RCB", x: 75, y: 75 },
    { id: "lhm", position: "LCM", x: 35, y: 60 },
    { id: "rhm", position: "RCM", x: 65, y: 60 },
    { id: "lw", position: "LW", x: 20, y: 40 },
    { id: "cam", position: "CAM", x: 50, y: 40 },
    { id: "rw", position: "RW", x: 80, y: 40 },
    { id: "lst", position: "LS", x: 35, y: 18 },
    { id: "rst", position: "RS", x: 65, y: 18 },
  ],
  "3-3-4": [
    { id: "gk", position: "GK", x: 50, y: 90 },
    { id: "lcb", position: "LCB", x: 25, y: 75 },
    { id: "cb", position: "CB", x: 50, y: 80 },
    { id: "rcb", position: "RCB", x: 75, y: 75 },
    { id: "lcm", position: "CM", x: 30, y: 55 },
    { id: "cm", position: "CM", x: 50, y: 55 },
    { id: "rcm", position: "CM", x: 70, y: 55 },
    { id: "lw", position: "LW", x: 15, y: 25 },
    { id: "lf", position: "LF", x: 35, y: 20 },
    { id: "rf", position: "RF", x: 65, y: 20 },
    { id: "rw", position: "RW", x: 85, y: 25 },
  ],
  "3-4-3": [
    { id: "gk", position: "GK", x: 50, y: 90 },
    { id: "lcb", position: "LCB", x: 25, y: 75 },
    { id: "cb", position: "CB", x: 50, y: 80 },
    { id: "rcb", position: "RCB", x: 75, y: 75 },
    { id: "lm", position: "LM", x: 10, y: 50 },
    { id: "lcm", position: "CM", x: 40, y: 55 },
    { id: "rcm", position: "CM", x: 60, y: 55 },
    { id: "rm", position: "RM", x: 90, y: 50 },
    { id: "lw", position: "LW", x: 20, y: 25 },
    { id: "rw", position: "RW", x: 80, y: 25 },
    { id: "st", position: "ST", x: 50, y: 15 },
  ],
  "3-4-2-1": [
    { id: "gk", position: "GK", x: 50, y: 90 },
    { id: "lcb", position: "LCB", x: 25, y: 75 },
    { id: "cb", position: "CB", x: 50, y: 80 },
    { id: "rcb", position: "RCB", x: 75, y: 75 },
    { id: "lm", position: "LM", x: 10, y: 50 },
    { id: "lcm", position: "CM", x: 40, y: 60 },
    { id: "rcm", position: "CM", x: 60, y: 60 },
    { id: "rm", position: "RM", x: 90, y: 50 },
    { id: "lf", position: "LF", x: 35, y: 30 },
    { id: "rf", position: "RF", x: 65, y: 30 },
    { id: "st", position: "ST", x: 50, y: 15 },
  ],
  "3-5-2": [
    { id: "gk", position: "GK", x: 50, y: 90 },
    { id: "lcb", position: "LCB", x: 25, y: 75 },
    { id: "cb", position: "CB", x: 50, y: 80 },
    { id: "rcb", position: "RCB", x: 75, y: 75 },
    { id: "lm", position: "LM", x: 10, y: 50 },
    { id: "lcm", position: "CM", x: 30, y: 50 },
    { id: "cdm", position: "CDM", x: 50, y: 60 },
    { id: "rcm", position: "CM", x: 70, y: 50 },
    { id: "rm", position: "RM", x: 90, y: 50 },
    { id: "lst", position: "ST", x: 35, y: 20 },
    { id: "rst", position: "ST", x: 65, y: 20 },
  ],
  "3-4-1-2": [
    { id: "gk", position: "GK", x: 50, y: 90 },
    { id: "lcb", position: "LCB", x: 25, y: 75 },
    { id: "cb", position: "CB", x: 50, y: 80 },
    { id: "rcb", position: "RCB", x: 75, y: 75 },
    { id: "lm", position: "LM", x: 10, y: 50 },
    { id: "lcm", position: "CM", x: 35, y: 55 },
    { id: "rcm", position: "CM", x: 65, y: 55 },
    { id: "rm", position: "RM", x: 90, y: 50 },
    { id: "cam", position: "CAM", x: 50, y: 35 },
    { id: "lst", position: "ST", x: 35, y: 18 },
    { id: "rst", position: "ST", x: 65, y: 18 },
  ],
  "3-3-1-3": [
    { id: "gk", position: "GK", x: 50, y: 90 },
    { id: "lcb", position: "LCB", x: 25, y: 75 },
    { id: "cb", position: "CB", x: 50, y: 80 },
    { id: "rcb", position: "RCB", x: 75, y: 75 },
    { id: "lcm", position: "CM", x: 30, y: 55 },
    { id: "cm", position: "CM", x: 50, y: 55 },
    { id: "rcm", position: "CM", x: 70, y: 55 },
    { id: "cam", position: "CAM", x: 50, y: 35 },
    { id: "lw", position: "LW", x: 20, y: 25 },
    { id: "st", position: "ST", x: 50, y: 15 },
    { id: "rw", position: "RW", x: 80, y: 25 },
  ],
  "3-2-4-1": [
    { id: "gk", position: "GK", x: 50, y: 90 },
    { id: "lcb", position: "LCB", x: 25, y: 75 },
    { id: "cb", position: "CB", x: 50, y: 80 },
    { id: "rcb", position: "RCB", x: 75, y: 75 },
    { id: "lcdm", position: "CDM", x: 35, y: 60 },
    { id: "rcdm", position: "CDM", x: 65, y: 60 },
    { id: "lm", position: "LM", x: 10, y: 40 },
    { id: "lcam", position: "LAM", x: 35, y: 40 },
    { id: "rcam", position: "RAM", x: 65, y: 40 },
    { id: "rm", position: "RM", x: 90, y: 40 },
    { id: "st", position: "ST", x: 50, y: 15 },
  ],
  "3-6-1": [
    { id: "gk", position: "GK", x: 50, y: 90 },
    { id: "lcb", position: "LCB", x: 25, y: 75 },
    { id: "cb", position: "CB", x: 50, y: 80 },
    { id: "rcb", position: "RCB", x: 75, y: 75 },
    { id: "lm", position: "LM", x: 10, y: 50 },
    { id: "lcm", position: "CM", x: 30, y: 50 },
    { id: "lcdm", position: "CDM", x: 40, y: 60 },
    { id: "rcdm", position: "CDM", x: 60, y: 60 },
    { id: "rcm", position: "CM", x: 70, y: 50 },
    { id: "rm", position: "RM", x: 90, y: 50 },
    { id: "st", position: "ST", x: 50, y: 18 },
  ],
  "3-3-3-1": [
    { id: "gk", position: "GK", x: 50, y: 90 },
    { id: "lcb", position: "LCB", x: 25, y: 75 },
    { id: "cb", position: "CB", x: 50, y: 80 },
    { id: "rcb", position: "RCB", x: 75, y: 75 },
    { id: "lcm", position: "CM", x: 30, y: 55 },
    { id: "cm", position: "CM", x: 50, y: 55 },
    { id: "rcm", position: "CM", x: 70, y: 55 },
    { id: "lw", position: "LW", x: 20, y: 35 },
    { id: "cam", position: "CAM", x: 50, y: 35 },
    { id: "rw", position: "RW", x: 80, y: 35 },
    { id: "st", position: "ST", x: 50, y: 15 },
  ],

  // ===== 4 Defenders =====
  "4-2-4": [
    { id: "gk", position: "GK", x: 50, y: 90 },
    { id: "lb", position: "LB", x: 10, y: 70 },
    { id: "lcb", position: "LCB", x: 35, y: 75 },
    { id: "rcb", position: "RCB", x: 65, y: 75 },
    { id: "rb", position: "RB", x: 90, y: 70 },
    { id: "lcdm", position: "CDM", x: 35, y: 55 },
    { id: "rcdm", position: "CDM", x: 65, y: 55 },
    { id: "lw", position: "LW", x: 15, y: 25 },
    { id: "lf", position: "LF", x: 35, y: 20 },
    { id: "rf", position: "RF", x: 65, y: 20 },
    { id: "rw", position: "RW", x: 85, y: 25 },
  ],
  "4-3-3": [
    { id: "gk", position: "GK", x: 50, y: 90 },
    { id: "lb", position: "LB", x: 10, y: 70 },
    { id: "lcb", position: "LCB", x: 35, y: 75 },
    { id: "rcb", position: "RCB", x: 65, y: 75 },
    { id: "rb", position: "RB", x: 90, y: 70 },
    { id: "lcm", position: "CM", x: 35, y: 45 },
    { id: "rcm", position: "CM", x: 65, y: 45 },
    { id: "cdm", position: "CDM", x: 50, y: 60 },
    { id: "lw", position: "LW", x: 15, y: 25 },
    { id: "rw", position: "RW", x: 85, y: 25 },
    { id: "st", position: "ST", x: 50, y: 15 },
  ],
  "4-4-2": [
    { id: "gk", position: "GK", x: 50, y: 90 },
    { id: "lb", position: "LB", x: 10, y: 70 },
    { id: "lcb", position: "LCB", x: 35, y: 75 },
    { id: "rcb", position: "RCB", x: 65, y: 75 },
    { id: "rb", position: "RB", x: 90, y: 70 },
    { id: "lm", position: "LM", x: 10, y: 45 },
    { id: "lcm", position: "CM", x: 35, y: 50 },
    { id: "rcm", position: "CM", x: 65, y: 50 },
    { id: "rm", position: "RM", x: 90, y: 45 },
    { id: "lst", position: "ST", x: 35, y: 18 },
    { id: "rst", position: "ST", x: 65, y: 18 },
  ],
  "4-4-2-Diamond": [
    { id: "gk", position: "GK", x: 50, y: 90 },
    { id: "lb", position: "LB", x: 10, y: 70 },
    { id: "lcb", position: "LCB", x: 35, y: 75 },
    { id: "rcb", position: "RCB", x: 65, y: 75 },
    { id: "rb", position: "RB", x: 90, y: 70 },
    { id: "cdm", position: "CDM", x: 50, y: 60 },
    { id: "lcm", position: "CM", x: 30, y: 45 },
    { id: "rcm", position: "CM", x: 70, y: 45 },
    { id: "cam", position: "CAM", x: 50, y: 35 },
    { id: "lst", position: "ST", x: 35, y: 18 },
    { id: "rst", position: "ST", x: 65, y: 18 },
  ],
  "4-2-3-1": [
    { id: "gk", position: "GK", x: 50, y: 90 },
    { id: "lb", position: "LB", x: 10, y: 70 },
    { id: "lcb", position: "LCB", x: 35, y: 75 },
    { id: "rcb", position: "RCB", x: 65, y: 75 },
    { id: "rb", position: "RB", x: 90, y: 70 },
    { id: "lcdm", position: "CDM", x: 35, y: 60 },
    { id: "rcdm", position: "CDM", x: 65, y: 60 },
    { id: "cam", position: "CAM", x: 50, y: 40 },
    { id: "lm", position: "LM", x: 15, y: 40 },
    { id: "rm", position: "RM", x: 85, y: 40 },
    { id: "st", position: "ST", x: 50, y: 15 },
  ],
  "4-1-4-1": [
    { id: "gk", position: "GK", x: 50, y: 90 },
    { id: "lb", position: "LB", x: 10, y: 70 },
    { id: "lcb", position: "LCB", x: 35, y: 75 },
    { id: "rcb", position: "RCB", x: 65, y: 75 },
    { id: "rb", position: "RB", x: 90, y: 70 },
    { id: "cdm", position: "CDM", x: 50, y: 60 },
    { id: "lm", position: "LM", x: 15, y: 40 },
    { id: "lcm", position: "CM", x: 35, y: 40 },
    { id: "rcm", position: "CM", x: 65, y: 40 },
    { id: "rm", position: "RM", x: 85, y: 40 },
    { id: "st", position: "ST", x: 50, y: 15 },
  ],
  "4-4-1-1": [
    { id: "gk", position: "GK", x: 50, y: 90 },
    { id: "lb", position: "LB", x: 10, y: 70 },
    { id: "lcb", position: "LCB", x: 35, y: 75 },
    { id: "rcb", position: "RCB", x: 65, y: 75 },
    { id: "rb", position: "RB", x: 90, y: 70 },
    { id: "lm", position: "LM", x: 10, y: 45 },
    { id: "lcm", position: "CM", x: 35, y: 50 },
    { id: "rcm", position: "CM", x: 65, y: 50 },
    { id: "rm", position: "RM", x: 90, y: 45 },
    { id: "cam", position: "CAM", x: 50, y: 30 },
    { id: "st", position: "ST", x: 50, y: 15 },
  ],
  "4-3-2-1": [
    { id: "gk", position: "GK", x: 50, y: 90 },
    { id: "lb", position: "LB", x: 10, y: 70 },
    { id: "lcb", position: "LCB", x: 35, y: 75 },
    { id: "rcb", position: "RCB", x: 65, y: 75 },
    { id: "rb", position: "RB", x: 90, y: 70 },
    { id: "lcm", position: "CM", x: 30, y: 55 },
    { id: "cdm", position: "CDM", x: 50, y: 60 },
    { id: "rcm", position: "CM", x: 70, y: 55 },
    { id: "lf", position: "LF", x: 35, y: 32 },
    { id: "rf", position: "RF", x: 65, y: 32 },
    { id: "st", position: "ST", x: 50, y: 15 },
  ],
  "4-1-3-2": [
    { id: "gk", position: "GK", x: 50, y: 90 },
    { id: "lb", position: "LB", x: 10, y: 70 },
    { id: "lcb", position: "LCB", x: 35, y: 75 },
    { id: "rcb", position: "RCB", x: 65, y: 75 },
    { id: "rb", position: "RB", x: 90, y: 70 },
    { id: "cdm", position: "CDM", x: 50, y: 60 },
    { id: "lcm", position: "CM", x: 30, y: 45 },
    { id: "cam", position: "CAM", x: 50, y: 40 },
    { id: "rcm", position: "CM", x: 70, y: 45 },
    { id: "lst", position: "ST", x: 35, y: 18 },
    { id: "rst", position: "ST", x: 65, y: 18 },
  ],
  "4-1-2-1-2": [
    { id: "gk", position: "GK", x: 50, y: 90 },
    { id: "lb", position: "LB", x: 10, y: 70 },
    { id: "lcb", position: "LCB", x: 35, y: 75 },
    { id: "rcb", position: "RCB", x: 65, y: 75 },
    { id: "rb", position: "RB", x: 90, y: 70 },
    { id: "cdm", position: "CDM", x: 50, y: 60 },
    { id: "lcm", position: "CM", x: 30, y: 45 },
    { id: "rcm", position: "CM", x: 70, y: 45 },
    { id: "cam", position: "CAM", x: 50, y: 35 },
    { id: "lst", position: "ST", x: 35, y: 18 },
    { id: "rst", position: "ST", x: 65, y: 18 },
  ],
  "4-2-2-2": [
    { id: "gk", position: "GK", x: 50, y: 90 },
    { id: "lb", position: "LB", x: 10, y: 70 },
    { id: "lcb", position: "LCB", x: 35, y: 75 },
    { id: "rcb", position: "RCB", x: 65, y: 75 },
    { id: "rb", position: "RB", x: 90, y: 70 },
    { id: "lcdm", position: "CDM", x: 35, y: 60 },
    { id: "rcdm", position: "CDM", x: 65, y: 60 },
    { id: "lcam", position: "LAM", x: 35, y: 38 },
    { id: "rcam", position: "RAM", x: 65, y: 38 },
    { id: "lst", position: "LS", x: 35, y: 18 },
    { id: "rst", position: "RS", x: 65, y: 18 },
  ],
  "4-1-2-3": [
    { id: "gk", position: "GK", x: 50, y: 90 },
    { id: "lb", position: "LB", x: 10, y: 70 },
    { id: "lcb", position: "LCB", x: 35, y: 75 },
    { id: "rcb", position: "RCB", x: 65, y: 75 },
    { id: "rb", position: "RB", x: 90, y: 70 },
    { id: "cdm", position: "CDM", x: 50, y: 60 },
    { id: "lcm", position: "CM", x: 35, y: 45 },
    { id: "rcm", position: "CM", x: 65, y: 45 },
    { id: "lw", position: "LW", x: 15, y: 25 },
    { id: "st", position: "ST", x: 50, y: 15 },
    { id: "rw", position: "RW", x: 85, y: 25 },
  ],
  "4-5-1": [
    { id: "gk", position: "GK", x: 50, y: 90 },
    { id: "lb", position: "LB", x: 10, y: 70 },
    { id: "lcb", position: "LCB", x: 35, y: 75 },
    { id: "rcb", position: "RCB", x: 65, y: 75 },
    { id: "rb", position: "RB", x: 90, y: 70 },
    { id: "lm", position: "LM", x: 10, y: 45 },
    { id: "lcm", position: "CM", x: 30, y: 50 },
    { id: "cdm", position: "CDM", x: 50, y: 55 },
    { id: "rcm", position: "CM", x: 70, y: 50 },
    { id: "rm", position: "RM", x: 90, y: 45 },
    { id: "st", position: "ST", x: 50, y: 18 },
  ],
  "4-6-0": [
    { id: "gk", position: "GK", x: 50, y: 90 },
    { id: "lb", position: "LB", x: 10, y: 70 },
    { id: "lcb", position: "LCB", x: 35, y: 75 },
    { id: "rcb", position: "RCB", x: 65, y: 75 },
    { id: "rb", position: "RB", x: 90, y: 70 },
    { id: "lm", position: "LM", x: 10, y: 40 },
    { id: "lcm", position: "CM", x: 30, y: 45 },
    { id: "cdm", position: "CDM", x: 50, y: 55 },
    { id: "rcm", position: "CM", x: 70, y: 45 },
    { id: "rm", position: "RM", x: 90, y: 40 },
    { id: "cf", position: "CF", x: 50, y: 25 },
  ],
  "4-3-1-2": [
    { id: "gk", position: "GK", x: 50, y: 90 },
    { id: "lb", position: "LB", x: 10, y: 70 },
    { id: "lcb", position: "LCB", x: 35, y: 75 },
    { id: "rcb", position: "RCB", x: 65, y: 75 },
    { id: "rb", position: "RB", x: 90, y: 70 },
    { id: "lcm", position: "CM", x: 30, y: 55 },
    { id: "cdm", position: "CDM", x: 50, y: 60 },
    { id: "rcm", position: "CM", x: 70, y: 55 },
    { id: "cam", position: "CAM", x: 50, y: 35 },
    { id: "lst", position: "ST", x: 35, y: 18 },
    { id: "rst", position: "ST", x: 65, y: 18 },
  ],
  "4-2-1-3": [
    { id: "gk", position: "GK", x: 50, y: 90 },
    { id: "lb", position: "LB", x: 10, y: 70 },
    { id: "lcb", position: "LCB", x: 35, y: 75 },
    { id: "rcb", position: "RCB", x: 65, y: 75 },
    { id: "rb", position: "RB", x: 90, y: 70 },
    { id: "lcdm", position: "CDM", x: 35, y: 60 },
    { id: "rcdm", position: "CDM", x: 65, y: 60 },
    { id: "cam", position: "CAM", x: 50, y: 40 },
    { id: "lw", position: "LW", x: 15, y: 25 },
    { id: "st", position: "ST", x: 50, y: 15 },
    { id: "rw", position: "RW", x: 85, y: 25 },
  ],

  // ===== 5 Defenders =====
  "5-3-2": [
    { id: "gk", position: "GK", x: 50, y: 90 },
    { id: "lwb", position: "LWB", x: 10, y: 60 },
    { id: "lcb", position: "LCB", x: 30, y: 75 },
    { id: "cb", position: "CB", x: 50, y: 80 },
    { id: "rcb", position: "RCB", x: 70, y: 75 },
    { id: "rwb", position: "RWB", x: 90, y: 60 },
    { id: "lcm", position: "CM", x: 35, y: 50 },
    { id: "rcm", position: "CM", x: 65, y: 50 },
    { id: "cdm", position: "CDM", x: 50, y: 60 },
    { id: "lst", position: "ST", x: 35, y: 20 },
    { id: "rst", position: "ST", x: 65, y: 20 },
  ],
  "5-4-1": [
    { id: "gk", position: "GK", x: 50, y: 90 },
    { id: "lwb", position: "LWB", x: 10, y: 60 },
    { id: "lcb", position: "LCB", x: 30, y: 75 },
    { id: "cb", position: "CB", x: 50, y: 80 },
    { id: "rcb", position: "RCB", x: 70, y: 75 },
    { id: "rwb", position: "RWB", x: 90, y: 60 },
    { id: "lm", position: "LM", x: 15, y: 45 },
    { id: "lcm", position: "CM", x: 35, y: 48 },
    { id: "rcm", position: "CM", x: 65, y: 48 },
    { id: "rm", position: "RM", x: 85, y: 45 },
    { id: "st", position: "ST", x: 50, y: 18 },
  ],
  "5-2-1-2": [
    { id: "gk", position: "GK", x: 50, y: 90 },
    { id: "lwb", position: "LWB", x: 10, y: 60 },
    { id: "lcb", position: "LCB", x: 30, y: 75 },
    { id: "cb", position: "CB", x: 50, y: 80 },
    { id: "rcb", position: "RCB", x: 70, y: 75 },
    { id: "rwb", position: "RWB", x: 90, y: 60 },
    { id: "lcdm", position: "CDM", x: 35, y: 55 },
    { id: "rcdm", position: "CDM", x: 65, y: 55 },
    { id: "cam", position: "CAM", x: 50, y: 38 },
    { id: "lst", position: "ST", x: 35, y: 18 },
    { id: "rst", position: "ST", x: 65, y: 18 },
  ],
  "5-2-3": [
    { id: "gk", position: "GK", x: 50, y: 90 },
    { id: "lwb", position: "LWB", x: 10, y: 60 },
    { id: "lcb", position: "LCB", x: 30, y: 75 },
    { id: "cb", position: "CB", x: 50, y: 80 },
    { id: "rcb", position: "RCB", x: 70, y: 75 },
    { id: "rwb", position: "RWB", x: 90, y: 60 },
    { id: "lcm", position: "CM", x: 35, y: 50 },
    { id: "rcm", position: "CM", x: 65, y: 50 },
    { id: "lw", position: "LW", x: 20, y: 25 },
    { id: "st", position: "ST", x: 50, y: 18 },
    { id: "rw", position: "RW", x: 80, y: 25 },
  ],
  "5-2-2-1": [
    { id: "gk", position: "GK", x: 50, y: 90 },
    { id: "lwb", position: "LWB", x: 10, y: 60 },
    { id: "lcb", position: "LCB", x: 30, y: 75 },
    { id: "cb", position: "CB", x: 50, y: 80 },
    { id: "rcb", position: "RCB", x: 70, y: 75 },
    { id: "rwb", position: "RWB", x: 90, y: 60 },
    { id: "lcdm", position: "CDM", x: 35, y: 55 },
    { id: "rcdm", position: "CDM", x: 65, y: 55 },
    { id: "lcam", position: "LAM", x: 35, y: 35 },
    { id: "rcam", position: "RAM", x: 65, y: 35 },
    { id: "st", position: "ST", x: 50, y: 15 },
  ],
};

// Formation categories for UI
export const FORMATION_CATEGORIES = {
  "2 Defenders (Historical)": ["2-3-5", "2-3-2-3"],
  "3 Defenders": [
    "3-2-5",
    "3-2-2-3",
    "3-2-3-2",
    "3-3-4",
    "3-4-3",
    "3-4-2-1",
    "3-5-2",
    "3-4-1-2",
    "3-3-1-3",
    "3-2-4-1",
    "3-6-1",
    "3-3-3-1",
  ],
  "4 Defenders": [
    "4-2-4",
    "4-3-3",
    "4-4-2",
    "4-4-2-Diamond",
    "4-2-3-1",
    "4-1-4-1",
    "4-4-1-1",
    "4-3-2-1",
    "4-1-3-2",
    "4-1-2-1-2",
    "4-2-2-2",
    "4-1-2-3",
    "4-5-1",
    "4-6-0",
    "4-3-1-2",
    "4-2-1-3",
  ],
  "5 Defenders": ["5-3-2", "5-4-1", "5-2-1-2", "5-2-3", "5-2-2-1"],
};

interface LineupState {
  slots: LineupSlot[];
  squad: Player[];
  selectedTeamId: string | null;
  selectedSlotId: string | null;
  formation: string;

  // Actions
  setSlots: (slots: LineupSlot[]) => void;
  updateSlot: (slotId: string, player: Player | null) => void;
  setSquad: (players: Player[]) => void;
  setSelectedTeamId: (id: string) => void;
  setSelectedSlotId: (id: string | null) => void;
  setFormation: (formation: string) => void;
  resetLineup: () => void;
  saveLineup: (name: string) => Promise<{ id: string; name: string }>;
  loadLineup: (lineupId: string) => Promise<void>;
}

export const useLineupStore = create<LineupState>((set, get) => ({
  slots: FORMATIONS["4-3-3"],
  squad: [],
  selectedTeamId: null,
  selectedSlotId: null,
  formation: "4-3-3",

  setSlots: (slots) => set({ slots }),

  updateSlot: (slotId, player) =>
    set((state) => {
      const targetSlot = state.slots.find((s) => s.id === slotId);
      if (!targetSlot) return state;

      if (!player) {
         return {
           slots: state.slots.map((slot) =>
             slot.id === slotId ? { ...slot, player: undefined } : slot,
           ),
         };
      }

      // Helper to check if position is GK
      const isGKPosition = (pos: string | undefined): boolean => {
        if (!pos) return false;
        const upper = pos.toUpperCase();
        return (
          upper === "GK" || upper.includes("GOAL") || upper.includes("KEEPER")
        );
      };

      // 1. Strict GK Rules
      const isPlayerGK = isGKPosition(player.position);
      const isSlotGK = targetSlot.position === "GK";

      // Rule A: GK player can ONLY go into a GK slot
      if (isPlayerGK && !isSlotGK) {
        return state; // Silently reject
      }
      // Rule B: GK slot can ONLY accept a GK player
      if (isSlotGK && !isPlayerGK) {
        return state; // Silently reject
      }

      // 2. Prevent Duplicates (Move player if already on pitch)
      const slotsWithoutPlayer = state.slots.map((slot) =>
        slot.player && slot.player.id === player.id
          ? { ...slot, player: undefined }
          : slot,
      );

      // 3. Place player in target slot
      return {
        slots: slotsWithoutPlayer.map((slot) =>
          slot.id === slotId ? { ...slot, player } : slot,
        ),
        selectedSlotId: null, // Clear selection
      };
    }),

  setSquad: (squad) => set({ squad }),

  setSelectedTeamId: (id) => set({ selectedTeamId: id }),

  setSelectedSlotId: (id) => set({ selectedSlotId: id }),

  setFormation: (formation) =>
    set((state) => {
      const newSlots = FORMATIONS[formation];
      if (!newSlots) return state;

      const currentPlayers = state.slots.reduce(
        (acc, slot) => {
          if (slot.player) acc[slot.id] = slot.player;
          return acc;
        },
        {} as Record<string, Player>,
      );

      const mappedSlots = newSlots.map((slot) => ({
        ...slot,
        player: currentPlayers[slot.id],
      }));

      return { formation, slots: mappedSlots, selectedSlotId: null };
    }),

  resetLineup: () =>
    set({
      slots: FORMATIONS["4-3-3"],
      selectedTeamId: null,
      squad: [],
      selectedSlotId: null,
      formation: "4-3-3",
    }),

  saveLineup: async (name: string) => {
    const state = get();
    if (!state.selectedTeamId) throw new Error("No team selected");

    const payload = {
      name,
      teamId: state.selectedTeamId,
      formation: state.formation,
      slots: state.slots,
    };

    const res = await fetch("/api/lineups", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) throw new Error("Failed to save lineup");
    return await res.json();
  },

  // ✅ ใหม่ - โหลดแผนเฉยๆ ไม่ดาวน์โหลด PDF
  loadLineup: async (id: string) => {
    try {
      const res = await fetch(`/api/lineups/${id}`);
      if (!res.ok) {
        throw new Error("Failed to load lineup");
      }

      const { data } = await res.json();

      // Update formation
      set({ formation: data.formation });

      const templateSlots = FORMATIONS[data.formation] || FORMATIONS["4-3-3"];

      // Map slots back to state structure using the template's id to prevent breaking when formation changes later
      const loadedSlots = templateSlots.map((tSlot) => {
        // Find the matching slot from the database by position and approximate x,y
        const dbSlot = data.slots.find(
          (s: any) =>
            s.position === tSlot.position &&
            Math.abs(s.x - tSlot.x) < 1 &&
            Math.abs(s.y - tSlot.y) < 1
        );

        return {
          id: tSlot.id,
          position: tSlot.position,
          x: tSlot.x,
          y: tSlot.y,
          player: dbSlot?.playerId
            ? {
                id: dbSlot.playerId,
                name: dbSlot.playerName || "Unknown",
                image: dbSlot.playerImage || null,
                position: dbSlot.position || tSlot.position,
              }
            : null,
        };
      });

      // Update slots in store
      set({ slots: loadedSlots });

      console.log("✅ Lineup loaded successfully:", data.name);
    } catch (error) {
      console.error("❌ Failed to load lineup:", error);
      throw error;
    }
  },
}));
