'use client';

import { useQuery } from '@tanstack/react-query';
import { useMemo, useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    CalendarDaysIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    BoltIcon,
    ChevronDownIcon,
    XMarkIcon,
} from '@heroicons/react/24/outline';
import { useLanguage } from "@/contexts/LanguageContext";
import translationsEn from "@/locales/en.json";
import translationsTh from "@/locales/th.json";

interface Match {
    id: string;
    league: string;
    homeTeam: string;
    awayTeam: string;
    homeTeamId?: string;
    awayTeamId?: string;
    matchDate: string;
    venue: string;
    status: string;
    kickoff?: string;
}

const LEAGUES = [
    { id: 'PL', name: 'Premier League', icon: 'https://upload.wikimedia.org/wikipedia/en/f/f2/Premier_League_Logo.svg' },
    { id: 'SA', name: 'Serie A', icon: 'https://upload.wikimedia.org/wikipedia/commons/c/c2/Serie_A.png' },
    { id: 'PD', name: 'La Liga', icon: 'https://crests.football-data.org/PD.png' },
    { id: 'BL1', name: 'Bundesliga', icon: 'https://crests.football-data.org/BL1.png' },
    { id: 'FL1', name: 'Ligue 1', icon: 'https://crests.football-data.org/FL1.png' },
    { id: 'ELC', name: 'Championship', icon: 'https://crests.football-data.org/ELC.png' },
    { id: 'DED', name: 'Eredivisie', icon: 'https://i.logos-download.com/114179/30713-s1280-2393da2764c605d0b728b1552d825b98.avif/Eredivisie_Logo_2025-s1280.avif' },
    { id: 'PPL', name: 'Primeira Liga', icon: 'https://crests.football-data.org/PPL.png' },
    { id: 'BSA', name: 'Brasileirao', icon: 'https://i.logos-download.com/114216/31028-s1280-9cc3f76b95e6105e2872252ef695dfa1.avif/Brasileir%C3%A3o_Logo_2024_Betano-s1280.avif' },
];

async function fetchFixtures(leagueId: string) {
    const res = await fetch(`/api/fixtures?leagueId=${leagueId}`);
    if (!res.ok) throw new Error('Failed to fetch fixtures');
    const json = await res.json();
    return json.data as Match[];
}

