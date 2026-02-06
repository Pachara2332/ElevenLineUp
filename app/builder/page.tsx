"use client";

import { DndContext } from "@dnd-kit/core";
import Pitch from "@/components/Pitch";
import FormationSelector from "@/components/FormationSelector";
import PlayerList from "@/components/PlayerList";
import { useLineupStore } from "@/stores/lineupStore";

export default function BuilderPage() {
    const assignPlayer = useLineupStore((s) => s.assignPlayer);

    function handleDragEnd(event: any) {
        const { active, over } = event;

        if (!over) return;

        assignPlayer(over.id, active.id);
    }

    return (
        <main className="min-h-screen bg-zinc-900 p-6 space-y-4 text-white">

            <FormationSelector />

            <DndContext onDragEnd={handleDragEnd}>
                <Pitch />
                <PlayerList />
            </DndContext>

        </main>
    );
}
