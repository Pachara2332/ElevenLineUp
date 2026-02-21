'use client';

import { useState } from 'react';
import { LeagueStanding } from '@prisma/client';

export default function StandingsClient({ initialStandings }: { initialStandings: LeagueStanding[] }) {
    const [standings, setStandings] = useState(initialStandings);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [form, setForm] = useState<Partial<LeagueStanding>>({});
    const [isSaving, setIsSaving] = useState(false);

    const startEditing = (s: LeagueStanding) => {
        setEditingId(s.id);
        setForm(s);
    };

    const handleSave = async () => {
        if (!editingId) return;
        setIsSaving(true);
        try {
            const res = await fetch('/api/admin/standings', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });
            if (res.ok) {
                const body = await res.json();
                setStandings((prev) => prev.map(item => item.id === editingId ? body.data.standing : item));
                setEditingId(null);
            } else {
                alert('Failed to update.');
            }
        } catch (err) {
            console.error(err);
            alert('Error saving standing');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="min-w-full text-left text-sm whitespace-nowrap">
                    <thead className="uppercase tracking-wider border-b border-gray-200 dark:border-gray-700 font-medium bg-gray-50 dark:bg-gray-800/50">
                        <tr>
                            <th className="px-6 py-4">Pos</th>
                            <th className="px-6 py-4">Team</th>
                            <th className="px-6 py-4">P</th>
                            <th className="px-6 py-4">W</th>
                            <th className="px-6 py-4">D</th>
                            <th className="px-6 py-4">L</th>
                            <th className="px-6 py-4">GF</th>
                            <th className="px-6 py-4">GA</th>
                            <th className="px-6 py-4">Pts</th>
                            <th className="px-6 py-4 text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {standings.map((s) => {
                            const isEditing = editingId === s.id;
                            return (
                                <tr key={s.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                                    {isEditing ? (
                                        <>
                                            <td className="px-6 py-4"><input type="number" value={form.position || ''} onChange={e => setForm({ ...form, position: +e.target.value })} className="w-16 p-1 border rounded dark:bg-gray-900" /></td>
                                            <td className="px-6 py-4 font-bold">{s.teamName}</td>
                                            <td className="px-6 py-4"><input type="number" value={form.played || ''} onChange={e => setForm({ ...form, played: +e.target.value })} className="w-16 p-1 border rounded dark:bg-gray-900" /></td>
                                            <td className="px-6 py-4"><input type="number" value={form.won || ''} onChange={e => setForm({ ...form, won: +e.target.value })} className="w-16 p-1 border rounded dark:bg-gray-900" /></td>
                                            <td className="px-6 py-4"><input type="number" value={form.drawn || ''} onChange={e => setForm({ ...form, drawn: +e.target.value })} className="w-16 p-1 border rounded dark:bg-gray-900" /></td>
                                            <td className="px-6 py-4"><input type="number" value={form.lost || ''} onChange={e => setForm({ ...form, lost: +e.target.value })} className="w-16 p-1 border rounded dark:bg-gray-900" /></td>
                                            <td className="px-6 py-4"><input type="number" value={form.goalsFor || ''} onChange={e => setForm({ ...form, goalsFor: +e.target.value })} className="w-16 p-1 border rounded dark:bg-gray-900" /></td>
                                            <td className="px-6 py-4"><input type="number" value={form.goalsAgainst || ''} onChange={e => setForm({ ...form, goalsAgainst: +e.target.value })} className="w-16 p-1 border rounded dark:bg-gray-900" /></td>
                                            <td className="px-6 py-4"><input type="number" value={form.points || ''} onChange={e => setForm({ ...form, points: +e.target.value })} className="w-16 p-1 border rounded dark:bg-gray-900" /></td>
                                            <td className="px-6 py-4 text-right">
                                                <button disabled={isSaving} onClick={handleSave} className="text-green-600 hover:text-green-800 font-semibold mr-4">Save</button>
                                                <button disabled={isSaving} onClick={() => setEditingId(null)} className="text-gray-500 hover:text-gray-700">Cancel</button>
                                            </td>
                                        </>
                                    ) : (
                                        <>
                                            <td className="px-6 py-4">{s.position}</td>
                                            <td className="px-6 py-4 font-bold">{s.teamName}</td>
                                            <td className="px-6 py-4">{s.played}</td>
                                            <td className="px-6 py-4">{s.won}</td>
                                            <td className="px-6 py-4">{s.drawn}</td>
                                            <td className="px-6 py-4">{s.lost}</td>
                                            <td className="px-6 py-4">{s.goalsFor}</td>
                                            <td className="px-6 py-4">{s.goalsAgainst}</td>
                                            <td className="px-6 py-4 font-bold">{s.points}</td>
                                            <td className="px-6 py-4 text-right">
                                                <button onClick={() => startEditing(s)} className="text-blue-600 hover:text-blue-800 font-semibold">Edit</button>
                                            </td>
                                        </>
                                    )}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
