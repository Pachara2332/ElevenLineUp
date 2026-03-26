"use client";

import React from "react";
import { useDroppable, useDraggable } from "@dnd-kit/core";
import { LineupSlot } from "@/types";
import clsx from "clsx";

interface PitchProps {
  slots: LineupSlot[];
  selectedSlotId: string | null;
  onSlotClick: (slotId: string) => void;
  draggedPosition?: string; // Position of currently dragged player
}

interface PitchSlotProps {
  slot: LineupSlot;
  isSelected: boolean;
  onClick: () => void;
  isValidDropZone?: boolean; // Is this a valid position for dragged player
}

// Map position to category for validation
export const getPositionCategory = (position: string): string => {
  const pos = position.toUpperCase();
  if (pos === "GK" || pos.includes("GOAL") || pos.includes("KEEPER"))
    return "GK";
  if (
    ["CB", "LCB", "RCB", "LB", "RB", "LWB", "RWB"].includes(pos) ||
    pos.includes("BACK") ||
    pos.includes("DEFENDER")
  )
    return "DEF";
  if (
    ["CDM", "CM", "CAM", "LM", "RM", "DM"].includes(pos) ||
    pos.includes("MID")
  )
    return "MID";
  if (
    ["ST", "CF", "LW", "RW", "LF", "RF", "SS"].includes(pos) ||
    pos.includes("FORWARD") ||
    pos.includes("WINGER") ||
    pos.includes("STRIKER") ||
    pos.includes("ATTACK")
  )
    return "FWD";
  return "ANY";
};

// Shorten position name
const shortenPosition = (position: string | undefined): string => {
  if (!position) return "?";
  const pos = position.toUpperCase();
  if (pos.length <= 3) return pos;

  const posMap: Record<string, string> = {
    GOALKEEPER: "GK",
    "CENTRE-BACK": "CB",
    "LEFT-BACK": "LB",
    "RIGHT-BACK": "RB",
    "LEFT MIDFIELD": "LM",
    "RIGHT MIDFIELD": "RM",
    "CENTRAL MIDFIELD": "CM",
    "DEFENSIVE MIDFIELD": "CDM",
    "ATTACKING MIDFIELD": "CAM",
    "LEFT WINGER": "LW",
    "RIGHT WINGER": "RW",
    "CENTRE-FORWARD": "CF",
    "SECOND STRIKER": "SS",
  };

  if (posMap[pos]) return posMap[pos];
  for (const [key, val] of Object.entries(posMap)) {
    if (pos.includes(key)) return val;
  }
  return pos.slice(0, 3);
};

const PitchSlot: React.FC<PitchSlotProps> = ({
  slot,
  isSelected,
  onClick,
  isValidDropZone,
}) => {
  const { isOver, setNodeRef: setDroppableRef } = useDroppable({
    id: slot.id,
    data: slot,
  });

  const {
    attributes,
    listeners,
    setNodeRef: setDraggableRef,
    isDragging,
  } = useDraggable({
    id: `pitch-player-${slot.id}`,
    data: slot.player || undefined,
    disabled: !slot.player,
  });

  const hasPlayer = !!slot.player;
  const displayName =
    slot.player?.name
      ?.replace(/\s*\(\d+\)$/, "")
      .split(" ")
      .slice(-1)[0] || "";
  const showImage =
    slot.player?.image && !slot.player.image.includes("default.jpg");

  return (
    <div
      ref={setDroppableRef}
      onClick={onClick}
      style={{
        left: `${slot.x}%`,
        top: `${slot.y}%`,
      }}
      className={clsx(
        "absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-700 ease-out cursor-pointer group hover:z-20",
        hasPlayer ? "w-16 h-20" : "w-14 h-14",
      )}
    >
      {/* Glow effect for valid drop zone */}
      {isValidDropZone && !isOver && (
        <div className="absolute inset-0 rounded-full bg-emerald-400/30 animate-pulse scale-125" />
      )}

      {/* Main slot container */}
      <div
        ref={setDraggableRef}
        {...listeners}
        {...attributes}
        className={clsx(
          "w-full h-full rounded-2xl flex flex-col items-center justify-center transition-all duration-300",
          // Drop states
          isOver && "scale-110 ring-4 ring-emerald-400 bg-emerald-400/40",
          // Selected state
          isSelected &&
            !isOver &&
            "scale-105 ring-4 ring-yellow-400 bg-yellow-400/30",
          // Valid drop zone
          isValidDropZone &&
            !isOver &&
            !isSelected &&
            "border-2 border-emerald-400 border-dashed bg-emerald-500/20",
          // Has player - add hover scale
          hasPlayer &&
            !isOver &&
            !isSelected &&
            "bg-gradient-to-b from-slate-800/90 to-slate-900/90 backdrop-blur-sm shadow-xl hover:scale-110 hover:shadow-2xl",
          // Empty slot or currently dragging player from here
          (!hasPlayer || isDragging) &&
            !isOver &&
            !isSelected &&
            !isValidDropZone &&
            "bg-black/30 border-2 border-white/20 hover:border-white/40 hover:bg-black/40",
        )}
      >
        {hasPlayer && !isDragging ? (
          <>
            {/* Player image */}
            <div className="w-11 h-11 rounded-xl overflow-hidden ring-2 ring-white/50 bg-slate-700 flex-shrink-0 shadow-lg">
              {showImage ? (
                <img
                  src={slot.player!.image || undefined}
                  alt={displayName}
                  className="w-full h-full object-cover pointer-events-none"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold text-sm pointer-events-none">
                  {displayName.charAt(0)}
                </div>
              )}
            </div>
            {/* Player name */}
            <span className="text-[10px] font-bold text-white mt-0.5 truncate max-w-14 drop-shadow-lg pointer-events-none">
              {displayName}
            </span>
          </>
        ) : (
          <span
            className={clsx(
              "text-xs font-bold pointer-events-none",
              isSelected
                ? "text-yellow-200"
                : "text-white/60 group-hover:text-white/80",
            )}
          >
            {slot.position}
          </span>
        )}
      </div>
    </div>
  );
};

