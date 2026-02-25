'use client';

import { useState } from 'react';
import { transactions } from '../_components/mock-data';
import StatCard from '../_components/StatCard';
import Badge from '../_components/Badge';
import Avatar from '../_components/Avatar';

// Format currency to Indian format
const formatINR = (value: number) => {
  return value.toLocaleString('en-IN');
};

const formatDateTime = (date: Date) => {
  return new Date(date).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export default function PaymentsPage() {
  // API CALL: Backend endpoint to fetch transactions with filters
  // GET /api/admin/payments/transactions?fromDate=&toDate=&type=&status=
  const [fromDate, setFromDate] = useState('2026-02-18');
  const [toDate, setToDate] = useState('2026-02-25');
  const [typeFilter, setTypeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  const filteredTransactions = transactions.filter((txn) => {
    const txnDate = new Date(txn.datetime);
    const from = new Date(fromDate);
    const to = new Date(toDate);

    const matchesDate = txnDate >= from && txnDate <= to;
    const matchesType = typeFilter === 'All' || txn.type === typeFilter;
    const matchesStatus =
      statusFilter === 'All' || txn.status === statusFilter;

    return matchesDate && matchesType && matchesStatus;
  });

  const totalRevenue = 4820000;
  const totalDeposits = 3210000;
  const totalWithdrawals = 1610000;
  const pendingAmount = 240000;

  // CSV Export
  const handleExportCSV = () => {
    // API CALL: Backend endpoint to export transactions as CSV
    // GET /api/admin/payments/export?fromDate=&toDate=&type=&status=
    const headers = [
      'TXN ID',
      'User',
      'Method',
      'Amount',
      'Type',
      'Status',
      'Date',
    ];
    const rows = filteredTransactions.map((txn) => [
      txn.id,
      txn.userName,
      txn.method,
      txn.amount,
      txn.type,
      txn.status,
      formatDateTime(txn.datetime),
    ]);

    const csv = [headers.join(','), ...rows.map((row) => row.join(','))].join(
      '\n'
    );

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'transactions_export.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      {/* STAT CARDS */}
      <div className="grid grid-cols-4 gap-6">
        <StatCard
          icon="💰"
          value={`₹${formatINR(totalRevenue)}`}
          label="Total Revenue"
          change="8.7%"
          changeType="up"
          accentColor="#00d68f"
        />
        <StatCard
          icon="📥"
          value={`₹${formatINR(totalDeposits)}`}
          label="Total Deposits"
          accentColor="#3d9eff"
        />
        <StatCard
          icon="📤"
          value={`₹${formatINR(totalWithdrawals)}`}
          label="Total Withdrawals"
          accentColor="#ff4d6d"
        />
        <StatCard
          icon="⏳"
          value={`₹${formatINR(pendingAmount)}`}
          label="Pending"
          accentColor="#f5c518"
        />
      </div>

      {/* FILTER BAR */}
      <div className="bg-[#0d1117] border border-[rgba(255,255,255,0.07)] rounded-2xl p-6">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4 flex-wrap">
            <div>
              <label className="block text-[11px] font-semibold text-[#4a5568] mb-1">
                From Date
              </label>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="bg-[#13191f] border border-[rgba(255,255,255,0.07)] rounded-xl px-3 py-2 text-[#e8edf3] text-[13px] outline-none focus:border-[#f5c518] transition-colors"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[#4a5568] mb-1">
                To Date
              </label>
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="bg-[#13191f] border border-[rgba(255,255,255,0.07)] rounded-xl px-3 py-2 text-[#e8edf3] text-[13px] outline-none focus:border-[#f5c518] transition-colors"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[#4a5568] mb-1">
                Type
              </label>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="bg-[#13191f] border border-[rgba(255,255,255,0.07)] rounded-xl px-3 py-2 text-[#8b9bb4] text-[13px] outline-none focus:border-[#f5c518] transition-colors"
              >
                <option>All</option>
                <option>Deposit</option>
                <option>Withdrawal</option>
                <option>TicketPurchase</option>
                <option>PrizePayout</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[#4a5568] mb-1">
                Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-[#13191f] border border-[rgba(255,255,255,0.07)] rounded-xl px-3 py-2 text-[#8b9bb4] text-[13px] outline-none focus:border-[#f5c518] transition-colors"
              >
                <option>All</option>
                <option>Success</option>
                <option>Pending</option>
                <option>Failed</option>
              </select>
            </div>
          </div>

          <button
            onClick={handleExportCSV}
            className="bg-[#13191f] border border-[rgba(255,255,255,0.07)] text-[#8b9bb4] px-4 py-2 rounded-xl hover:border-[rgba(255,255,255,0.15)] hover:text-[#e8edf3] transition-colors text-[13px] font-medium h-[38px]"
          >
            📥 Export CSV
          </button>
        </div>
      </div>

      {/* TRANSACTIONS TABLE */}
      <div className="bg-[#0d1117] border border-[rgba(255,255,255,0.07)] rounded-2xl p-6">
        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-[rgba(255,255,255,0.07)]">
                <th className="py-3 px-4 text-left text-[11px] font-semibold text-[#4a5568] uppercase tracking-wider">
                  TXN ID
                </th>
                <th className="py-3 px-4 text-left text-[11px] font-semibold text-[#4a5568] uppercase tracking-wider">
                  User
                </th>
                <th className="py-3 px-4 text-left text-[11px] font-semibold text-[#4a5568] uppercase tracking-wider">
                  Method
                </th>
                <th className="py-3 px-4 text-left text-[11px] font-semibold text-[#4a5568] uppercase tracking-wider">
                  Amount
                </th>
                <th className="py-3 px-4 text-left text-[11px] font-semibold text-[#4a5568] uppercase tracking-wider">
                  Type
                </th>
                <th className="py-3 px-4 text-left text-[11px] font-semibold text-[#4a5568] uppercase tracking-wider">
                  Status
                </th>
                <th className="py-3 px-4 text-left text-[11px] font-semibold text-[#4a5568] uppercase tracking-wider">
                  Date & Time
                </th>
                <th className="py-3 px-4 text-left text-[11px] font-semibold text-[#4a5568] uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.slice(0, 15).map((txn) => (
                <tr
                  key={txn.id}
                  className="border-b border-[rgba(255,255,255,0.04)] hover:bg-[rgba(255,255,255,0.03)]"
                >
                  <td className="py-3 px-4 font-mono text-[#3d9eff]">
                    {txn.id}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <Avatar name={txn.userName} size="sm" />
                      <p className="text-[#e8edf3]">{txn.userName}</p>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-[#8b9bb4]">
                    {txn.method === 'UPI'
                      ? '📱'
                      : txn.method === 'Card'
                        ? '💳'
                        : txn.method === 'NetBanking'
                          ? '🏦'
                          : '👛'}{' '}
                    {txn.method}
                  </td>
                  <td className="py-3 px-4 font-semibold">
                    <span
                      className={
                        txn.type === 'Deposit' || txn.type === 'PrizePayout'
                          ? 'text-[#00d68f]'
                          : 'text-[#ff4d6d]'
                      }
                    >
                      {txn.type === 'Deposit' || txn.type === 'PrizePayout'
                        ? '+'
                        : '-'}
                      ₹{formatINR(txn.amount)}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <Badge
                      label={txn.type}
                      variant={
                        txn.type === 'Deposit'
                          ? 'green'
                          : txn.type === 'Withdrawal'
                            ? 'red'
                            : txn.type === 'TicketPurchase'
                              ? 'gray'
                              : 'gold'
                      }
                    />
                  </td>
                  <td className="py-3 px-4">
                    <Badge
                      label={txn.status}
                      variant={
                        txn.status === 'Success'
                          ? 'green'
                          : txn.status === 'Pending'
                            ? 'gold'
                            : 'red'
                      }
                    />
                  </td>
                  <td className="py-3 px-4 text-[#8b9bb4]">
                    {formatDateTime(txn.datetime)}
                  </td>
                  <td className="py-3 px-4">
                    <button className="bg-[#13191f] border border-[rgba(255,255,255,0.07)] text-[#8b9bb4] px-3 py-1 rounded-lg hover:border-[rgba(255,255,255,0.15)] text-[12px] font-medium transition-colors">
                      Receipt
                    </button>
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
