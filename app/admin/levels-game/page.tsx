"use client";

import React, { useState, useEffect } from "react";
import StatCard from "../_components/StatCard";

const formatINR = (value: number) => {
return value.toLocaleString("en-IN");
};

export default function LevelsGameAdminPage() {
  const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:10000";

  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalGames: 0,
    activePools: 0,
    totalUsers: 0,
    totalPayouts: 0,
  });

  const [games, setGames] = useState<any[]>([]);
  const [activeLevels, setActiveLevels] = useState<any[]>([]);
  const [selectedGameId, setSelectedGameId] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const [newGameForm, setNewGameForm] = useState({
    name: "",
    entryFee: 0,
  });

  const [isAddPoolModalOpen, setIsAddPoolModalOpen] = useState(false);
  const [newPoolForm, setNewPoolForm] = useState({
    gameTypeId: "",
    level: 1,
    requiredCount: 4,
    levelEntryFee: 100,
  });

  /* ================= FETCH DATA ================= */

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const fetchJSON = async (url: string) => {
        const res = await fetch(url);
        if (!res.ok) {
          console.warn(`Admin API responded with ${res.status}: ${url}`);
          return null;
        }
        const contentType = res.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          console.warn(`Admin API did not return JSON: ${url}`);
          return null;
        }
        return res.json();
      };

      // 1. Fetch Stats
      const statsData = await fetchJSON(`${BASE_URL}/api/admin/level-games/stats`);
      if (statsData) setStats(statsData);

      // 2. Fetch All Level Games
      const gamesData = await fetchJSON(`${BASE_URL}/api/admin/level-games`);
      if (gamesData) setGames(Array.isArray(gamesData) ? gamesData : []);

      // 3. Fetch Active Pools
      const levelsUrl = selectedGameId === "All" 
        ? `${BASE_URL}/api/admin/levels` 
        : `${BASE_URL}/api/admin/levels?levelGameId=${selectedGameId}`;
      const levelsData = await fetchJSON(levelsUrl);
      if (levelsData) setActiveLevels(Array.isArray(levelsData) ? levelsData : []);

    } catch (err) {
      console.error("Error fetching admin data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedGameId]);

  /* ================= ACTIONS ================= */

  const handleCreateGame = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${BASE_URL}/api/admin/level-games`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newGameForm),
      });
      const data = await res.json();
      if (data.success) {
        setIsCreateModalOpen(false);
        setNewGameForm({ name: "", entryFee: 0 });
        fetchData(); // refresh
      }
    } catch (err) {
      console.error("Error creating game:", err);
    }
  };

  const handleForceComplete = async (poolId: string) => {
    if (!confirm("Are you sure you want to force complete this pool?")) return;
    try {
      const res = await fetch(`${BASE_URL}/api/admin/levels/force-complete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ poolId }),
      });
      const data = await res.json();
      if (data.success) {
        fetchData();
      }
    } catch (err) {
      console.error("Force complete error:", err);
    }
  };

  const handleCreatePool = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${BASE_URL}/api/admin/levels`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPoolForm),
      });

      if (!res.ok) {
        console.error(`Post Level failed with status ${res.status}`);
        alert(`Server Error (${res.status}): Please ensure your backend is running.`);
        return;
      }

      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        console.warn(`Post Level did not return JSON. Content-Type: ${contentType}`);
        alert("The server returned an invalid response (HTML instead of JSON).");
        return;
      }

      const data = await res.json();
      if (data.success) {
        setIsAddPoolModalOpen(false);
        fetchData();
      } else {
        alert(data.error || "Failed to create pool");
      }
    } catch (err) {
      console.error("Error creating pool:", err);
      alert("Network error: Please check your connection.");
    }
  };

  /* ================= UI ================= */

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="flex justify-between items-center bg-white border rounded-2xl p-6 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Level Game Management</h1>
          <p className="text-sm text-gray-500">Create and manage level-based games dynamically</p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => setIsAddPoolModalOpen(true)}
            className="border border-orange-600 text-orange-600 hover:bg-orange-50 px-6 py-2.5 rounded-xl font-bold transition-colors shadow-sm text-sm"
          >
            + Add Level Pool
          </button>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2.5 rounded-xl font-bold transition-colors shadow-sm text-sm"
          >
            + Create Game
          </button>
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon="🎮" value={stats.totalGames} label="Total Games" accentColor="#1e40af" />
        <StatCard icon="🌊" value={stats.activePools} label="Active Pools" accentColor="#16a34a" />
        <StatCard icon="👥" value={stats.totalUsers} label="Users Joined" accentColor="#d97706" />
        <StatCard icon="💰" value={`₹${formatINR(stats.totalPayouts)}`} label="Total Payouts" accentColor="#7c3aed" />
      </div>

      {/* FILTERS */}
      <div className="bg-white p-6 rounded-2xl flex flex-col md:flex-row gap-4 border shadow-sm">
        <div className="flex-1">
          <input
            placeholder="Search levels..."
            className="w-full border border-gray-200 px-4 py-2.5 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <select
          value={selectedGameId}
          onChange={(e) => setSelectedGameId(e.target.value)}
          className="border border-gray-200 px-4 py-2.5 rounded-xl bg-white outline-none focus:ring-2 focus:ring-orange-500 transition-all font-medium text-gray-700"
        >
          <option value="All">All Games</option>
          {Array.isArray(games) && games.map((game) => (
            <option key={game.id} value={game.id}>
              {game.name}
            </option>
          ))}
        </select>
      </div>

      {/* DATA TABLE */}
      <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
        <div className="p-6 border-b">
          <h3 className="font-bold text-lg text-gray-900">Active Level Pools</h3>
        </div>
        
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="p-12 text-center text-gray-400">Loading data...</div>
          ) : !Array.isArray(activeLevels) || activeLevels.length === 0 ? (
            <div className="p-12 text-center text-gray-400">No active pools found.</div>
          ) : (
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Level</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Game</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Progress</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Reward</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {activeLevels.map((level) => (
                  <tr key={level.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-bold text-gray-900">Level {level.level}</td>
                    <td className="px-6 py-4 text-gray-600">{level.gameName}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-100 h-2 rounded-full overflow-hidden">
                          <div 
                            className="bg-green-500 h-full transition-all duration-500" 
                            style={{ width: `${(level.currentUsers / level.requiredUsers) * 100}%` }}
                          />
                        </div>
                        <span className="text-xs font-bold text-gray-700">{level.currentUsers}/{level.requiredUsers}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-green-600 font-bold">₹{formatINR(level.reward)}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-[10px] font-bold uppercase">
                        {level.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => handleForceComplete(level.id)}
                        className="text-red-600 hover:text-red-800 text-xs font-bold"
                      >
                        Force Complete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* CREATE GAME MODAL */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b">
              <h2 className="text-xl font-bold text-gray-900">Create New Level Game</h2>
            </div>

            <form onSubmit={handleCreateGame} className="p-6 space-y-5">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Game Name</label>
                <input
                  required
                  placeholder="e.g. Super Mega Game"
                  className="w-full border border-gray-200 px-4 py-2.5 rounded-xl outline-none focus:ring-2 focus:ring-orange-500 transition-all"
                  value={newGameForm.name}
                  onChange={(e) => setNewGameForm({ ...newGameForm, name: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Initial Entry Fee (₹)</label>
                <input
                  type="number"
                  required
                  placeholder="1000"
                  className="w-full border border-gray-200 px-4 py-2.5 rounded-xl outline-none focus:ring-2 focus:ring-orange-500 transition-all"
                  value={newGameForm.entryFee || ""}
                  onChange={(e) => setNewGameForm({ ...newGameForm, entryFee: Number(e.target.value) })}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl font-bold text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-orange-600 hover:bg-orange-700 text-white px-4 py-2.5 rounded-xl font-bold transition-colors shadow-sm"
                >
                  Create Game
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD LEVEL POOL MODAL */}
      {isAddPoolModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b">
              <h2 className="text-xl font-bold text-gray-900">Add Level Pool</h2>
              <p className="text-xs text-gray-500">Initialize a new level for an existing game</p>
            </div>

            <form onSubmit={handleCreatePool} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Target Game</label>
                <select
                  required
                  className="w-full border border-gray-200 px-4 py-2.5 rounded-xl bg-white outline-none focus:ring-2 focus:ring-orange-500 transition-all font-medium text-gray-700"
                  value={newPoolForm.gameTypeId}
                  /* 
                     NEW LOGIC: When a game is selected, we automatically pull its base entry fee.
                     This ensures the "Fixed Fee" rule is followed across all levels.
                  */
                  onChange={(e) => {
                    const selectedId = e.target.value;
                    const game = games.find(g => g.id === selectedId);
                    setNewPoolForm({ 
                      ...newPoolForm, 
                      gameTypeId: selectedId,
                      // Set the fee to whatever the game's base entry fee is
                      levelEntryFee: game ? Number(game.entryFee) : 100 
                    });
                  }}
                >
                  <option value="">Select Game...</option>
                  {games.map(g => (
                    <option key={g.id} value={g.id}>{g.name} (Base Fee: ₹{g.entryFee})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Level #</label>
                  <input
                    type="number"
                    required
                    className="w-full border border-gray-200 px-4 py-2.5 rounded-xl outline-none focus:ring-2 focus:ring-orange-500"
                    value={newPoolForm.level}
                    /* 
                       When level changes, we update the required users (L * 4), 
                       but the Entry Fee remains FIXED to the base fee.
                    */
                    onChange={(e) => {
                        const lvl = Number(e.target.value);
                        setNewPoolForm({ 
                            ...newPoolForm, 
                            level: lvl,
                            // levelEntryFee: lvl * 100,  <-- REMOVED: No more multiplier
                            requiredCount: lvl * 4
                        });
                    }}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Required Users</label>
                  <input
                    type="number"
                    required
                    className="w-full border border-gray-200 px-4 py-2.5 rounded-xl outline-none focus:ring-2 focus:ring-orange-500"
                    value={newPoolForm.requiredCount}
                    onChange={(e) => setNewPoolForm({ ...newPoolForm, requiredCount: Number(e.target.value) })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Entry Fee (₹)</label>
                <input
                  type="number"
                  required
                  className="w-full border border-gray-200 px-4 py-2.5 rounded-xl outline-none focus:ring-2 focus:ring-orange-500"
                  value={newPoolForm.levelEntryFee}
                  onChange={(e) => {
                      const fee = Number(e.target.value);
                      setNewPoolForm({ ...newPoolForm, levelEntryFee: fee });
                  }}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Reward (₹) - STRICT 2x RULE</label>
                <input
                  disabled
                  className="w-full border border-gray-100 bg-gray-50 px-4 py-2.5 rounded-xl text-green-600 font-bold"
                  /* 
                    NEW RULE: Reward is exactly double the entry fee for all levels.
                    The logic is now: Pool Total - Reward = Platform Commission.
                  */
                  value={newPoolForm.levelEntryFee * 2}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsAddPoolModalOpen(false)}
                  className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl font-bold text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-orange-600 hover:bg-orange-700 text-white px-4 py-2.5 rounded-xl font-bold transition-colors shadow-sm"
                >
                  Initialize Level
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