export const Pitch: React.FC<PitchProps> = ({
  slots,
  selectedSlotId,
  onSlotClick,
  draggedPosition,
}) => {
  return (
    <div className="relative w-full aspect-[2/3] max-w-md mx-auto rounded-2xl shadow-2xl">
      {/* Pitch background with gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-green-600 via-green-700 to-green-800" />

      {/* Grass texture overlay */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `repeating-linear-gradient(
          0deg,
          transparent,
          transparent 20px,
          rgba(0,0,0,0.1) 20px,
          rgba(0,0,0,0.1) 40px
        )`,
        }}
      />

      {/* Pitch border */}
      <div className="absolute inset-3 border-2 border-white/40 rounded-lg" />

      {/* Center line */}
      <div className="absolute top-1/2 left-3 right-3 h-0.5 bg-white/40" />

      {/* Center circle */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-28 h-28 border-2 border-white/40 rounded-full" />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-white/40 rounded-full" />

      {/* Top penalty area */}
      <div className="absolute top-3 left-1/2 transform -translate-x-1/2 w-52 h-28 border-2 border-white/40 border-t-0 rounded-b-lg" />
      <div className="absolute top-3 left-1/2 transform -translate-x-1/2 w-28 h-12 border-2 border-white/40 border-t-0 rounded-b-lg" />

      {/* Bottom penalty area */}
      <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 w-52 h-28 border-2 border-white/40 border-b-0 rounded-t-lg" />
      <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 w-28 h-12 border-2 border-white/40 border-b-0 rounded-t-lg" />

      {/* Penalty spots */}
      <div className="absolute top-[18%] left-1/2 transform -translate-x-1/2 w-2 h-2 bg-white/40 rounded-full" />
      <div className="absolute bottom-[18%] left-1/2 transform -translate-x-1/2 w-2 h-2 bg-white/40 rounded-full" />

      {/* Corner arcs */}
      <div className="absolute top-3 left-3 w-6 h-6 border-2 border-white/40 border-t-0 border-l-0 rounded-br-full" />
      <div className="absolute top-3 right-3 w-6 h-6 border-2 border-white/40 border-t-0 border-r-0 rounded-bl-full" />
      <div className="absolute bottom-3 left-3 w-6 h-6 border-2 border-white/40 border-b-0 border-l-0 rounded-tr-full" />
      <div className="absolute bottom-3 right-3 w-6 h-6 border-2 border-white/40 border-b-0 border-r-0 rounded-tl-full" />

      {/* Slots */}
      {slots.map((slot, index) => {
        // Check if this slot is a valid drop zone for the dragged player
        const isValidDropZone = draggedPosition
          ? getPositionCategory(draggedPosition) ===
              getPositionCategory(slot.position) ||
            getPositionCategory(draggedPosition) === "ANY"
          : false;

        return (
          <PitchSlot
            key={index}
            slot={slot}
            isSelected={selectedSlotId === slot.id}
            onClick={() => onSlotClick(slot.id)}
            isValidDropZone={isValidDropZone}
          />
        );
      })}
    </div>
  );
};
