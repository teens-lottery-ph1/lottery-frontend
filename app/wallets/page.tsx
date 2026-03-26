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
} from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

/* ================= TYPES ================= */

type WalletType = {
  balance: number;
  bonus_balance: number;
};

type TransactionType = {
  id: string;
  amount: string;
  type: string;
  status: string;
  createdAt: string;
};

/* ================= API ================= */

 const BASE_URL = process.env.NEXT_PUBLIC_API_URL!;

// fallback (testing)
const USER_ID = "a9824974-b278-4c38-a383-188622ddf7a9";

/* ================= COMPONENT =============== */

export default function WalletPage() {
  const [wallet, setWallet] = useState<WalletType | null>(null);
  const [transactions, setTransactions] = useState<TransactionType[]>([]);

  useEffect(() => {
    fetchWallet();
  }, []);

  const fetchWallet = async () => {
    try {
      // cookies 
      const walletRes = await fetch(
        `${BASE_URL}/balance?userId=${USER_ID}`,
        {
          method: "GET",
          credentials: "include", // 🔥 cookies support
        }
      );

      const txRes = await fetch(
        `${BASE_URL}/transactions?userId=${USER_ID}`,
        {
          method: "GET",
          credentials: "include", // 🔥 cookies support
        }
      );

      const walletData = await walletRes.json();
      const txData = await txRes.json();

      setWallet(walletData.data);
      setTransactions(txData.data || []);
    } catch (err) {
      console.error("API Error:", err);
    }
  };

  return (
    <div className="p-6 text-white max-w-7xl mx-auto">

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* BALANCE CARD */}
        <div className="relative lg:col-span-2 bg-gradient-to-br from-[#0f1f1a] to-[#0b1511] rounded-2xl p-6 border border-[#1f3d32] overflow-hidden">

          <Image
            src="/images/wallet-hero.png"
            alt="wallet bg"
            fill
            sizes="100vw"
            priority
            className="object-cover opacity-10"
          />

          <div className="relative z-10">
            <div className="flex items-center gap-2 text-gray-400">
              <Wallet size={18} className="text-emerald-400" />
              <span>Total Balance</span>
            </div>

            <h1 className="text-5xl font-bold text-yellow-400 mt-4">
              ₹{wallet?.balance ?? 0}
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
              <p>Total Bonus</p>
            </div>
            <h2 className="text-3xl font-bold mt-2">
              ₹{wallet?.bonus_balance ?? 0}
            </h2>
          </div>

          <div className="bg-[#0f1613] rounded-2xl p-5 border border-[#1f2a26]">
            <div className="flex items-center gap-2 text-yellow-400">
              <CreditCard size={18} />
              <p>Transactions</p>
            </div>
            <h2 className="text-3xl font-bold mt-2">
              {transactions.length}
            </h2>
          </div>
        </div>
      </div>

      {/* ACTION CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
        {[
          {
            title: "Buy Tickets",
            desc: "Purchase lottery tickets",
            icon: <Ticket />,
          },
          {
            title: "Auto-Draw",
            desc: "Set up subscriptions",
            icon: <RefreshCcw />,
          },
          {
            title: "Referral Code",
            desc: "Earn ₹20 per referral",
            icon: <Users />,
          },
          {
            title: "Transaction History",
            desc: "View all transactions",
            icon: <Clock />,
          },
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

      {/* TRANSACTIONS */}
      <div className="mt-12 bg-[#0f1613] rounded-2xl border border-[#1f2a26]">
        <h2 className="text-xl font-semibold p-6 border-b border-[#1f2a26]">
          Recent Transactions
        </h2>

        <div className="max-h-[420px] overflow-y-auto">
          {transactions.map((tx) => (
            <div
              key={tx.id}
              className="flex items-center justify-between px-6 py-5 border-b border-[#1f2a26]"
            >
              <div className="flex items-center gap-4">
                <div
                  className={`p-2 rounded-full ${
                    tx.type === "deposit"
                      ? "bg-emerald-500/10 text-emerald-400"
                      : "bg-gray-500/10 text-gray-400"
                  }`}
                >
                  {tx.type === "deposit" ? (
                    <ArrowDownLeft />
                  ) : (
                    <ArrowUpRight />
                  )}
                </div>

                <div>
                  <p className="font-medium">{tx.type}</p>
                  <p className="text-sm text-gray-400">
                    {new Date(tx.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <p className="font-semibold text-white">
                  ₹{tx.amount}
                </p>
                <p className="text-sm text-gray-400">
                  {tx.status}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}