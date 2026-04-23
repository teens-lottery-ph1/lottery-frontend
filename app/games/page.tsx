'use client'

import React, { useState, useEffect } from "react";
import { Calendar, Trophy, Zap, Crown, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import PlayNowModal from "@/app/components/modals/PlayNowModal";
import AuthPromptModal from "@/app/components/modals/AuthPromptModal";

// ============================================================================
// CountdownTimer (UNCHANGED)
// ============================================================================
function CountdownTimer({ targetDate, label }: any) {
  const calculateTimeLeft = () => {
    const now = Date.now();
    const distance = new Date(targetDate).getTime() - now;

    return {
      days: Math.max(0, Math.floor(distance / (1000 * 60 * 60 * 24))),
      hours: Math.max(0, Math.floor((distance / (1000 * 60 * 60)) % 24)),
      minutes: Math.max(0, Math.floor((distance / (1000 * 60)) % 60)),
      seconds: Math.max(0, Math.floor((distance / 1000) % 60)),
    };
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  const units = [
    { label: "Days", value: timeLeft.days },
    { label: "Hrs", value: timeLeft.hours },
    { label: "Min", value: timeLeft.minutes },
    { label: "Sec", value: timeLeft.seconds },
  ];

  return (
    <div className="mt-6">
      <p className="text-xs text-muted-foreground mb-3 uppercase tracking-wider">
        {label}
      </p>
      <div className="flex gap-3">
        {units.map((unit) => (
          <div key={unit.label} className="flex flex-col items-center">
            <div className="w-14 h-14 rounded-xl bg-surface border border-[rgba(0,255,163,0.18)] flex items-center justify-center">
              <AnimatePresence mode="popLayout">
                <motion.span
                  key={unit.value}
                  initial={{ y: -10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 10, opacity: 0 }}
                  className="text-lg font-bold text-[#00FFA3]"
                >
                  {String(unit.value).padStart(2, "0")}
                </motion.span>
              </AnimatePresence>
            </div>
            <span className="text-[10px] text-muted-foreground mt-1">
              {unit.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// Types
// ============================================================================
interface Game {
  name: string;
  date: string;
  prize: string;
  credits: number;
  category: 'jackpot' | 'daily' | 'premium' | 'special' | 'instant';
  players: number;
  odds: string;
  status: string;
  createdAt: string;
  id: string; // Added ID for modal support
}

// ============================================================================
// STATUS BADGE (NEW 🔥)
// ============================================================================
const getStatusBadge = (status: string) => {
  switch (status) {
    case "live":
      return "bg-red-500/10 text-red-400 border border-red-500/30";
    case "scheduled":
      return "bg-yellow-500/10 text-yellow-400 border border-yellow-500/30";
    case "completed":
      return "bg-gray-500/10 text-gray-400 border border-gray-500/30";
    default:
      return "bg-blue-500/10 text-blue-400 border border-blue-500/30"; // draft
  }
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================
export default function GamesPage() {
  const [filter, setFilter] = useState("all");
  const [allGames, setAllGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGame, setSelectedGame] = useState<any>(null);
  const [isPlayModalOpen, setIsPlayModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const fetchGames = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/draws`
        );
        const result = await res.json();

        let formattedGames: Game[] = result.data.map((item: any) => ({
          name: item.name,

          date:
            new Date(item.drawStartDate) > new Date()
              ? item.drawStartDate
              : item.drawEndDate,

          prize: `₹${Number(item.prizePool).toLocaleString("en-IN")}`,
          credits: Number(item.ticketPrice),

          category: item.gameTypeName?.toLowerCase().includes("mega")
            ? "jackpot"
            : "daily",

          players: item.currentEntries || 0,
          odds: `1:${item.maxEntries || 1000}`,

          status: item.status || "draft",
          createdAt: item.createdAt,
          id: item.id,
        }));

        // ✅ SORTING LOGIC (STATUS + CREATED TIME)
        const statusOrder: any = {
          live: 1,
          scheduled: 2,
          completed: 3,
          draft: 4,
        };

        formattedGames.sort((a, b) => {
          const statusDiff =
            statusOrder[a.status] - statusOrder[b.status];

          if (statusDiff !== 0) return statusDiff;

          return (
            new Date(b.createdAt).getTime() -
            new Date(a.createdAt).getTime()
          );
        });

        setAllGames(formattedGames);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    fetchGames();
  }, []);

  const handlePlayNow = (game: Game) => {
    // Check Auth
    if (!localStorage.getItem("user")) {
      setIsAuthModalOpen(true);
      return;
    }
    setSelectedGame({
      ...game,
      odds: game.odds // Map odds correctly
    });
    setIsPlayModalOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading games...
      </div>
    );
  }

  const gridGames =
    filter === "all"
      ? allGames
      : allGames.filter(g => g.category === filter);

  return (
    <main className="min-h-screen bg-gradient-dark py-12 md:py-16">
      <div className="container mx-auto px-4 md:px-6">

        {/* HEADER */}
        <div className="mb-14">
          <h1 className="text-5xl font-bold text-white mb-3">All Games</h1>
          <p className="text-muted-foreground">
            Choose from {allGames.length} exciting lottery games
          </p>
        </div>

        {/* GRID */}
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
          {gridGames.map((game, i) => (
            <motion.div
              key={i}
              className="p-8 rounded-2xl border border-[rgba(0,255,163,0.18)] bg-surface"
            >

              {/* HEADER */}
              <div className="flex items-center justify-between mb-6">

                {/* LEFT */}
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-[rgba(0,255,163,0.10)] flex items-center justify-center">
                    <Trophy className="w-7 h-7 text-[#FFB800]" />
                  </div>

                  <h3 className="text-xl text-white font-bold">
                    {game.name}
                  </h3>
                </div>

                {/* RIGHT STATUS BADGE ✅ */}
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(game.status)}`}>
                  {game.status.toUpperCase()}
                </span>

              </div>

              {/* Prize */}
              <div className="text-4xl text-yellow-400 font-bold my-4">
                {game.prize}
              </div>

              {/* Countdown */}
              <CountdownTimer targetDate={game.date} label="Next Draw" />

              {/* Players & Odds */}
              <div className="flex justify-between mt-6 text-sm">
                <span>{game.players} playing</span>
                <span className="text-green-400">Odds: {game.odds}</span>
              </div>

              {/* Button */}
              <button 
                onClick={() => handlePlayNow(game)}
                className="w-full mt-6 bg-[#00FFA3] text-black py-3 rounded-xl font-semibold hover:bg-[#00FFA3]/90 transition-all hover:shadow-[0_0_20px_rgba(0,255,163,0.3)]"
              >
                Play Now — {game.credits} credits
              </button>

            </motion.div>
          ))}
        </div>

      </div>

      <PlayNowModal 
        isOpen={isPlayModalOpen}
        onClose={() => setIsPlayModalOpen(false)}
        game={selectedGame}
        onPurchaseSuccess={fetchGames}
      />

      <AuthPromptModal 
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        title="Sign In to Play"
        message="You need an active account to participate in lottery draws and win real prize pools."
      />
    </main>
  );
}