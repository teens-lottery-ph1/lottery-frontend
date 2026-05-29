"use client";

import { useState, useEffect } from "react";
import { Gamepad2, ArrowUpRight, History, Lock, Unlock, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";

/* ================= IMPORTANT =================
This page contains TWO systems:

1. 🎮 Level Game System (NEW - dynamic, API based)
2. 🏆 VIP Levels System (OLD - static, keep unchanged)
DO NOT MIX BOTH
============================================= */

export default function LevelsPage() {
  const router = useRouter();
  const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:10000";

  const [games, setGames] = useState<any[]>([]);
  const [activeGameId, setActiveGameId] = useState<string | null>(null);
  const [wallet, setWallet] = useState({ available: 0, locked: 0 });
  const [gameLevels, setGameLevels] = useState<any[]>([]);
  const [userEntries, setUserEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  /* ================= FETCH DATA ================= */

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/level-games`, { credentials: "include" });
        const data = await res.json();
        const gamesList = Array.isArray(data) ? data : [];
        setGames(gamesList);
        if (gamesList.length > 0 && !activeGameId) {
          setActiveGameId(gamesList[0].id);
        }
      } catch (err) {
        console.error("Error fetching games:", err);
      }
    };

    fetchGames();
  }, []);

  useEffect(() => {
    if (!activeGameId) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const fetchJSON = async (url: string) => {
          const res = await fetch(url, { credentials: "include" });
          if (!res.ok) {
            console.warn(`API responded with ${res.status}: ${url}`);
            return null;
          }
          const contentType = res.headers.get("content-type");
          if (!contentType || !contentType.includes("application/json")) {
            console.warn(`API did not return JSON: ${url}`);
            return null;
          }
          return res.json();
        };

        // 1. Get levels (pools)
        const levelsData = await fetchJSON(`${BASE_URL}/api/levels?levelGameId=${activeGameId}`);
        if (levelsData) setGameLevels(Array.isArray(levelsData) ? levelsData : []);

        // 2. Get user entries
        const entriesData = await fetchJSON(`${BASE_URL}/api/levels/my-entries?levelGameId=${activeGameId}`);
        if (entriesData) setUserEntries(Array.isArray(entriesData) ? entriesData : []);

        // 3. Get wallet
        const walletData = await fetchJSON(`${BASE_URL}/api/wallet`);
        if (walletData && typeof walletData === "object") {
          setWallet(walletData);
        }
      } catch (err) {
        console.error("Error fetching level data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [activeGameId]);

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
   * This navigates the user to the wallet/payment page with the fixed fee.
   * 
   * @param poolId - The unique ID of the pool in the database.
   * @param fee - The fixed entry fee for this game.
   */
  const handleJoinLevel = async (poolId: string, fee: number) => {
    // We pass the fee as an 'amount' parameter to the wallets page.
    // The wallets page will handle the actual wallet deduction or payment.
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
                className={`px-3 py-1 rounded text-black flex items-center gap-1 ${wallet.available > 0 ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-gray-600 cursor-not-allowed'}`}
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
              {Array.from({ length: 12 }, (_, i) => i).map((lvlNum) => {
                // 1. Try to find the active pool for this level in the API state
                const validLevels = Array.isArray(gameLevels) ? gameLevels : [];
                const g = validLevels.find(p => Number(p.level) === lvlNum);
                const validEntries = Array.isArray(userEntries) ? userEntries : [];
                
                // 2. Determine if the level is joinable based on our unlock logic
                const unlocked = isLevelUnlocked(lvlNum, g);
                
                /* ================= NEW FINANCIAL MODEL ================= */
                const activeGame = games.find(game => game.id === activeGameId);
                const baseFee = activeGame?.entryFee ? Number(activeGame.entryFee) : 100;
                const feeModel = activeGame?.feeModel || 'fixed'; // Defaults to fixed if not specified
                
                // Calculate entry fee based on fee model
                const entryFee = feeModel === 'variable' ? baseFee * Math.max(1, lvlNum) : baseFee; 

                // Reward is 2x the entry fee
                const reward = entryFee * 2;
                
                /* ================= OTHER DATA ================= */
                const currentUsers = g?.currentUsers || 0;
                // Capacity = 4
                const requiredUsers = g?.requiredUsers || 4; 
                const id = g?.id || `placeholder-${lvlNum}`;

                const isCompleted = g?.status === 'completed' || g?.is_closed || currentUsers >= requiredUsers;
                // Backend returns status: 'active' for successfully joined entries
                // We should also ensure the entry matches the current game. If gameId is missing, we check gameName as fallback, but ideally backend provides it.
                const hasJoined = validEntries.some(e => 
                  Number(e.level) === lvlNum && 
                  (e.status === 'active' || e.status === 'paid') &&
                  (Number(e.gameId) === Number(activeGameId) || (!e.gameId))
                );

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
                      <div className="flex items-center gap-2">
                        {isCompleted && (
                          <span className="text-[10px] bg-yellow-500/20 text-yellow-500 px-2 py-0.5 rounded font-bold uppercase tracking-wider border border-yellow-500/30">
                            Completed
                          </span>
                        )}
                        {hasJoined && (
                          <span className="text-[10px] bg-green-500/20 text-green-400 px-2 py-0.5 rounded font-bold uppercase tracking-wider border border-green-500/30">
                            Already Joined
                          </span>
                        )}
                        {unlocked ? (
                          <Unlock size={14} className="text-green-500" />
                        ) : (
                          <Lock size={14} className="text-red-500" />
                        )}
                      </div>
                    </div>
                    <div className="mb-4">
                      <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">Progress</p>
                      <div className="flex justify-between items-end mb-1">
                        <span className="text-xl font-black text-white">{currentUsers}/{requiredUsers}</span>
                      </div>
                      <div className="h-1.5 w-full bg-gray-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.5)]"
                          style={{ width: `${(currentUsers / requiredUsers) * 100}%` }}
                        />
                      </div>
                    </div>
                    <div className="mb-6">
                      <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">Reward</p>
                      <p className="text-2xl font-black text-yellow-500">₹{reward}</p>
                    </div>
                    <button
                      disabled={!unlocked || isCompleted || hasJoined}
                      onClick={() => {
                        const joinId = g?.id || `placeholder-${activeGameId}-${lvlNum}`;
                        handleJoinLevel(joinId, entryFee);
                      }}
                      className={`w-full font-bold py-2 rounded transition-colors flex items-center justify-center gap-2 ${
                        unlocked && !isCompleted && !hasJoined
                          ? "bg-white text-black hover:bg-yellow-500" 
                          : "bg-gray-800 text-gray-500 cursor-not-allowed"
                      }`}
                    >
                      {hasJoined ? "ALREADY JOINED" : isCompleted ? "COMPLETED" : !unlocked ? "LOCKED" : "JOIN"}
                      {unlocked && !isCompleted && !hasJoined && <ChevronRight size={16} />}
                    </button>
                  </motion.div>
                );
              })}
            </div>
          )}
          

          {/* ================= USER ENTRIES ================= */}

          <div className="bg-gray-900 p-6 rounded-xl">
            <h2 className="font-bold flex items-center gap-2 mb-4 text-xl">
              <History size={18} className="text-yellow-500" /> My Entries
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
                    <div className="flex flex-col">
                      <span className="text-gray-300">
                        <span className="text-yellow-500 font-bold uppercase mr-1">
                          {e.gameName || "Level Game"}
                        </span>
                        (Level {e.level})
                      </span>
                      <div className="mt-1">
                        {e.status === 'paid' ? (
                          <span className="text-[10px] bg-green-500/20 text-green-400 px-2 py-0.5 rounded font-bold uppercase tracking-wider border border-green-500/30">
                            Paid Out
                          </span>
                        ) : (
                          <span className="text-[10px] bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded font-bold uppercase tracking-wider border border-blue-500/30">
                            Active
                          </span>
                        )}
                      </div>
                    </div>
                    <span className="text-green-400 font-black self-center text-lg">₹{e.amount}</span>
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
