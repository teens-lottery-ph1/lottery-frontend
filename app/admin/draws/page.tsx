'use client';

import { useState } from 'react';
import Link from 'next/link';
import { draws } from '../_components/mock-data';
import StatCard from '../_components/StatCard';
import Badge from '../_components/Badge';




// Format currency to Indian format
const formatINR = (value: number) => {
  return value.toLocaleString('en-IN');
};

const formatDate = (date: Date) => {
  return new Date(date).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

const formatTime = (date: Date) => {
  return new Date(date).toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

export default function DrawsPage() {
  // API CALL: Backend endpoint to fetch all draws with filters
  // GET /api/admin/draws?status=&gameType=&search=
  // Description: Fetch paginated list of lottery draws with optional filtering
  // Query Params:
  //   - status: `'live'` | `'scheduled'` | `'completed'` | `'draft'`
  //   - gameType: Game type filter
  //   - search: Search by draw name
  // Response: { draws: [], totalCount: number }
  // GET /api/admin/draws?status=&gameType=&search=
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [gameTypeFilter, setGameTypeFilter] = useState('All');

  const filteredDraws = draws.filter((draw) => {
    const matchesSearch = draw.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === 'All' || draw.status === statusFilter.toLowerCase();
    const matchesGameType =
      gameTypeFilter === 'All' || draw.gameType === gameTypeFilter;
    return matchesSearch && matchesStatus && matchesGameType;
  });

  const liveDraws = 0;
  const scheduledDraws = 0;
  const completedDraws = 0;
  const totalPaid = 0;

  return (
    <div className="space-y-8">
      {/* STAT CARDS */}
      <div className="grid grid-cols-4 gap-6">
        <StatCard
          icon="🎰"
          value={liveDraws}
          label="Live Draws"
          accentColor="#16a34a"
        />
        <StatCard
          icon="⏳"
          value={scheduledDraws}
          label="Scheduled"
          accentColor="#1e40af"
        />
        <StatCard
          icon="✅"
          value={completedDraws}
          label="Completed"
          accentColor="#d97706"
        />
        <StatCard
          icon="💰"
          value={`₹${formatINR(totalPaid)}`}
          label="Total Prizes Paid"
          accentColor="#7c3aed"
        />
      </div>

      {/* TOOLBAR */}
      <div className="bg-white border border-[#e5e7eb] rounded-2xl p-6">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2 bg-[#f9fafb] border border-[#e5e7eb] rounded-xl px-4 py-2.5 focus-within:border-[#d97706] transition-colors">
              <span className="text-[13px]">🔍</span>
              <input
                type="text"
                placeholder="Search draws..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-transparent outline-none text-[#111827] text-[13px] w-48 placeholder:text-[#9ca3af]"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-[#f9fafb] border border-[#e5e7eb] rounded-xl px-4 py-2.5 text-[#4b5563] text-[13px] outline-none focus:border-[#d97706] transition-colors"
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
              className="bg-[#f9fafb] border border-[#e5e7eb] rounded-xl px-4 py-2.5 text-[#4b5563] text-[13px] outline-none focus:border-[#d97706] transition-colors"
            >
              <option>All</option>
              <option>Mega Millions</option>
              <option>Super Jackpot</option>
              <option>Power Ball</option>
              <option>Daily Draw</option>
            </select>
          </div>

          <Link
            href="/admin/draws/create"
            className="bg-[#d97706] text-white font-bold px-6 py-2.5 rounded-xl hover:bg-[#b45309] transition-colors text-[13px]"
          >
            🎯 Create Draw
          </Link>
        </div>
      </div>

      {/* DRAWS TABLE */}
      <div className="bg-white border border-[#e5e7eb] rounded-2xl p-6 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-[#e5e7eb]">
                <th className="py-3 px-4 text-left text-[11px] font-semibold text-[#4b5563] uppercase tracking-wider">
                  Draw Name
                </th>
                <th className="py-3 px-4 text-left text-[11px] font-semibold text-[#4b5563] uppercase tracking-wider">
                  Game Type
                </th>
                <th className="py-3 px-4 text-left text-[11px] font-semibold text-[#4b5563] uppercase tracking-wider">
                  Prize Pool
                </th>
                <th className="py-3 px-4 text-left text-[11px] font-semibold text-[#4b5563] uppercase tracking-wider">
                  Ticket Price
                </th>
                <th className="py-3 px-4 text-left text-[11px] font-semibold text-[#4b5563] uppercase tracking-wider">
                  Entries
                </th>
                <th className="py-3 px-4 text-left text-[11px] font-semibold text-[#4b5563] uppercase tracking-wider">
                  Status
                </th>
                <th className="py-3 px-4 text-left text-[11px] font-semibold text-[#4b5563] uppercase tracking-wider">
                  Draw Date
                </th>
                <th className="py-3 px-4 text-left text-[11px] font-semibold text-[#4b5563] uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredDraws.slice(0, 8).map((draw) => (
                <tr
                  key={draw.id}
                  className="border-b border-[#f3f4f6] hover:bg-[#f9fafb]"
                >
                  <td className="py-3 px-4">
                    <div>
                      <p className="font-semibold text-[#111827]">
                        {draw.name}
                      </p>
                      <p className="text-[11px] text-[#6b7280]">
                        {draw.description}
                      </p>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-[#4b5563]">
                    {draw.gameType}
                  </td>
                  <td className="py-3 px-4 font-bold text-[#d97706]">
                    ₹{formatINR(draw.prizePool)}
                  </td>
                  <td className="py-3 px-4 text-[#4b5563]">
                    ₹{formatINR(draw.ticketPrice)}
                  </td>
                  <td className="py-3 px-4 text-[#4b5563]">
                    {formatINR(draw.entries)} /
                    {formatINR(draw.maxEntries)}
                  </td>
                  <td className="py-3 px-4">
                    {draw.status === 'live' ? (
                      <span className="flex items-center gap-1">
                        <span className="w-2 h-2 bg-[#dc2626] rounded-full animate-pulse"></span>
                        <Badge label="LIVE" variant="red" />
                      </span>
                    ) : draw.status === 'scheduled' ? (
                      <Badge label="SCHEDULED" variant="blue" />
                    ) : draw.status === 'completed' ? (
                      <Badge label="COMPLETED" variant="gray" />
                    ) : (
                      <Badge label="DRAFT" variant="gray" />
                    )}
                  </td>
                  <td className="py-3 px-4 text-[#4b5563]">
                    {formatDate(draw.drawDate)} {formatTime(draw.drawDate)}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <button className="text-[#4b5563] hover:text-[#111827] text-[12px] font-medium">
                        ✎
                      </button>
                      <button className="text-[#1e40af] hover:text-[#1e3a8a] text-[12px] font-medium">
                        👁
                      </button>
                      <button className="text-[#dc2626] hover:text-[#b91c1c] text-[12px] font-medium">
                        ✕
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}