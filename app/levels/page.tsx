"use client";

import {
  Shield,
  Crown,
  Star,
  Gem,
  Zap,
  Award,
  Flame,
  Sparkles,
  Trophy,
  BadgeCheck,
  Check,
  Lock,
} from "lucide-react";

import Image from "next/image";
import { motion } from "framer-motion";

/* ================= LEVELS DATA ================= */

const levels = [
  {
    level: 1,
    name: "Basic",
    icon: Shield,
    color: "text-gray-400",
    bg: "bg-gray-700/40",
    xp: 0,
    perks: ["1 free ticket/month", "Standard support"],
  },
  {
    level: 2,
    name: "Bronze",
    icon: Award,
    color: "text-amber-600",
    bg: "bg-amber-900/20",
    xp: 100,
    perks: ["2 free tickets/month", "5% ticket discount"],
  },
  {
    level: 3,
    name: "Silver",
    icon: Star,
    color: "text-slate-400",
    bg: "bg-slate-500/20",
    xp: 500,
    perks: ["5 free tickets/month", "10% discount", "Bonus number picks"],
  },
  {
    level: 4,
    name: "Gold",
    icon: Crown,
    color: "text-yellow-400",
    bg: "bg-yellow-500/20",
    xp: 1500,
    perks: ["10 free tickets/month", "15% discount", "Priority payouts"],
  },
  {
    level: 5,
    name: "Platinum",
    icon: Gem,
    color: "text-cyan-400",
    bg: "bg-cyan-400/20",
    xp: 3000,
    perks: ["15 tickets/month", "20% discount", "Exclusive draws"],
  },
  {
    level: 6,
    name: "Diamond",
    icon: Sparkles,
    color: "text-blue-400",
    bg: "bg-blue-400/20",
    xp: 6000,
    perks: ["20 tickets/month", "25% discount", "Personal manager"],
  },
  {
    level: 7,
    name: "Elite",
    icon: Zap,
    color: "text-violet-400",
    bg: "bg-violet-400/20",
    xp: 10000,
    perks: ["Unlimited tickets", "30% discount", "Advanced analytics"],
  },
  {
    level: 8,
    name: "Superstar",
    icon: Flame,
    color: "text-orange-400",
    bg: "bg-orange-400/20",
    xp: 20000,
    perks: ["All Elite perks", "Double referral rewards", "VIP events"],
  },
  {
    level: 9,
    name: "Titan",
    icon: BadgeCheck,
    color: "text-rose-400",
    bg: "bg-rose-400/20",
    xp: 35000,
    perks: ["All Superstar perks", "Highest referral bonus", "Custom draws"],
  },
  {
    level: 10,
    name: "VIP",
    icon: Trophy,
    color: "text-yellow-400",
    bg: "bg-yellow-500/20",
    xp: 50000,
    perks: [
      "All perks unlocked",
      "Priority winnings",
      "Concierge service",
      "Lifetime benefits",
    ],
  },
];

export default function LevelsPage() {
  const currentLevel = 3;

  return (
    <div className="py-8 bg-black text-white min-h-screen">
      <div className="container px-4">

        {/* HERO */}
        <div className="relative rounded-2xl overflow-hidden mb-8 border border-gray-700">
          <Image
            src="/images/levels-hero.png"
            alt="VIP Levels"
            width={1200}
            height={400}
            priority
            className="w-full h-48 md:h-72 object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-transparent flex items-center">
            <div className="px-4 md:px-8">
              <h1 className="text-2xl md:text-5xl font-bold mb-2">
                10-Level <span className="text-yellow-400">Rewards</span> System
              </h1>
              <p className="text-gray-300 text-sm md:text-lg">
                Unlock exclusive perks as you play more
              </p>

              <div className="mt-4 flex flex-wrap gap-3">
                <div className="px-3 py-2 rounded-lg bg-yellow-500/10 border border-yellow-500/30">
                  <span className="text-sm text-gray-400">Your Level: </span>
                  <span className="font-bold text-yellow-400">Silver (Level 3)</span>
                </div>

                <div className="px-3 py-2 rounded-lg bg-gray-800 border border-gray-700">
                  <span className="text-sm text-gray-400">XP: </span>
                  <span className="font-bold text-white">750 / 1,500</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* GRID */}
        <section className="py-10">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold">Levels Overview</h2>
            <p className="text-gray-400">Unlock exclusive perks as you level up</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {levels.map((l) => (
              <div
                key={l.level}
                className="rounded-2xl border border-gray-700 bg-gray-900 p-5 text-center"
              >
                <l.icon className={`w-8 h-8 ${l.color} mx-auto mb-2`} />
                <p className="text-xs text-gray-400">Level {l.level}</p>
                <p className="font-bold text-sm">{l.name}</p>
              </div>
            ))}
          </div>
        </section>

        {/* PROGRESS */}
        <div className="mb-10 p-6 rounded-2xl border border-gray-700 bg-gray-900">
          <div className="flex justify-between mb-3 text-sm">
            <span>Level Progress</span>
            <span className="text-gray-400">750 / 1,500 XP</span>
          </div>

          <div className="h-3 rounded-full bg-gray-700 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "50%" }}
              transition={{ duration: 1.5 }}
              className="h-full bg-gradient-to-r from-yellow-400 to-orange-500"
            />
          </div>
        </div>

        {/* DETAILS */}
        <div className="space-y-4">
          {levels.map((lvl, i) => {
            const unlocked = lvl.level <= currentLevel;

            return (
              <motion.div
                key={lvl.level}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`rounded-2xl border bg-gray-900 p-6 ${
                  unlocked ? "border-yellow-500/30" : "border-gray-700"
                }`}
              >
                <div className="flex flex-col md:flex-row gap-4">
                  <div className={`w-14 h-14 rounded-2xl ${lvl.bg} flex items-center justify-center`}>
                    <lvl.icon className={`w-7 h-7 ${lvl.color}`} />
                  </div>

                  <div className="flex-1">
                    <h3 className="text-lg font-bold mb-2">
                      Level {lvl.level} — {lvl.name}
                    </h3>

                    <div className="flex flex-wrap gap-2">
                      {lvl.perks.map((perk) => (
                        <span key={perk} className="text-xs flex items-center gap-1 text-gray-300">
                          <Check className="w-3 h-3 text-yellow-400" />
                          {perk}
                        </span>
                      ))}
                    </div>

                    {!unlocked && (
                      <div className="text-xs mt-2 flex items-center gap-1 text-gray-400">
                        <Lock className="w-3 h-3" />
                        {lvl.xp.toLocaleString()} XP required
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </div>
  );
}