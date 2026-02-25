"use client";

import { useState, useEffect } from "react";
import { Star, Trophy, Users, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

/* ===========================
   Countdown Timer Component
=========================== */

interface CountdownTimerProps {
  targetDate: Date;
  label?: string;
}

function CountdownTimer({ targetDate, label }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate.getTime() - now;

      if (distance < 0) {
        clearInterval(timer);
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor(
          (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        ),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      });
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
    <div>
      {label && (
        <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wider">
          {label}
        </p>
      )}

      <div className="flex gap-2">
        {units.map((unit) => (
          <div key={unit.label} className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-lg bg-secondary border border-border flex items-center justify-center">
              <AnimatePresence mode="popLayout">
                <motion.span
                  key={unit.value}
                  initial={{ y: -10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 10, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="text-lg font-bold"
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

/* ===========================
   Games Data
=========================== */

const allGames = [
  { name: "Mega Millions", date: "2026-03-01T20:00:00", prize: "$1,000,000", credits: 100, featured: true, category: "jackpot", players: 12450, odds: "1:10M" },
  { name: "Super Jackpot", date: "2026-03-05T20:00:00", prize: "$2,000,000", credits: 100, featured: true, category: "jackpot", players: 8230, odds: "1:15M" },
  { name: "Power Ball", date: "2026-03-02T20:00:00", prize: "$500,000", credits: 100, featured: false, category: "daily", players: 25100, odds: "1:5M" },
  { name: "Lucky 7", date: "2026-03-03T18:00:00", prize: "$75,000", credits: 50, featured: false, category: "daily", players: 45000, odds: "1:1M" },
  { name: "Daily Draw", date: "2026-02-24T12:00:00", prize: "$10,000", credits: 25, featured: false, category: "daily", players: 89000, odds: "1:100K" },
  { name: "Diamond Rush", date: "2026-03-10T20:00:00", prize: "$5,000,000", credits: 250, featured: true, category: "premium", players: 3200, odds: "1:50M" },
  { name: "Golden Wheel", date: "2026-03-07T20:00:00", prize: "$150,000", credits: 75, featured: false, category: "special", players: 18700, odds: "1:2M" },
  { name: "Flash Lottery", date: "2026-02-24T15:00:00", prize: "$5,000", credits: 10, featured: false, category: "instant", players: 120000, odds: "1:50K" },
];

const categories = [
  { label: "All", value: "all" },
  { label: "Jackpot", value: "jackpot" },
  { label: "Daily", value: "daily" },
  { label: "Premium", value: "premium" },
  { label: "Special", value: "special" },
  { label: "Instant", value: "instant" },
];

/* ===========================
   Page Component
=========================== */

export default function GamesPage() {
  const [filter, setFilter] = useState("all");

  const filtered =
    filter === "all"
      ? allGames
      : allGames.filter((g) => g.category === filter);

  return (
    <div className="py-12 px-4 min-h-screen">
      <div className="max-w-7xl mx-auto">

        <div className="mb-10">
          <h1 className="text-4xl font-bold mb-2">All Games</h1>
          <p className="text-muted-foreground">
            Choose from {allGames.length} exciting lottery games
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-10">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setFilter(cat.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                filter === cat.value
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Games Grid */}
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
          {filtered.map((game, i) => (
            <motion.div
              key={game.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="relative rounded-2xl border bg-card p-6 shadow-sm hover:shadow-lg transition"
            >
              {game.featured && (
                <div className="absolute top-4 right-4 flex items-center gap-1 px-2.5 py-1 rounded-full bg-yellow-500/10 text-yellow-500 text-xs font-semibold">
                  <Star className="w-3 h-3" />
                  Featured
                </div>
              )}

              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Trophy className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">{game.name}</h3>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-secondary text-muted-foreground capitalize">
                    {game.category}
                  </span>
                </div>
              </div>

              <div className="text-3xl font-bold text-yellow-500 mb-4">
                {game.prize}
              </div>

              <CountdownTimer
                targetDate={new Date(game.date)}
                label="Next Draw"
              />

              <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Users className="w-4 h-4" />
                {game.players.toLocaleString("en-US")} players                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Zap className="w-4 h-4" />
                  Odds: {game.odds}
                </div>
              </div>

              <button className="w-full mt-5 rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition">
                Play Now — {game.credits} credits
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}