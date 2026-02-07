
'use client';

import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { Player } from '@/types';
import clsx from 'clsx';

interface DraggablePlayerProps {
    player: Player;
}

export const DraggablePlayer: React.FC<DraggablePlayerProps> = ({ player }) => {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: player.id,
        data: player,
    });

    const style = transform ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    } : undefined;

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...listeners}
            {...attributes}
            className={clsx(
                'p-3 bg-slate-700 rounded-lg flex items-center gap-3 cursor-grab hover:bg-slate-600 transition-colors',
                isDragging && 'opacity-50 cursor-grabbing'
            )}
        >
            <div className="w-8 h-8 rounded-full bg-slate-500 overflow-hidden">
                {/* Placeholder for player image */}
                <div className="w-full h-full bg-emerald-500/20 flex items-center justify-center text-xs text-white">
                    {player.position}
                </div>
            </div>
            <div>
                <p className="font-bold text-sm text-slate-100">{player.name}</p>
                <p className="text-xs text-slate-400">{player.position}</p>
            </div>
        </div>
    );
};
