"use client";

import { useState, useEffect, useRef } from "react";
import {
  TrophyIcon,
  ChevronRightIcon,
  InformationCircleIcon,
  ChevronDownIcon
} from "@heroicons/react/24/outline";
import { useLanguage } from "@/contexts/LanguageContext";
import translationsEn from "@/locales/en.json";
import translationsTh from "@/locales/th.json";

const LEAGUES = [
  { id: "PL", name: "Premier League", icon: "https://crests.football-data.org/PL.png" },
  { id: "SA", name: "Serie A", icon: "https://crests.football-data.org/SA.png" },
  { id: "PD", name: "La Liga", icon: "https://crests.football-data.org/PD.png" },
  { id: "BL1", name: "Bundesliga", icon: "https://crests.football-data.org/BL1.png" },
  { id: "FL1", name: "Ligue 1", icon: "https://crests.football-data.org/FL1.png" },
  { id: "ELC", name: "Championship", icon: "https://crests.football-data.org/ELC.png" },
  { id: "DED", name: "Eredivisie", icon: "https://crests.football-data.org/DED.png" },
  { id: "PPL", name: "Primeira Liga", icon: "https://crests.football-data.org/PPL.png" },
  { id: "BSA", name: "Brasileirão", icon: "https://crests.football-data.org/BSA.png" },
  { id: "CL", name: "Champions League", icon: "https://upload.wikimedia.org/wikipedia/en/thumb/b/bf/UEFA_Champions_League_logo_2.svg/100px-UEFA_Champions_League_logo_2.svg.png" },
  { id: "EC", name: "Euro 2024", icon: "https://upload.wikimedia.org/wikipedia/en/thumb/9/96/UEFA_Euro_2024_Logo.svg/100px-UEFA_Euro_2024_Logo.svg.png" },
  { id: "WC", name: "World Cup", icon: "https://upload.wikimedia.org/wikipedia/en/thumb/e/e3/2026_FIFA_World_Cup_logo.svg/100px-2026_FIFA_World_Cup_logo.svg.png" },
];

export default function DashboardStandings() {
  const { language } = useLanguage();
  const t = language === "th" ? translationsTh : translationsEn;
  const [league, setLeague] = useState("PL");
  const [standings, setStandings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedLeague = LEAGUES.find(l => l.id === league) || LEAGUES[0];

  useEffect(() => {
    const fetchStandings = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/standings?league=${league}`);
        const json = await res.json();
        if (json.data?.standings?.[0]?.table) {
          setStandings(json.data.standings[0].table);
        } else {
          setStandings([]);
        }
      } catch (error) {
        console.error("Failed to fetch standings:", error);
        setStandings([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStandings();
  }, [league]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="glass-panel overflow-hidden rounded-[10px] shadow-sm border border-slate-200 bg-white/50">
      <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div>
            <h2 className="text-xl font-bold text-slate-900 leading-none">
              {t.dashboard.standings.title}
            </h2>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1.5 flex items-center gap-1.5">
              {t.dashboard.standings.season} <InformationCircleIcon className="w-3 h-3 text-slate-300" />
            </p>
          </div>
        </div>

        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-3 bg-white border border-slate-200 text-slate-800 text-xs font-bold rounded-lg px-4 py-2.5 transition-all hover:border-slate-300 shadow-sm active:scale-95"
          >
            <img src={selectedLeague.icon} alt="" className="w-5 h-5 object-contain" />
            <span className="min-w-[120px] text-left">{selectedLeague.name}</span>
            <ChevronDownIcon className={`w-4 h-4 text-slate-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white border border-slate-200 rounded-[10px] shadow-xl z-50 py-2 max-h-[400px] overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-200">
              {LEAGUES.map((l) => (
                <button
                  key={l.id}
                  onClick={() => {
                    setLeague(l.id);
                    setIsDropdownOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold transition-colors hover:bg-slate-50 ${league === l.id ? 'bg-emerald-50 text-emerald-700' : 'text-slate-600'}`}
                >
                  <img src={l.icon} alt="" className="w-6 h-6 object-contain" />
                  <span>{l.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="overflow-x-auto">
        {isLoading ? (
          <div className="p-6 space-y-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="flex gap-4 animate-pulse px-4">
                <div className="h-5 bg-slate-100 rounded-lg w-8"></div>
                <div className="h-5 bg-slate-100 rounded-lg flex-1"></div>
                <div className="h-5 bg-slate-100 rounded-lg w-24"></div>
              </div>
            ))}
          </div>
        ) : (
          <table className="w-full text-sm text-left border-collapse">
            <thead className="text-[10px] text-slate-500 font-bold uppercase tracking-wider bg-slate-50/50">
              <tr>
                <th className="px-6 py-4">Pos</th>
                <th className="px-6 py-4">Club</th>
                <th className="px-3 py-4 text-center">P</th>
                <th className="px-3 py-4 text-center">W</th>
                <th className="px-3 py-4 text-center">D</th>
                <th className="px-3 py-4 text-center">L</th>
                <th className="px-3 py-4 text-center">GD</th>
                <th className="px-6 py-4 text-center">Pts</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {standings.length > 0 ? (
                standings.map((team: any) => (
                  <tr
                    key={team.team.id}
                    className="hover:bg-slate-50 transition-colors group cursor-default"
                  >
                    <td className="px-6 py-4">
                      <div
                        className={`
                        w-6 h-6 flex items-center justify-center rounded text-[10px] font-bold
                        ${
                          team.position <= 4
                            ? "bg-emerald-100 text-emerald-700"
                            : team.position >= 18
                              ? "bg-red-50 text-red-600"
                              : "bg-slate-50 text-slate-500"
                        }
                      `}
                      >
                        {team.position}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {team.team.crest && (
                          <img
                            src={team.team.crest}
                            alt=""
                            className="w-5 h-5 object-contain"
                          />
                        )}
                        <div className="font-bold text-slate-700 transition-colors truncate max-w-[150px]">
                          {team.team.shortName || team.team.name}
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-4 text-center font-medium text-slate-400">
                      {team.playedGames}
                    </td>
                    <td className="px-3 py-4 text-center font-medium text-slate-400">
                      {team.won}
                    </td>
                    <td className="px-3 py-4 text-center font-medium text-slate-400">
                      {team.draw}
                    </td>
                    <td className="px-3 py-4 text-center font-medium text-slate-400">
                      {team.lost}
                    </td>
                    <td className="px-3 py-4 text-center font-bold text-slate-500">
                      {team.goalDifference > 0
                        ? `+${team.goalDifference}`
                        : team.goalDifference}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="font-bold text-slate-800 tabular-nums">
                        {team.points}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={8}
                    className="p-12 text-center text-slate-400 font-medium"
                  >
                    No standings available for this league.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {!isLoading && standings.length > 0 && (
        <div className="p-4 bg-white border-t border-slate-100 flex justify-center">
          <button className="text-[10px] font-bold text-emerald-600 hover:text-emerald-700 uppercase tracking-widest flex items-center gap-1 group transition-colors">
            {t.dashboard.standings.view_full_table}{" "}
            <ChevronRightIcon className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      )}
    </div>
  );
}
