
'use client';

import React, { useEffect, useMemo } from 'react';
import { DndContext, DragEndEvent } from '@dnd-kit/core';
import { Pitch } from './Pitch';
import { DraggablePlayer } from './DraggablePlayer';
import { Player } from '@/types';
import { useLineupStore } from '../stores/useLineupStore';

// Map slot positions to player position types
const POSITION_MAP: Record<string, string> = {
    'gk': 'GK',
    'lcb': 'DEF',
    'rcb': 'DEF',
    'lb': 'DEF',
    'rb': 'DEF',
    'cm': 'MID',
    'lw': 'FWD',
    'rw': 'FWD',
    'st': 'FWD',
};

export default function LineupBuilder() {
    const {
        slots,
        updateSlot,
        setSquad,
        squad,
        selectedTeamId,
        selectedSlotId,
        setSelectedSlotId
    } = useLineupStore();

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

    // Filter squad based on selected slot position
    const filteredSquad = useMemo(() => {
        if (!selectedSlotId) return squad;

        const positionType = POSITION_MAP[selectedSlotId];
        if (!positionType) return squad;

        return squad.filter(player => player.position === positionType);
    }, [squad, selectedSlotId]);

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.data.current) {
            const player = active.data.current as Player;
            updateSlot(over.id as string, player);
        }
    };

    const handleSlotClick = (slotId: string) => {
        // Toggle selection: if same slot, deselect; otherwise select
        setSelectedSlotId(selectedSlotId === slotId ? null : slotId);
    };

    const selectedSlot = slots.find(s => s.id === selectedSlotId);

    return (
        <DndContext onDragEnd={handleDragEnd}>
            <div className="flex flex-col md:flex-row gap-8 h-[calc(100vh-140px)]">
                <div className="flex-grow flex items-center justify-center glass-panel rounded-3xl p-6 relative overflow-hidden">
                    {/* Decorative Background Element */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent pointer-events-none" />
                    <Pitch
                        slots={slots}
                        selectedSlotId={selectedSlotId}
                        onSlotClick={handleSlotClick}
                    />
                </div>

                <div className="w-full md:w-80 glass-panel p-6 rounded-3xl flex flex-col gap-4 overflow-hidden">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-black text-emerald-900 drop-shadow-sm uppercase tracking-wide">Squad</h2>
                        {selectedSlotId && (
                            <button
                                onClick={() => setSelectedSlotId(null)}
                                className="text-sm px-3 py-1 rounded-full bg-yellow-400 text-emerald-900 font-bold hover:bg-yellow-300 transition-colors"
                            >
                                {POSITION_MAP[selectedSlotId]} ✕
                            </button>
                        )}
                    </div>
                    {selectedSlotId && (
                        <p className="text-sm text-emerald-700 -mt-2">
                            กดที่ตำแหน่ง <span className="font-bold">{selectedSlot?.position}</span> → แสดงเฉพาะ {POSITION_MAP[selectedSlotId]}
                        </p>
                    )}
                    <div className="space-y-3 overflow-y-auto pr-2 custom-scrollbar flex-1">
                        {filteredSquad.length > 0 ? (
                            filteredSquad.map((player) => (
                                <DraggablePlayer key={player.id} player={player} />
                            ))
                        ) : (
                            <p className="text-emerald-700/50 text-center py-4">ไม่มีนักเตะในตำแหน่งนี้</p>
                        )}
                    </div>
                </div>
            </div>
        </DndContext>
    );
}
