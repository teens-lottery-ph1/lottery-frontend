'use client';

import { useState, useEffect } from 'react';
import StatCard from '../_components/StatCard';
import Badge from '../_components/Badge';
import Avatar from '../_components/Avatar';

// Format currency to Indian format
const formatINR = (value: number) => {
  return value.toLocaleString('en-IN');
};

export default function DashboardPage() {

  const [users, setUsers] = useState<any[]>([]);
  const [revenue, setRevenue] = useState<number>(0);
  const [loadingRevenue, setLoadingRevenue] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  // Fetch Users
  const fetchUsers = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users`
      );

      const data = await res.json();

      setUsers(data.data || []);
    } catch (error) {
      console.error('Error fetching users', error);
    }
  };

  // Fetch Revenue
  const fetchRevenue = async () => {
    setIsUpdating(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/revenue`
      );

      const data = await res.json();

      if (data.success) {
        setRevenue(data.revenue);
      }

    } catch (error) {
      console.error('Error fetching revenue', error);
    } finally {
      setLoadingRevenue(false);

      setTimeout(() => {
        setIsUpdating(false);
      }, 300);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchRevenue();

    const interval = setInterval(() => {
      fetchUsers();
      fetchRevenue();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const recentUsers = users.slice(0, 7);

  return (
    <div className="space-y-8">

      {/* STAT CARDS */}
      <div className="grid grid-cols-4 gap-6">

        <StatCard
          icon="👥"
          value={users.length.toString()}
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

      {/* RECENT USERS */}
      <div className="bg-white border border-[#e5e7eb] rounded-2xl shadow-sm">

        <div className="p-6 border-b border-[#e5e7eb] flex items-center justify-between">

          <h3 className="text-[16px] font-semibold text-[#111827]">
            Recent Registrations
          </h3>

          <button className="text-[13px] font-semibold text-[#d97706] hover:text-[#b45309]">
            📥 Export CSV
          </button>

        </div>

        <div className="overflow-x-auto">

          <table className="w-full text-[13px]">

            <thead>

              <tr className="border-b border-[#e5e7eb]">

                <th className="py-4 px-6 text-left text-[11px] font-semibold text-[#6b7280] uppercase tracking-wider">
                  User
                </th>

                <th className="py-4 px-6 text-left text-[11px] font-semibold text-[#6b7280] uppercase tracking-wider">
                  Email
                </th>

                <th className="py-4 px-6 text-left text-[11px] font-semibold text-[#6b7280] uppercase tracking-wider">
                  Phone
                </th>

                <th className="py-4 px-6 text-left text-[11px] font-semibold text-[#6b7280] uppercase tracking-wider">
                  Status
                </th>

              </tr>

            </thead>

            <tbody>

              {recentUsers.map((user) => (

                <tr
                  key={user.id}
                  className="hover:bg-[#f9fafb] transition-colors border-b border-[#f3f4f6]"
                >

                  <td className="py-4 px-6">

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

                  <td className="py-4 px-6 text-[#4b5563]">
                    {user.email}
                  </td>

                  <td className="py-4 px-6 text-[#4b5563]">
                    {user.phone}
                  </td>

                  <td className="py-4 px-6">

                    <Badge
                      label={user.status || "Active"}
                      variant="green"
                    />

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