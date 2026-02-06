import { players } from "@/lib/players";
import PlayerCard from "./PlayerCard";

export default function PlayerList() {
    return (
        <div className="grid grid-cols-2 gap-3">
            {players.map((p) => (
                <PlayerCard key={p.id} player={p} />
            ))}
        </div>
    );
}
