"use client";
import { useRouter } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import {
  DndContext,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
} from "@dnd-kit/core";
import { Pitch, getPositionCategory } from "./Pitch";
import { DraggablePlayer } from "./DraggablePlayer";
import { Player, LineupSlot } from "@/types";
import { useLineupStore, FORMATION_CATEGORIES } from "../stores/useLineupStore";
import AlertModal from "@/components/AlertModal";
import AdvancedFilter from "./AdvancedFilter";

// Map slot positions to player position types
const POSITION_MAP: Record<string, string> = {
  gk: "GK",
  lcb: "DEF",
  rcb: "DEF",
  lb: "DEF",
  rb: "DEF",
  cm: "MID",
  lw: "FWD",
  rw: "FWD",
  st: "FWD",
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
    loadLineup,
  } = useLineupStore();

  const [isSaving, setIsSaving] = React.useState(false);
  const [lineupName, setLineupName] = React.useState("");
  const [showSaveModal, setShowSaveModal] = React.useState(false);
  const [showLoadModal, setShowLoadModal] = React.useState(false);
  const [myLineups, setMyLineups] = React.useState<any[]>([]);
  const [isLoadingPlayers, setIsLoadingPlayers] = React.useState(false);
  const [draggedPlayer, setDraggedPlayer] = useState<Player | null>(null);
  const [pendingDrop, setPendingDrop] = useState<{
    player: Player;
    slotId: string;
    slotPosition: string;
  } | null>(null);

  // Filter state
  const [activeFilters, setActiveFilters] = useState<{
    search: string;
    season: string;
    birthYearFrom: string;
    birthYearTo: string;
    heightFrom: string;
    heightTo: string;
    preferredFoot: string;
  }>({
    search: "",
    season: "",
    birthYearFrom: "",
    birthYearTo: "",
    heightFrom: "",
    heightTo: "",
    preferredFoot: "",
  });

  const [seasons, setSeasons] = useState<string[]>([]);

  useEffect(() => {
    const fetchSeasons = async () => {
      try {
        const res = await fetch("/api/filters/seasons");
        if (res.ok) {
          const json = await res.json();
          setSeasons(json);
        }
      } catch (error) {
        console.error("Failed to fetch seasons", error);
      }
    };
    fetchSeasons();
  }, []);

  useEffect(() => {
    // Legacy fetch removed in favor of page-level fetching
  }, []);

  const fetchMyLineups = async () => {
    try {
      const res = await fetch("/api/lineups");
      if (res.ok) {
        const json = await res.json();
        setMyLineups(json.data);
      }
    } catch (error) {
      console.error("Failed to fetch lineups", error);
    }
  };

  const handleDragStart = (event: DragStartEvent) => {
    const player = event.active.data.current as Player;
    setDraggedPlayer(player);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setDraggedPlayer(null);

    if (over && active.data.current) {
      const player = active.data.current as Player;
      const targetSlot = slots.find((s) => s.id === over.id) as LineupSlot;

      if (targetSlot) {
        const playerCategory = getPositionCategory(player.position || "");
        const slotCategory = getPositionCategory(targetSlot.position);

        // Debug log
        console.log(
          "Player:",
          player.name,
          "Position:",
          player.position,
          "-> Category:",
          playerCategory,
        );
        console.log(
          "Slot:",
          targetSlot.id,
          "Position:",
          targetSlot.position,
          "-> Category:",
          slotCategory,
        );

        // Check if positions match
        if (playerCategory !== slotCategory && playerCategory !== "ANY") {
          // Show confirmation popup
          console.log("Position mismatch! Showing confirmation popup");
          setPendingDrop({
            player,
            slotId: over.id as string,
            slotPosition: targetSlot.position,
          });
        } else {
          // Positions match, drop directly
          console.log("Position match! Calling updateSlot for slot:", over.id);
          updateSlot(over.id as string, player);
          console.log("updateSlot called successfully");
        }
      }
    }
  };

  const confirmDrop = () => {
    if (pendingDrop) {
      updateSlot(pendingDrop.slotId, pendingDrop.player);
      setPendingDrop(null);
    }
  };

  const cancelDrop = () => {
    setPendingDrop(null);
  };

  const [alertConfig, setAlertConfig] = React.useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type: "success" | "error" | "info";
  }>({ isOpen: false, title: "", message: "", type: "info" });

  const showAlert = (
    title: string,
    message: string,
    type: "success" | "error" | "info" = "info",
  ) => {
    setAlertConfig({ isOpen: true, title, message, type });
  };

  const handleSave = async () => {
    if (!lineupName) return;
    setIsSaving(true);
    try {
      await saveLineup(lineupName);
      setShowSaveModal(false);
      setLineupName("");
      showAlert("Success!", "Lineup saved successfully.", "success");
    } catch (error) {
      showAlert("Error", "Failed to save lineup. Please try again.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  // ✅ ฟังก์ชันโหลดแผนกลับมาดู (ไม่ดาวน์โหลด PDF)
  const handleLoadLineup = async (id: string) => {
    try {
      await loadLineup(id);
      setShowLoadModal(false);
      showAlert("Success!", "Lineup loaded successfully.", "success");
    } catch (error) {
      showAlert("Error", "Failed to load lineup.", "error");
    }
  };

  // ✅ ฟังก์ชันดาวน์โหลด PDF แยกต่างหาก
  const handleDownloadPDF = async (id: string, name: string) => {
    try {
      const res = await fetch(`/api/lineups/${id}/pdf`);
      if (!res.ok) {
        throw new Error("Failed to generate PDF");
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${name || "lineup"}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);

      showAlert("Success!", "PDF downloaded successfully.", "success");
    } catch (error) {
      showAlert("Error", "Failed to download PDF.", "error");
    }
  };

  // Fetch players with filters
  const fetchPlayersWithFilters = async (
    position?: string,
    filters?: typeof activeFilters,
  ) => {
    if (!selectedTeamId) return;

    setIsLoadingPlayers(true);
    try {
      const params = new URLSearchParams();

      if (position) params.append("position", position);

      if (filters) {
        if (filters.search) params.append("search", filters.search);
        if (filters.season) params.append("season", filters.season);

        if (filters.birthYearFrom)
          params.append("birth_year", filters.birthYearFrom);
        if (filters.heightFrom) params.append("min_height", filters.heightFrom);
        if (filters.heightTo) params.append("max_height", filters.heightTo);
        if (filters.preferredFoot)
          params.append("foot", filters.preferredFoot.toLowerCase());
      }

      const res = await fetch(
        `/api/teams/${selectedTeamId}/players?${params.toString()}`,
      );
      const json = await res.json();
      setSquad(json.data || []);
    } catch (error) {
      console.error("Failed to fetch players:", error);
    } finally {
      setIsLoadingPlayers(false);
    }
  };

  const handleSlotClick = async (slotId: string) => {
    // Toggle selection - ถ้ากดซ้ำให้ยกเลิก
    if (selectedSlotId === slotId) {
      setSelectedSlotId(null);
      return;
    }

    setSelectedSlotId(slotId);

    // Find slot position
    const slot = slots.find((s) => s.id === slotId);
    if (!slot || !selectedTeamId) return;

    // Fetch players by position with current filters
    await fetchPlayersWithFilters(slot.position, activeFilters);
  };

  const selectedSlot = slots.find((s) => s.id === selectedSlotId);

  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="flex flex-col md:flex-row gap-8 h-[calc(100vh-140px)]">
        <div className="flex-grow flex items-center justify-center glass-panel rounded-3xl p-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent pointer-events-none" />

          <div className="absolute top-6 left-6 z-10 flex gap-2">
            <button
              onClick={() => setShowSaveModal(true)}
              className="bg-emerald-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-emerald-700 transition shadow-md"
            >
              Save Lineup
            </button>
            <button
              onClick={() => {
                setShowLoadModal(true);
                fetchMyLineups();
              }}
              className="bg-white/80 text-emerald-900 px-4 py-2 rounded-lg font-bold hover:bg-white transition shadow-md border border-emerald-200"
            >
              My Lineups
            </button>
          </div>

          <Pitch
            slots={slots}
            selectedSlotId={selectedSlotId}
            onSlotClick={handleSlotClick}
            draggedPosition={draggedPlayer?.position}
          />
        </div>

        <div className="w-full md:w-[380px] glass-panel p-6 rounded-3xl flex flex-col gap-5 overflow-hidden">
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black text-emerald-900 uppercase tracking-wide">
                  {selectedSlot ? selectedSlot.position : "Squad"}
                </h2>
                {selectedSlot && (
                  <p className="text-sm text-emerald-600">
                    {squad.length} players available
                  </p>
                )}
              </div>

              <select
                value={formation}
                onChange={(e) => setFormation(e.target.value)}
                className="bg-white border border-emerald-200 text-emerald-900 text-sm rounded-lg px-3 py-2 font-medium cursor-pointer"
              >
                {Object.entries(FORMATION_CATEGORIES).map(
                  ([category, formations]) => (
                    <optgroup key={category} label={category}>
                      {formations.map((f) => (
                        <option key={f} value={f}>
                          {f}
                        </option>
                      ))}
                    </optgroup>
                  ),
                )}
              </select>
            </div>
          </div>

          {/* Advanced Filter */}
          <AdvancedFilter
            seasons={seasons}
            onFilterChange={(filters) => {
              setActiveFilters(filters);
              // Re-fetch with new filters
              if (selectedSlot) {
                fetchPlayersWithFilters(selectedSlot.position, filters);
              }
            }}
          />

          <div className="space-y-3 overflow-y-auto pr-2 custom-scrollbar flex-1">
            {isLoadingPlayers ? (
              <div className="text-center py-8 text-emerald-600 animate-pulse">
                Loading players...
              </div>
            ) : squad.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                {selectedSlot
                  ? `No ${selectedSlot.position} players found`
                  : "Click a position to see players"}
              </div>
            ) : (
              squad.map((player) => (
                <DraggablePlayer key={player.id} player={player} />
              ))
            )}
          </div>
        </div>
      </div>

      {/* Save Modal */}
      {showSaveModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-2xl w-full max-w-sm">
            <h3 className="text-xl font-bold text-emerald-900 mb-4">
              Save Lineup
            </h3>
            <input
              type="text"
              placeholder="Lineup Name (e.g. Dream Team A)"
              className="w-full p-3 border rounded-lg mb-4"
              value={lineupName}
              onChange={(e) => setLineupName(e.target.value)}
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowSaveModal(false)}
                className="px-4 py-2 text-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving || !lineupName}
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg disabled:opacity-50"
              >
                {isSaving ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Load Modal - ✅ แก้ไขให้มี 2 ปุ่ม */}
      {showLoadModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-2xl w-full max-w-md max-h-[80vh] flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-emerald-900">My Lineups</h3>
              <button
                onClick={() => setShowLoadModal(false)}
                className="text-gray-500 text-2xl hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <div className="overflow-y-auto flex-1 space-y-2">
              {myLineups.length === 0 ? (
                <p className="text-center text-gray-500 py-8">
                  No saved lineups yet.
                </p>
              ) : (
                myLineups.map((l: any) => (
                  <div
                    key={l.lineupId}
                    className="p-4 border border-emerald-200 rounded-xl hover:bg-emerald-50 transition"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="font-bold text-emerald-900 text-lg">
                          {l.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {l.formation} •{" "}
                          {new Date(l.updatedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    {/* ✅ ปุ่ม 2 ปุ่มแยกกัน */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleLoadLineup(l.lineupId)}
                        className="flex-1 bg-emerald-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-emerald-700 transition"
                      >
                        📋 Load Lineup
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDownloadPDF(l.lineupId, l.name);
                        }}
                        className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
                      >
                        📄 Download PDF
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Position Mismatch Confirmation Modal */}
      {pendingDrop && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-2xl w-full max-w-sm shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="text-center mb-4">
              <div className="w-16 h-16 mx-auto mb-3 bg-amber-100 rounded-full flex items-center justify-center">
                <span className="text-3xl">⚠️</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Position Mismatch
              </h3>
              <p className="text-gray-600">
                <strong className="text-emerald-700">
                  {pendingDrop.player.name?.replace(/\s*\(\d+\)$/, "")}
                </strong>{" "}
                is a{" "}
                <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded font-medium">
                  {pendingDrop.player.position}
                </span>{" "}
                but you&apos;re placing them at{" "}
                <span className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded font-medium">
                  {pendingDrop.slotPosition}
                </span>
              </p>
            </div>
            <p className="text-sm text-gray-500 text-center mb-4">
              Do you want to use this player in this position?
            </p>
            <div className="flex gap-3">
              <button
                onClick={cancelDrop}
                className="flex-1 px-4 py-3 border-2 border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-100 transition"
              >
                Cancel
              </button>
              <button
                onClick={confirmDrop}
                className="flex-1 px-4 py-3 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      <AlertModal
        isOpen={alertConfig.isOpen}
        onClose={() => setAlertConfig((prev) => ({ ...prev, isOpen: false }))}
        title={alertConfig.title}
        message={alertConfig.message}
        type={alertConfig.type}
      />
    </DndContext>
  );
}
