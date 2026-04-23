'use client';

import { useState, useEffect } from 'react';
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
const [fromDate, setFromDate] = useState('');
const [toDate, setToDate] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  // NEW: State for real API transactions
  const [transactions, setTransactions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // NEW: Fetch transactions on mount
  // Calling GET /api/admin/payments/transactions to fetch real data
  // We keep the client-side filters acting exactly the same to avoid UI refactor
  useEffect(() => {
    const fetchTransactions = async () => {
      setIsLoading(true);
      setError(null);
      try {
        
        // [DEBUG]: Extract admin_token from cookies and print it
const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/payments/transactions`, {
  method: "GET",
  credentials: "include",
  headers: {
    "Content-Type": "application/json"
  }
});


if (!res.ok) {
  const errText = await res.text();
  console.log("TRANSACTION API ERROR:", errText);
  throw new Error(errText);
}        const data = await res.json();
        const txnsArray = Array.isArray(data) ? data : (data.data || []);
        setTransactions(txnsArray);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTransactions();
  }, []);

const filteredTransactions = transactions.filter((txn) => {
  const txnDate = new Date(txn.datetime);

  const matchesFrom = fromDate ? txnDate >= new Date(fromDate) : true;
  const matchesTo = toDate ? txnDate <= new Date(toDate + "T23:59:59") : true;

  const matchesDate = matchesFrom && matchesTo;
    const matchesType = typeFilter === 'All' || txn.type === typeFilter;
    const matchesStatus =
      statusFilter === 'All' || txn.status === statusFilter;

    return matchesDate && matchesType && matchesStatus;
  });

  // Added state for payment stats
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalDeposits, setTotalDeposits] = useState(0);
  const [totalWithdrawals, setTotalWithdrawals] = useState(0);
  const [pendingAmount, setPendingAmount] = useState(0);

  // Added useEffect to fetch real-time payment status
  useEffect(() => {
    const fetchStats = async () => {
      try {
        
const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/payments/stats`, {
  method: "GET",
  credentials: "include",
  headers: {
    "Content-Type": "application/json"
  }
});// API call to fetch stats using env var
        if (res.ok) {
          const data = await res.json();
          setTotalRevenue(Number(data.totalRevenue) || 0); // Update total revenue
          setTotalDeposits(Number(data.totalDeposits) || 0); // Update total deposits
          setTotalWithdrawals(Number(data.totalWithdrawals) || 0); // Update total withdrawals
          setPendingAmount(Number(data.totalPending) || 0); // Update total pending
        }
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      }
    };
    fetchStats();
  }, []);


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
          change="0%"
          changeType="up"
          accentColor="#16a34a"
        />
        <StatCard
          icon="📥"
          value={`₹${formatINR(totalDeposits)}`}
          label="Total Deposits"
          accentColor="#1e40af"
        />
        <StatCard
          icon="📤"
          value={`₹${formatINR(totalWithdrawals)}`}
          label="Total Withdrawals"
          accentColor="#dc2626"
        />
        <StatCard
          icon="⏳"
          value={`₹${formatINR(pendingAmount)}`}
          label="Pending"
          accentColor="#f5c518"
        />
      </div>

      {/* FILTER BAR */}
      <div className="bg-white border border-[#e5e7eb] rounded-2xl p-6">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4 flex-wrap">
            <div>
              <label className="block text-[11px] font-semibold text-[#6b7280] mb-1">
                From Date
              </label>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="bg-[#f9fafb] border border-[#e5e7eb] rounded-xl px-3 py-2 text-[#111827] text-[13px] outline-none focus:border-[#d97706] transition-colors"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[#6b7280] mb-1">
                To Date
              </label>
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="bg-[#f9fafb] border border-[#e5e7eb] rounded-xl px-3 py-2 text-[#111827] text-[13px] outline-none focus:border-[#d97706] transition-colors"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[#6b7280] mb-1">
                Type
              </label>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="bg-[#f9fafb] border border-[#e5e7eb] rounded-xl px-3 py-2 text-[#4b5563] text-[13px] outline-none focus:border-[#d97706] transition-colors"
              >
                <option>All</option>
                <option>Deposit</option>
                <option>Withdrawal</option>
                <option>TicketPurchase</option>
                <option>PrizePayout</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[#6b7280] mb-1">
                Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-[#f9fafb] border border-[#e5e7eb] rounded-xl px-3 py-2 text-[#4b5563] text-[13px] outline-none focus:border-[#d97706] transition-colors"
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
            className="bg-[#f9fafb] border border-[#e5e7eb] text-[#4b5563] px-4 py-2 rounded-xl hover:border-[rgba(255,255,255,0.15)] hover:text-[#111827] transition-colors text-[13px] font-medium h-[38px]"
          >
            📥 Export CSV
          </button>
        </div>
      </div>

      {/* TRANSACTIONS TABLE */}
      <div className="bg-white border border-[#e5e7eb] rounded-2xl p-6">
        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-[#e5e7eb]">
                <th className="py-3 px-4 text-left text-[11px] font-semibold text-[#6b7280] uppercase tracking-wider">
                  TXN ID
                </th>
                <th className="py-3 px-4 text-left text-[11px] font-semibold text-[#6b7280] uppercase tracking-wider">
                  User
                </th>
                {/* <th className="py-3 px-4 text-left text-[11px] font-semibold text-[#6b7280] uppercase tracking-wider">
                  Method
                </th> */}
                <th className="py-3 px-4 text-left text-[11px] font-semibold text-[#6b7280] uppercase tracking-wider">
                  Amount
                </th>
                <th className="py-3 px-4 text-left text-[11px] font-semibold text-[#6b7280] uppercase tracking-wider">
                  Type
                </th>
                <th className="py-3 px-4 text-left text-[11px] font-semibold text-[#6b7280] uppercase tracking-wider">
                  Status
                </th>
                <th className="py-3 px-4 text-left text-[11px] font-semibold text-[#6b7280] uppercase tracking-wider">
                  Date & Time
                </th>
                <th className="py-3 px-4 text-left text-[11px] font-semibold text-[#6b7280] uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading && (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-[#6b7280]">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                      <span>Loading transactions...</span>
                    </div>
                  </td>
                </tr>
              )}
              {error && (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-[#ff4d6d]">
                    Failed to load transactions: {error}
                  </td>
                </tr>
              )}
              {!isLoading && !error && filteredTransactions.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-[#6b7280]">
                    No transactions found.
                  </td>
                </tr>
              )}
              {!isLoading && !error && filteredTransactions.slice(0, 15).map((txn) => (
                <tr
                  key={txn.id}
                  className="border-b border-[#f3f4f6] hover:bg-[#f9fafb]"
                >
                  <td className="py-3 px-4 font-mono text-[#3d9eff]">
                    {txn.id}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <Avatar name={txn.userName} size="sm" />
                      <p className="text-[#111827]">{txn.userName}</p>
                    </div>
                  </td>
                  {/* <td className="py-3 px-4 text-[#4b5563]">
                    {txn.method === 'UPI'
                      ? '📱'
                      : txn.method === 'Card'
                        ? '💳'
                        : txn.method === 'NetBanking'
                          ? '🏦'
                          : '👛'}{' '}
                    {txn.method}
                  </td> */}
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
                  <td className="py-3 px-4 text-[#4b5563]">
                    {formatDateTime(txn.datetime)}
                  </td>
                  <td className="py-3 px-4">
                    <button className="bg-[#f9fafb] border border-[#e5e7eb] text-[#4b5563] px-3 py-1 rounded-lg hover:border-[rgba(255,255,255,0.15)] text-[12px] font-medium transition-colors">
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