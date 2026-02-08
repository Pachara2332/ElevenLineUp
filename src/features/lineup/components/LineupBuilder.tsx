
'use client';

import React, { useEffect, useMemo } from 'react';
import { DndContext, DragEndEvent } from '@dnd-kit/core';
import { Pitch } from './Pitch';
import { DraggablePlayer } from './DraggablePlayer';
import { Player } from '@/types';
import { useLineupStore } from '../stores/useLineupStore';
import AlertModal from '@/components/AlertModal';

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
        setSelectedSlotId,
        formation,
        setFormation,
        saveLineup,
        loadLineup
    } = useLineupStore();

    const [isSaving, setIsSaving] = React.useState(false);
    const [lineupName, setLineupName] = React.useState('');
    const [showSaveModal, setShowSaveModal] = React.useState(false);
    const [showLoadModal, setShowLoadModal] = React.useState(false);
    const [myLineups, setMyLineups] = React.useState<any[]>([]);

    // Fetch players and lineups
    // Fetch players and lineups
    // Note: Players are now fetched by the parent page based on URL teamId
    // We keep this hook mainly to ensure store is synced if needed, or we can remove it.
    // For now, let's remove the direct fetch here to avoid double fetching and rely on the store being populated.
    useEffect(() => {
        // Legacy fetch removed in favor of page-level fetching
    }, []);

    const fetchMyLineups = async () => {
        try {
            const res = await fetch('/api/lineups');
            if (res.ok) {
                const json = await res.json();
                setMyLineups(json.data);
            }
        } catch (error) {
            console.error('Failed to fetch lineups', error);
        }
    };

    // Filter squad based on selected slot position
    // Updated: REMOVE strict filtering to allow creativity (GK as ST)
    // But maybe keep it as a "Recommended" filter? 
    // For now, let's keep the filter but add a "Show All" toggle or just relax it?
    // User requested: "GK to ST" -> so we should probably remove the strict filter or make it optional.
    // Let's make it optional: If specific slot selected, show relevant + option for others?
    // Or just show all sorted by relevance? 
    // Implementation Plan said: "Relax position restrictions".
    // So let's show ALL players, maybe highlighting the ones matching the position.

    const filteredSquad = useMemo(() => {
        // Simple approach: Show all players, maybe sort matchers first?
        // Or just return all squad for maximum freedom as requested.
        return squad;
    }, [squad]);

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.data.current) {
            const player = active.data.current as Player;
            // Allow any player in any slot
            updateSlot(over.id as string, player);
        }
    };

    const [alertConfig, setAlertConfig] = React.useState<{
        isOpen: boolean;
        title: string;
        message: string;
        type: 'success' | 'error' | 'info';
    }>({ isOpen: false, title: '', message: '', type: 'info' });

    const showAlert = (title: string, message: string, type: 'success' | 'error' | 'info' = 'info') => {
        setAlertConfig({ isOpen: true, title, message, type });
    };

    const handleSave = async () => {
        if (!lineupName) return;
        setIsSaving(true);
        try {
            await saveLineup(lineupName);
            setShowSaveModal(false);
            setLineupName('');
            showAlert('Success!', 'Lineup saved successfully.', 'success');
        } catch (error) {
            showAlert('Error', 'Failed to save lineup. Please try again.', 'error');
        } finally {
            setIsSaving(false);
        }
    };

    const handleLoad = async (id: string) => {
        try {
            await loadLineup(id);
            setShowLoadModal(false);
        } catch (error) {
            showAlert('Error', 'Failed to load lineup.', 'error');
        }
    };

    const handleSlotClick = (slotId: string) => {
        setSelectedSlotId(selectedSlotId === slotId ? null : slotId);
    };

    const selectedSlot = slots.find(s => s.id === selectedSlotId);

    return (
        <DndContext onDragEnd={handleDragEnd}>
            <div className="flex flex-col md:flex-row gap-8 h-[calc(100vh-140px)]">
                <div className="flex-grow flex items-center justify-center glass-panel rounded-3xl p-6 relative overflow-hidden">
                    {/* Decorative Background Element */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent pointer-events-none" />

                    {/* Toolbar */}
                    <div className="absolute top-6 left-6 z-10 flex gap-2">
                        <button
                            onClick={() => setShowSaveModal(true)}
                            className="bg-emerald-600 text-white px-4 py-2 rounded-xl font-bold hover:bg-emerald-700 transition shadow-lg"
                        >
                            Save Lineup
                        </button>
                        <button
                            onClick={() => { setShowLoadModal(true); fetchMyLineups(); }}
                            className="bg-white/50 text-emerald-900 px-4 py-2 rounded-xl font-bold hover:bg-white/80 transition shadow-lg"
                        >
                            My Lineups
                        </button>
                    </div>

                    <Pitch
                        slots={slots}
                        selectedSlotId={selectedSlotId}
                        onSlotClick={handleSlotClick}
                    />
                </div>

                <div className="w-full md:w-80 glass-panel p-6 rounded-3xl flex flex-col gap-4 overflow-hidden">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-black text-emerald-900 drop-shadow-sm uppercase tracking-wide">Squad</h2>
                        <div className="flex gap-2">
                            <select
                                value={formation}
                                onChange={(e) => setFormation(e.target.value)}
                                className="bg-white/50 border border-emerald-200 text-emerald-900 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block p-1"
                            >
                                <option value="4-3-3">4-3-3</option>
                                <option value="4-2-3-1">4-2-3-1</option>
                                <option value="3-4-3">3-4-3</option>
                                <option value="5-3-2">5-3-2</option>
                                <option value="4-1-4-1">4-1-4-1</option>
                                <option value="3-4-2-1">3-4-2-1</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-3 overflow-y-auto pr-2 custom-scrollbar flex-1">
                        {filteredSquad.map((player) => (
                            <DraggablePlayer key={player.id} player={player} />
                        ))}
                    </div>
                </div>
            </div>

            {/* Save Modal */}
            {showSaveModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white p-6 rounded-2xl w-full max-w-sm">
                        <h3 className="text-xl font-bold text-emerald-900 mb-4">Save Lineup</h3>
                        <input
                            type="text"
                            placeholder="Lineup Name (e.g. Dream Team A)"
                            className="w-full p-3 border rounded-lg mb-4"
                            value={lineupName}
                            onChange={e => setLineupName(e.target.value)}
                        />
                        <div className="flex justify-end gap-2">
                            <button onClick={() => setShowSaveModal(false)} className="px-4 py-2 text-gray-500">Cancel</button>
                            <button
                                onClick={handleSave}
                                disabled={isSaving || !lineupName}
                                className="px-4 py-2 bg-emerald-600 text-white rounded-lg disabled:opacity-50"
                            >
                                {isSaving ? 'Saving...' : 'Save'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Load Modal */}
            {showLoadModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white p-6 rounded-2xl w-full max-w-md max-h-[80vh] flex flex-col">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold text-emerald-900">My Lineups</h3>
                            <button onClick={() => setShowLoadModal(false)} className="text-gray-500">✕</button>
                        </div>
                        <div className="overflow-y-auto flex-1 space-y-2">
                            {myLineups.length === 0 ? (
                                <p className="text-center text-gray-500 py-8">No saved lineups yet.</p>
                            ) : (
                                myLineups.map((l: any) => (
                                    <div key={l.lineupId} className="p-4 border rounded-xl hover:bg-emerald-50 cursor-pointer flex justify-between items-center" onClick={() => handleLoad(l.lineupId)}>
                                        <div>
                                            <p className="font-bold text-emerald-900">{l.name}</p>
                                            <p className="text-xs text-gray-500">{l.formation} • {new Date(l.updatedAt).toLocaleDateString()}</p>
                                        </div>
                                        <div className="text-emerald-600">Load →</div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            )}

            <AlertModal
                isOpen={alertConfig.isOpen}
                onClose={() => setAlertConfig(prev => ({ ...prev, isOpen: false }))}
                title={alertConfig.title}
                message={alertConfig.message}
                type={alertConfig.type}
            />

        </DndContext>
    );
}
