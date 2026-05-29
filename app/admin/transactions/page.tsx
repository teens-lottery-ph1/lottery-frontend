"use client";

import { useEffect, useState } from "react";
import { ArrowDownLeft, ArrowUpRight, Search, Filter, Download } from "lucide-react";
import DashboardLayout from "../layout";

export default function AdminTransactionsPage() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:10000";

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/payments/transactions`, {
          credentials: "include"
        });
        const data = await res.json();
        if (data.success) {
          setTransactions(data.data || []);
        }
      } catch (err) {
        console.error("Failed to fetch transactions:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, [BASE_URL]);

  return (
    <DashboardLayout>
      <div className="p-6 text-white max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Transaction History</h1>
            <p className="text-gray-400 mt-1">Complete ledger of all user financial activities.</p>
          </div>
          <button className="flex items-center gap-2 bg-[#1c2b26] hover:bg-[#22352f] px-4 py-2 rounded-xl border border-[#2a403a] transition-all">
            <Download size={18} /> Export CSV
          </button>
        </div>

        {/* Filters */}
        <div className="flex gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search by Username or Transaction ID..."
              className="w-full bg-[#0f1613] border border-[#1f2a26] rounded-xl py-2 pl-10 pr-4 text-white focus:outline-none focus:border-emerald-500"
            />
          </div>
          <button className="flex items-center gap-2 bg-[#0f1613] hover:bg-[#151f1a] px-4 py-2 rounded-xl border border-[#1f2a26]">
            <Filter size={18} /> Filter by Status
          </button>
        </div>

        {/* Table */}
        <div className="bg-[#0f1613] border border-[#1f2a26] rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#1f2a26] bg-[#0a0f0d]">
                  <th className="p-4 font-semibold text-gray-400 uppercase text-xs tracking-wider">Transaction ID</th>
                  <th className="p-4 font-semibold text-gray-400 uppercase text-xs tracking-wider">Username</th>
                  <th className="p-4 font-semibold text-gray-400 uppercase text-xs tracking-wider">Date & Time</th>
                  <th className="p-4 font-semibold text-gray-400 uppercase text-xs tracking-wider">Purpose</th>
                  <th className="p-4 font-semibold text-gray-400 uppercase text-xs tracking-wider text-right">Amount</th>
                  <th className="p-4 font-semibold text-gray-400 uppercase text-xs tracking-wider text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1f2a26]">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-gray-500">Loading transactions...</td>
                  </tr>
                ) : transactions.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-gray-500">No transactions found.</td>
                  </tr>
                ) : (
                  transactions.map((txn, idx) => {
                    // Logic for Credit vs Debit based on type
                    const isCredit = ['Deposit', 'PrizePayout', 'BonusCredit', 'ReferralReward'].includes(txn.type);
                    
                    return (
                      <tr key={idx} className="hover:bg-[#151f1a] transition-colors">
                        <td className="p-4 text-sm font-mono text-gray-300">
                          {txn.id.substring(0, 8).toUpperCase() + "..."}
                        </td>
                        <td className="p-4 font-medium">{txn.userName}</td>
                        <td className="p-4 text-sm text-gray-400">
                          {new Date(txn.datetime).toLocaleDateString()} <br />
                          <span className="text-xs">{new Date(txn.datetime).toLocaleTimeString()}</span>
                        </td>
                        <td className="p-4">
                          <span className="bg-gray-800/50 text-gray-300 px-2 py-1 rounded text-xs font-medium uppercase tracking-wider">
                            {txn.type.replace(/([A-Z])/g, ' $1').trim()}
                          </span>
                        </td>
                        <td className="p-4 text-right font-bold">
                          {isCredit ? (
                            <span className="text-emerald-400 flex items-center justify-end gap-1">
                              <ArrowDownLeft size={16} /> +₹{Number(txn.amount).toFixed(2)}
                            </span>
                          ) : (
                            <span className="text-red-400 flex items-center justify-end gap-1">
                              <ArrowUpRight size={16} /> -₹{Number(txn.amount).toFixed(2)}
                            </span>
                          )}
                        </td>
                        <td className="p-4 text-center">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                              txn.status === 'Success'
                                ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                                : txn.status === 'Pending'
                                ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20'
                                : 'bg-red-500/10 text-red-500 border border-red-500/20'
                            }`}
                          >
                            {txn.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
