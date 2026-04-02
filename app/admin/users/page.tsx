// "use client";

import { useEffect, useState } from "react";
import StatCard from "../_components/StatCard";
import Badge from "../_components/Badge";
import Avatar from "../_components/Avatar";

const formatINR = (value: number) => {
  return value.toLocaleString("en-IN");
};

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [levelFilter, setLevelFilter] = useState("All");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  // ✅ NEW: fetch users count
  useEffect(() => {
    const fetchUsers = async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users`
      );

      const data = await res.json();

      const usersList = data.data || [];

      // Fetch wallet for each user
      const usersWithWallet = await Promise.all(
        usersList.map(async (user: any) => {
          try {
            const walletRes = await fetch(
              `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/${user.id}`
            );

            const walletData = await walletRes.json();

            return {
              ...user,
              wallet: walletData?.data?.wallet?.balance || 0
            };
          } catch (error) {
            return {
              ...user,
              wallet: 0
            };
          }
        })
      );

      setUsers(usersWithWallet);
    };

    fetchUsers();
  }, []);

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "All" || user.status === statusFilter;

    const matchesLevel =
      levelFilter === "All" || user.level == levelFilter;

    return matchesSearch && matchesStatus && matchesLevel;
  });

  return (
    <div className="space-y-8">

      {/* STAT CARDS */}
      <div className="grid grid-cols-4 gap-6">

        <StatCard
          icon="👥"
          value={users.length}
          label="Total Users"
          accentColor="#1e40af"
        />

        <StatCard
          icon="✅"
          value={users.filter((u) => u.kycStatus === "Verified").length}
          label="KYC Verified"
          accentColor="#16a34a"
        />

        <StatCard
          icon="🚫"
          value={users.filter((u) => u.status === "Suspended").length}
          label="Suspended"
          accentColor="#dc2626"
        />

        <StatCard
          icon="⭐"
          value={users.length}
          label="New This Week"
          accentColor="#d97706"
        />

      </div>

      {/* TOOLBAR */}
      <div className="bg-white border border-[#e5e7eb] rounded-2xl p-6">

        <div className="flex items-center justify-between">

          <div className="flex items-center gap-4">

            {/* Search */}
            <div className="flex items-center gap-2 bg-[#f9fafb] border border-[#e5e7eb] rounded-xl px-4 py-2.5">

              <span className="text-sm">🔍</span>

              <input
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-transparent outline-none text-[13px] w-52"
              />

            </div>

            {/* Status */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-[#f9fafb] border border-[#e5e7eb] rounded-xl px-4 py-2.5 text-[13px]"
            >
              <option>All</option>
              <option>Active</option>
              <option>Suspended</option>
            </select>

            {/* Level */}
            <select
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value)}
              className="bg-[#f9fafb] border border-[#e5e7eb] rounded-xl px-4 py-2.5 text-[13px]"
            >
              <option>All Levels</option>
              <option>1</option>
              <option>2</option>
              <option>3</option>
              <option>4</option>
            </select>

          </div>

          <div className="flex items-center gap-3">

            <button className="bg-[#f9fafb] border border-[#e5e7eb] px-4 py-2.5 rounded-xl text-[13px] font-medium">
              📥 Export CSV
            </button>

            <button className="bg-[#f5c518] text-black font-bold px-6 py-2.5 rounded-xl text-[13px]">
              + Add User
            </button>

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

      </div>

      {/* TABLE */}
      <div className="bg-white border border-[#e5e7eb] rounded-2xl overflow-hidden">

        <table className="w-full text-[13px]">

          <thead>

            <tr className="border-b border-[#e5e7eb]">

              <th className="py-4 px-4">
                <input type="checkbox" />
              </th>

              <th className="py-4 px-4 text-left text-[11px] font-semibold text-[#6b7280] uppercase">
                User
              </th>

              <th className="py-4 px-4 text-left text-[11px] font-semibold text-[#6b7280] uppercase">
                Email
              </th>

              {/* <th className="py-4 px-4 text-left text-[11px] font-semibold text-[#6b7280] uppercase">
                Level
              </th> */}

              <th className="py-4 px-4 text-left text-[11px] font-semibold text-[#6b7280] uppercase">
                Wallet
              </th>

              {/* <th className="py-4 px-4 text-left text-[11px] font-semibold text-[#6b7280] uppercase">
                Referrals
              </th> */}

              {/* <th className="py-4 px-4 text-left text-[11px] font-semibold text-[#6b7280] uppercase">
                KYC
              </th> */}

              <th className="py-4 px-4 text-left text-[11px] font-semibold text-[#6b7280] uppercase">
                Status
              </th>

              <th className="py-4 px-4 text-left text-[11px] font-semibold text-[#6b7280] uppercase">
                Actions
              </th>

            </tr>

          </thead>

          <tbody>

            {filteredUsers.map((user: any) => (

              <tr
                key={user.id}
                className="border-b border-[#f3f4f6] hover:bg-[#f9fafb]"
              >

                <td className="py-4 px-4">
                  <input type="checkbox" />
                </td>

                <td className="py-4 px-4">

                  <div className="flex items-center gap-3">

                    <Avatar name={user.name} size="sm" />

                    <div>

                      <p className="font-semibold text-[#111827]">
                        {user.name}
                      </p>

                      <p className="text-[11px] text-[#6b7280]">
                        #{user.id}
                      </p>

                    </div>

                  </div>

                </td>

                <td className="py-4 px-4">
                  {user.email}
                </td>

                <td className="py-4 px-4 text-[#00d68f] font-semibold">
                  ₹{formatINR(user.wallet || 0)}
                </td>

                <td className="py-4 px-4">
                  <Badge
                    label={user.status || "Active"}
                    variant="green"
                  />
                </td>

                <td className="py-4 px-4">

                  <a
                    href={`/admin/users/${user.id}`}
                    className="text-[#3d9eff] font-medium"
                  >
                    View →
                  </a>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

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