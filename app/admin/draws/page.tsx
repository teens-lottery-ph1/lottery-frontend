'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import StatCard from '../_components/StatCard';
import Badge from '../_components/Badge';
import DeclareResultModal from './_components/DeclareResultModal';

const formatINR = (value: number) => value.toLocaleString('en-IN');
const formatDate = (date: string) =>
  new Date(date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
const formatTime = (date: string) =>
  new Date(date).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

export default function DrawsPage() {
  const [draws, setDraws] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [gameTypeFilter, setGameTypeFilter] = useState('All');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDraw, setSelectedDraw] = useState<any>(null);

  const API = process.env.NEXT_PUBLIC_API_BASE_URL;

  const fetchDraws = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`${API}/api/draws`, { credentials: 'include' });
      if (!res.ok) throw new Error('Failed to fetch draws');
      const result = await res.json();
      const formatted = (result.data || []).map((d: any) => ({
        id: d.id,
        name: d.name,
        description: d.description,
        game_type: d.gameTypeName,
        prize_pool: Number(d.prizePool),
        ticket_price: Number(d.ticketPrice),
        max_entries: d.maxEntries,
        entries: d.currentEntries,
        status: d.status,
        draw_date: d.drawDate,
      }));
      setDraws(formatted);
    } catch (error) {
      console.error('Fetch Draws Error:', error);
      setDraws([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchDraws(); }, []);

  const filteredDraws = draws.filter((draw) => {
    const matchesSearch = draw.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || draw.status === statusFilter.toLowerCase();
    const matchesGameType = gameTypeFilter === 'All' || draw.game_type === gameTypeFilter;
    return matchesSearch && matchesStatus && matchesGameType;
  });

  const liveDraws = draws.filter((d) => d.status === 'live').length;
  const scheduledDraws = draws.filter((d) => d.status === 'scheduled').length;
  const completedDraws = draws.filter((d) => d.status === 'completed').length;
  const totalPrize = draws.reduce((sum, d) => sum + Number(d.prize_pool || 0), 0);

  return (
    <div className="space-y-8">
      {/* STAT CARDS */}
      <div className="grid grid-cols-4 gap-6">
        <StatCard icon="🎰" value={liveDraws} label="Live Draws" accentColor="#16a34a" />
        <StatCard icon="⏳" value={scheduledDraws} label="Scheduled" accentColor="#1e40af" />
        <StatCard icon="✅" value={completedDraws} label="Completed" accentColor="#d97706" />
        <StatCard icon="💰" value={`₹${formatINR(totalPrize)}`} label="Total Prize Pool" accentColor="#7c3aed" />
      </div>

      {/* TOOLBAR */}
      <div className="bg-white border border-[#e5e7eb] rounded-2xl p-6">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2 bg-[#f9fafb] border border-[#e5e7eb] rounded-xl px-4 py-2.5 focus-within:border-[#d97706]">
              🔍
              <input
                type="text"
                placeholder="Search draws..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-transparent outline-none text-[#111827] text-[13px]"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-[#f9fafb] border border-[#e5e7eb] rounded-xl px-4 py-2.5 text-[#111827] text-[13px]"
            >
              <option>All</option>
              <option>Live</option>
              <option>Scheduled</option>
              <option>Completed</option>
              <option>Draft</option>
            </select>

            <select
              value={gameTypeFilter}
              onChange={(e) => setGameTypeFilter(e.target.value)}
              className="bg-[#f9fafb] border border-[#e5e7eb] rounded-xl px-4 py-2.5 text-[#111827] text-[13px]"
            >
              <option>All</option>
              <option>Mega Millions</option>
              <option>Super Jackpot</option>
              <option>Power Ball</option>
              <option>Daily Draw</option>
            </select>
          </div>

          <Link href="/admin/draws/create" className="bg-[#d97706] text-white font-bold px-6 py-2.5 rounded-xl hover:bg-[#b45309] transition-colors">
            🎯 Create Draw
          </Link>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white border border-[#e5e7eb] rounded-2xl p-6 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-[#e5e7eb]">
                <th className="py-3 px-4 text-left text-[11px] font-semibold text-[#4b5563] uppercase">Draw Name</th>
                <th className="py-3 px-4 text-left text-[11px] font-semibold text-[#4b5563] uppercase">Game Type</th>
                <th className="py-3 px-4 text-left text-[11px] font-semibold text-[#4b5563] uppercase">Prize Pool</th>
                <th className="py-3 px-4 text-left text-[11px] font-semibold text-[#4b5563] uppercase">Ticket Price</th>
                <th className="py-3 px-4 text-left text-[11px] font-semibold text-[#4b5563] uppercase">Entries</th>
                <th className="py-3 px-4 text-left text-[11px] font-semibold text-[#4b5563] uppercase">Status</th>
                <th className="py-3 px-4 text-left text-[11px] font-semibold text-[#4b5563] uppercase">Draw Date</th>
                <th className="py-3 px-4 text-center text-[11px] font-semibold text-[#4b5563] uppercase">Action</th>
              </tr>
            </thead>

            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="text-center py-8 text-[#9ca3af]">Loading draws...</td>
                </tr>
              ) : filteredDraws.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-8 text-[#6b7280]">No draws found.</td>
                </tr>
              ) : (
                filteredDraws.map((draw) => (
                  <tr key={draw.id} className="border-b border-[#f3f4f6] hover:bg-[#fffbf0] transition-colors">
                    <td className="py-3 px-4 text-[#111827]">
                      <p className="font-semibold">{draw.name}</p>
                      <p className="text-[11px] text-[#6b7280]">{draw.description}</p>
                    </td>
                    <td className="py-3 px-4 text-[#4b5563]">{draw.game_type}</td>
                    <td className="py-3 px-4 font-bold text-[#d97706]">₹{formatINR(draw.prize_pool)}</td>
                    <td className="py-3 px-4 text-[#4b5563]">₹{formatINR(draw.ticket_price)}</td>
                    <td className="py-3 px-4 text-[#4b5563]">{draw.entries} / {draw.max_entries}</td>
                    <td className="py-3 px-4">
                      <Badge label={draw.status.toUpperCase()} variant="gray" />
                    </td>
                    <td className="py-3 px-4 text-[#4b5563]">
                      {formatDate(draw.draw_date)} {formatTime(draw.draw_date)}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {draw.status === 'live' ? (
                        <button
                          onClick={() => { setSelectedDraw(draw); setModalOpen(true); }}
                          className="bg-amber-100 text-amber-700 hover:bg-amber-500 hover:text-white px-3 py-1.5 rounded-lg font-bold text-[11px] border border-amber-200 transition-all"
                        >
                          🏆 Declare Result
                        </button>
                      ) : (
                        <span className="text-gray-300">—</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL */}
      <DeclareResultModal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setSelectedDraw(null); }}
        draw={selectedDraw}
        onSuccess={() => { fetchDraws(); }}
      />
    </div>
  );
}