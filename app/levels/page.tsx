"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  Gamepad2, ArrowUpRight, History, Unlock,
  ChevronRight, CheckCircle2, Clock, Users
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

/* ================= IMPORTANT =================
This page contains TWO systems:
1. 🎮 Level Game System (NEW - dynamic, API based)
2. 🏆 VIP Levels System (OLD - static, keep unchanged)
DO NOT MIX BOTH
============================================= */

// ─── Types ────────────────────────────────────────────────────────────────────
interface LevelPool {
  id: string;
  level: number;
  currentUsers: number;
  requiredUsers: number;
  status: "filling" | "completed";
  gameName: string;
  entryFee: string;
  reward: number;
  createdAt?: string;
}

interface UserEntry {
  id: string;
  level: number;
  amount: string;
  createdAt: string;
  status: string;
  gameName: string;
  poolStatus: string;
  currentCount: number;
  requiredCount: number;
}

// ─── Level × 4 rule ────────────────────────────────────────────────────────
const requiredForLevel = (lvl: number) => lvl * 4;
// L1=4  L2=8  L3=12  L4=16  L5=20  L6=24  L7=28  L8=32  L9=36  L10=40

export default function LevelsPage() {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const BASE_URL     = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:10000";

  const [games,        setGames]        = useState<any[]>([]);
  const [activeGameId, setActiveGameId] = useState<string | null>(null);
  const [wallet,       setWallet]       = useState({ available: 0, locked: 0 });
  const [gameLevels,   setGameLevels]   = useState<LevelPool[]>([]);
  const [userEntries,  setUserEntries]  = useState<UserEntry[]>([]);
  const [loading,      setLoading]      = useState(true);

  // Flash animation: track levels that just completed this session
  const [justCompleted, setJustCompleted] = useState<Set<number>>(new Set());
  const prevLevelsRef = useRef<LevelPool[]>([]);

  // ─── Fetch helpers ──────────────────────────────────────────────────────────
  const fetchJSON = useCallback(async (url: string) => {
    try {
      const res = await fetch(url, {
        credentials: "include",
        headers: { "Cache-Control": "no-cache" },
      });
      if (!res.ok) return null;
      if (!res.headers.get("content-type")?.includes("application/json")) return null;
      return res.json();
    } catch { return null; }
  }, []);

  const fetchWallet  = useCallback(async () => {
    const data = await fetchJSON(`${BASE_URL}/api/wallet`);
    if (data && typeof data === "object") setWallet(data);
  }, [BASE_URL, fetchJSON]);

  const fetchEntries = useCallback(async () => {
    const data = await fetchJSON(`${BASE_URL}/api/levels/my-entries`);
    if (Array.isArray(data)) setUserEntries(data);
  }, [BASE_URL, fetchJSON]);

  const fetchLevels  = useCallback(async (gameId: string) => {
    const data = await fetchJSON(`${BASE_URL}/api/levels?levelGameId=${gameId}`);
    if (!Array.isArray(data)) return;

    const incoming: LevelPool[] = data;

    // Detect newly completed levels → trigger green flash
    const prev = prevLevelsRef.current;
    const newlyDone = new Set<number>();
    incoming.forEach(pool => {
      if (pool.status !== "completed") return;
      const lvl = Number(pool.level);
      const wasAlreadyCompleted = prev.some(p => Number(p.level) === lvl && p.status === "completed");
      if (!wasAlreadyCompleted) newlyDone.add(lvl);
    });

    if (newlyDone.size > 0) {
      setJustCompleted(prev => new Set([...prev, ...newlyDone]));
      setTimeout(() => {
        setJustCompleted(prev => {
          const next = new Set(prev);
          newlyDone.forEach(l => next.delete(l));
          return next;
        });
      }, 3500);
    }

    prevLevelsRef.current = incoming;
    setGameLevels(incoming);
  }, [BASE_URL, fetchJSON]);

  // ─── Load game list on mount ────────────────────────────────────────────────
  useEffect(() => {
    (async () => {
      const data = await fetchJSON(`${BASE_URL}/api/level-games`);
      const list = Array.isArray(data) ? data : [];
      setGames(list);
      if (list.length > 0) setActiveGameId(String(list[0].id));
    })();
  }, [BASE_URL, fetchJSON]);

  // ─── Poll every 3 s ────────────────────────────────────────────────────────
  useEffect(() => {
    if (!activeGameId) return;

    const refresh = () => Promise.all([
      fetchLevels(activeGameId),
      fetchEntries(),
      fetchWallet(),
    ]);

    setLoading(true);
    refresh().finally(() => setLoading(false));

    const timer = setInterval(refresh, 3000);
    return () => clearInterval(timer);
  }, [activeGameId, fetchLevels, fetchEntries, fetchWallet]);

  // ─── Re-sync after returning from wallet page ───────────────────────────────
  useEffect(() => {
    if (searchParams?.get("from") === "level-game" && activeGameId) {
      fetchLevels(activeGameId);
      fetchEntries();
      fetchWallet();
    }
  }, [searchParams, activeGameId, fetchLevels, fetchEntries, fetchWallet]);

  // ─── Actions ────────────────────────────────────────────────────────────────
  const handleJoin = (poolId: string, fee: number) =>
    router.push(`/wallets?amount=${fee}&poolId=${poolId}&from=level-game`);

  const handleWithdraw = async () => {
    if (wallet.available <= 0) return;
    try {
      const res  = await fetch(`${BASE_URL}/api/withdraw`, {
        method:      "POST",
        headers:     { "Content-Type": "application/json" },
        credentials: "include",
        body:        JSON.stringify({ amount: wallet.available }),
      });
      const data = await res.json();
      if (data.success) { alert("Withdrawal successful!"); window.location.reload(); }
    } catch (e) { console.error(e); }
  };

  // ─── Per-level display state ────────────────────────────────────────────────
  const activeGame = games.find(g => String(g.id) === activeGameId);
  const baseFee    = activeGame?.entryFee ? Number(activeGame.entryFee) : 100;
  const reward     = baseFee * 2;

  /**
   * ✅ FIXED STATE LOGIC
   *
   * Backend now deduplicates pools — only ONE pool per level is returned.
   * completed pool → always shows required count (never 0)
   * filling pool   → shows live count
   */
  const getLevelState = (lvlNum: number) => {
    const required = requiredForLevel(lvlNum);

    const allPools      = gameLevels.filter(p => Number(p.level) === lvlNum);
    const completedPool = allPools.find(p => p.status === "completed") ?? null;
    const fillingPool   = allPools.find(p => p.status === "filling")   ?? null;

    // ✅ COMPLETED: if any completed pool exists → always COMPLETED, never goes back
    const isCompleted = !!completedPool;

    // ✅ FIX: completed always shows full count
    const currentUsers = isCompleted
      ? required
      : (fillingPool?.currentUsers ?? 0);

    const fillPct = isCompleted
      ? 100
      : Math.min((currentUsers / required) * 100, 100);

    // ✅ ALL levels are always OPEN — no pending, no lock
    // user can join any level anytime, completes when members fill up
    const isOpen = !isCompleted;

    return {
      pool:      fillingPool ?? completedPool,
      required,
      currentUsers,
      fillPct,
      isCompleted,
      isOpen,
      isPending: false,
      flashNow:  justCompleted.has(lvlNum),
    };
  };

  // ─── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="py-8 bg-black text-white min-h-screen">
      <div className="container px-4">

        {/* ══════════════ LEVEL GAME ══════════════ */}
        <div className="mb-16 space-y-8">

          {/* Header + Wallet */}
          <div className="flex flex-col md:flex-row justify-between gap-6 items-start">
            <div className="flex items-center gap-3">
              <Gamepad2 className="w-9 h-9 text-yellow-500" />
              <div>
                <h1 className="text-3xl font-black">Level Game</h1>
                <p className="text-gray-400 text-sm mt-0.5">Join pools • Earn rewards • Live updates</p>
              </div>
            </div>

            <div className="flex gap-5 p-4 bg-gray-900 rounded-2xl border border-gray-800 items-center">
              <div>
                <p className="text-[10px] text-gray-500 uppercase font-bold">Available</p>
                <p className="text-green-400 font-black text-xl">₹{wallet.available}</p>
              </div>
              <div className="w-px h-8 bg-gray-700" />
              <div>
                <p className="text-[10px] text-gray-500 uppercase font-bold">Locked</p>
                <p className="text-gray-400 font-black text-xl">₹{wallet.locked}</p>
              </div>
              <button
                onClick={handleWithdraw}
                disabled={wallet.available <= 0}
                className={`px-4 py-2 rounded-xl text-black font-black flex items-center gap-1.5 text-sm ${
                  wallet.available > 0
                    ? "bg-yellow-500 hover:bg-yellow-400 active:scale-95 transition-transform"
                    : "bg-gray-700 text-gray-500 cursor-not-allowed"
                }`}
              >
                Withdraw <ArrowUpRight size={14} />
              </button>
            </div>
          </div>

          {/* Game tabs */}
          {games.length > 0 && (
            <div className="flex flex-wrap gap-2 bg-gray-900/60 border border-gray-800 p-1.5 rounded-2xl w-fit">
              {games.map(g => (
                <button
                  key={g.id}
                  onClick={() => setActiveGameId(String(g.id))}
                  className={`px-5 py-2 rounded-xl font-bold text-sm transition-all ${
                    activeGameId === String(g.id)
                      ? "bg-yellow-500 text-black shadow-md"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  {g.name}
                </button>
              ))}
            </div>
          )}

          {/* ══════════ LEVELS GRID ══════════ */}
          {loading ? (
            <div className="flex items-center gap-3 text-gray-500 py-16 justify-center">
              <Clock className="animate-spin text-yellow-500" size={22} />
              <span className="text-gray-400 font-semibold">Loading levels...</span>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {Array.from({ length: 10 }, (_, i) => i + 1).map(lvlNum => {
                const {
                  pool, required, currentUsers, fillPct,
                  isCompleted, isOpen, isPending, flashNow,
                } = getLevelState(lvlNum);

                return (
                  <motion.div
                    key={lvlNum}
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: lvlNum * 0.04, duration: 0.3 }}
                    className={`relative p-4 rounded-2xl border transition-all duration-500 ${
                      isCompleted
                        ? flashNow
                          ? "bg-green-900/70 border-green-400 shadow-[0_0_28px_rgba(74,222,128,0.55)]"
                          : "bg-green-950/40 border-green-800/60"
                        : isOpen
                          ? "bg-gray-900/70 border-gray-700 hover:border-yellow-500/50"
                          : "bg-gray-900/15 border-gray-800/30 opacity-40 pointer-events-none"
                    }`}
                  >

                    {/* COMPLETED badge */}
                    <AnimatePresence>
                      {isCompleted && (
                        <motion.div
                          key="cbadge"
                          initial={{ scale: 0.5, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0.5, opacity: 0 }}
                          transition={{ type: "spring", stiffness: 300 }}
                          className="absolute -top-2.5 left-1/2 -translate-x-1/2 z-10 whitespace-nowrap"
                        >
                          <span className="flex items-center gap-1 text-[9px] font-black uppercase tracking-widest bg-green-500 text-black px-2.5 py-0.5 rounded-full shadow-lg">
                            <CheckCircle2 size={9} /> COMPLETED
                          </span>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Level number + status icon */}
                    <div className="flex justify-between items-center mb-3 mt-1">
                      <span className={`font-black text-sm ${
                        isCompleted ? "text-green-400" : isOpen ? "text-white" : "text-gray-600"
                      }`}>
                        Level {lvlNum}
                      </span>
                      {isCompleted
                        ? <CheckCircle2 size={14} className="text-green-500" />
                        : isOpen
                          ? <Unlock size={13} className="text-yellow-400" />
                          : <Clock size={13} className="text-gray-600" />
                      }
                    </div>

                    {/* Progress */}
                    <div className="mb-3">
                      <div className="flex justify-between items-center mb-1">
                        <span className={`text-xl font-black leading-none ${
                          isCompleted ? "text-green-400" : "text-white"
                        }`}>
                          {currentUsers}
                          <span className="text-gray-600 text-sm font-bold">/{required}</span>
                        </span>

                        <span className={`text-[8px] font-black uppercase px-1.5 py-0.5 rounded-full ${
                          isCompleted
                            ? "bg-green-900 text-green-400"
                            : isOpen
                              ? "bg-yellow-900/80 text-yellow-400"
                              : "bg-gray-800 text-gray-500"
                        }`}>
                          {isCompleted ? "FULL" : isOpen ? "OPEN" : "PENDING"}
                        </span>
                      </div>

                      {/* Animated progress bar */}
                      <div className="h-1.5 w-full bg-gray-800 rounded-full overflow-hidden">
                        <motion.div
                          className={`h-full rounded-full ${
                            isCompleted
                              ? "bg-green-500 shadow-[0_0_6px_rgba(74,222,128,0.6)]"
                              : "bg-yellow-500 shadow-[0_0_6px_rgba(234,179,8,0.5)]"
                          }`}
                          initial={false}
                          animate={{ width: `${fillPct}%` }}
                          transition={{ duration: 0.4, ease: "easeOut" }}
                        />
                      </div>
                    </div>

                    {/* Members info */}
                    <div className="flex items-center gap-1 mb-2">
                      <Users size={10} className="text-gray-600" />
                      <span className="text-[10px] text-gray-500 font-semibold">{required} members</span>
                    </div>

                    {/* Reward */}
                    <div className="mb-4">
                      <p className="text-[9px] text-gray-600 uppercase font-bold mb-0.5">Reward</p>
                      <p className={`text-xl font-black ${
                        isCompleted ? "text-green-400" : "text-yellow-500"
                      }`}>
                        ₹{reward}
                      </p>
                    </div>

                    {/* CTA button */}
                    <button
                      disabled={isCompleted || isPending}
                      onClick={() => {
                        if (isOpen) {
                          const joinId = pool?.id || `placeholder-${activeGameId}-${lvlNum}`;
                          handleJoin(joinId, baseFee);
                        }
                      }}
                      className={`w-full font-black py-2 rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 ${
                        isCompleted
                          ? "bg-green-900/40 text-green-500 cursor-not-allowed border border-green-800/40"
                          : isOpen
                            ? "bg-white text-black hover:bg-yellow-400 active:scale-95"
                            : "bg-gray-800/50 text-gray-600 cursor-not-allowed"
                      }`}
                    >
                      {isCompleted ? (
                        <><CheckCircle2 size={13} /> COMPLETED</>
                      ) : isOpen ? (
                        <>JOIN <ChevronRight size={13} /></>
                      ) : (
                        "PENDING"
                      )}
                    </button>
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* ══════════ MY ENTRIES ══════════ */}
          <div className="bg-gray-900/60 border border-gray-800 p-6 rounded-2xl">
            <h2 className="font-black flex items-center gap-2 mb-5 text-xl">
              <History size={18} className="text-yellow-500" />
              My Entries
              {userEntries.length > 0 && (
                <span className="text-xs bg-yellow-500 text-black font-black px-2 py-0.5 rounded-full">
                  {userEntries.length}
                </span>
              )}
            </h2>

            {userEntries.length === 0 ? (
              <p className="text-gray-500 text-sm">No entries yet. Join a level to get started!</p>
            ) : (
              <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
                {userEntries.map(e => {
                  const done    = e.poolStatus === "completed";
                  const entryRq = requiredForLevel(e.level);
                  // ✅ FIX: completed entries always show full count
                  const displayCount = done ? entryRq : (e.currentCount ?? 0);

                  return (
                    <div
                      key={e.id}
                      className={`flex justify-between p-3 rounded-xl border ${
                        done ? "bg-green-950/30 border-green-800/40" : "bg-black/40 border-gray-800"
                      }`}
                    >
                      <div className="flex flex-col gap-0.5">
                        <span className="text-sm font-semibold text-gray-200">
                          <span className="text-yellow-500 font-black uppercase mr-1">
                            {e.gameName || "Level Game"}
                          </span>
                          — Level {e.level}
                        </span>

                        <span className={`text-[10px] font-bold uppercase tracking-wide flex items-center gap-1 ${
                          done ? "text-green-400" : "text-yellow-400"
                        }`}>
                          <Users size={8} />
                          {done ? "COMPLETED ✓" : "In Progress"} ·{" "}
                          {displayCount}/{entryRq} players
                        </span>

                        <span className="text-[10px] text-gray-600">
                          {new Date(e.createdAt).toLocaleString("en-IN", {
                            day: "2-digit", month: "short", year: "numeric",
                            hour: "2-digit", minute: "2-digit",
                          })}
                        </span>
                      </div>

                      <div className="flex flex-col items-end justify-center gap-1.5 ml-3 shrink-0">
                        <span className="text-green-400 font-black">₹{e.amount}</span>
                        <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-lg ${
                          e.status === "paid"   ? "bg-green-900 text-green-400"   :
                          e.status === "active" ? "bg-yellow-900 text-yellow-400" :
                                                  "bg-gray-800 text-gray-400"
                        }`}>
                          {e.status}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>

        {/* ══════════ VIP SYSTEM (UNCHANGED) ══════════ */}
        <div className="text-center text-gray-700 text-xs mt-20 border-t border-gray-900 pt-8">
          <p>Legacy VIP System (maintained for compatibility)</p>
        </div>

      </div>
    </div>
  );
}