import { formations } from "../lib/formations";
import PositionSlot from "./PositionSlot";

export default function Pitch() {
    const formation = formations["4-3-3"];

    return (
        <div className="w-full max-w-2xl mx-auto aspect-[2/3] relative rounded-2xl overflow-hidden shadow-2xl">

            <div className="absolute inset-0 bg-gradient-to-b from-green-700 to-green-900" />

            <div className="absolute left-0 right-0 top-1/2 h-[2px] bg-white/40" />
            <div className="absolute w-32 h-32 border border-white/40 rounded-full
                      left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />

            {formation.map((pos, i) => (
                <PositionSlot key={i} {...pos} />
            ))}
        </div>
    );
}
