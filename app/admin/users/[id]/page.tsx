'use client';

import { useState } from 'react';
import Link from 'next/link';
import { users } from '../../_components/mock-data';
import Avatar from '../../_components/Avatar';
import Badge from '../../_components/Badge';
import StatCard from '../../_components/StatCard';

interface UserDetailPageProps {
  params: { id: string };
}

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

export default function UserDetailPage({
  params,
}: UserDetailPageProps) {
  // API CALL: Backend endpoint to fetch single user details
  // GET /api/admin/users/{id}
  const user = users.find((u) => u.id === params.id);
  const [activeTab, setActiveTab] = useState('tickets');

  if (!user) {
    return (
      <div className="text-center py-20">
        <p className="text-[#ff4d6d] text-lg">User not found</p>
      </div>
    );
  }

  // Mock ticket history data
  const ticketHistory = [
    {
      id: '1',
      drawName: 'Mega Millions #4821',
      ticketNo: 'MG-4821-001',
      amount: 100,
      date: new Date('2026-02-25'),
      result: 'Pending',
    },
    {
      id: '2',
      drawName: 'Power Ball #88',
      ticketNo: 'PB-88-052',
      amount: 50,
      date: new Date('2026-02-24'),
      result: 'Won',
    },
    {
      id: '3',
      drawName: 'Daily Draw #485',
      ticketNo: 'DD-485-123',
      amount: 50,
      date: new Date('2026-02-23'),
      result: 'Lost',
    },
  ];

  // Mock wallet transactions
  const walletTransactions = [
    {
      id: 'TXN001',
      type: 'Deposit',
      amount: 5000,
      method: 'UPI',
      date: new Date('2026-02-24'),
    },
    {
      id: 'TXN002',
      type: 'Withdrawal',
      amount: 1000,
      method: 'Card',
      date: new Date('2026-02-23'),
    },
  ];

  // Mock referrals
  const referrals = [
    {
      id: '1',
      name: 'Rahul Verma',
      joinedDate: new Date('2026-02-15'),
      status: 'Active',
      reward: 500,
    },
    {
      id: '2',
      name: 'Meera Joshi',
      joinedDate: new Date('2026-02-10'),
      status: 'Active',
      reward: 500,
    },
    {
      id: '3',
      name: 'Amit Patel',
      joinedDate: new Date('2026-02-08'),
      status: 'Inactive',
      reward: 0,
    },
  ];

  // Mock KYC documents
  const kycDocs = [
    {
      id: 'DOC001',
      type: 'Aadhaar',
      submittedAt: new Date('2026-02-20'),
      status: 'Verified',
    },
    {
      id: 'DOC002',
      type: 'PAN Card',
      submittedAt: new Date('2026-02-21'),
      status: 'Verified',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Back Button */}
      <Link
        href="/admin/users"
        className="text-[#f5c518] hover:text-[#e6a800] text-[13px] font-medium inline-flex items-center gap-2"
      >
        ← Back to Users
      </Link>

      {/* PROFILE SECTION */}
      <div className="bg-[#0d1117] border border-[rgba(255,255,255,0.07)] rounded-2xl p-8 grid grid-cols-2 gap-8">
        {/* Left: User Info */}
        <div>
          <div className="flex items-start gap-4 mb-6">
            <Avatar name={user.name} size="lg" />
            <div>
              <h1 className="text-[24px] font-bold text-[#e8edf3]">
                {user.name}
              </h1>
              <p className="text-[#8b9bb4] text-[13px]">{user.email}</p>
              <p className="text-[#8b9bb4] text-[13px]">{user.phone}</p>
              <p className="text-[#4a5568] text-[12px] mt-2">
                Joined {formatDate(user.joinedDate)}
              </p>
            </div>
          </div>
        </div>

        {/* Right: Level & Actions */}
        <div className="flex flex-col items-end justify-start">
          <Badge
            label={`${user.levelName} - Level ${user.level}`}
            variant={
              user.level === 4
                ? 'gold'
                : user.level === 5
                  ? 'green'
                  : user.level === 7
                    ? 'purple'
                    : user.level >= 8
                      ? 'gold'
                      : 'blue'
            }
          />

          <div className="w-full mt-6 bg-[rgba(245,197,24,0.1)] rounded-lg p-4 mb-4">
            <p className="text-[12px] text-[#8b9bb4] mb-2">
              Progress to Next Level
            </p>
            <div className="flex items-center gap-3">
              <div className="flex-1 h-2 bg-[rgba(255,255,255,0.07)] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#f5c518] rounded-full"
                  style={{
                    width: `${(user.points / user.nextLevelPoints) * 100}%`,
                  }}
                ></div>
              </div>
              <span className="text-[12px] text-[#f5c518] font-semibold">
                {formatINR(user.points)} /{' '}
                {formatINR(user.nextLevelPoints)}
              </span>
            </div>
          </div>

          <div className="flex gap-3 w-full">
            <button className="flex-1 bg-[rgba(255,77,109,0.12)] text-[#ff4d6d] border border-[rgba(255,77,109,0.2)] px-3 py-2 rounded-lg hover:bg-[rgba(255,77,109,0.2)] transition-colors text-[12px] font-semibold">
              🚫 Suspend
            </button>
            <button className="flex-1 bg-[#13191f] border border-[rgba(255,255,255,0.07)] text-[#8b9bb4] px-3 py-2 rounded-lg hover:border-[rgba(255,255,255,0.15)] transition-colors text-[12px] font-semibold">
              🔑 Reset Password
            </button>
            <button className="flex-1 bg-[rgba(245,197,24,0.12)] text-[#f5c518] border border-[rgba(245,197,24,0.2)] px-3 py-2 rounded-lg hover:bg-[rgba(245,197,24,0.2)] transition-colors text-[12px] font-semibold">
              💰 Add Bonus
            </button>
            <button className="flex-1 bg-[#13191f] border border-[rgba(255,255,255,0.07)] text-[#8b9bb4] px-3 py-2 rounded-lg hover:border-[rgba(255,255,255,0.15)] transition-colors text-[12px] font-semibold">
              📢 Notify
            </button>
          </div>
        </div>
      </div>

      {/* 4 MINI STATS */}
      <div className="grid grid-cols-4 gap-6">
        <StatCard
          icon="🎫"
          value={user.tickets}
          label="Tickets Bought"
          accentColor="#3d9eff"
        />
        <StatCard
          icon="💸"
          value={`₹${formatINR(user.totalSpent)}`}
          label="Total Spent"
          accentColor="#f5c518"
        />
        <StatCard
          icon="👥"
          value={user.referrals}
          label="Referrals Made"
          accentColor="#00d68f"
        />
        <StatCard
          icon="👛"
          value={`₹${formatINR(user.wallet)}`}
          label="Wallet Balance"
          accentColor="#06b6d4"
        />
      </div>

      {/* TABS */}
      <div className="bg-[#0d1117] border border-[rgba(255,255,255,0.07)] rounded-2xl">
        {/* Tab Headers */}
        <div className="border-b border-[rgba(255,255,255,0.07)] flex">
          {[
            { id: 'tickets', label: 'Ticket History' },
            { id: 'wallet', label: 'Wallet Transactions' },
            { id: 'referrals', label: 'Referrals' },
            { id: 'kyc', label: 'KYC Documents' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-4 text-[13px] font-semibold border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'text-[#f5c518] border-b-[#f5c518]'
                  : 'text-[#4a5568] border-b-transparent hover:text-[#8b9bb4]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'tickets' && (
            <div className="overflow-x-auto">
              <table className="w-full text-[13px]">
                <thead>
                  <tr className="border-b border-[rgba(255,255,255,0.07)]">
                    <th className="py-3 px-4 text-left text-[11px] font-semibold text-[#4a5568] uppercase tracking-wider">
                      Draw Name
                    </th>
                    <th className="py-3 px-4 text-left text-[11px] font-semibold text-[#4a5568] uppercase tracking-wider">
                      Ticket No
                    </th>
                    <th className="py-3 px-4 text-left text-[11px] font-semibold text-[#4a5568] uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="py-3 px-4 text-left text-[11px] font-semibold text-[#4a5568] uppercase tracking-wider">
                      Date
                    </th>
                    <th className="py-3 px-4 text-left text-[11px] font-semibold text-[#4a5568] uppercase tracking-wider">
                      Result
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {ticketHistory.map((ticket) => (
                    <tr
                      key={ticket.id}
                      className="border-b border-[rgba(255,255,255,0.04)] hover:bg-[rgba(255,255,255,0.03)]"
                    >
                      <td className="py-3 px-4 text-[#e8edf3]">
                        {ticket.drawName}
                      </td>
                      <td className="py-3 px-4 text-[#8b9bb4] font-mono">
                        {ticket.ticketNo}
                      </td>
                      <td className="py-3 px-4 text-[#f5c518] font-semibold">
                        ₹{formatINR(ticket.amount)}
                      </td>
                      <td className="py-3 px-4 text-[#8b9bb4]">
                        {formatDate(ticket.date)}
                      </td>
                      <td className="py-3 px-4">
                        <Badge
                          label={ticket.result}
                          variant={
                            ticket.result === 'Won'
                              ? 'green'
                              : ticket.result === 'Lost'
                                ? 'red'
                                : 'gold'
                          }
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'wallet' && (
            <div className="overflow-x-auto">
              <table className="w-full text-[13px]">
                <thead>
                  <tr className="border-b border-[rgba(255,255,255,0.07)]">
                    <th className="py-3 px-4 text-left text-[11px] font-semibold text-[#4a5568] uppercase tracking-wider">
                      TXN ID
                    </th>
                    <th className="py-3 px-4 text-left text-[11px] font-semibold text-[#4a5568] uppercase tracking-wider">
                      Type
                    </th>
                    <th className="py-3 px-4 text-left text-[11px] font-semibold text-[#4a5568] uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="py-3 px-4 text-left text-[11px] font-semibold text-[#4a5568] uppercase tracking-wider">
                      Method
                    </th>
                    <th className="py-3 px-4 text-left text-[11px] font-semibold text-[#4a5568] uppercase tracking-wider">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {walletTransactions.map((txn) => (
                    <tr
                      key={txn.id}
                      className="border-b border-[rgba(255,255,255,0.04)] hover:bg-[rgba(255,255,255,0.03)]"
                    >
                      <td className="py-3 px-4 text-[#3d9eff] font-mono">
                        {txn.id}
                      </td>
                      <td className="py-3 px-4">
                        <Badge
                          label={txn.type}
                          variant={
                            txn.type === 'Deposit'
                              ? 'green'
                              : 'red'
                          }
                        />
                      </td>
                      <td className="py-3 px-4 font-semibold text-[#e8edf3]">
                        {txn.type === 'Deposit' ? '+' : '-'}₹
                        {formatINR(txn.amount)}
                      </td>
                      <td className="py-3 px-4 text-[#8b9bb4]">
                        📱 {txn.method}
                      </td>
                      <td className="py-3 px-4 text-[#8b9bb4]">
                        {formatDate(txn.date)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'referrals' && (
            <div className="overflow-x-auto">
              <table className="w-full text-[13px]">
                <thead>
                  <tr className="border-b border-[rgba(255,255,255,0.07)]">
                    <th className="py-3 px-4 text-left text-[11px] font-semibold text-[#4a5568] uppercase tracking-wider">
                      Referred User
                    </th>
                    <th className="py-3 px-4 text-left text-[11px] font-semibold text-[#4a5568] uppercase tracking-wider">
                      Joined Date
                    </th>
                    <th className="py-3 px-4 text-left text-[11px] font-semibold text-[#4a5568] uppercase tracking-wider">
                      Status
                    </th>
                    <th className="py-3 px-4 text-left text-[11px] font-semibold text-[#4a5568] uppercase tracking-wider">
                      Reward Earned
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {referrals.map((ref) => (
                    <tr
                      key={ref.id}
                      className="border-b border-[rgba(255,255,255,0.04)] hover:bg-[rgba(255,255,255,0.03)]"
                    >
                      <td className="py-3 px-4 text-[#e8edf3]">
                        {ref.name}
                      </td>
                      <td className="py-3 px-4 text-[#8b9bb4]">
                        {formatDate(ref.joinedDate)}
                      </td>
                      <td className="py-3 px-4">
                        <Badge
                          label={ref.status}
                          variant={
                            ref.status === 'Active'
                              ? 'green'
                              : 'gray'
                          }
                        />
                      </td>
                      <td className="py-3 px-4 font-semibold text-[#00d68f]">
                        ₹{formatINR(ref.reward)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'kyc' && (
            <div className="space-y-4">
              {kycDocs.map((doc) => (
                <div
                  key={doc.id}
                  className="bg-[rgba(255,255,255,0.03)] rounded-lg p-4 flex items-center justify-between"
                >
                  <div>
                    <p className="text-[13px] font-semibold text-[#e8edf3]">
                      {doc.type}
                    </p>
                    <p className="text-[12px] text-[#8b9bb4]">
                      Submitted {formatDate(doc.submittedAt)}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge label={doc.status} variant="green" />
                    <button className="bg-[#13191f] border border-[rgba(255,255,255,0.07)] text-[#8b9bb4] px-3 py-2 rounded-lg hover:border-[rgba(255,255,255,0.15)] text-[12px] font-semibold transition-colors">
                      👁 View
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
