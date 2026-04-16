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
  X,
  Lock
} from "lucide-react";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import AuthPromptModal from "@/app/components/modals/AuthPromptModal";

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
]; function WalletContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const amount = searchParams.get("amount");
  const poolId = searchParams.get("poolId");
  const from = searchParams.get("from");

  const [wallet, setWallet] = useState({ available: 0, locked: 0 });
  const [isPaying, setIsPaying] = useState(false);
  const [isAddMoneyOpen, setIsAddMoneyOpen] = useState(false);
  const [addAmount, setAddAmount] = useState("");
  const [isProcessingAdd, setIsProcessingAdd] = useState(false);
  const [isPolling, setIsPolling] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:10000";

  // Load Razorpay script dynamically
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    return () => { document.body.removeChild(script); };
  }, []);

  useEffect(() => {
    const fetchWallet = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/wallet`, {
          credentials: "include"
        });
        const data = await res.json();
        if (data && data.success) {
          setWallet(data);
        }
      } catch (err) {
        console.error("Wallet fetch error:", err);
      }
    };
    fetchWallet();
  }, [BASE_URL]);

  const handlePay = async () => {
    // Check Auth
    if (!localStorage.getItem("user")) {
      setIsAuthModalOpen(true);
      return;
    }
    setIsPaying(true);
    try {
      // 1. Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 1500));

      // 2. Call the ACTUAL join API if we have a poolId
      if (poolId) {
        const res = await fetch(`${BASE_URL}/api/levels/join`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ 
            poolId
          }),
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

  const handleAddMoney = async () => {
    const amountVal = Number(addAmount);
    if (!amountVal || amountVal < 50) {
      alert("Minimum amount to add is ₹50");
      return;
    }

    setIsProcessingAdd(true);
    try {
      const orderRes = await fetch(`${BASE_URL}/api/payments/create-order`, {
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

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Lottery Wallet",
        description: "Add Money to Wallet",
        order_id: orderData.id,
        handler: async (response: any) => {
          try {
            // Verify payment ONLY ONCE for add money.
            const verifyRes = await fetch(`${BASE_URL}/api/payments/verify`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              credentials: "include",
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                amount: amountVal,
                type: "Deposit"
              }),
            });
            if (!verifyRes.ok) {
              const errData = await verifyRes.json().catch(() => ({}));
              throw new Error(errData.error || `Server Error during verification`);
            }

            // NOTE: Wallet update is handled asynchronously by the Razorpay webhook.
            // We poll GET /api/wallet every 2-3 seconds until the balance increases 
            // instead of blindly updating the local state.
            setIsAddMoneyOpen(false);
            setIsPolling(true);

            const initialBalance = wallet.available;
            let currentBalance = initialBalance;
            let attempts = 0;
            const maxAttempts = 10; // Max ~25 seconds

            while (currentBalance <= initialBalance && attempts < maxAttempts) {
              await new Promise(r => setTimeout(r, 2500)); // Poll every 2.5 seconds
              try {
                const walletRes = await fetch(`${BASE_URL}/api/wallet`, {
                  credentials: "include"
                });
                const data = await walletRes.json();
                if (data && data.success) {
                  currentBalance = data.available;
                  if (currentBalance > initialBalance) {
                    setWallet(data); 
                    break;
                  }
                }
              } catch (e) {
                // Network glitch, silently ignore and let loop retry
              }
              attempts++;
            }

            setIsPolling(false);
            if (currentBalance > initialBalance) {
              // Success exactly when webhook updates DB
              alert(`Money added successfully! New Balance: ₹${currentBalance}`);
            } else {
              // Timeout fallback
              alert("Payment verified, but wallet update is taking a bit longer. Please check back in a few minutes.");
            }

            setAddAmount("");
          } catch (err: any) {
            console.error("Network Error during Verification:", err);
            alert(`Verification failed: ${err.message || 'Could not verify payment.'}`);
          }
        },
        theme: { color: "#10b981" },
      };
      new (window as any).Razorpay(options).open();
    } catch (e: any) {
      console.error(e);
      alert("Failed to initiate payment");
    } finally {
      setIsProcessingAdd(false);
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
              <p className="text-gray-400 text-sm">You are joining a Level Game. Please complete the payment of <span className="text-yellow-500 font-bold">₹{amount}</span>.</p>
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
          {/* background image */}
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
              ₹{(wallet?.available ?? 0).toLocaleString()}
            </h1>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  if (!localStorage.getItem("user")) {
                    setIsAuthModalOpen(true);
                  } else {
                    setIsAddMoneyOpen(true);
                  }
                }}
                className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-black font-semibold px-5 py-2 rounded-xl"
              >
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
            desc: "Earn $20 per referral",
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
          {transactions.map((tx, i) => (
            <div
              key={i}
              className="flex items-center justify-between px-6 py-5 border-b border-[#1f2a26]"
            >
              <div className="flex items-center gap-4">
                <div
                  className={`p-2 rounded-full ${tx.type === "credit"
                    ? "bg-emerald-500/10 text-emerald-400"
                    : "bg-gray-500/10 text-gray-400"
                    }`}
                >
                  {tx.type === "credit" ? (
                    <ArrowDownLeft />
                  ) : (
                    <ArrowUpRight />
                  )}
                </div>

                <div>
                  <p className="font-medium">{tx.title}</p>
                  <p className="text-sm text-gray-400">{tx.date}</p>
                </div>
              </div>

              <div className="text-right">
                <p
                  className={`font-semibold ${tx.type === "credit"
                    ? "text-emerald-400"
                    : "text-white"
                    }`}
                >
                  {tx.amount}
                </p>
                <p
                  className={`text-sm ${tx.status === "pending"
                    ? "text-yellow-400"
                    : "text-gray-400"
                    }`}
                >
                  {tx.status}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* POLLING OVERLAY */}
      {isPolling && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#0f1613] border border-[#1f2a26] rounded-2xl p-8 flex flex-col items-center shadow-2xl w-full max-w-sm text-center">
            <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin mb-5" />
            <h2 className="text-xl font-bold text-white mb-2">Processing Payment...</h2>
            <p className="text-gray-400 text-sm">
              Please wait while the transaction successfully synchronizes securely.<br />
              This usually takes just a few seconds...
            </p>
          </div>
        </div>
      )}

      {/* ADD MONEY MODAL */}
      {isAddMoneyOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#0f1613] border border-[#1f2a26] rounded-2xl w-full max-w-md p-6 relative">
            <button
              onClick={() => setIsAddMoneyOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X size={20} />
            </button>
            <h2 className="text-xl font-bold mb-4">Add Money to Wallet</h2>
            <div className="mb-6">
              <label className="block text-sm text-gray-400 mb-2">Amount (Min ₹50)</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">₹</span>
                <input
                  type="number"
                  value={addAmount}
                  onChange={(e) => setAddAmount(e.target.value)}
                  placeholder="Enter amount"
                  className="w-full bg-[#1c2b26] border border-[#2a403a] rounded-xl py-3 pl-8 pr-4 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
            <button
              onClick={handleAddMoney}
              disabled={isProcessingAdd || !addAmount || Number(addAmount) < 50}
              className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 disabled:hover:bg-emerald-500 text-black font-bold py-3 rounded-xl transition-all"
            >
              {isProcessingAdd ? "Processing..." : "Proceed to Pay"}
            </button>
          </div>
        </div>
      )}

      <AuthPromptModal 
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        title="Wallet Access restricted"
        message="Please sign in to your account to add funds, withdraw, or participate in premium levels."
      />
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
