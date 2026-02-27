'use client'

import React, { useState, useEffect } from "react";
import { Calendar, Star, Trophy, Clock, Users, Zap, Crown, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

// ============================================================================
// CountdownTimer Component (embedded with target styling)
// ============================================================================
interface CountdownTimerProps {
  targetDate: Date;
  label?: string;
}

function CountdownTimer({ targetDate, label }: CountdownTimerProps) {
  const calculateTimeLeft = () => {
    const now = Date.now();
    const distance = targetDate.getTime() - now;
    return {
      days: Math.max(0, Math.floor(distance / (1000 * 60 * 60 * 24))),
      hours: Math.max(0, Math.floor((distance / (1000 * 60 * 60)) % 24)),
      minutes: Math.max(0, Math.floor((distance / (1000 * 60)) % 60)),
      seconds: Math.max(0, Math.floor((distance / 1000) % 60)),
    };
  };

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => setTimeLeft(calculateTimeLeft()), 1000);
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
      {label && (
        <p className="text-xs text-muted-foreground mb-3 uppercase tracking-wider">
          {label}
        </p>
      )}
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
                  transition={{ duration: 0.2 }}
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
// Types & Data
// ============================================================================
interface Game {
  name: string;
  date: string;
  prize: string;
  credits: number;
  featured: boolean;
  category: 'jackpot' | 'daily' | 'premium' | 'special' | 'instant';
  players: number;
  odds: string;
}

const allGames: Game[] = [
  { name: "Mega Millions", date: "2026-03-01T20:00:00", prize: "$1,000,000", credits: 100, featured: true, category: "jackpot", players: 12450, odds: "1:12M" },
  { name: "Super Jackpot", date: "2026-03-05T20:00:00", prize: "$2,000,000", credits: 100, featured: true, category: "jackpot", players: 25100, odds: "1:25M" },
  { name: "Power Ball", date: "2026-03-02T20:00:00", prize: "$500,000", credits: 50, featured: false, category: "jackpot", players: 45000, odds: "1:1M" },
  { name: "Lucky 7", date: "2026-03-03T18:00:00", prize: "$75,000", credits: 50, featured: false, category: "daily", players: 18700, odds: "1:2M" },
  { name: "Daily Draw", date: "2026-02-24T12:00:00", prize: "$10,000", credits: 25, featured: false, category: "daily", players: 89000, odds: "1:100K" },
  { name: "Diamond Rush", date: "2026-03-10T20:00:00", prize: "$5,000,000", credits: 250, featured: true, category: "premium", players: 3200, odds: "1:50M" },
  { name: "Golden Wheel", date: "2026-03-07T20:00:00", prize: "$150,000", credits: 75, featured: false, category: "special", players: 18700, odds: "1:2M" },
  { name: "Flash Lottery", date: "2026-02-24T15:00:00", prize: "$5,000", credits: 10, featured: false, category: "instant", players: 120000, odds: "1:50K" },
];

const categories = [
  { label: "All", value: "all", icon: Sparkles },
  { label: "Jackpot", value: "jackpot", icon: Trophy },
  { label: "Daily", value: "daily", icon: Calendar },
  { label: "Premium", value: "premium", icon: Crown },
  { label: "Special", value: "special", icon: Star },
  { label: "Instant", value: "instant", icon: Zap },
];

// Helper for category badge style (using target colors)
const getCategoryBadgeClass = (category: string) => {
  // All categories use the same style for consistency (you can customize if needed)
  return "border border-[rgba(0,255,163,0.25)] text-[#00FFA3] bg-[rgba(0,255,163,0.05)] px-3 py-1 rounded-full text-xs font-medium";
};

// ============================================================================
// Main Page Component
// ============================================================================
export default function GamesPage() {
  const [filter, setFilter] = useState("all");

  // All games are shown in the grid; no separate featured section
  const gridGames = filter === "all"
    ? allGames
    : allGames.filter(g => g.category === filter);

  return (
    <main className="min-h-screen bg-gradient-dark py-12 md:py-16">
      <div className="container mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="mb-8 md:mb-14 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-3">
            All Games
          </h1>
          <p className="text-muted-foreground text-lg">
            Choose from {allGames.length} exciting lottery games
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2 mb-8 md:mb-14 justify-center md:justify-start">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.value}
                onClick={() => setFilter(cat.value)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  filter === cat.value
                    ? "bg-[#00FFA3] text-[#07140F] shadow-[0_0_20px_rgba(0,255,163,0.3)]"
                    : "bg-surface text-muted-foreground border border-[rgba(0,255,163,0.15)] hover:border-[#00FFA3] hover:text-[#00FFA3]"
                }`}
              >
                <Icon className="w-4 h-4" />
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* All Games Grid */}
        <div>
          <h2 className="text-2xl md:text-3xl font-display font-bold text-white mb-6 md:mb-8">
            {filter === 'all' ? 'All Games' : `${filter.charAt(0).toUpperCase() + filter.slice(1)} Games`}
          </h2>

          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8">
            {gridGames.map((game, i) => (
              <motion.div
                key={game.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="relative rounded-2xl border border-[rgba(0,255,163,0.18)] bg-surface p-6 md:p-8 transition-all duration-300 hover:-translate-y-2 hover:border-[#00FFA3] hover:shadow-[0_20px_70px_rgba(0,255,163,0.15)]"
              >
                {/* Optional top color strip – can be removed if not wanted */}
                {/* <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#00FFA3] to-[#FFB800] rounded-t-2xl" /> */}

                {/* Featured Badge (if any) */}
                {game.featured && (
                  <div className="absolute top-4 right-4 md:top-5 md:right-5 flex items-center gap-1 px-3 py-1 rounded-full bg-[rgba(0,255,163,0.12)] text-[#00FFA3] text-xs font-semibold border border-[rgba(0,255,163,0.25)]">
                    <Star className="w-3 h-3 text-[#FFB800]" />
                    Featured
                  </div>
                )}

                {/* Header */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 rounded-xl bg-[rgba(0,255,163,0.10)] flex items-center justify-center">
                    <Trophy className="w-7 h-7 text-[#FFB800]" />
                  </div>
                  <div>
                    <h3 className="text-xl font-display font-bold text-white">
                      {game.name}
                    </h3>
                    <span className={getCategoryBadgeClass(game.category)}>
                      {game.category}
                    </span>
                  </div>
                </div>

                {/* Prize */}
                <div className="text-4xl font-display font-bold text-gradient-gold mb-6">
                  {game.prize}
                </div>

                {/* Countdown */}
                <CountdownTimer targetDate={new Date(game.date)} label="Next Draw" />

                {/* Players & Odds */}
                <div className="flex items-center justify-between mt-6 pt-6 border-t border-[rgba(0,255,163,0.15)] text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-[#8FA9A2]" />
                    <span>{game.players.toLocaleString('en-US')} players</span>
                  </div>
                  <div className="text-[#00FFA3] font-medium">Odds: {game.odds}</div>
                </div>

                {/* Play Button */}
                <button className="w-full mt-6 rounded-xl bg-[#00FFA3] py-3.5 font-semibold text-[#07140F] transition-all hover:bg-[rgba(0,255,163,0.9)] hover:shadow-[0_0_30px_rgba(0,255,163,0.35)]">
                  Play Now — {game.credits} credits
                </button>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Mobile View All Link */}
        <div className="mt-8 text-center md:hidden">
          <Link
            href="/games"
            className="inline-flex items-center gap-2 rounded-xl border border-[rgba(0,255,163,0.15)] px-6 py-3 text-sm font-semibold transition-all hover:border-[#00FFA3] hover:text-[#00FFA3]"
          >
            View All Games
          </Link>
        </div>
      </div>
    </main>
  );
}