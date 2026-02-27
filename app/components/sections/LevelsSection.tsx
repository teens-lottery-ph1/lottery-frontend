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
} from "lucide-react";

const levels = [
  { level: 1, name: "Basic", icon: Shield, color: "text-muted-foreground" },
  { level: 2, name: "Bronze", icon: Award, color: "text-amber-600" },
  { level: 3, name: "Silver", icon: Star, color: "text-slate-400" },
  { level: 4, name: "Gold", icon: Crown, color: "text-accent" },
  { level: 5, name: "Platinum", icon: Gem, color: "text-cyan-400" },
  { level: 6, name: "Diamond", icon: Sparkles, color: "text-blue-400" },
  { level: 7, name: "Elite", icon: Zap, color: "text-violet-400" },
  { level: 8, name: "Superstar", icon: Flame, color: "text-orange-400" },
  { level: 9, name: "Titan", icon: BadgeCheck, color: "text-rose-400" },
  { level: 10, name: "VIP", icon: Trophy, color: "text-accent" },
];

export default function LevelsSection() {
  return (
    <section className="py-10 md:py-16">
      {/* Header */}
      <div className="container px-4 text-center mb-8 md:mb-12">
        <h2 className="text-2xl md:text-4xl font-bold mb-3">
          10-Level Rewards System
        </h2>
        <p className="text-sm md:text-base text-muted-foreground">
          Unlock exclusive perks as you level up
        </p>
      </div>

      {/* Levels Grid */}
      <div className="container px-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 md:gap-6 max-w-6xl mx-auto">
        {levels.map((l) => (
          <div
            key={l.level}
          className="
  rounded-2xl
  border border-[rgba(0,255,163,0.18)]
  bg-surface
  p-4 md:p-6
  text-center
  transition-all duration-300
  hover:-translate-y-2
  hover:border-[#00FFA3]
  hover:shadow-[0_20px_70px_rgba(0,255,163,0.15)]
"
          >
            <l.icon
              className={`w-7 h-7 md:w-9 md:h-9 ${l.color} mx-auto mb-2 md:mb-3`}
            />

            <p className="text-[11px] md:text-xs text-muted-foreground mb-1">
              Level {l.level}
            </p>

            <p className="text-sm md:text-base font-bold">
              {l.name}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}