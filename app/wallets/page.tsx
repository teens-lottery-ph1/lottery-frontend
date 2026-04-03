"use client";

import {
  ArrowDownLeft,
  ArrowUpRight,
  Plus,
  Wallet,
  Ticket,
  RefreshCcw,
  Users,
  Clock,
  TrendingUp,
  CreditCard,
  AlertCircle,
  CheckCircle2,
  Copy,
  Sparkles,
} from "lucide-react";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect, Suspense } from "react";

const transactions = [
  {
    title: "Deposit via UPI",
    date: "Feb 22, 2026",
    amount: "+$100.00",
    status: "completed",
    type: "credit",
  },
  {
    title: "Mega Millions Ticket",
    date: "Feb 22, 2026",
    amount: "-$10.00",
    status: "completed",
    type: "debit",
  },
  {
    title: "Lucky 7 — Won!",
    date: "Feb 20, 2026",
    amount: "+$500.00",
    status: "completed",
    type: "credit",
  },
  {
    title: "Power Ball Ticket x3",
    date: "Feb 19, 2026",
    amount: "-$30.00",
    status: "completed",
    type: "debit",
  },
  {
    title: "Referral Bonus — James",
    date: "Feb 18, 2026",
    amount: "+$20.00",
    status: "completed",
    type: "credit",
  },
  {
    title: "Deposit via Card",
    date: "Feb 15, 2026",
    amount: "+$200.00",
    status: "completed",
    type: "credit",
  },
  {
    title: "Withdrawal to Bank",
    date: "Feb 14, 2026",
    amount: "-$300.00",
    status: "pending",
    type: "debit",
  },
];

function WalletContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const amount = searchParams.get("amount");
  const poolId = searchParams.get("poolId");

  const [wallet, setWallet] = useState({ available: 0, locked: 0 });
  const [isPaying, setIsPaying] = useState(false);

  // Referral States
  const [referralId, setReferralId] = useState("");
  const [referralLink, setReferralLink] = useState("");
  const [loadingReferral, setLoadingReferral] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);   // ← New state for copy feedback

  const BASE_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:10000";

  // Fetch Wallet Balance
  useEffect(() => {
    const fetchWallet = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/wallet`, {
          credentials: "include",
        });
        const data = await res.json();
        if (data && !data.error) {
          setWallet(data);
        }
      } catch (err) {
        console.error("Wallet fetch error:", err);
      }
    };
    fetchWallet();
  }, [BASE_URL]);

  // Generate Referral
  const generateReferral = async () => {
    try {
      setLoadingReferral(true);
      const res = await fetch(`${BASE_URL}/api/referral/generate`, {
        method: "POST",
        credentials: "include",
      });

      const data = await res.json();

      if (data.success && data.referralId) {
        setReferralId(data.referralId);
        const link = `${window.location.origin}/signup?ref=${data.referralId}`;
        setReferralLink(link);
      } else {
        alert(data.message || "Failed to generate referral");
      }
    } catch (err) {
      console.error("Referral generation error:", err);
      alert("Failed to generate referral");
    } finally {
      setLoadingReferral(false);
    }
  };

  const copyReferral = async () => {
    if (!referralLink) return;

    try {
      await navigator.clipboard.writeText(referralLink);
      setCopySuccess(true);

      // Auto hide success message after 2 seconds
      setTimeout(() => {
        setCopySuccess(false);
      }, 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
      alert("Failed to copy link");
    }
  };

  const handlePay = async () => {
    setIsPaying(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      if (poolId) {
        const res = await fetch(`${BASE_URL}/api/levels/join`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ poolId }),
          credentials: "include",
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Failed to join level");
        }
      }

      alert(`Payment of ₹${amount} successful!`);
      window.location.href = "/levels";
    } catch (err: any) {
      alert(err.message || "Payment failed");
    } finally {
      setIsPaying(false);
    }
  };

  return (
    <>
      {/* PAYMENT ALERT IF REDIRECTED */}
      {amount && (
        <div className="mb-8 bg-yellow-500/10 border border-yellow-500/20 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/10 blur-3xl rounded-full -mr-16 -mt-16" />
          <div className="flex items-center gap-4 relative z-10">
            <div className="w-12 h-12 rounded-full bg-yellow-500/20 flex items-center justify-center text-yellow-500">
              <AlertCircle size={24} />
            </div>
            <div>
              <h3 className="font-bold text-lg text-white">Complete Your Entry</h3>
              <p className="text-gray-400 text-sm">
                You are joining a Level Game. Please complete the payment of{" "}
                <span className="text-yellow-500 font-bold">₹{amount}</span>.
              </p>
            </div>
          </div>
          <div className="flex gap-3 relative z-10 w-full md:w-auto">
            <button
              onClick={handlePay}
              disabled={isPaying}
              className="flex-1 md:flex-none bg-yellow-500 hover:bg-yellow-600 text-black font-bold px-8 py-3 rounded-xl transition-all shadow-lg shadow-yellow-500/20 flex items-center justify-center gap-2"
            >
              {isPaying ? "Processing..." : "PAY NOW"}
              <CheckCircle2 size={18} />
            </button>
            <button
              onClick={() => window.history.back()}
              className="px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium border border-white/10 transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* TOP SUMMARY */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* BALANCE CARD */}
        <div className="relative lg:col-span-2 bg-gradient-to-br from-[#0f1f1a] to-[#0b1511] rounded-2xl p-6 border border-[#1f3d32] overflow-hidden">
          <Image
            src="/images/wallet-hero.png"
            alt="wallet bg"
            fill
            className="object-cover opacity-10"
          />

          <div className="relative z-10">
            <div className="flex items-center gap-2 text-gray-400">
              <Wallet size={18} className="text-emerald-400" />
              <span>Total Balance</span>
            </div>

            <h1 className="text-5xl font-bold text-yellow-400 mt-4">
              ₹{wallet.available.toLocaleString()}
            </h1>

            <div className="flex gap-3 mt-6">
              <button className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-black font-semibold px-5 py-2 rounded-xl">
                <Plus size={18} /> Add Funds
              </button>

              <button className="flex items-center gap-2 bg-[#1c2b26] hover:bg-[#22352f] px-5 py-2 rounded-xl">
                <CreditCard size={18} /> Withdraw
              </button>
            </div>
          </div>
        </div>

        {/* SIDE STATS */}
        <div className="flex flex-col gap-6">
          <div className="bg-[#0f1613] rounded-2xl p-5 border border-[#1f2a26]">
            <div className="flex items-center gap-2 text-emerald-400">
              <TrendingUp size={18} />
              <p>Total Won</p>
            </div>
            <h2 className="text-3xl font-bold mt-2">$2,500.00</h2>
          </div>

          <div className="bg-[#0f1613] rounded-2xl p-5 border border-[#1f2a26]">
            <div className="flex items-center gap-2 text-yellow-400">
              <CreditCard size={18} />
              <p>Credits Used</p>
            </div>
            <h2 className="text-3xl font-bold mt-2">3,450</h2>
          </div>
        </div>
      </div>

      {/* ACTION CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
        {[
          { title: "Buy Tickets", desc: "Purchase lottery tickets", icon: <Ticket /> },
          { title: "Auto-Draw", desc: "Set up subscriptions", icon: <RefreshCcw /> },
          { title: "Referral Code", desc: "Earn $20 per referral", icon: <Users /> },
          { title: "Transaction History", desc: "View all transactions", icon: <Clock /> },
        ].map((item) => (
          <div
            key={item.title}
            className="bg-[#0f1613] p-5 rounded-2xl border border-[#1f2a26] hover:border-emerald-500 transition"
          >
            <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 mb-3">
              {item.icon}
            </div>
            <h3 className="font-semibold">{item.title}</h3>
            <p className="text-sm text-gray-400 mt-1">{item.desc}</p>
          </div>
        ))}
      </div>

      {/* REFERRAL SECTION */}
      <div className="mt-10 bg-[#0f1613] rounded-2xl border border-[#1f2a26] p-6">
        <div className="flex items-center gap-2 mb-4">
          <Users className="text-emerald-400" />
          <h2 className="text-lg font-semibold">Referral</h2>
        </div>

        {!referralId && (
          <button
            onClick={generateReferral}
            disabled={loadingReferral}
            className="flex items-center gap-2 bg-yellow-500 text-black px-5 py-3 rounded-xl cursor-pointer hover:bg-yellow-600 transition-colors disabled:opacity-50"
          >
            <Sparkles size={16} />
            {loadingReferral ? "Fetching..." : "Generate Referral ID"}
          </button>
        )}

        {referralId && (
          <div className="space-y-4">
            <div>
              <p className="text-gray-400 text-sm">Referral ID</p>
              <p className="text-yellow-400 font-semibold">{referralId}</p>
            </div>

            <div>
              <p className="text-gray-400 text-sm">Referral Link</p>
              <div className="flex gap-3 mt-2">
                <input
                  value={referralLink}
                  readOnly
                  className="flex-1 bg-[#0b1511] border border-[#1f2a26] rounded-xl px-4 py-2"
                />
                <button
                  onClick={copyReferral}
                  className="bg-emerald-500 text-black px-4 rounded-xl flex items-center gap-2 cursor-pointer hover:bg-emerald-600 transition-colors"
                >
                  <Copy size={14} />
                  Copy
                </button>
              </div>

              {/* Success Message - Shown on the page instead of alert */}
              {copySuccess && (
                <div className="mt-3 flex items-center gap-2 text-emerald-400 text-sm font-medium">
                  <CheckCircle2 size={18} />
                  Referral link copied successfully!
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* TRANSACTIONS */}
      <div className="mt-12 bg-[#0f1613] rounded-2xl border border-[#1f2a26]">
        <h2 className="text-xl font-semibold p-6 border-b border-[#1f2a26]">
          Recent Transactions
        </h2>

        <div className="max-h-[420px] overflow-y-auto">
          {transactions.map((tx, i) => (
            <div
              key={i}
              className="flex items-center justify-between px-6 py-5 border-b border-[#1f2a26]"
            >
              <div className="flex items-center gap-4">
                <div
                  className={`p-2 rounded-full ${
                    tx.type === "credit"
                      ? "bg-emerald-500/10 text-emerald-400"
                      : "bg-gray-500/10 text-gray-400"
                  }`}
                >
                  {tx.type === "credit" ? <ArrowDownLeft /> : <ArrowUpRight />}
                </div>

                <div>
                  <p className="font-medium">{tx.title}</p>
                  <p className="text-sm text-gray-400">{tx.date}</p>
                </div>
              </div>

              <div className="text-right">
                <p
                  className={`font-semibold ${
                    tx.type === "credit" ? "text-emerald-400" : "text-white"
                  }`}
                >
                  {tx.amount}
                </p>
                <p
                  className={`text-sm ${
                    tx.status === "pending" ? "text-yellow-400" : "text-gray-400"
                  }`}
                >
                  {tx.status}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default function WalletPage() {
  return (
    <div className="p-6 text-white max-w-7xl mx-auto">
      <Suspense fallback={<p className="text-gray-500">Loading wallet...</p>}>
        <WalletContent />
      </Suspense>
    </div>
  );
}