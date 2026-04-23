"use client";

import { useState, useEffect } from "react";
import { Calendar, Trophy, Search, ChevronRight, Users, Banknote, Sparkles, Filter, Hash } from "lucide-react";

interface DrawResult {
  id: string;
  drawId: string;
  drawName: string;
  gameTypeName: string;
  gameTypeIcon: string;
  winningNumbers: string;
  totalTicketsSold: number;
  totalPrizePaid: string;
  winnersCount: number;
  resultDeclaredAt: string;
  prizePool: string;
  drawDate: string;
}

export default function ResultsPage() {
  const [results, setResults] = useState<DrawResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:10000";

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await fetch(`${BASE}/api/draw-results`);
        const data = await res.json();
        if (data?.success) setResults(data.data);
      } catch (err) {
        console.error("Failed to fetch results:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, [BASE]);

  const gameTypes = [...new Set(results.map((r) => r.gameTypeName).filter(Boolean))];

  const filtered = results.filter((r) => {
    const q = search.toLowerCase();
    const matchSearch = r.drawName?.toLowerCase().includes(q) || r.gameTypeName?.toLowerCase().includes(q);
    const matchFilter = filter === "all" || r.gameTypeName === filter;
    return matchSearch && matchFilter;
  });

  return (
    <div className="min-h-screen bg-[#0a0f0d] text-white font-['Outfit',sans-serif] pb-24">

      {/* ── HERO ── */}
      <div className="relative h-[420px] flex items-center justify-center overflow-hidden">
        <div className="absolute top-[-60px] left-[-60px] w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-[-80px] right-[-80px] w-[400px] h-[400px] bg-yellow-400/8 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative z-10 text-center px-6 max-w-3xl">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" /> Latest Draw Results
          </span>
          <h1 className="text-5xl md:text-7xl font-black mb-4 tracking-tight leading-none">
            Celebrate the{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-yellow-400">
              Winners
            </span>
          </h1>
          <p className="text-lg text-gray-400 max-w-xl mx-auto leading-relaxed">
            Transparent, verifiable, and fair. Every result declared by our admins is permanently recorded and publicly visible.
          </p>
        </div>

        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#0a0f0d] to-transparent" />
      </div>

      {/* ── SEARCH & FILTER ── */}
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row gap-4 mb-10 items-center justify-between">
          <div className="relative w-full md:max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500/50" />
            <input
              type="text"
              placeholder="Search by draw or game name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white/[0.04] border border-white/10 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 transition-all"
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <Filter className="w-4 h-4 text-emerald-500 flex-shrink-0" />
            {["all", ...gameTypes].map((type) => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition-all capitalize ${
                  filter === type
                    ? "bg-emerald-500 text-black shadow-lg shadow-emerald-500/20"
                    : "bg-white/5 text-gray-400 hover:text-white border border-white/[0.08]"
                }`}
              >
                {type === "all" ? "All Draws" : type}
              </button>
            ))}
          </div>
        </div>

        {/* ── RESULTS LIST ── */}
        {loading ? (
          <div className="grid gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-44 w-full rounded-3xl bg-white/[0.02] border border-white/[0.06] animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24 bg-white/[0.02] rounded-3xl border border-white/[0.06]">
            <Trophy className="w-14 h-14 text-gray-700 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">No Results Yet</h3>
            <p className="text-gray-500 text-sm">Results will appear here once the admin declares them.</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {filtered.map((result) => (
              <div
                key={result.id}
                className="group relative rounded-3xl bg-white/[0.02] border border-white/[0.08] p-1 transition-all duration-500 hover:bg-white/[0.04] hover:border-emerald-500/30"
              >
                {/* Hover glow */}
                <div className="absolute inset-0 rounded-3xl bg-emerald-500/5 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

                <div className="relative flex flex-col lg:flex-row items-stretch gap-6 rounded-[22px] bg-[#0a0f0d] px-6 py-7 md:px-8">

                  {/* LEFT: Game & Draw info */}
                  <div className="flex-shrink-0 lg:w-60 border-b lg:border-b-0 lg:border-r border-white/[0.06] pb-6 lg:pb-0 lg:pr-8">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-11 h-11 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 text-lg">
                        {result.gameTypeIcon || "🏆"}
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-500">{result.gameTypeName || "Lottery"}</p>
                        <h3 className="text-base font-bold text-white leading-snug group-hover:text-emerald-400 transition-colors">
                          {result.drawName}
                        </h3>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Calendar className="w-3.5 h-3.5 text-emerald-500/50" />
                        {new Date(result.drawDate).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Hash className="w-3.5 h-3.5 text-emerald-500/50" />
                        Result ID: {result.id.slice(0, 8)}…
                      </div>
                    </div>
                  </div>

                  {/* CENTER: Winning Numbers */}
                  <div className="flex-grow flex flex-col justify-center gap-5">
                    <div className="flex flex-wrap items-center gap-3">
                      {(result.winningNumbers || "").split(",").map((num, idx, arr) => {
                        const isBonus = idx === arr.length - 1;
                        return (
                          <div
                            key={idx}
                            className={`relative w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center text-lg md:text-xl font-black transition-all duration-300 ${
                              isBonus
                                ? "bg-gradient-to-br from-yellow-400 to-orange-500 text-black shadow-[0_0_20px_rgba(234,179,8,0.4)]"
                                : "bg-gradient-to-br from-[#1a2e22] to-[#0d1a11] text-emerald-400 border border-emerald-500/25 shadow-[inset_0_0_12px_rgba(16,185,129,0.08)] group-hover:border-emerald-500/50"
                            }`}
                          >
                            {num.trim()}
                          </div>
                        );
                      })}
                    </div>
                    <div className="flex items-center gap-5 text-sm">
                      <div className="flex items-center gap-2 text-gray-400">
                        <Users className="w-4 h-4 text-emerald-500/60" />
                        <span>Winners: <b className="text-white">{result.winnersCount}</b></span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-400">
                        <Banknote className="w-4 h-4 text-emerald-500/60" />
                        <span>Paid: <b className="text-emerald-400">₹{parseFloat(result.totalPrizePaid || "0").toLocaleString("en-IN")}</b></span>
                      </div>
                    </div>
                  </div>

                  {/* RIGHT: Jackpot */}
                  <div className="flex-shrink-0 lg:w-44 flex flex-col justify-center items-end border-t lg:border-t-0 lg:border-l border-white/[0.06] pt-6 lg:pt-0 lg:pl-8 text-right">
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Jackpot</p>
                    <div className="text-3xl font-black text-white mb-5">
                      ₹{parseFloat(result.prizePool || "0").toLocaleString("en-IN")}
                    </div>
                    <button className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-white/5 hover:bg-emerald-500 hover:text-black transition-all duration-300 flex items-center gap-1.5 border border-white/[0.08]">
                      Details <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}