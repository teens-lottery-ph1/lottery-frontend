'use client'

import { useState, useEffect } from "react";
import { Calendar, Star, Trophy, Clock, Users, Zap, Crown, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

// ------------------------------------------------------------
// TYPES
// ------------------------------------------------------------
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

interface CountdownTimerProps {
  targetDate: Date;
  label?: string;
}

// ------------------------------------------------------------
// COUNTDOWN TIMER COMPONENT
// Uses neutral dark background (secondary) for digits,
// with white text and a subtle border.
// ------------------------------------------------------------
const CountdownTimer = ({ targetDate, label }: CountdownTimerProps) => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

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
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
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
      {label && <p className="text-xs text-primary mb-2 uppercase tracking-wider">{label}</p>}
      <div className="flex gap-2">
        {units.map((unit) => (
          <div key={unit.label} className="flex flex-col items-center">
            {/* Digit box – neutral dark background, white text, border, shadow */}
            <div className="w-12 h-12 rounded-lg bg-secondary text-foreground flex items-center justify-center shadow-lg border border-border">
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
            <span className="text-[10px] text-muted-foreground mt-1">{unit.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ------------------------------------------------------------
// GAMES DATA (hardcoded for demo – can be replaced by API)
// ------------------------------------------------------------
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

// ------------------------------------------------------------
// CATEGORY FILTERS
// ------------------------------------------------------------
const categories = [
  { label: "All", value: "all", icon: Sparkles },
  { label: "Jackpot", value: "jackpot", icon: Trophy },
  { label: "Daily", value: "daily", icon: Calendar },
  { label: "Premium", value: "premium", icon: Crown },
  { label: "Special", value: "special", icon: Star },
  { label: "Instant", value: "instant", icon: Zap },
];

// ------------------------------------------------------------
// HELPER: returns Tailwind classes for category badges
// Each badge has: dark background, border, white text, shadow
// Border color varies by category (gold for jackpot/instant, green for others)
// ------------------------------------------------------------
const getCategoryBadgeClass = (category: string) => {
  const base = "bg-black/50 backdrop-blur-sm border text-white px-3 py-1 rounded-full text-xs font-medium shadow-lg";
  switch (category) {
    case 'jackpot':
      return `${base} border-accent`;        // gold border
    case 'premium':
      return `${base} border-primary`;       // green border
    case 'special':
      return `${base} border-primary`;       // green border
    case 'daily':
      return `${base} border-primary`;       // green border
    case 'instant':
      return `${base} border-accent`;        // gold border
    default:
      return `${base} border-primary`;
  }
};

// ------------------------------------------------------------
// MAIN PAGE COMPONENT
// ------------------------------------------------------------
export default function GamesPage() {
  const [filter, setFilter] = useState("all");

  // Games that are marked as featured
  const featuredGames = allGames.filter(g => g.featured);

  // Games to display in the main grid:
  // - when filter is "all", exclude featured games (to avoid duplication)
  // - otherwise, show only games of the selected category
  const gridGames = filter === "all"
    ? allGames.filter(g => !g.featured)
    : allGames.filter(g => g.category === filter);

  return (
    <main className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-7xl mx-auto">

        {/* ========== HEADER ========== */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-2">
            All Games
          </h1>
          <p className="text-muted-foreground text-lg">
            Choose from {allGames.length} exciting lottery games
          </p>
        </div>

        {/* ========== CATEGORY FILTER BUTTONS ========== */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.value}
                onClick={() => setFilter(cat.value)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  filter === cat.value
                    ? "bg-primary text-primary-foreground glow-primary"   // active: green + glow
                    : "bg-secondary text-muted-foreground hover:text-foreground hover:bg-secondary/80"
                }`}
              >
                <Icon className="w-4 h-4" />
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* ========== FEATURED GAMES SECTION (only when filter is "all") ========== */}
        {filter === 'all' && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-display font-bold text-foreground flex items-center gap-2">
                <Star className="w-6 h-6 text-accent fill-accent" />
                Featured Games
              </h2>
              <Link
                href="/games"
                className="hidden md:inline-flex items-center gap-2 rounded-xl border border-border px-5 py-2.5 text-sm font-semibold text-foreground hover:bg-secondary transition-colors"
              >
                View All Games
              </Link>
            </div>

            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
              {featuredGames.map((game, i) => (
                <motion.div
                  key={game.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="card-hover relative rounded-2xl bg-card border border-border p-6 overflow-hidden group"
                >
                  {/* Hover gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Featured badge – yellow border, yellow text, no background */}
                  <div className="absolute top-4 right-4 flex items-center gap-1 px-3 py-1 rounded-full border border-yellow-400/50 text-yellow-400 text-xs font-semibold">
                    <Star className="w-3 h-3 fill-yellow-400" />
                    Featured
                  </div>

                  {/* Game icon + name + category badge */}
                  <div className="flex items-center gap-4 mb-4 relative z-10">
                    <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
                      <Trophy className="w-8 h-8 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-display font-bold text-foreground mb-1">
                        {game.name}
                      </h3>
                      {/* Category badge (dark background + colored border) */}
                      <span className={`inline-block ${getCategoryBadgeClass(game.category)}`}>
                        {game.category}
                      </span>
                    </div>
                  </div>

                  {/* Prize amount – gold gradient */}
                  <div className="text-4xl font-display font-bold text-gradient-gold mb-4">
                    {game.prize}
                  </div>

                  {/* Countdown timer */}
                  <CountdownTimer targetDate={new Date(game.date)} label="Next Draw" />

                  {/* Stats row */}
                  <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-border">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Users className="w-4 h-4 text-primary" />
                      {game.players.toLocaleString('en-US')} players
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Zap className="w-4 h-4 text-primary" />
                      Odds: {game.odds}
                    </div>
                  </div>

                  {/* Play button */}
                  <button className="w-full mt-4 rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors">
                    Play Now — {game.credits} credits
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* ========== MAIN GAMES GRID ========== */}
        <div>
          {/* Optional heading (commented out to avoid duplication with featured) */}
          {/* <h2 className="text-2xl font-display font-bold text-foreground mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            {filter === 'all' ? 'All Games' : `${filter.charAt(0).toUpperCase() + filter.slice(1)} Games`}
          </h2> */}

          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {gridGames.map((game, i) => (
              <motion.div
                key={game.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="card-hover relative rounded-2xl bg-card border border-border p-6 group"
              >
                {/* Top color strip (optional – currently hidden) */}
                {/* <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-accent rounded-t-2xl" /> */}

                {/* Featured badge (if game is featured) – same style as above */}
                {game.featured && (
                  <div className="absolute top-4 right-4 flex items-center gap-1 px-2 py-1 rounded-full border border-yellow-400/50 text-yellow-400 text-xs font-semibold">
                    <Star className="w-3 h-3 fill-yellow-400" />
                    Featured
                  </div>
                )}

                <div className="flex items-center gap-3 mb-4 relative z-10">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
                    <Trophy className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-display font-bold text-foreground">
                      {game.name}
                    </h3>
                    <span className={`inline-block ${getCategoryBadgeClass(game.category)}`}>
                      {game.category}
                    </span>
                  </div>
                </div>

                <div className="text-3xl font-display font-bold text-gradient-gold mb-4">
                  {game.prize}
                </div>

                <CountdownTimer targetDate={new Date(game.date)} label="Next Draw" />

                <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-border">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Users className="w-3.5 h-3.5 text-primary" />
                    {game.players.toLocaleString('en-US')} players
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Zap className="w-3.5 h-3.5 text-primary" />
                    Odds: {game.odds}
                  </div>
                </div>

                <button className="w-full mt-4 rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors">
                  Play Now — {game.credits} credits
                </button>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ========== MOBILE VIEW ALL LINK ========== */}
        <div className="mt-6 text-center md:hidden">
          <Link
            href="/games"
            className="inline-flex items-center gap-2 rounded-xl border border-border px-5 py-2.5 text-sm font-semibold text-foreground hover:bg-secondary transition-colors"
          >
            View All Games
          </Link>
        </div>
      </div>
    </main>
  );
}