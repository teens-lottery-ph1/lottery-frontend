'use client';

import { useState, useEffect } from 'react';
import StatCard from '../_components/StatCard';
import Badge from '../_components/Badge';
import Avatar from '../_components/Avatar';
import { users, draws } from '../_components/mock-data';

// Format currency to Indian format
const formatINR = (value: number) => {
  return value.toLocaleString('en-IN');
};

// Format time duration
const formatTime = (seconds: number) => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
};

export default function DashboardPage() {
  // API CALL: Replace with backend endpoint to fetch real-time stats
  // GET /api/admin/dashboard/stats
  const [countdown, setCountdown] = useState({ h: 0, m: 0, s: 0 });
  const [totalSeconds, setTotalSeconds] = useState(0);
  
  // ✅ Revenue states
  const [revenue, setRevenue] = useState<number>(0);
  const [loadingRevenue, setLoadingRevenue] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  // ✅ NEW: Total Users state
  const [totalUsers, setTotalUsers] = useState<number>(0);

  // ✅ Fetch users count
  const fetchUsersCount = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users`);
      const data = await res.json();

      // adjust based on API response
      const usersList = data.users || data;
      setTotalUsers(usersList.length);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };
  // ✅ Fetch revenue
  const fetchRevenue = async () => {
    setIsUpdating(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/revenue`);
      const data = await res.json();

      if (data.success) {
        setRevenue(data.revenue);
      }
    } catch (error) {
      console.error('Error fetching revenue:', error);
    } finally {
      setLoadingRevenue(false);

      setTimeout(() => {
        setIsUpdating(false);
      }, 300);
    }
  };

  // ✅ Auto refresh every 10 seconds
  useEffect(() => {
    fetchRevenue();
    fetchUsersCount();

    const interval = setInterval(() => {
      fetchRevenue();
      fetchUsersCount();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  // Countdown timer
  useEffect(() => {
    const interval = setInterval(() => {
      setTotalSeconds((prev) => {
        if (prev <= 0) return 0;
        const newTotal = prev - 1;
        setCountdown({
          h: Math.floor(newTotal / 3600),
          m: Math.floor((newTotal % 3600) / 60),
          s: newTotal % 60,
        });
        return newTotal;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Get recent registrations - last 7 users
  const recentUsers = users.slice(0, 7);

  // Level distribution data
  const levelData = [
    { name: 'VIP', percentage: 0, color: '#f5c518' },
    { name: 'Titan', percentage: 0, color: '#3d9eff' },
    { name: 'Superstar', percentage: 0, color: '#f59e0b' },
    { name: 'Elite', percentage: 0, color: '#a855f7' },
    { name: 'Diamond', percentage: 0, color: '#06b6d4' },
    { name: 'Platinum', percentage: 0, color: '#00d68f' },
    { name: 'Gold', percentage: 0, color: '#f5c518' },
    { name: 'Silver', percentage: 0, color: '#94a3b8' },
    { name: 'Bronze', percentage: 0, color: '#cd7c2f' },
    { name: 'Basic', percentage: 0, color: '#4a5568' },
  ];

  // 7-day revenue
  const revenueHeights = [0, 0, 0, 0, 0, 0, 0];
  const revenueDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <div className="space-y-8">
      {/* SECTION 1: Stat Cards */}
      <div className="grid grid-cols-4 gap-6">
         <StatCard
          icon="👥"
          value={totalUsers.toString()}
          label="Total Users"
          change="Live"
          changeType="up"
          accentColor="#1e40af"
        />
         <StatCard
          icon="💰"
          value={
            loadingRevenue
              ? 'Loading...'
              : `₹${formatINR(revenue)}`
          }
          label="Total Revenue"
          change={isUpdating ? 'Updating...' : 'Live'}
          changeType="up"
          accentColor="#16a34a"
        />
        <StatCard
          icon="🎫"
          value="0"
          label="Tickets Sold"
          change="0%"
          changeType="up"
          accentColor="#d97706"
        />
        <StatCard
          icon="🎰"
          value="0"
          label="Active Draws"
          changeType="live"
          accentColor="#16a34a"
        />
      </div>

      {/* SECTION 2: Active Draws + Level Distribution */}
      <div className="grid grid-cols-[1fr_1fr] gap-6">
        {/* Active Draws Column */}
        <div className="space-y-4">
          {/* LIVE Draw */}
          <div className="bg-white border border-[#e5e7eb] rounded-2xl p-6 hover:border-[#9ca3af] hover:-translate-y-0.5 transition-all shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <Badge label="🔴 LIVE" variant="red" />
              <span className="text-[12px] text-[#6b7280]">
                {String(countdown.h).padStart(2, '0')}:
                {String(countdown.m).padStart(2, '0')}:
                {String(countdown.s).padStart(2, '0')}
              </span>
            </div>
            <h3 className="text-[16px] font-bold text-[#111827] mb-2">
              Mega Millions #4821
            </h3>
            <p className="text-[28px] font-bold text-[#d97706] mb-3">
              ₹1,00,00,000
            </p>
            <div className="flex items-center justify-between">
              <Badge label="3,241 entries" variant="green" />
              <span className="text-[12px] text-[#4b5563]">
                Max: 10,000
              </span>
            </div>
          </div>

          {/* UPCOMING Draw */}
          <div className="bg-white border border-[#e5e7eb] rounded-2xl p-6 hover:border-[#9ca3af] hover:-translate-y-0.5 transition-all shadow-sm">
            <div className="mb-4">
              <Badge label="⏳ UPCOMING" variant="gold" />
            </div>
            <h3 className="text-[16px] font-bold text-[#111827] mb-2">
              Super Jackpot #219
            </h3>
            <p className="text-[28px] font-bold text-[#d97706] mb-3">
              ₹50,00,000
            </p>
            <div className="flex items-center justify-between">
              <Badge label="1,820 pre-entries" variant="blue" />
              <span className="text-[12px] text-[#4b5563]">
                Starts: Tomorrow 8:00 PM
              </span>
            </div>
          </div>

          {/* COMPLETED Draw */}
          <div className="bg-white border border-[#e5e7eb] rounded-2xl p-6 hover:border-[#9ca3af] hover:-translate-y-0.5 transition-all shadow-sm">
            <div className="mb-4">
              <Badge label="✅ COMPLETED" variant="gray" />
            </div>
            <h3 className="text-[16px] font-bold text-[#111827] mb-2">
              Power Ball #88
            </h3>
            <p className="text-[28px] font-bold text-[#d97706] mb-3">
              ₹25,00,000
            </p>
            <div className="flex items-center justify-between">
              <span className="text-[12px] font-semibold text-[#16a34a]">
                Winner: Raj Kumar (ID #4421)
              </span>
              <Badge label="Paid out" variant="gray" />
            </div>
          </div>
        </div>

        {/* Right Column: Level Distribution + Revenue */}
        <div className="space-y-6">
          {/* Level Distribution */}
          <div className="bg-white border border-[#e5e7eb] rounded-2xl p-6 shadow-sm">
            <h3 className="text-[16px] font-bold text-[#111827] mb-6">
              Level Distribution
            </h3>

            <div className="space-y-3">
              {levelData.map((level) => (
                <div
                  key={level.name}
                  className="flex items-center gap-4"
                >
                  <div className="w-16 text-[12px] font-semibold text-[#4b5563]">
                    {level.name}
                  </div>
                  <div className="flex-1 h-1 bg-[#e5e7eb] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        backgroundColor: level.color,
                        width: `${level.percentage}%`,
                      }}
                    ></div>
                  </div>
                  <div className="w-10 text-right text-[12px] text-[#6b7280]">
                    {level.percentage}%
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 7-Day Revenue Chart */}
          <div className="bg-white border border-[#e5e7eb] rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-[16px] font-bold text-[#111827]">
                Revenue (7 Days)
              </h3>
              <span className="text-[16px] font-bold text-[#d97706]">
                ₹6.8L
              </span>
            </div>

            <div className="flex items-end gap-1 h-20">
              {revenueHeights.map((height, index) => (
                <div
                  key={index}
                  className="flex-1 rounded-t bg-[#fef3c7] hover:bg-[#fbbf24] transition-colors"
                  style={{
                    height: `${height}%`,
                  }}
                ></div>
              ))}
            </div>

            <div className="flex justify-between mt-3 px-1">
              {revenueDays.map((day) => (
                <span
                  key={day}
                  className="text-[10px] text-[#6b7280]"
                >
                  {day}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 3: Recent Registrations Table */}
      <div className="bg-white border border-[#e5e7eb] rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-[16px] font-bold text-[#111827]">
            Recent Registrations
          </h3>
          {/* API CALL: Download CSV with user data from backend */}
          <button className="text-[13px] font-semibold text-[#d97706] hover:text-[#b45309] transition-colors">
            📥 Export CSV
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-[#e5e7eb]">
                <th className="py-3 px-4 text-left text-[11px] font-semibold text-[#4b5563] uppercase tracking-wider">
                  User
                </th>
                <th className="py-3 px-4 text-left text-[11px] font-semibold text-[#4b5563] uppercase tracking-wider">
                  Level
                </th>
                <th className="py-3 px-4 text-left text-[11px] font-semibold text-[#4b5563] uppercase tracking-wider">
                  Tickets
                </th>
                <th className="py-3 px-4 text-left text-[11px] font-semibold text-[#4b5563] uppercase tracking-wider">
                  Wallet
                </th>
                <th className="py-3 px-4 text-left text-[11px] font-semibold text-[#4b5563] uppercase tracking-wider">
                  Status
                </th>
                <th className="py-3 px-4 text-left text-[11px] font-semibold text-[#4b5563] uppercase tracking-wider">
                  Joined
                </th>
              </tr>
            </thead>
            <tbody>
              {recentUsers.map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-[#f9fafb] cursor-pointer transition-colors border-b border-[#f3f4f6]"
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <Avatar name={user.name} size="sm" />
                      <div>
                        <p className="font-semibold text-[#111827]">
                          {user.name}
                        </p>
                        <p className="text-[11px] text-[#6b7280] font-mono">
                          ID #{user.id}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <Badge
                      label={`${user.levelName} L${user.level}`}
                      variant={
                        user.level === 1
                          ? 'gray'
                          : user.level === 2
                            ? 'red'
                            : user.level === 3
                              ? 'blue'
                              : user.level === 4
                                ? 'gold'
                                : user.level === 5
                                  ? 'green'
                                  : 'purple'
                      }
                    />
                  </td>
                  <td className="py-3 px-4 text-[#111827]">
                    {user.tickets}
                  </td>
                  <td className="py-3 px-4 font-semibold text-[#16a34a]">
                    ₹{formatINR(user.wallet)}
                  </td>
                  <td className="py-3 px-4">
                    <Badge
                      label={user.status}
                      variant={
                        user.status === 'Active'
                          ? 'green'
                          : user.status === 'VIP'
                            ? 'gold'
                            : 'red'
                      }
                    />
                  </td>
                  <td className="py-3 px-4 text-[#4b5563]">
                    {new Date(user.joinedDate).toLocaleDateString(
                      'en-IN',
                      { day: '2-digit', month: 'short' }
                    )}
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
