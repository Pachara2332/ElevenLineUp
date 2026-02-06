import Pitch from "@/components/Pitch";
import FormationSelector from "@/components/FormationSelector";

export default function BuilderPage() {
    return (
        <main className="min-h-screen bg-zinc-900 p-6 space-y-4">
            <h1 className="text-white text-2xl">
                Lineup Builder
            </h1>

            <FormationSelector />

            <Pitch />
        </main>
    );
}
