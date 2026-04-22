"use client";

import { useState, useEffect, useCallback } from "react";
import { Gamepad2, ArrowUpRight, History, Lock, Unlock, ChevronRight } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";

/* ================= IMPORTANT =================
This page contains TWO systems:

1. 🎮 Level Game System (NEW - dynamic, API based)
2. 🏆 VIP Levels System (OLD - static, keep unchanged)
DO NOT MIX BOTH
============================================= */

export default function LevelsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:10000";

  const [games, setGames] = useState<any[]>([]);
  const [activeGameId, setActiveGameId] = useState<string | null>(null);
  const [wallet, setWallet] = useState({ available: 0, locked: 0 });
  const [gameLevels, setGameLevels] = useState<any[]>([]);
  const [userEntries, setUserEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  /* ================= HELPERS ================= */

  const fetchJSON = useCallback(async (url: string) => {
    const res = await fetch(url, { credentials: "include" });
    if (!res.ok) { console.warn(`API ${res.status}: ${url}`); return null; }
    const ct = res.headers.get("content-type");
    if (!ct?.includes("application/json")) { console.warn(`Non-JSON: ${url}`); return null; }
    return res.json();
  }, []);

  /* ================= FETCH ALL ENTRIES (no game filter) ================= */
  // ✅ Called on load + every 5s + after every join
  // ✅ No ?levelGameId param — returns ALL entries for logged-in user
  const fetchAllEntries = useCallback(async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/levels/my-entries`, {
        credentials: "include",
        headers: { "Cache-Control": "no-cache" },
      });
      if (!res.ok) return;
      const data = await res.json();
      setUserEntries(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Entries fetch error:", err);
    }
  }, [BASE_URL]);

  /* ================= FETCH WALLET ================= */
  const fetchWallet = useCallback(async () => {
    const data = await fetchJSON(`${BASE_URL}/api/wallet`);
    if (data && typeof data === "object") setWallet(data);
  }, [BASE_URL, fetchJSON]);

  /* ================= FETCH LEVELS FOR ACTIVE GAME ================= */
  const fetchLevels = useCallback(async (gameId: string) => {
    const data = await fetchJSON(`${BASE_URL}/api/levels?levelGameId=${gameId}`);
    if (data) setGameLevels(Array.isArray(data) ? data : []);
  }, [BASE_URL, fetchJSON]);

  /* ================= INITIAL LOAD: games list ================= */
  useEffect(() => {
    const fetchGames = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/level-games`, { credentials: "include" });
        const data = await res.json();
        const gamesList = Array.isArray(data) ? data : [];
        setGames(gamesList);
        if (gamesList.length > 0) setActiveGameId(gamesList[0].id);
      } catch (err) {
        console.error("Error fetching games:", err);
      }
    };
    fetchGames();
  }, [BASE_URL]);

  /* ================= WHEN ACTIVE GAME CHANGES ================= */
  useEffect(() => {
    if (!activeGameId) return;

    const init = async () => {
      setLoading(true);
      await Promise.all([
        fetchLevels(activeGameId),
        fetchAllEntries(),   // ✅ All entries, no filter
        fetchWallet(),
      ]);
      setLoading(false);
    };

    init();

    // ✅ Real-time polling every 5 seconds
    const interval = setInterval(async () => {
      await fetchLevels(activeGameId);
      await fetchAllEntries();
      await fetchWallet();
    }, 5000);

    return () => clearInterval(interval);
  }, [activeGameId, fetchLevels, fetchAllEntries, fetchWallet]);

  /* ================= RE-FETCH WHEN RETURNING FROM WALLET PAGE ================= */
  // When user comes back from /wallets page after joining, refresh immediately
  useEffect(() => {
    const fromParam = searchParams?.get("from");
    if (fromParam === "level-game") {
      fetchAllEntries();
      fetchWallet();
    }
  }, [searchParams, fetchAllEntries, fetchWallet]);

  /* ================= ACTIONS ================= */

  /**
   * Check if a level is unlocked based on progression logic.
   * Standard logic: Level L is unlocked if L-2 is completed.
   * Special case: If admin has created a pool for a level but skipped intermediate ones (like L-2), 
   * we unlock it so it correctly reflects as joinable on the user screen.
   */
  const isLevelUnlocked = (levelNum: number, currentPool?: any) => {
    // All levels unlocked unconditionally as per requirements (No progression blocking)
    return true;

    /* 
    =================================================
    OLD PROGRESSION LOGIC (Commented out as requested)
    =================================================
    
    // Basic progression: Levels 1 and 2 are always joinable for new players
    if (levelNum <= 2) return true;

    const validLevels = Array.isArray(gameLevels) ? gameLevels : [];
    const validEntries = Array.isArray(userEntries) ? userEntries : [];
    
    // N+2 Logic: Level L is unlocked if L-2 is completed
    const prevPool = validLevels.find(p => Number(p.level) === levelNum - 2);
    
    // Check if the required previous level was completed in a pool or recorded in user entries
    const isPrevPoolCompleted = prevPool ? prevPool.status === 'completed' : false;
    const hasCompletedPrevEntry = validEntries.some(e => Number(e.level) === levelNum - 2 && e.status === 'paid' &&
      (e.levelGameId === activeGameId || e.gameId === activeGameId || (!e.levelGameId && !e.gameId))
    );
    
    if (isPrevPoolCompleted || hasCompletedPrevEntry) return true;

    // AUTO-UNLOCK FOR SKIPPED LEVELS:
    // If the admin has explicitly created a pool for this level (e.g. Level 4) 
    // but NO pool exists for Level 2 (skipped creation), we unlock it.
    // This ensures manually initialized high levels are playable.
    if (currentPool && !prevPool) return true;
    
    return false;
    */
  };

  /**
   * Action: Join a level pool.
   * Refresh entries immediately then navigate to wallet page.
   */
  const handleJoinLevel = async (poolId: string, fee: number) => {
    // ✅ Refresh before navigating so entries are fresh when we return
    await fetchAllEntries();
    router.push(`/wallets?amount=${fee}&poolId=${poolId}&from=level-game`);
  };

  const handleWithdraw = async () => {
    if (wallet.available <= 0) return;
    try {
      const res = await fetch(`${BASE_URL}/api/withdraw`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ amount: wallet.available }),
      });
      const data = await res.json();
      if (data.success) {
        alert("Withdrawal successful!");
        window.location.reload();
      }
    } catch (err) {
      console.error("Withdraw Error:", err);
    }
  };

  /* ================= UI ================= */

  return (
    <div className="py-8 bg-black text-white min-h-screen">
      <div className="container px-4">
        {/* ================= LEVEL GAME SECTION ================= */}

        <div className="mb-16 space-y-8">
          {/* HEADER + WALLET */}
          <div className="flex flex-col md:flex-row justify-between gap-6">
            <div className="flex items-center gap-3">
              <Gamepad2 className="w-8 h-8 text-yellow-500" />
              <div>
                <h1 className="text-3xl font-bold">Level Game</h1>
                <p className="text-gray-400 text-sm">Join pools and earn rewards</p>
              </div>
            </div>

            {/* WALLET */}
            <div className="flex gap-4 p-4 bg-gray-900 rounded-xl">
              <div>
                <p className="text-xs text-gray-500">Available</p>
                <p className="text-green-400 font-bold">₹{wallet.available}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Locked</p>
                <p className="text-gray-400 font-bold">₹{wallet.locked}</p>
              </div>
              <button
                onClick={handleWithdraw}
                disabled={wallet.available <= 0}
                className={`px-3 py-1 rounded text-black flex items-center gap-1 ${
                  wallet.available > 0 ? "bg-yellow-500 hover:bg-yellow-600" : "bg-gray-600 cursor-not-allowed"
                }`}
              >
                Withdraw <ArrowUpRight size={14} />
              </button>
            </div>
          </div>

          {/* ================= GAME SELECTOR (DYNAMIC) ================= */}
          <div className="flex flex-wrap gap-2 bg-gray-900 p-1 rounded-xl w-fit">
            {Array.isArray(games) && games.map((g) => (
              <button
                key={g.id}
                onClick={() => setActiveGameId(g.id)}
                className={`px-4 py-2 rounded ${
                  activeGameId === g.id ? "bg-yellow-500 text-black" : "text-gray-400"
                }`}
              >
                {g.name}
              </button>
            ))}
          </div>

          {/* ================= LEVELS GRID ================= */}
          {loading ? (
            <p className="text-gray-500">Loading levels...</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {/*
                RENDER LOOP: We show 10 potential levels.
                If a level exists in the database (g), we use its data (progress/ID).
                If it doesn't exist, we show it as a grayed-out placeholder.
              */}
              {Array.from({ length: 10 }, (_, i) => i + 1).map((lvlNum) => {
                const validLevels = Array.isArray(gameLevels) ? gameLevels : [];
                const g = validLevels.find(p => Number(p.level) === lvlNum);

                const unlocked = isLevelUnlocked(lvlNum, g);

                /* ================= NEW FINANCIAL MODEL (FIXED FEE) ================= */
                // RULE 1: Entry fee is FIXED — same for every level
                const activeGame = games.find(game => game.id === activeGameId);
                const baseFee = activeGame?.entryFee ? Number(activeGame.entryFee) : 100;
                const entryFee = baseFee;

                // RULE 2: Reward = 2x entry fee for ALL levels
                const reward = entryFee * 2;

                const currentUsers = g?.currentUsers || 0;
                // Required users scale with level (L*4) — higher levels harder to fill
                const requiredUsers = g?.requiredUsers || (lvlNum * 4);

                return (
                  <motion.div
                    key={lvlNum}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: lvlNum * 0.05 }}
                    className={`relative p-5 rounded-2xl border transition-all ${
                      unlocked
                        ? "bg-gray-900/50 border-gray-800 hover:border-yellow-500/50"
                        : "bg-gray-900/10 border-gray-700/30 opacity-60 grayscale"
                    }`}
                  >
                    {!unlocked && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-[2px] rounded-2xl z-10 p-4 text-center">
                        <Lock className="text-gray-500 mb-2" size={32} />
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Locked</p>
                        <p className="text-[9px] text-gray-500">Complete Level {lvlNum - 2} to unlock</p>
                      </div>
                    )}

                    <div className="flex justify-between items-start mb-4">
                      <h3 className="font-bold text-gray-400">Level {lvlNum}</h3>
                      {unlocked ? (
                        <Unlock size={14} className="text-green-500" />
                      ) : (
                        <Lock size={14} className="text-red-500" />
                      )}
                    </div>

                    <div className="mb-4">
                      <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">Progress</p>
                      <div className="flex justify-between items-end mb-1">
                        <span className="text-xl font-black text-white">{currentUsers}/{requiredUsers}</span>
                      </div>
                      <div className="h-1.5 w-full bg-gray-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.5)]"
                          style={{ width: `${Math.min((currentUsers / requiredUsers) * 100, 100)}%` }}
                        />
                      </div>
                    </div>

                    <div className="mb-6">
                      <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">Reward</p>
                      <p className="text-2xl font-black text-yellow-500">₹{reward}</p>
                    </div>

                    <button
                      disabled={!unlocked}
                      onClick={() => {
                        const joinId = g?.id || `placeholder-${activeGameId}-${lvlNum}`;
                        handleJoinLevel(joinId, entryFee);
                      }}
                      className={`w-full font-bold py-2 rounded transition-colors flex items-center justify-center gap-2 ${
                        unlocked
                          ? "bg-white text-black hover:bg-yellow-500"
                          : "bg-gray-800 text-gray-500 cursor-not-allowed"
                      }`}
                    >
                      {unlocked ? "JOIN" : "LOCKED"}
                      {unlocked && <ChevronRight size={16} />}
                    </button>
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* ================= MY ENTRIES — ALL GAMES, REAL-TIME ================= */}
          <div className="bg-gray-900 p-6 rounded-xl">
            <h2 className="font-bold flex items-center gap-2 mb-4 text-xl">
              <History size={18} className="text-yellow-500" /> My Entries
              {/* ✅ Live count badge */}
              {userEntries.length > 0 && (
                <span className="ml-2 text-xs bg-yellow-500 text-black font-bold px-2 py-0.5 rounded-full">
                  {userEntries.length}
                </span>
              )}
            </h2>

            {(!Array.isArray(userEntries) || userEntries.length === 0) ? (
              <p className="text-gray-500 text-sm">No entries yet.</p>
            ) : (
              <div className="space-y-3">
                {userEntries.map((e: any) => (
                  <div
                    key={e.id}
                    className="flex justify-between p-3 bg-black/50 rounded-lg border border-gray-800"
                  >
                    <div className="flex flex-col gap-0.5">
                      {/* Game name + level */}
                      <span className="text-gray-300">
                        <span className="text-yellow-500 font-bold uppercase mr-1">
                          {e.gameName || "Level Game"}
                        </span>
                        — Level {e.level}
                      </span>

                      {/* ✅ Live pool status */}
                      {e.poolStatus && (
                        <span className={`text-[10px] font-bold uppercase tracking-wide ${
                          e.poolStatus === "completed" ? "text-green-400" :
                          e.poolStatus === "filling"   ? "text-yellow-400" : "text-gray-500"
                        }`}>
                          Pool: {e.poolStatus} · {e.currentCount}/{e.requiredCount} players
                        </span>
                      )}

                      {/* Date */}
                      <span className="text-[10px] text-gray-600">
                        {new Date(e.createdAt).toLocaleString("en-IN", {
                          day: "2-digit", month: "short", year: "numeric",
                          hour: "2-digit", minute: "2-digit"
                        })}
                      </span>
                    </div>

                    <div className="flex flex-col items-end justify-center gap-1">
                      <span className="text-green-400 font-black">₹{e.amount}</span>
                      {/* Entry status badge */}
                      <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded ${
                        e.status === "paid"   ? "bg-green-900 text-green-400" :
                        e.status === "active" ? "bg-yellow-900 text-yellow-400" : "bg-gray-800 text-gray-400"
                      }`}>
                        {e.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ================= VIP SYSTEM (UNCHANGED) ================= */}
        <div className="text-center text-gray-600 text-sm mt-32 border-t border-gray-900 pt-8">
          <p>Legacy VIP System (maintained for compatibility)</p>
        </div>
      </div>
    </div>
  );
}