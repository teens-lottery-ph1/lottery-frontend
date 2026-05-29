'use client';

import { useState, useEffect } from 'react';
import StatCard from '../_components/StatCard';
import Badge from '../_components/Badge';
import Avatar from '../_components/Avatar';
import { useSocket } from '../../components/SocketProvider';

// Format currency to Indian format
const formatINR = (value: number) => {
  return value.toLocaleString('en-IN');
};

// ── Company Wallet types ──────────────────────────────────────────────────────
interface CompanyWalletData {
  balance: number;
  currency: string;
  updatedAt: string | null;
}

interface CompanyWalletStats {
  totalDepositsCollected: number;
  totalPrizesPaid: number;
  totalWithdrawalsPaid: number;
  netRevenue: number;
}

export default function WalletPage() {
  const { socket } = useSocket();
  const [walletsList, setWalletsList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [adjustmentOpen, setAdjustmentOpen] = useState(false);
  const [selectedUserWallet, setSelectedUserWallet] = useState<any | null>(null);
  const [adjustmentForm, setAdjustmentForm] = useState({
    amount: '',
    type: 'Add',
    reason: 'Bonus Award',
    note: '',
  });

  // ── Company Wallet State ──────────────────────────────────────────────────
  const [companyWallet, setCompanyWallet] = useState<CompanyWalletData | null>(null);
  const [companyStats, setCompanyStats] = useState<CompanyWalletStats | null>(null);
  const [companyLoading, setCompanyLoading] = useState(true);
  const [fundingOpen, setFundingOpen] = useState(false);
  const [fundingAmount, setFundingAmount] = useState('');
  const [isProcessingFunding, setIsProcessingFunding] = useState(false);

  const fetchCompanyWallet = async () => {
    try {
      const [walletRes, statsRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/company-wallet`, {
          credentials: 'include',
        }),
        fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/company-wallet/stats`, {
          credentials: 'include',
        }),
      ]);
      const walletData = await walletRes.json();
      const statsData = await statsRes.json();

      if (walletData.success) setCompanyWallet(walletData);
      if (statsData.success) setCompanyStats(statsData.stats);
    } catch (err) {
      console.error('[CompanyWallet] Fetch error:', err);
    } finally {
      setCompanyLoading(false);
    }
  };

  const fetchWallets = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/wallet/admin/all`, {
        credentials: "include"
      });
      const data = await res.json();
      if (data.success) {
        setWalletsList(data.wallets || []);
      }
    } catch (error) {
      console.error('Error fetching wallets:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanyWallet();
    fetchWallets();
    // Auto-refresh company wallet every 30 seconds
    const interval = setInterval(fetchCompanyWallet, 30000);

    // Load Razorpay script dynamically
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      clearInterval(interval);
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  // Listen for Socket.io real-time payment events to refresh balances instantly
  useEffect(() => {
    if (!socket) return;

    const handleRealtimePayment = () => {
      console.log("⚡ Live payment event received, refreshing wallets and company balance...");
      fetchWallets();
      fetchCompanyWallet();
    };

    socket.on("payment_updated", handleRealtimePayment);
    socket.on("new_transaction", handleRealtimePayment);

    return () => {
      socket.off("payment_updated", handleRealtimePayment);
      socket.off("new_transaction", handleRealtimePayment);
    };
  }, [socket]);

  const totalBalance = walletsList.reduce((sum, w) => sum + Number(w.balance || 0), 0);
  const avgBalance = walletsList.length ? totalBalance / walletsList.length : 0;
  const txnToday = walletsList.length;
  const lockedPrizes = walletsList.reduce((sum, w) => sum + Number(w.locked || 0), 0);

  const handleOpenAdjustment = (user: any) => {
    setSelectedUserWallet(user);
    setAdjustmentOpen(true);
  };

  const handleCloseAdjustment = () => {
    setAdjustmentOpen(false);
    setSelectedUserWallet(null);
    setAdjustmentForm({
      amount: '',
      type: 'Add',
      reason: 'Bonus Award',
      note: '',
    });
  };

  const handleSubmitAdjustment = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/wallet/adjust`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          userId: selectedUserWallet?.userId,
          amount: Number(adjustmentForm.amount),
          type: adjustmentForm.type.toLowerCase(), // 'add' or 'deduct'
          reason: adjustmentForm.reason,
          note: adjustmentForm.note
        })
      });

      const data = await res.json();
      if (data.success) {
        alert("Wallet adjusted successfully!");
        fetchWallets();
        handleCloseAdjustment();
      } else {
        alert(data.message || "Failed to adjust wallet");
      }
    } catch (error) {
      console.error("Adjustment error:", error);
      alert("Error processing adjustment");
    }
  };

  const handleCompanyFunding = async () => {
    const amountVal = Number(fundingAmount);
    if (!amountVal || amountVal < 50) {
      alert("Minimum amount to add is ₹50");
      return;
    }

    setIsProcessingFunding(true);
    try {
      const orderRes = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/company-wallet/funding/create-order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          amount: amountVal
        }),
      });
      const orderData = await orderRes.json();
      
      if (!orderRes.ok || !orderData.order?.id) {
        throw new Error(orderData.error || "Failed to create company funding order from server.");
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.order.amount,
        currency: orderData.order.currency,
        name: "Company Wallet",
        description: "Add Company Funds",
        order_id: orderData.order.id,
        handler: async (response: any) => {
          try {
            const verifyRes = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/company-wallet/funding/verify`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              credentials: "include",
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });
            
            if (!verifyRes.ok) {
              const errData = await verifyRes.json().catch(() => ({}));
              throw new Error(errData.error || `Server Error during verification`);
            }

            alert(`Company Wallet funded successfully!`);
            setFundingOpen(false);
            setFundingAmount('');
            fetchCompanyWallet();
          } catch (err: any) {
            console.error("Verification error:", err);
            alert(`Funding verification failed: ${err.message || 'Could not verify payment.'}`);
          }
        },
        prefill: {
          name: "System Admin",
          email: "system-admin@lottery.internal"
        },
        theme: {
          color: "#059669"
        }
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on('payment.failed', function (resp: any) {
        alert(`Payment failed: ${resp.error.description}`);
      });
      rzp.open();
    } catch (error: any) {
      console.error("Company funding error:", error);
      alert(`Funding error: ${error.message}`);
    } finally {
      setIsProcessingFunding(false);
    }
  };

  return (
    <div className="space-y-8">

      {/* ── COMPANY WALLET SECTION ─────────────────────────────────────────── */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <h2 className="text-[20px] font-bold text-[#111827]">🏦 Company Wallet</h2>
          {!companyLoading && (
            <span className="flex items-center gap-1.5 bg-[rgba(22,163,74,0.1)] text-[#16a34a] text-[11px] font-bold px-2.5 py-1 rounded-full">
              <span className="w-1.5 h-1.5 bg-[#16a34a] rounded-full animate-pulse" />
              LIVE
            </span>
          )}
        </div>

        {companyLoading ? (
          <div className="h-40 bg-white border border-[#e5e7eb] rounded-2xl flex items-center justify-center text-[#6b7280] text-[14px]">
            Loading company wallet...
          </div>
        ) : (
          <div className="grid grid-cols-[auto_1fr] gap-6">

            {/* Balance Card */}
            <div
              className="rounded-2xl p-8 min-w-[280px] flex flex-col justify-between relative overflow-hidden"
              style={{ background: 'linear-gradient(135deg, #1e3a2f 0%, #064e3b 60%, #065f46 100%)' }}
            >
              {/* Decorative circle */}
              <div className="absolute -right-8 -top-8 w-40 h-40 rounded-full bg-white opacity-5" />
              <div className="absolute -right-4 -bottom-10 w-56 h-56 rounded-full bg-white opacity-5" />

              <div className="relative">
                <p className="text-[#6ee7b7] text-[12px] font-semibold uppercase tracking-widest mb-1">
                  Company Wallet Balance
                </p>
                <p className="text-white text-[42px] font-black leading-none mb-1">
                  ₹{formatINR(companyWallet?.balance ?? 0)}
                </p>
                <p className="text-[#6ee7b7] text-[12px] opacity-70">
                  {companyWallet?.currency ?? 'INR'} •{' '}
                  {companyWallet?.updatedAt
                    ? `Updated ${new Date(companyWallet.updatedAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}`
                    : 'Not initialised yet'}
                </p>
              </div>

              <div className="relative mt-6 pt-4 border-t border-[rgba(255,255,255,0.1)] flex items-center justify-between">
                <p className="text-[#a7f3d0] text-[11px]">
                  Auto-refreshes every 30 seconds
                </p>
                <button
                  onClick={() => setFundingOpen(true)}
                  className="bg-[#10b981] hover:bg-[#059669] text-white text-[12px] font-bold py-1.5 px-3 rounded-lg transition-all shadow flex items-center gap-1"
                >
                  ➕ Add Funds
                </button>
              </div>
            </div>

            {/* P&L Breakdown */}
            <div className="grid grid-cols-3 gap-4">
              {/* Deposits Collected */}
              <div className="bg-white border border-[#e5e7eb] rounded-2xl p-5 flex flex-col justify-between hover:-translate-y-0.5 transition-all shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-[rgba(22,163,74,0.1)] flex items-center justify-center text-xl mb-3">
                  💰
                </div>
                <div>
                  <p className="text-[26px] font-black text-[#16a34a]">
                    ₹{formatINR(companyStats?.totalDepositsCollected ?? 0)}
                  </p>
                  <p className="text-[12px] text-[#6b7280] mt-1">User Join Level Money</p>
                </div>
                <p className="text-[11px] text-[#9ca3af] mt-3">User join level money → Company wallet</p>
              </div>

              {/* Prizes Paid */}
              <div className="bg-white border border-[#e5e7eb] rounded-2xl p-5 flex flex-col justify-between hover:-translate-y-0.5 transition-all shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-[rgba(220,38,38,0.1)] flex items-center justify-center text-xl mb-3">
                  🏆
                </div>
                <div>
                  <p className="text-[26px] font-black text-[#dc2626]">
                    ₹{formatINR(companyStats?.totalPrizesPaid ?? 0)}
                  </p>
                  <p className="text-[12px] text-[#6b7280] mt-1">Total Prizes Paid</p>
                </div>
                <p className="text-[11px] text-[#9ca3af] mt-3">Level completion payouts</p>
              </div>

              {/* Net Revenue */}
              <div
                className="rounded-2xl p-5 flex flex-col justify-between hover:-translate-y-0.5 transition-all shadow-sm border"
                style={{
                  background: (companyStats?.netRevenue ?? 0) >= 0
                    ? 'rgba(22,163,74,0.05)'
                    : 'rgba(220,38,38,0.05)',
                  borderColor: (companyStats?.netRevenue ?? 0) >= 0
                    ? 'rgba(22,163,74,0.2)'
                    : 'rgba(220,38,38,0.2)',
                }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-xl mb-3"
                  style={{
                    background: (companyStats?.netRevenue ?? 0) >= 0
                      ? 'rgba(22,163,74,0.15)'
                      : 'rgba(220,38,38,0.15)',
                  }}
                >
                  {(companyStats?.netRevenue ?? 0) >= 0 ? '📈' : '📉'}
                </div>
                <div>
                  <p
                    className="text-[26px] font-black"
                    style={{
                      color: (companyStats?.netRevenue ?? 0) >= 0 ? '#16a34a' : '#dc2626',
                    }}
                  >
                    ₹{formatINR(Math.abs(companyStats?.netRevenue ?? 0))}
                  </p>
                  <p className="text-[12px] text-[#6b7280] mt-1">Net Revenue</p>
                </div>
                <p className="text-[11px] text-[#9ca3af] mt-3">
                  Deposits − Prizes − Withdrawals
                </p>
              </div>
            </div>

          </div>
        )}
      </div>

      {/* DIVIDER */}
      <div className="border-t border-[#e5e7eb]" />

      {/* ── USER WALLETS SECTION ───────────────────────────────────────────── */}
      <div>
        <h2 className="text-[20px] font-bold text-[#111827] mb-4">👛 User Wallets</h2>

      {/* STAT CARDS */}
      <div className="grid grid-cols-4 gap-6">
        <StatCard
          icon="👛"
          value={`₹${formatINR(totalBalance)}`}
          label="Total Wallet Balance"
          accentColor="#d97706"
        />
        <StatCard
          icon="📊"
          value={`₹${formatINR(avgBalance)}`}
          label="Average Balance"
          accentColor="#1e40af"
        />
        <StatCard
          icon="💫"
          value={txnToday}
          label="Transactions Today"
          accentColor="#16a34a"
        />
        <StatCard
          icon="🔒"
          value={`₹${formatINR(lockedPrizes)}`}
          label="Locked Prizes"
          accentColor="#dc2626"
        />
      </div>
      </div>

      {/* WALLET TABLE + ADJUSTMENT PANEL */}
      <div className="grid grid-cols-[1fr_350px] gap-6">
        {/* WALLET TABLE */}
        <div className="bg-white border border-[#e5e7eb] rounded-2xl p-6">
          <h3 className="text-[18px] font-bold text-[#111827] mb-6">
            User Wallets
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-[13px]">
              <thead>
                <tr className="border-b border-[#e5e7eb]">
                  <th className="py-3 px-4 text-left text-[11px] font-semibold text-[#6b7280] uppercase tracking-wider">
                    User
                  </th>
                  <th className="py-3 px-4 text-left text-[11px] font-semibold text-[#6b7280] uppercase tracking-wider">
                    Balance
                  </th>
                  <th className="py-3 px-4 text-left text-[11px] font-semibold text-[#6b7280] uppercase tracking-wider">
                    Bonus
                  </th>
                  <th className="py-3 px-4 text-left text-[11px] font-semibold text-[#6b7280] uppercase tracking-wider">
                    Locked
                  </th>
                  <th className="py-3 px-4 text-left text-[11px] font-semibold text-[#6b7280] uppercase tracking-wider">
                    Last Txn
                  </th>
                  <th className="py-3 px-4 text-left text-[11px] font-semibold text-[#6b7280] uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={6} className="py-8 text-center text-gray-400">Loading wallets...</td></tr>
                ) : walletsList.map((user) => (
                  <tr
                    key={user.userId}
                    className="border-b border-[#f3f4f6] hover:bg-[#f9fafb]"
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Avatar name={user.userName} size="sm" />
                        <p className="text-[#111827] font-semibold">
                          {user.userName}
                        </p>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-semibold text-[#00d68f]">
                      ₹{formatINR(Number(user.balance))}
                    </td>
                    <td className="py-3 px-4 font-semibold text-[#f5c518]">
                      ₹{formatINR(Number(user.bonus || 0))}
                    </td>
                    <td className="py-3 px-4 text-[#ff4d6d]">
                      ₹{formatINR(Number(user.locked || 0))}
                    </td>
                    <td className="py-3 px-4 text-[#4b5563]">
                      {new Date(user.updatedAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleOpenAdjustment(user)}
                          className="bg-[rgba(0,214,143,0.12)] text-[#00d68f] border border-[rgba(0,214,143,0.2)] px-2 py-1 rounded-lg hover:bg-[rgba(0,214,143,0.2)] text-[11px] font-semibold transition-colors"
                        >
                          ➕
                        </button>
                        <button
                          onClick={() => handleOpenAdjustment(user)}
                          className="bg-[rgba(255,77,109,0.12)] text-[#ff4d6d] border border-[rgba(255,77,109,0.2)] px-2 py-1 rounded-lg hover:bg-[rgba(255,77,109,0.2)] text-[11px] font-semibold transition-colors"
                        >
                          ➖
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* MANUAL ADJUSTMENT PANEL */}
        {adjustmentOpen && selectedUserWallet && (
          <div className="bg-white border border-[#e5e7eb] rounded-2xl p-6 h-fit sticky top-20">
            <h3 className="text-[16px] font-bold text-[#111827] mb-4">
              Manual Adjustment
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-[12px] font-semibold text-[#4b5563] mb-2">
                  User
                </label>
                <p className="bg-[#f3f4f6] rounded-lg px-3 py-2 text-[#111827]">
                  {selectedUserWallet.userName}
                </p>
              </div>

              <div>
                <label className="block text-[12px] font-semibold text-[#4b5563] mb-2">
                  Amount
                </label>
                <input
                  type="number"
                  value={adjustmentForm.amount}
                  onChange={(e) =>
                    setAdjustmentForm((prev) => ({
                      ...prev,
                      amount: e.target.value,
                    }))
                  }
                  placeholder="0"
                  className="w-full bg-[#f9fafb] border border-[#e5e7eb] rounded-lg px-3 py-2 text-[#111827] text-[13px] outline-none focus:border-[#d97706] transition-colors placeholder:text-[#6b7280]"
                />
              </div>

              <div>
                <label className="block text-[12px] font-semibold text-[#4b5563] mb-2">
                  Type
                </label>
                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      setAdjustmentForm((prev) => ({
                        ...prev,
                        type: 'Add',
                      }))
                    }
                    className={`flex-1 py-2 rounded-lg text-[12px] font-semibold transition-colors ${
                      adjustmentForm.type === 'Add'
                        ? 'bg-[#f5c518] text-black'
                        : 'bg-[#f9fafb] border border-[#e5e7eb] text-[#4b5563]'
                    }`}
                  >
                    Add Funds
                  </button>
                  <button
                    onClick={() =>
                      setAdjustmentForm((prev) => ({
                        ...prev,
                        type: 'Deduct',
                      }))
                    }
                    className={`flex-1 py-2 rounded-lg text-[12px] font-semibold transition-colors ${
                      adjustmentForm.type === 'Deduct'
                        ? 'bg-[#f5c518] text-black'
                        : 'bg-[#f9fafb] border border-[#e5e7eb] text-[#4b5563]'
                    }`}
                  >
                    Deduct
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[12px] font-semibold text-[#4b5563] mb-2">
                  Reason
                </label>
                <select
                  value={adjustmentForm.reason}
                  onChange={(e) =>
                    setAdjustmentForm((prev) => ({
                      ...prev,
                      reason: e.target.value,
                    }))
                  }
                  className="w-full bg-[#f9fafb] border border-[#e5e7eb] rounded-lg px-3 py-2 text-[#4b5563] text-[13px] outline-none focus:border-[#d97706] transition-colors"
                >
                  <option>Bonus Award</option>
                  <option>Contest Winner</option>
                  <option>Refund</option>
                  <option>Correction</option>
                  <option>Penalty</option>
                  <option>Other</option>
                </select>
              </div>

              <div>
                <label className="block text-[12px] font-semibold text-[#4b5563] mb-2">
                  Note
                </label>
                <textarea
                  value={adjustmentForm.note}
                  onChange={(e) =>
                    setAdjustmentForm((prev) => ({
                      ...prev,
                      note: e.target.value,
                    }))
                  }
                  placeholder="Admin note..."
                  rows={3}
                  className="w-full bg-[#f9fafb] border border-[#e5e7eb] rounded-lg px-3 py-2 text-[#111827] text-[13px] outline-none focus:border-[#d97706] transition-colors placeholder:text-[#6b7280] resize-none"
                />
              </div>

              <div className="bg-[rgba(255,77,109,0.12)] border border-[rgba(255,77,109,0.2)] rounded-lg p-3 text-[12px] text-[#ff4d6d]">
                ⚠️ This action will be logged in the audit trail
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleSubmitAdjustment}
                  className="flex-1 bg-[#f5c518] text-black font-bold px-3 py-2 rounded-lg hover:bg-[#e6a800] transition-colors text-[13px]"
                >
                  Apply 💰
                </button>
                <button
                  onClick={handleCloseAdjustment}
                  className="flex-1 bg-[#f9fafb] border border-[#e5e7eb] text-[#4b5563] px-3 py-2 rounded-lg hover:border-[rgba(255,255,255,0.15)] transition-colors text-[13px]"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── COMPANY FUNDING MODAL ─────────────────────────────────────────── */}
      {fundingOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white border border-[#e5e7eb] rounded-2xl w-full max-w-md p-6 relative shadow-xl">
            <button
              onClick={() => setFundingOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-lg font-bold"
            >
              ✕
            </button>
            <h2 className="text-xl font-bold mb-4 text-[#111827]">🏦 Add Company Funds</h2>
            <div className="mb-6">
              <label className="block text-sm text-[#4b5563] mb-2">Amount (Min ₹50)</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">₹</span>
                <input
                  type="number"
                  value={fundingAmount}
                  onChange={(e) => setFundingAmount(e.target.value)}
                  placeholder="Enter amount"
                  className="w-full bg-[#f9fafb] border border-[#e5e7eb] rounded-xl py-3 pl-8 pr-4 text-[#111827] focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
            <button
              onClick={handleCompanyFunding}
              disabled={isProcessingFunding || !fundingAmount || Number(fundingAmount) < 50}
              className="w-full bg-[#10b981] hover:bg-[#059669] disabled:opacity-50 disabled:hover:bg-[#10b981] text-white font-bold py-3 rounded-xl transition-all shadow-md"
            >
              {isProcessingFunding ? "Processing..." : "Proceed to Pay"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
