'use client';

import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CalendarDaysIcon, ChevronLeftIcon, ChevronRightIcon, BoltIcon } from '@heroicons/react/24/outline';
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
    { id: 'premier-league', name: 'Premier League', icon: 'https://crests.football-data.org/PL.png' },
    { id: 'la-liga', name: 'La Liga', icon: 'https://crests.football-data.org/PD.png' },
    { id: 'bundesliga', name: 'Bundesliga', icon: 'https://crests.football-data.org/BL1.png' },
    { id: 'thai-league', name: 'Thai League', icon: '🇹🇭' },
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

    const { data: fixtures, isLoading } = useQuery({
        queryKey: ['fixtures', selectedLeague],
        queryFn: () => fetchFixtures(selectedLeague),
    });

    const pageSize = 3;
    const paginatedFixtures = fixtures?.slice(page * pageSize, (page + 1) * pageSize);
    const totalPages = Math.ceil((fixtures?.length || 0) / pageSize);

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
                    <select 
                        value={selectedLeague}
                        onChange={(e) => {
                            setSelectedLeague(e.target.value);
                            setPage(0);
                        }}
                        className="bg-white border border-slate-200 text-slate-700 text-[10px] font-bold uppercase rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-slate-200 transition-all cursor-pointer"
                    >
                        {LEAGUES.map(league => (
                            <option key={league.id} value={league.id}>{league.name}</option>
                        ))}
                    </select>

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
                                <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">No matches scheduled</p>
                            </div>
                        ) : (
                            paginatedFixtures?.map((match) => (
                                <div 
                                    key={match.id}
                                    className="bg-white border border-slate-200 p-5 rounded-xl transition-all hover:shadow-md hover:border-slate-300 group"
                                >
                                    <div className="flex justify-between items-center mb-6">
                                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${match.status === 'LIVE' ? 'bg-red-50 text-red-600' : 'bg-slate-100 text-slate-500'}`}>
                                            {match.status}
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
                                                        src={match.homeTeamId ? `https://crests.football-data.org/${match.homeTeamId}.png` : `https://ui-avatars.com/api/?name=${match.homeTeam}&background=f8fafc&color=94a3b8&font-size=0.5&bold=true`} 
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
                                                        src={match.awayTeamId ? `https://crests.football-data.org/${match.awayTeamId}.png` : `https://ui-avatars.com/api/?name=${match.awayTeam}&background=f8fafc&color=94a3b8&font-size=0.5&bold=true`} 
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
                                        <button className="w-full py-2 text-[10px] font-bold text-slate-600 uppercase tracking-widest hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all">
                                            {t.dashboard.fixtures.view_match}
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}
