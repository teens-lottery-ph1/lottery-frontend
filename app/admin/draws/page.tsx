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

  const liveDraws = draws.filter((d) => d.status === 'live').length;
  const scheduledDraws = draws.filter(
    (d) => d.status === 'scheduled'
  ).length;
  const completedDraws = draws.filter(
    (d) => d.status === 'completed'
  ).length;
  const totalPaid = 4800000;

  return (
    <div className="space-y-8">
      {/* STAT CARDS */}
      <div className="grid grid-cols-4 gap-6">
        <StatCard
          icon="🎰"
          value={liveDraws}
          label="Live Draws"
          accentColor="#00d68f"
        />
        <StatCard
          icon="⏳"
          value={scheduledDraws}
          label="Scheduled"
          accentColor="#3d9eff"
        />
        <StatCard
          icon="✅"
          value={completedDraws}
          label="Completed"
          accentColor="#f5c518"
        />
        <StatCard
          icon="💰"
          value={`₹${formatINR(totalPaid)}`}
          label="Total Prizes Paid"
          accentColor="#a855f7"
        />
      </div>

      {/* TOOLBAR */}
      <div className="bg-[#0d1117] border border-[rgba(255,255,255,0.07)] rounded-2xl p-6">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2 bg-[#13191f] border border-[rgba(255,255,255,0.07)] rounded-xl px-4 py-2.5 focus-within:border-[#f5c518] transition-colors">
              <span className="text-[13px]">🔍</span>
              <input
                type="text"
                placeholder="Search draws..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-transparent outline-none text-[#e8edf3] text-[13px] w-48 placeholder:text-[#4a5568]"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-[#13191f] border border-[rgba(255,255,255,0.07)] rounded-xl px-4 py-2.5 text-[#8b9bb4] text-[13px] outline-none focus:border-[#f5c518] transition-colors"
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
              className="bg-[#13191f] border border-[rgba(255,255,255,0.07)] rounded-xl px-4 py-2.5 text-[#8b9bb4] text-[13px] outline-none focus:border-[#f5c518] transition-colors"
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
            className="bg-[#f5c518] text-black font-bold px-6 py-2.5 rounded-xl hover:bg-[#e6a800] transition-colors text-[13px]"
          >
            🎯 Create Draw
          </Link>
        </div>
      </div>

      {/* DRAWS TABLE */}
      <div className="bg-[#0d1117] border border-[rgba(255,255,255,0.07)] rounded-2xl p-6">
        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-[rgba(255,255,255,0.07)]">
                <th className="py-3 px-4 text-left text-[11px] font-semibold text-[#4a5568] uppercase tracking-wider">
                  Draw Name
                </th>
                <th className="py-3 px-4 text-left text-[11px] font-semibold text-[#4a5568] uppercase tracking-wider">
                  Game Type
                </th>
                <th className="py-3 px-4 text-left text-[11px] font-semibold text-[#4a5568] uppercase tracking-wider">
                  Prize Pool
                </th>
                <th className="py-3 px-4 text-left text-[11px] font-semibold text-[#4a5568] uppercase tracking-wider">
                  Ticket Price
                </th>
                <th className="py-3 px-4 text-left text-[11px] font-semibold text-[#4a5568] uppercase tracking-wider">
                  Entries
                </th>
                <th className="py-3 px-4 text-left text-[11px] font-semibold text-[#4a5568] uppercase tracking-wider">
                  Status
                </th>
                <th className="py-3 px-4 text-left text-[11px] font-semibold text-[#4a5568] uppercase tracking-wider">
                  Draw Date
                </th>
                <th className="py-3 px-4 text-left text-[11px] font-semibold text-[#4a5568] uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredDraws.slice(0, 8).map((draw) => (
                <tr
                  key={draw.id}
                  className="border-b border-[rgba(255,255,255,0.04)] hover:bg-[rgba(255,255,255,0.03)]"
                >
                  <td className="py-3 px-4">
                    <div>
                      <p className="font-semibold text-[#e8edf3]">
                        {draw.name}
                      </p>
                      <p className="text-[11px] text-[#4a5568]">
                        {draw.description}
                      </p>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-[#8b9bb4]">
                    {draw.gameType}
                  </td>
                  <td className="py-3 px-4 font-bold text-[#f5c518]">
                    ₹{formatINR(draw.prizePool)}
                  </td>
                  <td className="py-3 px-4 text-[#8b9bb4]">
                    ₹{formatINR(draw.ticketPrice)}
                  </td>
                  <td className="py-3 px-4 text-[#8b9bb4]">
                    {formatINR(draw.entries)} /
                    {formatINR(draw.maxEntries)}
                  </td>
                  <td className="py-3 px-4">
                    {draw.status === 'live' ? (
                      <span className="flex items-center gap-1">
                        <span className="w-2 h-2 bg-[#ff4d6d] rounded-full animate-pulse"></span>
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
                  <td className="py-3 px-4 text-[#8b9bb4]">
                    {formatDate(draw.drawDate)} {formatTime(draw.drawDate)}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <button className="text-[#8b9bb4] hover:text-[#e8edf3] text-[12px] font-medium">
                        ✎
                      </button>
                      <button className="text-[#3d9eff] hover:text-[#06b6d4] text-[12px] font-medium">
                        👁
                      </button>
                      <button className="text-[#ff4d6d] hover:text-[#ff6b7f] text-[12px] font-medium">
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
