"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy } from "lucide-react";

const tickerItems = [
  { name: "Sarah M.", game: "Mega Millions", amount: "$50,000" },
  { name: "James K.", game: "Super Jackpot", amount: "$25,000" },
  { name: "Maria L.", game: "Power Ball", amount: "$100,000" },
];

export default function LiveTicker() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(
      () => setCurrent((c) => (c + 1) % tickerItems.length),
      3000
    );
    return () => clearInterval(timer);
  }, []);

  const item = tickerItems[current];

  return (
    <div
      className="
        rounded-3xl
        bg-gradient-to-br from-[#06231A] to-[#041912]
        border border-[rgba(0,255,163,0.15)]
        shadow-[0_10px_40px_rgba(0,255,163,0.05)]
        px-6 py-4
        flex items-center gap-4
      "
    >
      {/* Icon - NOW GOLD */}
      <div className="w-9 h-9 rounded-xl bg-[#06231A] border border-[rgba(0,255,163,0.2)] flex items-center justify-center">
        <Trophy className="w-4 h-4 text-[#F5B942]" />
      </div>

      <span className="text-xs font-semibold tracking-wider text-[#00FFA3] uppercase">
        LIVE
      </span>

      <AnimatePresence mode="wait">
        <motion.p
          key={current}
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -10, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="text-sm text-foreground"
        >
          <span className="font-semibold">{item.name}</span> won{" "}
          <span className="text-[#F5B942] font-bold">
            {item.amount}
          </span>{" "}
          on {item.game}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}