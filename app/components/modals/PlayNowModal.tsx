"use client";

/**
 * PlayNowModal.tsx (PREMIUM EDITION)
 * 
 * WHY IS THIS BEING DEVELOPED?
 * To create a "WOW" factor for the user. A basic UI feels boring; a premium UI with 
 * glassmorphism, smooth animations, and neon glow makes the lottery experience 
 * feel exciting, trustworthy, and high-end.
 */

import { useState, useEffect } from "react";
import { X, Check, ChevronRight, ChevronLeft, Trash2, Zap, Wallet } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion"; 
import { useRouter } from "next/navigation";

// Define the shape of our Game data
interface Game {
  id: string;
  name: string;
  prize: string;
  credits: number;
}

interface PlayNowModalProps {
  isOpen: boolean;
  onClose: () => void;
  game: Game | null;
}

export default function PlayNowModal({ isOpen, onClose, game }: PlayNowModalProps) {
  // State for user selections and navigation
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [bookedNumbers, setBookedNumbers] = useState<number[]>([]);
  const [walletBalance, setWalletBalance] = useState<number>(0);
  const router = useRouter();

  // Dynamically load Razorpay for the payment step
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    return () => { document.body.removeChild(script); };
  }, []);

  // Fetch booked tickets when modal opens
  useEffect(() => {
    if (isOpen && game) {
      const fetchBookedTickets = async () => {
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/draws/${game.id}/tickets`);
          if (res.ok) {
            const data = await res.json();
            let parsedNumbers: number[] = [];

            // Accommodate array responses or object responses { bookedNumbers: [...] }
            const rawArray = Array.isArray(data) ? data : (data.bookedNumbers || data.data || data.tickets || []);

            if (Array.isArray(rawArray)) {
              rawArray.forEach((item: any) => {
                if (typeof item === 'number') {
                  parsedNumbers.push(item);
                } else if (typeof item === 'string') {
                  item.split(',').forEach(n => parsedNumbers.push(parseInt(n.trim(), 10)));
                } else if (item && typeof item === 'object') {
                  // If the backend returned rows from db directly e.g. { pickedNumbers: '1,2,3' }
                  const nums = item.pickedNumbers || item.ticketNumber || item.number || "";
                  if (typeof nums === 'string') {
                    nums.split(',').forEach(n => parsedNumbers.push(parseInt(n.trim(), 10)));
                  } else if (typeof nums === 'number') {
                    parsedNumbers.push(nums);
                  }
                }
              });
            }
            // Remove dups and NaN
            const validNumbers = Array.from(new Set(parsedNumbers.filter(n => !isNaN(n))));
            setBookedNumbers(validNumbers);
          } else {
            console.error("Failed to fetch tickets, status:", res.status);
          }
        } catch (err) {
          console.error("Failed to fetch booked tickets network error:", err);
        }
      };
      fetchBookedTickets();

      // NEW: Fetch Wallet Balance for unified flow
      const fetchWallet = async () => {
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/wallet`, {
            credentials: "include"
          });
          const data = await res.json();
          if (data && data.success) {
            setWalletBalance(data.available);
          }
        } catch (err) {
          console.error("Failed to fetch wallet:", err);
        }
      };
      fetchWallet();
    }
  }, [isOpen, game]);

  if (!isOpen || !game) return null;

  const totalAmount = selectedNumbers.length * game.credits;

  // Toggle selection logic
  const toggleNumber = (num: number) => {
    setSelectedNumbers((prev) =>
      prev.includes(num) ? prev.filter((n) => n !== num) : [...prev, num]
    );
  };

  // Pagination logic (50 per page)
  const startNum = (currentPage - 1) * 50 + 1;
  const visibleNumbers = Array.from({ length: 50 }, (_, i) => startNum + i);

  // Handle the payment process
  const handlePayment = async () => {
    if (selectedNumbers.length === 0) return;
    
    // DECISION: Wallet vs Razorpay
    if (walletBalance >= totalAmount) {
      await handleWalletPayment();
    } else {
      await handleRazorpayPayment();
    }
  };

  const handleWalletPayment = async () => {
    setIsProcessing(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/wallet/pay`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          drawId: game?.id,
          ticketNumbers: selectedNumbers.join(","),
          totalAmount: totalAmount
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Wallet payment failed");

      alert("Success! Tickets purchased using wallet balance.");
      onClose();
      // Optional: Refresh balance or redirect
    } catch (err: any) {
      alert(err.message || "Payment failed");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRazorpayPayment = async () => {
    setIsProcessing(true);
    try {
      const orderRes = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/payments/create-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ amount: totalAmount }),
      });

      if (!orderRes.ok) {
        const errData = await orderRes.json().catch(() => ({}));
        throw new Error(errData.error || "Failed to create payment order");
      }

      const orderData = await orderRes.json();

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Lottery Network",
        description: `Playing ${game?.name}`,
        order_id: orderData.id,
        handler: async (response: any) => {
          try {
            // Razorpay sometimes omits order_id from the response; use our stored value as fallback
            const verifyRes = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/payments/verify`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              credentials: "include",
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id || orderData.id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                drawId: game?.id,
                ticketNumber: selectedNumbers.join(","),
                pickedNumbers: selectedNumbers.join(","),
                amount: totalAmount,
              }),
            });
            if (!verifyRes.ok) {
              const errData = await verifyRes.json().catch(() => ({}));
              throw new Error(errData.error || "Server Error during verification");
            }
            alert("Success! Your tickets are booked.");
            onClose();
          } catch (err: any) {
            alert(`Verification failed: ${err.message || "Could not verify payment."}`);
          }
        },
        theme: { color: "#00FFA3" },
      };
      new (window as any).Razorpay(options).open();
    } catch (e) {
      console.error(e);
      alert("Failed to initiate external payment.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        // The overlay backdrop with blur
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-xl" // WHY? Blur adds depth and luxury
        >
          {/* Main Modal Window */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }} // WHY? Spring makes it feel "bouncy" and alive
            className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden bg-[#07140F]/90 rounded-[2.5rem] border border-white/10 shadow-[0_0_80px_rgba(0,255,163,0.15)] flex flex-col"
          >
            {/* Glassy Background Patterns */}
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-64 h-64 bg-[#00FFA3]/20 blur-[100px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-64 h-64 bg-gold/10 blur-[100px] pointer-events-none" />

            {/* Header Area */}
            <div className="relative z-10 p-8 flex items-center justify-between border-b border-white/5">
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#00FFA3] to-[#009461] flex items-center justify-center shadow-[0_0_30px_rgba(0,255,163,0.3)]">
                  <Zap className="w-8 h-8 text-black fill-black" />
                </div>
                <div>
                  <h2 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
                    {game.name}
                  </h2>
                  <div className="flex items-center gap-3 mt-1 text-sm text-white/50">
                    <span className="text-[#00FFA3] font-bold">DRAW LIVE</span>
                    <span>•</span>
                    <span className="flex items-center gap-1"><Check className="w-4 h-4" /> Secure checkout</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <button
                  onClick={() => setSelectedNumbers([])}
                  className="hidden sm:flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-500/10 text-red-400 text-sm font-bold border border-red-500/20 hover:bg-red-500/20 transition-all"
                >
                  <Trash2 className="w-4 h-4" /> Clear
                </button>
                <button
                  onClick={onClose}
                  className="w-12 h-12 rounded-2xl bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all border border-white/10 text-white"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Content Area */}
            <div className="relative z-10 flex-1 overflow-hidden flex flex-col md:flex-row">

              {/* Sidebar Info (Desktop Only) */}
              <div className="w-full md:w-64 p-8 border-r border-white/5 flex flex-col justify-between bg-white/[0.02]">
                <div>
                  <h4 className="text-white/40 text-[10px] font-black uppercase tracking-[0.2em] mb-4">Game Stats</h4>
                  <div className="space-y-6">
                    <div>
                      <p className="text-white/60 text-sm">Grand Prize</p>
                      <p className="text-2xl font-black text-gradient-gold">{game.prize}</p>
                    </div>
                    <div>
                      <p className="text-white/60 text-sm">Entry Fee</p>
                      <p className="text-xl font-bold text-white">₹{game.credits}</p>
                    </div>
                  </div>
                </div>

                {/* Progress Circle Visual */}
                <div className="py-6 border-t border-white/5">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs text-white/40 uppercase font-bold">Selected</p>
                    <p className="text-[#00FFA3] text-xs font-bold">{selectedNumbers.length}</p>
                  </div>
                  <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(selectedNumbers.length / 10) * 100}%` }}
                      className="h-full bg-[#00FFA3] shadow-[0_0_10px_#00FFA3]"
                    />
                  </div>
                </div>
              </div>

              {/* Main Ticket Grid */}
              <div className="flex-1 p-8 flex flex-col">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-xl font-bold text-white">Pick Your Lucky Numbers</h3>

                  {/* Premium Pagination Toggle */}
                  <div className="flex items-center gap-2 bg-white/5 p-1 rounded-xl border border-white/10">
                    <button
                      onClick={() => setCurrentPage(1)}
                      className={`px-4 py-2 rounded-lg text-xs font-black transition-all ${currentPage === 1 ? 'bg-[#00FFA3] text-black shadow-lg shadow-[#00FFA3]/20' : 'text-white/50 hover:text-white'}`}
                    >
                      1 - 50
                    </button>
                    <button
                      onClick={() => setCurrentPage(2)}
                      className={`px-4 py-2 rounded-lg text-xs font-black transition-all ${currentPage === 2 ? 'bg-[#00FFA3] text-black shadow-lg shadow-[#00FFA3]/20' : 'text-white/50 hover:text-white'}`}
                    >
                      51 - 100
                    </button>
                  </div>
                </div>

                {/* The Interactive Grid */}
                <div className="grid grid-cols-5 sm:grid-cols-10 gap-3">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentPage}
                      initial={{ opacity: 0, x: currentPage === 1 ? -20 : 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: currentPage === 1 ? 20 : -20 }}
                      className="col-span-full grid grid-cols-5 sm:grid-cols-10 gap-3"
                    >
                      {visibleNumbers.map((num) => {
                        const isSelected = selectedNumbers.includes(num);
                        const isBooked = bookedNumbers.includes(num); // Check if box is already booked

                        return (
                          <motion.button
                            key={num}
                            whileHover={isBooked ? {} : { scale: 1.1, y: -2 }} // WHY? Makes the buttons feel interactive and clickable
                            whileTap={isBooked ? {} : { scale: 0.95 }}
                            onClick={() => !isBooked && toggleNumber(num)}
                            disabled={isProcessing || isBooked}
                            className={`
                              relative h-12 rounded-xl flex items-center justify-center text-sm font-black transition-all duration-300
                              ${isBooked
                                ? "bg-red-500/10 border border-red-500/20 text-red-500/50 cursor-not-allowed" // Disabled booked styling
                                : isSelected
                                  ? "bg-[#00FFA3] text-black shadow-[0_0_25px_rgba(0,255,163,0.5)] border-[#00FFA3]"
                                  : "bg-white/5 border border-white/10 text-white/40 hover:border-[#00FFA3]/50 hover:text-white"
                              }
                            `}
                          >
                            {num}
                            {isSelected && (
                              <motion.div
                                initial={{ scale: 0 }} animate={{ scale: 1 }}
                                className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-white flex items-center justify-center text-[#00FFA3] shadow-lg"
                              >
                                <Check className="w-3 h-3 stroke-[4]" />
                              </motion.div>
                            )}
                          </motion.button>
                        );
                      })}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {/* Bottom Action Footer */}
            <div className="relative z-10 p-8 border-t border-white/5 bg-white/[0.01] flex flex-col sm:flex-row items-center justify-between gap-8">
              <div className="flex items-center gap-8">
                <div className="flex flex-col">
                  <span className="text-white/30 text-[10px] font-black uppercase tracking-widest mb-1">Items Selected</span>
                  <div className="flex -space-x-2">
                    {selectedNumbers.slice(0, 5).map(n => (
                      <div key={n} className="w-8 h-8 rounded-full bg-[#00FFA3] border-2 border-[#07140F] flex items-center justify-center text-[10px] font-black text-black">
                        {n}
                      </div>
                    ))}
                    {selectedNumbers.length > 5 && (
                      <div className="w-8 h-8 rounded-full bg-white/10 border-2 border-[#07140F] flex items-center justify-center text-[10px] font-black text-white/50 backdrop-blur-md">
                        +{selectedNumbers.length - 5}
                      </div>
                    )}
                  </div>
                </div>

                <div className="h-10 w-[1px] bg-white/10 hidden sm:block" />

                <div>
                  <span className="text-white/30 text-[10px] font-black uppercase tracking-widest mb-1">Total Payable</span>
                  <p className="text-3xl font-black text-white leading-none">₹{totalAmount.toLocaleString()}</p>
                </div>

                <div className="h-10 w-[1px] bg-white/10 hidden lg:block" />

                <div className="hidden lg:flex flex-col">
                  <span className="text-white/30 text-[10px] font-black uppercase tracking-widest mb-1 flex items-center gap-1">
                    <Wallet className="w-3 h-3" /> available Balance
                  </span>
                  <p className={`text-xl font-bold leading-none ${walletBalance >= totalAmount ? 'text-[#00FFA3]' : 'text-red-400'}`}>
                    ₹{walletBalance.toLocaleString()}
                  </p>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02, boxShadow: "0 0 40px rgba(0, 255, 163, 0.4)" }}
                whileTap={{ scale: 0.98 }}
                onClick={handlePayment}
                disabled={isProcessing || selectedNumbers.length === 0}
                className={`
                  w-full sm:w-auto px-10 h-16 rounded-2xl font-black text-lg transition-all flex items-center justify-center gap-3
                  ${isProcessing || selectedNumbers.length === 0
                    ? "bg-white/5 text-white/20 border border-white/10 cursor-not-allowed"
                    : walletBalance >= totalAmount
                      ? "bg-[#00FFA3] text-black shadow-[0_0_30px_rgba(0,255,163,0.3)]"
                      : "bg-red-500 text-white shadow-[0_0_30px_rgba(239,68,68,0.3)]"
                  }
                `}
              >
                {isProcessing ? (
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span className="uppercase">
                      {selectedNumbers.length === 0 
                        ? "Pick Numbers" 
                        : walletBalance >= totalAmount 
                          ? "Pay via Wallet" 
                          : "Add Funds & Pay"}
                    </span>
                    <ChevronRight className="w-6 h-6" />
                  </>
                )}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
