'use client';

import { useState,useEffect } from 'react';
import { users } from '../_components/mock-data';
import StatCard from '../_components/StatCard';
import Badge from '../_components/Badge';
import Avatar from '../_components/Avatar';

// Format currency to Indian format
const formatINR = (value: number) => {
  return value.toLocaleString('en-IN');
};

export default function UsersPage() {
  // API CALL: Replace with backend endpoint to fetch users with filters
  // GET /api/admin/users?search=&filter=&level=&page=
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [levelFilter, setLevelFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
 // ✅ NEW: total users state
  const [totalUsers, setTotalUsers] = useState<number>(0);

  // ✅ NEW: fetch users count
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users`);
        const data = await res.json();

        // adjust based on your API response
        setTotalUsers(data.length || data.users?.length || 0);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  // Filter users
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === 'All' || user.status === statusFilter;

    const matchesLevel =
      levelFilter === 'All' || user.level === parseInt(levelFilter);

    return matchesSearch && matchesStatus && matchesLevel;
  });

  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIdx = (currentPage - 1) * itemsPerPage;
  const paginatedUsers = filteredUsers.slice(
    startIdx,
    startIdx + itemsPerPage
  );

  // CSV Export
  const handleExportCSV = () => {
    // API CALL: Backend endpoint to export all filtered users as CSV
    // GET /api/admin/users/export?filter=&search=
    const headers = [
      'ID',
      'Name',
      'Email',
      'Phone',
      'Level',
      'Wallet',
      'Tickets',
      'Referrals',
      'KYC Status',
      'Status',
    ];
    const rows = filteredUsers.map((user) => [
      user.id,
      user.name,
      user.email,
      user.phone,
      user.levelName,
      user.wallet,
      user.tickets,
      user.referrals,
      user.kycStatus,
      user.status,
    ]);

    const csv = [
      headers.join(','),
      ...rows.map((row) =>
        row
          .map((cell) =>
            typeof cell === 'string' && cell.includes(',')
              ? `"${cell}"`
              : cell
          )
          .join(',')
      ),
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'users_export.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      {/* STAT CARDS */}
      <div className="grid grid-cols-4 gap-6">
        <StatCard
          icon="👥"
          value={totalUsers.toString()}
          label="Total Users"
          accentColor="#1e40af"
        />
        <StatCard
          icon="✅"
          value="21,340"
          label="KYC Verified"
          accentColor="#16a34a"
        />
        <StatCard
          icon="🚫"
          value="142"
          label="Suspended"
          accentColor="#dc2626"
        />
        <StatCard
          icon="⭐"
          value="891"
          label="New This Week"
          accentColor="#d97706"
        />
      </div>

      {/* TOOLBAR */}
      <div className="bg-white border border-[#e5e7eb] rounded-2xl p-6">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          {/* Left: Filters */}
          <div className="flex items-center gap-4 flex-wrap flex-1">
            {/* Search */}
            <div className="flex items-center gap-2 bg-[#f9fafb] border border-[#e5e7eb] rounded-xl px-4 py-2.5 focus-within:border-[#d97706] transition-colors">
              <span className="text-[13px]">🔍</span>
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="bg-transparent outline-none text-[#111827] text-[13px] w-48 placeholder:text-[#6b7280]"
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-[#f9fafb] border border-[#e5e7eb] rounded-xl px-4 py-2.5 text-[#4b5563] text-[13px] outline-none focus:border-[#d97706] transition-colors"
            >
              <option>All</option>
              <option>Active</option>
              <option>Suspended</option>
              <option>VIP</option>
            </select>

            {/* Level Filter */}
            <select
              value={levelFilter}
              onChange={(e) => {
                setLevelFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-[#f9fafb] border border-[#e5e7eb] rounded-xl px-4 py-2.5 text-[#4b5563] text-[13px] outline-none focus:border-[#d97706] transition-colors"
            >
              <option>All Levels</option>
              {Array.from({ length: 10 }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  Level {i + 1}
                </option>
              ))}
            </select>
          </div>

          {/* Right: Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleExportCSV}
              className="bg-[#f9fafb] border border-[#e5e7eb] text-[#4b5563] px-4 py-2.5 rounded-xl hover:border-[rgba(255,255,255,0.15)] hover:text-[#111827] transition-colors text-[13px] font-medium"
            >
              📥 Export CSV
            </button>
            <button className="bg-[#f5c518] text-black font-bold px-6 py-2.5 rounded-xl hover:bg-[#e6a800] transition-colors text-[13px]">
              ➕ Add User
            </button>
          </div>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white border border-[#e5e7eb] rounded-2xl p-6">
        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-[#e5e7eb]">
                <th className="py-3 px-4 text-left">
                  <input
                    type="checkbox"
                    checked={selectedUsers.length === paginatedUsers.length}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedUsers(
                          paginatedUsers.map((u) => u.id)
                        );
                      } else {
                        setSelectedUsers([]);
                      }
                    }}
                    className="cursor-pointer"
                  />
                </th>
                <th className="py-3 px-4 text-left text-[11px] font-semibold text-[#6b7280] uppercase tracking-wider">
                  User
                </th>
                <th className="py-3 px-4 text-left text-[11px] font-semibold text-[#6b7280] uppercase tracking-wider">
                  Email
                </th>
                <th className="py-3 px-4 text-left text-[11px] font-semibold text-[#6b7280] uppercase tracking-wider">
                  Level
                </th>
                <th className="py-3 px-4 text-left text-[11px] font-semibold text-[#6b7280] uppercase tracking-wider">
                  Wallet
                </th>
                <th className="py-3 px-4 text-left text-[11px] font-semibold text-[#6b7280] uppercase tracking-wider">
                  Referrals
                </th>
                <th className="py-3 px-4 text-left text-[11px] font-semibold text-[#6b7280] uppercase tracking-wider">
                  KYC
                </th>
                <th className="py-3 px-4 text-left text-[11px] font-semibold text-[#6b7280] uppercase tracking-wider">
                  Status
                </th>
                <th className="py-3 px-4 text-left text-[11px] font-semibold text-[#6b7280] uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedUsers.map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-[#f9fafb] transition-colors border-b border-[#f3f4f6]"
                >
                  <td className="py-3 px-4">
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedUsers([...selectedUsers, user.id]);
                        } else {
                          setSelectedUsers(
                            selectedUsers.filter((id) => id !== user.id)
                          );
                        }
                      }}
                      className="cursor-pointer"
                    />
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <Avatar name={user.name} size="sm" />
                      <div>
                        <p className="font-semibold text-[#111827]">
                          {user.name}
                        </p>
                        <p className="text-[11px] text-[#6b7280] font-mono">
                          #{user.id}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-[#4b5563]">
                    {user.email}
                  </td>
                  <td className="py-3 px-4">
                    <Badge
                      label={`L${user.level} ${user.levelName}`}
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
                  <td className="py-3 px-4 text-[#00d68f] font-semibold">
                    ₹{formatINR(user.wallet)}
                  </td>
                  <td className="py-3 px-4">
                    <Badge
                      label={user.referrals.toString()}
                      variant="blue"
                    />
                  </td>
                  <td className="py-3 px-4">
                    <Badge
                      label={user.kycStatus}
                      variant={
                        user.kycStatus === 'Verified'
                          ? 'green'
                          : user.kycStatus === 'Pending'
                            ? 'gold'
                            : 'red'
                      }
                    />
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
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <a
                        href={`/admin/users/${user.id}`}
                        className="text-[#3d9eff] hover:text-[#06b6d4] text-[13px] font-medium"
                      >
                        View →
                      </a>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        <div className="flex items-center justify-between mt-6 pt-6 border-t border-[#e5e7eb]">
          <p className="text-[13px] text-[#4b5563]">
            Showing {startIdx + 1}–
            {Math.min(startIdx + itemsPerPage, filteredUsers.length)} of{' '}
            {filteredUsers.length} users
          </p>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 border border-[#e5e7eb] rounded-lg text-[13px] hover:border-[rgba(255,255,255,0.15)] transition-colors disabled:opacity-50"
            >
              ←
            </button>

            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const pageNum = i + 1;
              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`px-3 py-1 rounded-lg text-[13px] font-medium transition-colors ${
                    currentPage === pageNum
                      ? 'bg-[#f5c518] text-black'
                      : 'border border-[#e5e7eb] text-[#4b5563] hover:border-[rgba(255,255,255,0.15)]'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}

            {totalPages > 5 && (
              <>
                <span className="text-[#6b7280]">...</span>
                <button
                  onClick={() => setCurrentPage(totalPages)}
                  className="px-3 py-1 border border-[#e5e7eb] rounded-lg text-[13px] hover:border-[rgba(255,255,255,0.15)] transition-colors text-[#4b5563]"
                >
                  {totalPages}
                </button>
              </>
            )}

            <button
              onClick={() =>
                setCurrentPage(Math.min(totalPages, currentPage + 1))
              }
              disabled={currentPage === totalPages}
              className="px-3 py-1 border border-[#e5e7eb] rounded-lg text-[13px] hover:border-[rgba(255,255,255,0.15)] transition-colors disabled:opacity-50"
            >
              →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