export default function DashboardFixtures() {
    const { language } = useLanguage();
    const t = language === "th" ? translationsTh : translationsEn;
    const [selectedLeague, setSelectedLeague] = useState(LEAGUES[0].id);
    const [page, setPage] = useState(0);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const { data: fixtures, isLoading } = useQuery({
        queryKey: ['fixtures', selectedLeague],
        queryFn: () => fetchFixtures(selectedLeague),
    });

    const { data: standingsData } = useQuery({
        queryKey: ['standings-crests', selectedLeague],
        queryFn: async () => {
            const res = await fetch(`/api/standings?league=${selectedLeague}`);
            if (!res.ok) return [];
            const json = await res.json();
            return json?.data?.standings?.[0]?.table ?? [];
        },
    });

    const crestMap = useMemo(() => {
        const map = new Map<string, string>();
        (standingsData || []).forEach((row: any) => {
            const crest = row?.team?.crest;
            const name = row?.team?.name;
            const shortName = row?.team?.shortName;
            if (name && crest) map.set(name.toLowerCase(), crest);
            if (shortName && crest) map.set(shortName.toLowerCase(), crest);
        });
        return map;
    }, [standingsData]);

    const selectedLeagueData = LEAGUES.find((l) => l.id === selectedLeague) || LEAGUES[0];
    const standingsByTeam = useMemo(() => {
        const map = new Map<string, any>();
        (standingsData || []).forEach((row: any) => {
            if (row?.team?.name) {
                map.set(String(row.team.name).toLowerCase(), row);
            }
            if (row?.team?.shortName) {
                map.set(String(row.team.shortName).toLowerCase(), row);
            }
        });
        return map;
    }, [standingsData]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const pageSize = 3;
    const paginatedFixtures = fixtures?.slice(page * pageSize, (page + 1) * pageSize);
    const totalPages = Math.ceil((fixtures?.length || 0) / pageSize);

    const selectedMatchContext = useMemo(() => {
        if (!selectedMatch || !fixtures) return null;

        const kickoffTs = new Date(selectedMatch.matchDate || selectedMatch.kickoff || '').getTime();
        const homeNext = fixtures
            .filter((f) => f.id !== selectedMatch.id && (f.homeTeam === selectedMatch.homeTeam || f.awayTeam === selectedMatch.homeTeam))
            .filter((f) => new Date(f.matchDate || f.kickoff || '').getTime() >= kickoffTs)
            .slice(0, 3);
        const awayNext = fixtures
            .filter((f) => f.id !== selectedMatch.id && (f.homeTeam === selectedMatch.awayTeam || f.awayTeam === selectedMatch.awayTeam))
            .filter((f) => new Date(f.matchDate || f.kickoff || '').getTime() >= kickoffTs)
            .slice(0, 3);

        const homeStanding = standingsByTeam.get(selectedMatch.homeTeam.toLowerCase());
        const awayStanding = standingsByTeam.get(selectedMatch.awayTeam.toLowerCase());
        return {
            homeNext,
            awayNext,
            homeStanding,
            awayStanding,
        };
    }, [selectedMatch, fixtures, standingsByTeam]);

    return (
        <div className="glass-panel overflow-hidden rounded-[10px] shadow-sm border border-slate-200 bg-white/50">
            <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-100 rounded-lg">
                        <CalendarDaysIcon className="w-5 h-5 text-slate-600" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-slate-900 leading-none">{t.dashboard.fixtures.upcoming}</h2>
                        <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-widest">{t.dashboard.fixtures.subtitle}</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative" ref={dropdownRef}>
                        <button
                            onClick={() => setIsDropdownOpen((prev) => !prev)}
                            className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 text-[10px] font-bold uppercase rounded-lg px-3 py-2 outline-none transition-all cursor-pointer hover:border-slate-300"
                        >
                            <img
                                src={selectedLeagueData.icon}
                                alt=""
                                className="w-4 h-4 object-contain"
                            />
                            <span>{selectedLeagueData.name}</span>
                            <ChevronDownIcon className={`w-3.5 h-3.5 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`} />
                        </button>

                        {isDropdownOpen && (
                            <div className="absolute right-0 mt-2 w-60 rounded-lg border border-slate-200 bg-white shadow-lg z-20 py-1">
                                {LEAGUES.map((league) => (
                                    <button
                                        key={league.id}
                                        onClick={() => {
                                            setSelectedLeague(league.id);
                                            setPage(0);
                                            setIsDropdownOpen(false);
                                        }}
                                        className={`w-full px-3 py-2 text-left text-xs font-semibold flex items-center gap-2 hover:bg-slate-50 ${selectedLeague === league.id ? "bg-emerald-50 text-emerald-700" : "text-slate-700"}`}
                                    >
                                        <img src={league.icon} alt="" className="w-5 h-5 object-contain" />
                                        <span>{league.name}</span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="flex gap-1">
                        <button 
                            disabled={page === 0}
                            onClick={() => setPage(p => p - 1)}
                            className="p-1.5 rounded-lg hover:bg-slate-50 disabled:opacity-20 transition-all border border-slate-200"
                        >
                            <ChevronLeftIcon className="w-3 h-3 text-slate-600" />
                        </button>
                        <button 
                            disabled={page >= totalPages - 1}
                            onClick={() => setPage(p => p + 1)}
                            className="p-1.5 rounded-lg hover:bg-slate-50 disabled:opacity-20 transition-all border border-slate-200"
                        >
                            <ChevronRightIcon className="w-3 h-3 text-slate-600" />
                        </button>
                    </div>
                </div>
            </div>

            <div className="p-6">
                <AnimatePresence mode="wait">
                    <motion.div 
                        key={`${selectedLeague}-${page}`}
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        transition={{ duration: 0.2 }}
                        className="grid grid-cols-1 md:grid-cols-3 gap-4"
                    >
                        {isLoading ? (
                            [...Array(3)].map((_, i) => (
                                <div key={i} className="h-44 bg-slate-50 animate-pulse rounded-xl border border-slate-100" />
                            ))
                        ) : paginatedFixtures?.length === 0 ? (
                            <div className="col-span-3 py-16 text-center">
                                <BoltIcon className="w-8 h-8 text-slate-200 mx-auto mb-3" />
                                <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">{t.dashboard.fixtures.no_matches}</p>
                            </div>
                        ) : (
                            paginatedFixtures?.map((match) => (
                                <div 
                                    key={match.id}
                                    className="bg-white border border-slate-200 p-5 rounded-xl transition-all hover:shadow-md hover:border-slate-300 group"
                                >
                                    <div className="flex justify-between items-center mb-6">
                                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${match.status === 'LIVE' ? 'bg-red-50 text-red-600' : 'bg-slate-100 text-slate-500'}`}>
                                            {match.status === 'scheduled' ? t.dashboard.fixtures.scheduled : match.status}
                                        </span>
                                        <div className="text-right">
                                            <div className="text-[10px] font-bold text-slate-900">
                                                {new Date(match.matchDate || match.kickoff || '').toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                            <div className="text-[9px] font-bold text-slate-400 uppercase">
                                                {new Date(match.matchDate || match.kickoff || '').toLocaleDateString(language === 'th' ? 'th-TH' : 'en-GB', { day: 'numeric', month: 'short' })}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between gap-3">
                                            <div className="flex items-center gap-3 truncate">
                                                <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center p-1.5 flex-shrink-0">
                                                    <img 
                                                        src={crestMap.get(match.homeTeam.toLowerCase()) || (match.homeTeamId ? `https://crests.football-data.org/${match.homeTeamId}.png` : `https://ui-avatars.com/api/?name=${match.homeTeam}&background=f8fafc&color=94a3b8&font-size=0.5&bold=true`)} 
                                                        alt="" 
                                                        className="w-full h-full object-contain"
                                                        onError={(e) => { (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${match.homeTeam.substring(0, 1)}&background=f8fafc&color=94a3b8`; }}
                                                    />
                                                </div>
                                                <span className="font-bold text-slate-700 text-xs truncate">{match.homeTeam}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between gap-3">
                                            <div className="flex items-center gap-3 truncate">
                                                <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center p-1.5 flex-shrink-0">
                                                    <img 
                                                        src={crestMap.get(match.awayTeam.toLowerCase()) || (match.awayTeamId ? `https://crests.football-data.org/${match.awayTeamId}.png` : `https://ui-avatars.com/api/?name=${match.awayTeam}&background=f8fafc&color=94a3b8&font-size=0.5&bold=true`)} 
                                                        alt="" 
                                                        className="w-full h-full object-contain"
                                                        onError={(e) => { (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${match.awayTeam.substring(0, 1)}&background=f8fafc&color=94a3b8`; }}
                                                    />
                                                </div>
                                                <span className="font-bold text-slate-700 text-xs truncate">{match.awayTeam}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-6 pt-4 border-t border-slate-100">
                                        <button
                                            onClick={() => setSelectedMatch(match)}
                                            className="w-full py-2 text-[10px] font-bold text-slate-600 uppercase tracking-widest hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all"
                                        >
                                            {t.dashboard.fixtures.view_match}
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>

            <AnimatePresence>
                {selectedMatch && selectedMatchContext ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-slate-950/55 backdrop-blur-[2px] flex items-center justify-center p-4"
                        onClick={() => setSelectedMatch(null)}
                    >
                        <motion.div
                            initial={{ y: 20, opacity: 0, scale: 0.98 }}
                            animate={{ y: 0, opacity: 1, scale: 1 }}
                            exit={{ y: 10, opacity: 0, scale: 0.98 }}
                            transition={{ duration: 0.2 }}
                            className="w-full max-w-3xl rounded-3xl border border-slate-200/80 bg-gradient-to-b from-white to-slate-50 shadow-[0_32px_80px_-24px_rgba(15,23,42,0.45)] overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="relative p-6 border-b border-slate-100 bg-gradient-to-r from-indigo-50/80 via-white to-sky-50/80">
                                <div className="absolute -top-16 -right-12 w-40 h-40 rounded-full bg-indigo-200/30 blur-3xl" />
                                <div className="absolute -bottom-20 -left-10 w-44 h-44 rounded-full bg-emerald-200/30 blur-3xl" />
                                <div className="flex items-start justify-between gap-3">
                                    <div className="relative">
                                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                                            {selectedLeagueData.name} - {new Date(selectedMatch.matchDate || selectedMatch.kickoff || '').toLocaleString(language === 'th' ? 'th-TH' : 'en-GB', { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => setSelectedMatch(null)}
                                        className="relative p-1.5 rounded-full hover:bg-white/80 text-slate-500 border border-slate-200/70"
                                    >
                                        <XMarkIcon className="w-5 h-5" />
                                    </button>
                                </div>

                                <div className="relative mt-6 grid grid-cols-[1fr_auto_1fr] items-center gap-6">
                                    <div className="text-center">
                                        <img
                                            src={crestMap.get(selectedMatch.homeTeam.toLowerCase()) || `https://ui-avatars.com/api/?name=${selectedMatch.homeTeam}&background=f8fafc&color=94a3b8&font-size=0.5&bold=true`}
                                            alt=""
                                            className="w-16 h-16 mx-auto object-contain drop-shadow-sm"
                                        />
                                        <p className="mt-2.5 text-2xl font-black text-slate-800 leading-none">{selectedMatch.homeTeam}</p>
                                    </div>
                                    <div className="text-xl font-black text-slate-400 tracking-widest">VS</div>
                                    <div className="text-center">
                                        <img
                                            src={crestMap.get(selectedMatch.awayTeam.toLowerCase()) || `https://ui-avatars.com/api/?name=${selectedMatch.awayTeam}&background=f8fafc&color=94a3b8&font-size=0.5&bold=true`}
                                            alt=""
                                            className="w-16 h-16 mx-auto object-contain drop-shadow-sm"
                                        />
                                        <p className="mt-2.5 text-2xl font-black text-slate-800 leading-none">{selectedMatch.awayTeam}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6">
                                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                                    <p className="text-center text-sm font-bold text-slate-800 mb-4 uppercase tracking-wider">
                                        {language === "th" ? "ข้อมูลแมตช์" : "Match Snapshot"}
                                    </p>
                                    <div className="grid grid-cols-2 gap-4 text-xs">
                                        <div className="rounded-xl border border-slate-200/80 bg-gradient-to-b from-slate-50 to-white p-4">
                                            <p className="text-slate-500 font-bold uppercase tracking-wide">{selectedMatch.homeTeam}</p>
                                            <div className="mt-2 space-y-1.5">
                                                <div className="flex items-center justify-between rounded-lg bg-white border border-slate-200 px-3 py-2">
                                                    <span className="text-slate-500">{language === "th" ? "อันดับ" : "Position"}</span>
                                                    <span className="font-black text-slate-800">{selectedMatchContext.homeStanding?.position ?? "-"}</span>
                                                </div>
                                                <div className="flex items-center justify-between rounded-lg bg-white border border-slate-200 px-3 py-2">
                                                    <span className="text-slate-500">{language === "th" ? "แต้ม" : "Points"}</span>
                                                    <span className="font-black text-slate-800">{selectedMatchContext.homeStanding?.points ?? "-"}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="rounded-xl border border-slate-200/80 bg-gradient-to-b from-slate-50 to-white p-4">
                                            <p className="text-slate-500 font-bold uppercase tracking-wide">{selectedMatch.awayTeam}</p>
                                            <div className="mt-2 space-y-1.5">
                                                <div className="flex items-center justify-between rounded-lg bg-white border border-slate-200 px-3 py-2">
                                                    <span className="text-slate-500">{language === "th" ? "อันดับ" : "Position"}</span>
                                                    <span className="font-black text-slate-800">{selectedMatchContext.awayStanding?.position ?? "-"}</span>
                                                </div>
                                                <div className="flex items-center justify-between rounded-lg bg-white border border-slate-200 px-3 py-2">
                                                    <span className="text-slate-500">{language === "th" ? "แต้ม" : "Points"}</span>
                                                    <span className="font-black text-slate-800">{selectedMatchContext.awayStanding?.points ?? "-"}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-5 grid md:grid-cols-2 gap-4">
                                    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                                        <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                                            {language === "th" ? `โปรแกรมถัดไปของ ${selectedMatch.homeTeam}` : `Next fixtures: ${selectedMatch.homeTeam}`}
                                        </p>
                                        <div className="space-y-2">
                                            {selectedMatchContext.homeNext.length > 0 ? selectedMatchContext.homeNext.map((f) => (
                                                <div key={f.id} className="text-xs text-slate-700 bg-gradient-to-r from-slate-50 to-slate-100/70 rounded-xl px-3 py-2.5 border border-slate-200/70">
                                                    <div className="mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                                                        {new Date(f.matchDate || f.kickoff || '').toLocaleDateString(language === 'th' ? 'th-TH' : 'en-GB', {
                                                            weekday: 'short',
                                                            day: 'numeric',
                                                            month: 'short',
                                                        })}{" "}
                                                        •{" "}
                                                        {new Date(f.matchDate || f.kickoff || '').toLocaleTimeString([], {
                                                            hour: '2-digit',
                                                            minute: '2-digit',
                                                        })}
                                                    </div>
                                                    <div className="flex flex-col items-center gap-1.5">
                                                        <div className="flex items-center gap-2 min-w-0">
                                                        <img
                                                            src={crestMap.get(f.homeTeam.toLowerCase()) || `https://ui-avatars.com/api/?name=${f.homeTeam}&background=f8fafc&color=94a3b8&font-size=0.5&bold=true`}
                                                            alt=""
                                                            className="w-4 h-4 object-contain"
                                                        />
                                                        <span className="font-semibold truncate">{f.homeTeam}</span>
                                                        </div>
                                                        <span className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">vs</span>
                                                        <div className="flex items-center gap-2 min-w-0">
                                                        <img
                                                            src={crestMap.get(f.awayTeam.toLowerCase()) || `https://ui-avatars.com/api/?name=${f.awayTeam}&background=f8fafc&color=94a3b8&font-size=0.5&bold=true`}
                                                            alt=""
                                                            className="w-4 h-4 object-contain"
                                                        />
                                                        <span className="font-semibold truncate">{f.awayTeam}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            )) : (
                                                <p className="text-xs text-slate-400">{language === "th" ? "ไม่มีข้อมูลเพิ่มเติม" : "No more fixtures found"}</p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                                        <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                                            {language === "th" ? `โปรแกรมถัดไปของ ${selectedMatch.awayTeam}` : `Next fixtures: ${selectedMatch.awayTeam}`}
                                        </p>
                                        <div className="space-y-2">
                                            {selectedMatchContext.awayNext.length > 0 ? selectedMatchContext.awayNext.map((f) => (
                                                <div key={f.id} className="text-xs text-slate-700 bg-gradient-to-r from-slate-50 to-slate-100/70 rounded-xl px-3 py-2.5 border border-slate-200/70">
                                                    <div className="mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                                                        {new Date(f.matchDate || f.kickoff || '').toLocaleDateString(language === 'th' ? 'th-TH' : 'en-GB', {
                                                            weekday: 'short',
                                                            day: 'numeric',
                                                            month: 'short',
                                                        })}{" "}
                                                        •{" "}
                                                        {new Date(f.matchDate || f.kickoff || '').toLocaleTimeString([], {
                                                            hour: '2-digit',
                                                            minute: '2-digit',
                                                        })}
                                                    </div>
                                                    <div className="flex flex-col items-center gap-1.5">
                                                        <div className="flex items-center gap-2 min-w-0">
                                                        <img
                                                            src={crestMap.get(f.homeTeam.toLowerCase()) || `https://ui-avatars.com/api/?name=${f.homeTeam}&background=f8fafc&color=94a3b8&font-size=0.5&bold=true`}
                                                            alt=""
                                                            className="w-4 h-4 object-contain"
                                                        />
                                                        <span className="font-semibold truncate">{f.homeTeam}</span>
                                                        </div>
                                                        <span className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">vs</span>
                                                        <div className="flex items-center gap-2 min-w-0">
                                                        <img
                                                            src={crestMap.get(f.awayTeam.toLowerCase()) || `https://ui-avatars.com/api/?name=${f.awayTeam}&background=f8fafc&color=94a3b8&font-size=0.5&bold=true`}
                                                            alt=""
                                                            className="w-4 h-4 object-contain"
                                                        />
                                                        <span className="font-semibold truncate">{f.awayTeam}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            )) : (
                                                <p className="text-xs text-slate-400">{language === "th" ? "ไม่มีข้อมูลเพิ่มเติม" : "No more fixtures found"}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                ) : null}
            </AnimatePresence>
        </div>
    );
}
