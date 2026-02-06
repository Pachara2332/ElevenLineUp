"use client";

import { useDraggable } from "@dnd-kit/core";

export default function PlayerCard({ player }: any) {
    const { attributes, listeners, setNodeRef, transform } =
        useDraggable({
            id: player.id,
        });

    const style = transform
        ? {
            transform: `translate(${transform.x}px, ${transform.y}px)`,
        }
        : undefined;

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...listeners}
            {...attributes}
            className="bg-zinc-800 text-white p-3 rounded-xl
                 cursor-grab active:cursor-grabbing
                 shadow-lg"
        >
            <div className="font-bold">{player.name}</div>
            <div className="text-xs opacity-70">{player.role}</div>
        </div>
    );
}
