"use client";

import { useState } from "react";
import { Calendar, Trophy, Search } from "lucide-react";
import Image from "next/image";

const pastResults = [
  { game: "Mega Millions", date: "Feb 22, 2026", numbers: [7, 14, 21, 35, 42], bonus: 10, jackpot: "$1,000,000", winners: 3 },
  { game: "Super Jackpot", date: "Feb 20, 2026", numbers: [3, 18, 25, 33, 48], bonus: 6, jackpot: "$2,000,000", winners: 1 },
  { game: "Power Ball", date: "Feb 19, 2026", numbers: [5, 12, 28, 37, 44], bonus: 15, jackpot: "$500,000", winners: 5 },
  { game: "Lucky 7", date: "Feb 18, 2026", numbers: [1, 7, 14, 21, 28], bonus: 7, jackpot: "$75,000", winners: 12 },
  { game: "Daily Draw", date: "Feb 17, 2026", numbers: [9, 16, 23, 31, 39], bonus: 4, jackpot: "$10,000", winners: 45 },
  { game: "Mega Millions", date: "Feb 15, 2026", numbers: [2, 11, 24, 36, 49], bonus: 8, jackpot: "$1,000,000", winners: 2 },
  { game: "Diamond Rush", date: "Feb 14, 2026", numbers: [6, 13, 27, 34, 47], bonus: 19, jackpot: "$5,000,000", winners: 0 },
  { game: "Golden Wheel", date: "Feb 13, 2026", numbers: [4, 17, 22, 38, 43], bonus: 11, jackpot: "$150,000", winners: 8 },
];

export default function ResultsPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const filtered = pastResults.filter((r) =>
    r.game.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="py-12 bg-[hsl(var(--background))] min-h-screen">
      <div className="max-w-6xl mx-auto px-6">

        {/* ================= HERO SECTION ================= */}
        <div className="relative rounded-3xl overflow-hidden mb-12 border border-[hsl(var(--border))]">
          <Image
            src="/results-hero.png"
            alt="Results"
            width={1400}
            height={400}
            className="w-full h-56 md:h-72 object-cover"
            priority
          />

          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-transparent flex items-center">
            <div className="px-10">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
                Lottery Results
              </h1>
              <p className="text-[hsl(var(--muted-foreground))] text-lg">
                View past draw results and winning numbers
              </p>
            </div>
          </div>
        </div>

        {/* ================= SEARCH ================= */}
        <div className="relative mb-10 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by game name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="
              w-full pl-11 pr-4 py-3
              rounded-xl
              bg-[hsl(var(--card))]
              border border-[hsl(var(--border))]
              text-sm
              focus:outline-none
              focus:ring-2
              focus:ring-emerald-500/50
              transition
            "
          />
        </div>

        {/* ================= RESULTS LIST ================= */}
        <div className="space-y-6">
          {filtered.map((result, i) => (
            <div
              key={i}
              className="
                rounded-2xl
                bg-[hsl(var(--card))]
                border border-[hsl(var(--border))]
                p-6
                card-hover
              "
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">

                {/* LEFT SIDE */}
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <Trophy className="w-5 h-5 text-emerald-400" />
                    <h3 className="text-xl font-bold">
                      {result.game}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-[hsl(var(--muted-foreground))]">
                    <Calendar className="w-4 h-4" />
                    {result.date}
                  </div>
                </div>

                {/* NUMBER BALLS */}
                <div className="flex items-center gap-3 flex-wrap">

                  {result.numbers.map((num, j) => (
                    <div
                      key={j}
                      className="
                        w-11 h-11
                        rounded-full
                        flex items-center justify-center
                        text-sm font-semibold
                        text-emerald-300
                        bg-gradient-to-br
                        from-emerald-500/20
                        to-emerald-800/20
                        border border-emerald-500/40
                      "
                    >
                      {num}
                    </div>
                  ))}

                  {/* BONUS BALL */}
                  <div
                    className="
                      w-11 h-11
                      rounded-full
                      flex items-center justify-center
                      text-sm font-semibold
                      text-yellow-300
                      bg-gradient-to-br
                      from-yellow-400/30
                      to-yellow-700/20
                      border border-yellow-500/50
                    "
                  >
                    {result.bonus}
                  </div>

                </div>

                {/* JACKPOT INFO */}
                <div className="text-right">
                  <div className="text-2xl font-bold text-yellow-400">
                    {result.jackpot}
                  </div>
                  <p className="text-sm text-[hsl(var(--muted-foreground))]">
                    {result.winners} winner{result.winners !== 1 ? "s" : ""}
                  </p>
                </div>

              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}