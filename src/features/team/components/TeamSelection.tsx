"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLineupStore } from "@/features/lineup/stores/useLineupStore";
import clsx from "clsx";
import { useQuery } from "@tanstack/react-query";
import { Team } from "@prisma/client";

keepPreviousData: true;

async function fetchTeams() {
  const res = await fetch("/api/teams");
  if (!res.ok) throw new Error("Failed to fetch teams");
  const json = await res.json();
  return json.data as Team[];
}

export default function TeamSelection() {
  const router = useRouter();
  const { selectedTeamId, setSelectedTeamId, resetLineup } = useLineupStore();

  useEffect(() => {
    resetLineup();
  }, [resetLineup]);

  const [selectedLeague, setSelectedLeague] = useState("ALL");
  const [search, setSearch] = useState("");

  const leagues = [
    { name: "ALL", id: "" },
    { name: "Premier League", id: "GB1" },
    { name: "La Liga", id: "ES1" },
    { name: "Serie A", id: "IT1" },
    { name: "Bundesliga", id: "L1" },
    { name: "Ligue 1", id: "FR1" },
  ];
  // useEffect(() => {
  //     if (search.length > 0) {
  //         setSelectedLeague('ALL');
  //     }
  // }, [search]); เพื่อกลับมาค้นหาทั้งหมด

  const [debouncedSearch, setDebouncedSearch] = useState(search);

  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300); // delay 300ms

    return () => clearTimeout(t);
  }, [search]);

  const {
    data: teams,
    isLoading,
    isFetching,
  } = useQuery<Team[]>({
    queryKey: ["teams-search", debouncedSearch, selectedLeague],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (debouncedSearch) params.set("q", debouncedSearch);

      // Find competition_id from selected league
      const league = leagues.find((l) => l.name === selectedLeague);
      if (league?.id) params.set("competition_id", league.id);

      const res = await fetch(`/api/teams/search?${params.toString()}`);
      const json = await res.json();
      return json.data;
    },
    placeholderData: (prev) => prev,
  });

  const filteredTeams = teams;

  const handleContinue = () => {
    if (selectedTeamId) {
      router.push(`/lineups/${selectedTeamId}`);
    }
  };

  if (isLoading && !teams) {
    return (
      <div className="w-full max-w-6xl mx-auto p-8 glass-panel rounded-2xl shadow-2xl animate-in fade-in slide-in-from-bottom-8 duration-700">
        {/* Title Skeleton */}
        <div className="h-12 w-3/4 max-w-sm bg-emerald-900/10 rounded-xl mx-auto mb-4 animate-pulse" />
        <div className="h-6 w-1/2 max-w-xs bg-emerald-800/10 rounded-lg mx-auto mb-8 animate-pulse" />

        {/* Search Bar Skeleton */}
        <div className="flex justify-center mb-10">
          <div className="w-full max-w-md h-12 bg-white/40 rounded-xl animate-pulse" />
        </div>

        {/* League Tabs Skeleton */}
        <div className="flex justify-center gap-3 mb-12 flex-wrap">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="h-9 w-24 bg-white/40 rounded-lg animate-pulse"
            />
          ))}
        </div>

        {/* Teams Grid Skeleton */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="p-6 rounded-2xl bg-white/20 flex flex-col items-center justify-center gap-4 aspect-square animate-pulse"
            >
              {/* Logo placeholder */}
              <div className="w-20 h-20 bg-white/30 rounded-full" />
              {/* Name placeholder */}
              <div className="w-24 h-5 bg-white/30 rounded-md" />
            </div>
          ))}
        </div>

        {/* Button Skeleton */}
        <div className="flex justify-center">
          <div className="w-48 h-14 rounded-3xl bg-emerald-600/30 animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto p-8 glass-panel rounded-2xl shadow-2xl animate-in fade-in slide-in-from-bottom-8 duration-700">
      <h1 className="text-5xl font-black text-center mb-4 text-emerald-900 uppercase tracking-tighter drop-shadow-sm">
        Select Your Club
      </h1>
      <p className="text-center text-emerald-800 mb-8 text-lg font-medium">
        Choose the badge you fight for
      </p>
      <div className="flex justify-center mb-10">
        <input
          type="text"
          placeholder="Search club..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-md px-5 py-3 rounded-xl 
                   border border-emerald-200 
                   shadow-sm focus:outline-none 
                   focus:ring-2 focus:ring-emerald-500"
        />
      </div>

      {/* {isFetching && (
        <div className="text-xs text-emerald-600 text-center mb-3">
          searching...
        </div>
      )} */}
      {/* League Tabs */}
      <div className="flex justify-center gap-3 mb-12 flex-wrap">
        {leagues.map((league) => (
          <button
            key={league.name}
            onClick={() => setSelectedLeague(league.name)}
            className={clsx(
              "px-6 py-2 rounded-lg font-bold transition-all duration-300 uppercase tracking-widest text-sm",
              selectedLeague === league.name
                ? "bg-emerald-600 text-white shadow-lg scale-105"
                : "bg-white/40 text-emerald-900 hover:bg-white/60",
            )}
          >
            {league.name}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
        {filteredTeams?.map((team) => (
          <button
            key={team.teamId}
            onClick={() => setSelectedTeamId(team.teamId)}
            onDoubleClick={() => {
              setSelectedTeamId(team.teamId);
              router.push(`/lineups/${team.teamId}`);
            }}
            className={clsx(
              "p-6 rounded-2xl border-4 transition-all duration-300 flex flex-col items-center justify-center gap-4 aspect-square group",
              selectedTeamId === team.teamId
                ? "border-white bg-white/40 scale-105 shadow-xl"
                : "border-transparent bg-white/10 hover:bg-white/20 hover:scale-105",
            )}
          >
            <img
              src={team.logo}
              alt={team.name}
              className="w-20 h-20 object-contain drop-shadow-md transition-transform group-hover:rotate-12 duration-300"
            />
            <span
              className={clsx(
                "font-bold text-lg uppercase tracking-wider",
                selectedTeamId === team.teamId
                  ? "text-emerald-900"
                  : "text-emerald-900/70",
              )}
            >
              {team.name}
            </span>
            {selectedTeamId === team.teamId && (
              <p className="text-xs font-semibold animate-fade-in">
                <span className="text-emerald-900">Double click</span>
                <span className="text-emerald-500"> to start instantly</span>
              </p>
            )}
          </button>
        ))}
      </div>

      <div className="flex justify-center">
        <button
          onClick={handleContinue}
          disabled={!selectedTeamId}
          className="
    px-12 py-4 rounded-3xl 
    bg-emerald-600 text-white
    text-xl tracking-widest uppercase font-bold
    shadow-lg shadow-emerald-500/40
    transition-all duration-300
    hover:bg-emerald-500 hover:scale-105
    active:scale-95
    disabled:opacity-40 disabled:cursor-not-allowed disabled:scale-100
  "
        >
          Start Building
        </button>
      </div>
    </div>
  );
}
