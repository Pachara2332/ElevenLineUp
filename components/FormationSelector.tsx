"use client";

import { formations } from "@/lib/formations";
import { useLineupStore } from "../stores/lineupStore";

export default function FormationSelector() {
    const setFormation = useLineupStore((s) => s.setFormation);
    const current = useLineupStore((s) => s.formationName);

    return (
        <div className="flex gap-2 flex-wrap">
            {Object.keys(formations).map((name) => (
                <button
                    key={name}
                    onClick={() => setFormation(name)}
                    className={`px-4 py-2 rounded-xl text-sm
            ${current === name
                            ? "bg-green-600 text-white"
                            : "bg-zinc-700 text-zinc-200"}`}
                >
                    {name}
                </button>
            ))}
        </div>
    );
}
