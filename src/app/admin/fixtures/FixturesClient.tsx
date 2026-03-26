"use client";

import { useState } from "react";
import { Fixture } from "@prisma/client";

export default function FixturesClient({
  initialFixtures,
}: {
  initialFixtures: Fixture[];
}) {
  const [fixtures, setFixtures] = useState(initialFixtures);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<Fixture>>({});
  const [isSaving, setIsSaving] = useState(false);

  const startEditing = (f: Fixture) => {
    setEditingId(f.id);
    setForm(f);
  };

  const handleSave = async () => {
    if (!editingId) return;
    setIsSaving(true);
    try {
      const res = await fetch("/api/admin/fixtures", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        const body = await res.json();
        setFixtures((prev) =>
          prev.map((item) =>
            item.id === editingId ? body.data.fixture : item,
          ),
        );
        setEditingId(null);
      } else {
        alert("Failed to update.");
      }
    } catch (err) {
      console.error(err);
      alert("Error saving fixture");
    } finally {
      setIsSaving(false);
    }
  };

  const formatDateForInput = (date: Date | string | null | undefined) => {
    if (!date) return "";
    const d = new Date(date);
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().slice(0, 16);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm whitespace-nowrap">
          <thead className="uppercase tracking-wider border-b border-gray-200 dark:border-gray-700 font-medium bg-gray-50 dark:bg-gray-800/50">
            <tr>
              <th className="px-6 py-4">Match</th>
              <th className="px-6 py-4">Kickoff</th>
              <th className="px-6 py-4">Home Score</th>
              <th className="px-6 py-4">Away Score</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {fixtures.map((f) => {
              const isEditing = editingId === f.id;
              return (
                <tr
                  key={f.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition"
                >
                  {isEditing ? (
                    <>
                      <td className="px-6 py-4 font-bold">
                        {f.homeTeam} vs {f.awayTeam}
                      </td>
                      <td className="px-6 py-4">
                        <input
                          type="datetime-local"
                          value={formatDateForInput(form.kickoff)}
                          onChange={(e) =>
                            setForm({
                              ...form,
                              kickoff: new Date(e.target.value),
                            })
                          }
                          className="w-full p-1 border rounded dark:bg-gray-900"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <input
                          type="number"
                          value={form.homeScore ?? ""}
                          onChange={(e) =>
                            setForm({
                              ...form,
                              homeScore: e.target.value
                                ? +e.target.value
                                : null,
                            })
                          }
                          className="w-16 p-1 border rounded dark:bg-gray-900"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <input
                          type="number"
                          value={form.awayScore ?? ""}
                          onChange={(e) =>
                            setForm({
                              ...form,
                              awayScore: e.target.value
                                ? +e.target.value
                                : null,
                            })
                          }
                          className="w-16 p-1 border rounded dark:bg-gray-900"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={form.status || ""}
                          onChange={(e) =>
                            setForm({ ...form, status: e.target.value })
                          }
                          className="p-1 border rounded dark:bg-gray-900"
                        >
                          <option value="scheduled">Scheduled</option>
                          <option value="live">Live</option>
                          <option value="finished">Finished</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          disabled={isSaving}
                          onClick={handleSave}
                          className="text-green-600 hover:text-green-800 font-semibold mr-4"
                        >
                          Save
                        </button>
                        <button
                          disabled={isSaving}
                          onClick={() => setEditingId(null)}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          Cancel
                        </button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="px-6 py-4 font-bold">
                        {f.homeTeam} vs {f.awayTeam}
                      </td>
                      <td className="px-6 py-4">
                        {new Date(f.kickoff).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 font-bold text-center">
                        {f.homeScore ?? "-"}
                      </td>
                      <td className="px-6 py-4 font-bold text-center">
                        {f.awayScore ?? "-"}
                      </td>
                      <td className="px-6 py-4 capitalize">{f.status}</td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => startEditing(f)}
                          className="text-blue-600 hover:text-blue-800 font-semibold"
                        >
                          Edit
                        </button>
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
