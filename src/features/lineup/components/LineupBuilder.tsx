
'use client';

import React, { useEffect } from 'react';
import { DndContext, DragEndEvent } from '@dnd-kit/core';
import { Pitch } from './Pitch';
import { DraggablePlayer } from './DraggablePlayer';
import { Player } from '@/types';
import { useLineupStore } from '../stores/useLineupStore';

// Mock Data (Moved from component to simulate fetch)
const MOCK_PLAYERS: Player[] = [
    { id: 'p1', name: 'Saka', position: 'RW', teamId: 'arsenal', image: '' },
    { id: 'p2', name: 'Odegaard', position: 'CAM', teamId: 'arsenal', image: '' },
    { id: 'p3', name: 'Rice', position: 'CDM', teamId: 'arsenal', image: '' },
    { id: 'p4', name: 'Saliba', position: 'CB', teamId: 'arsenal', image: '' },
    { id: 'p5', name: 'Raya', position: 'GK', teamId: 'arsenal', image: '' },
];

export default function LineupBuilder() {
    const { slots, updateSlot, setSquad, squad, selectedTeamId } = useLineupStore();

    // Fetch players for the selected team
    useEffect(() => {
        if (!selectedTeamId) return;

        const fetchPlayers = async () => {
            try {
                const res = await fetch(`/api/teams/${selectedTeamId}/players`);
                if (!res.ok) throw new Error('Failed to fetch players');
                const json = await res.json();
                setSquad(json.data);
            } catch (error) {
                console.error('Error fetching players:', error);
            }
        };

        fetchPlayers();
    }, [selectedTeamId, setSquad]);

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.data.current) {
            const player = active.data.current as Player;
            // Update global state
            updateSlot(over.id as string, player);
        }
    };

    return (
        <DndContext onDragEnd={handleDragEnd}>
            <div className="flex flex-col md:flex-row gap-8 h-[calc(100vh-140px)]">
                <div className="flex-grow flex items-center justify-center glass-panel rounded-3xl p-6 relative overflow-hidden">
                    {/* Decorative Background Element */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent pointer-events-none" />
                    <Pitch slots={slots} />
                </div>

                <div className="w-full md:w-80 glass-panel p-6 rounded-3xl flex flex-col gap-4 overflow-hidden">
                    <h2 className="text-2xl font-black text-emerald-900 drop-shadow-sm mb-2 uppercase tracking-wide">Squad</h2>
                    <div className="space-y-3 overflow-y-auto pr-2 custom-scrollbar">
                        {squad.map((player) => (
                            <DraggablePlayer key={player.id} player={player} />
                        ))}
                    </div>
                </div>
            </div>
        </DndContext>
    );
}
