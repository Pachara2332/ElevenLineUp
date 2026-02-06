"use client";

import { useDroppable } from "@dnd-kit/core";
import { players } from "@/lib/players";

type Props = {
    id: string;
    role: string;
    x: number;
    y: number;
    playerId?: string | null;
};

export default function PositionSlot({ id, role, x, y, playerId }: Props) {
    const { setNodeRef, isOver } = useDroppable({
        id,
    });

    const player = players.find((p) => p.id === playerId);

    return (
        <div
            ref={setNodeRef}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${x}%`, top: `${y}%` }}
        >
            <div
                className={`w-14 h-14 rounded-full flex items-center justify-center
        text-xs font-bold shadow-lg
        ${isOver ? "bg-yellow-300" : "bg-white"}`}
            >
                {player ? player.name : role}
            </div>
        </div>
    );
}
