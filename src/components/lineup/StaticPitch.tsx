"use client";

import React from "react";
import clsx from "clsx";
import { LineupSlot } from "@prisma/client";

interface StaticPitchProps {
    slots: LineupSlot[];
}

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

const StaticPitchSlot: React.FC<{ slot: LineupSlot }> = ({ slot }) => {
    const hasPlayer = !!slot.playerName;
    const displayName =
        slot.playerName
            ?.replace(/\s*\(\d+\)$/, "")
            .split(" ")
            .slice(-1)[0] || "";
    const showImage =
        slot.playerImage && !slot.playerImage.includes("default.jpg");

    return (
        <div
            style={{
                left: `${slot.x}%`,
                top: `${slot.y}%`,
            }}
            className={clsx(
                "absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-700 ease-out group hover:z-20",
                hasPlayer ? "w-16 h-20" : "w-14 h-14",
            )}
        >
            <div
                className={clsx(
                    "w-full h-full rounded-2xl flex flex-col items-center justify-center transition-all duration-300",
                    hasPlayer &&
                    "bg-gradient-to-b from-slate-800/90 to-slate-900/90 backdrop-blur-sm shadow-xl hover:scale-[1.5] hover:z-50 hover:shadow-2xl",
                    !hasPlayer &&
                    "bg-black/30 border-2 border-white/20 hover:border-white/40 hover:bg-black/40"
                )}
            >
                {hasPlayer ? (
                    <>
                        {/* Hover popup - with image */}
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none z-50">
                            <div className="bg-slate-900 rounded-xl p-2 shadow-xl border border-slate-600 whitespace-nowrap flex items-center gap-2">
                                <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-700 flex-shrink-0">
                                    {showImage ? (
                                        <img
                                            src={slot.playerImage!}
                                            alt={displayName}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold">
                                            {displayName.charAt(0)}
                                        </div>
                                    )}
                                </div>
                                <div className="flex flex-col gap-0.5">
                                    <span className="text-white font-bold text-xs">
                                        {slot.playerName?.replace(/\s*\(\d+\)$/, "")}
                                    </span>
                                    <span className="bg-emerald-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded text-center">
                                        {shortenPosition(slot.position)}
                                    </span>
                                </div>
                            </div>
                            <div className="absolute left-1/2 -translate-x-1/2 -bottom-1.5 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-slate-900" />
                        </div>

                        {/* Player image */}
                        <div className="w-11 h-11 rounded-xl overflow-hidden ring-2 ring-white/50 bg-slate-700 flex-shrink-0 shadow-lg">
                            {showImage ? (
                                <img
                                    src={slot.playerImage!}
                                    alt={displayName}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).style.display = "none";
                                    }}
                                />
                            ) : (
                                <div className="w-full h-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold text-sm">
                                    {displayName.charAt(0)}
                                </div>
                            )}
                        </div>
                        {/* Player name */}
                        <span className="text-[10px] font-bold text-white mt-0.5 truncate max-w-14 drop-shadow-lg">
                            {displayName}
                        </span>
                    </>
                ) : (
                    <span className="text-xs font-bold text-white/60 group-hover:text-white/80">
                        {shortenPosition(slot.position)}
                    </span>
                )}
            </div>
        </div>
    );
};

export const StaticPitch: React.FC<StaticPitchProps> = ({ slots }) => {
    return (
        <div className="relative w-full aspect-[2/3] max-w-md mx-auto rounded-2xl shadow-2xl overflow-hidden">
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
            {slots.map((slot) => (
                <StaticPitchSlot key={slot.slotId} slot={slot} />
            ))}
        </div>
    );
};
