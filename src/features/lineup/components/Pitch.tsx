
'use client';

import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { LineupSlot } from '@/types';
import clsx from 'clsx';

interface PitchProps {
    slots: LineupSlot[];
}

interface PitchSlotProps {
    slot: LineupSlot;
}

const PitchSlot: React.FC<PitchSlotProps> = ({ slot }) => {
    const { isOver, setNodeRef } = useDroppable({
        id: slot.id,
        data: slot,
    });

    return (
        <div
            ref={setNodeRef}
            style={{
                left: `${slot.x}%`,
                top: `${slot.y}%`,
            }}
            className={clsx(
                'absolute transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full border-2 transition-all flex items-center justify-center',
                isOver
                    ? 'border-emerald-400 bg-emerald-400/20 scale-110'
                    : 'border-white/30 bg-black/20 hover:border-white/50'
            )}
        >
            {slot.player ? (
                <div className="text-center">
                    {/* Player Image & Name logic here */}
                    <span className="text-xs font-bold text-white drop-shadow-md">{slot.player.name}</span>
                </div>
            ) : (
                <span className="text-xs font-semibold text-white/50">{slot.position}</span>
            )}
        </div>
    );
};

export const Pitch: React.FC<PitchProps> = ({ slots }) => {
    return (
        <div className="relative w-full aspect-[2/3] max-w-md mx-auto bg-green-800 rounded-lg overflow-hidden border-4 border-white/20 shadow-2xl">
            {/* Pitch Markings */}
            <div className="absolute inset-4 border-2 border-white/30 rounded-sm"></div>
            <div className="absolute top-1/2 left-0 right-0 h-px bg-white/30"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 border-2 border-white/30 rounded-full"></div>

            {/* Penalty Areas */}
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-48 h-24 border-2 border-white/30 border-t-0"></div>
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-48 h-24 border-2 border-white/30 border-b-0"></div>

            {/* Goal Areas */}
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-24 h-8 border-2 border-white/30 border-t-0"></div>
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-24 h-8 border-2 border-white/30 border-b-0"></div>

            {/* Slots */}
            {slots.map((slot) => (
                <PitchSlot key={slot.id} slot={slot} />
            ))}
        </div>
    );
};
