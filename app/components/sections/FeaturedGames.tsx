'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import { Trophy, Users } from "lucide-react";
import CountdownTimer from "@/app/components/ui/CountdownTimer";
import PlayNowModal from "@/app/components/modals/PlayNowModal";
import AuthPromptModal from "@/app/components/modals/AuthPromptModal";

export default function FeaturedGames() {

  type Game = {
    id: string;
    name: string;
    date: string;
    prize: string;
    credits: number;
    players: number;
    status: string;
    createdAt: string;
    odds: string;
  };

  const [games, setGames] = useState<Game[]>([]);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // ✅ STATUS BADGE STYLE (same as GamesPage)
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "live":
        return "bg-red-500/10 text-red-400 border border-red-500/30";
      case "scheduled":
        return "bg-yellow-500/10 text-yellow-400 border border-yellow-500/30";
      case "completed":
        return "bg-gray-500/10 text-gray-400 border border-gray-500/30";
      default:
        return "bg-blue-500/10 text-blue-400 border border-blue-500/30";
    }
  };

  const fetchGames = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/draws`
        );
        const json = await res.json();

        if (json.success) {

          const statusPriority: any = {
            live: 1,
            scheduled: 2,
            completed: 3,
            draft: 4,
          };

          const formattedGames = json.data
            .map((item: any) => {
              const ticketPrice =
                item.ticketPrice || item.ticket_price || item.amount || 0;

              return {
                id: item.id,
                name: item.name,

                date:
                  new Date(item.drawStartDate) > new Date()
                    ? item.drawStartDate
                    : item.drawEndDate,

                prize: `₹${Number(item.prizePool).toLocaleString("en-IN")}`,
                credits: Number(ticketPrice),
                players: item.currentEntries || 0,

                status: item.status || "draft",
                createdAt: item.createdAt,
                odds: `1:${item.maxEntries || 1000}`,
              };
            })

            // ✅ SORT: STATUS → CREATED TIME
            .sort((a: any, b: any) => {
              const statusDiff =
                statusPriority[a.status] - statusPriority[b.status];

              if (statusDiff !== 0) return statusDiff;

              return (
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
              );
            })

            // ✅ SHOW ONLY TOP 3
            .slice(0, 3);

          setGames(formattedGames);
        }
      } catch (error) {
        console.error("Failed to fetch games:", error);
      }
    };

  useEffect(() => {
    fetchGames();
  }, []);

  const handlePlayNow = (game: Game) => {
    // Check if user is logged in
    const user = localStorage.getItem("user");
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }
    setSelectedGame(game);
    setIsModalOpen(true);
  };

  return (
    <section className="py-12 md:py-16 bg-gradient-dark">
      <div className="container">

        {/* HEADER */}
        <div className="flex items-center justify-between mb-14">
          <div>
            <h2 className="text-4xl font-display font-bold mb-3">
              Featured Games
            </h2>
            <p className="text-muted-foreground">
              Latest draws based on status & time
            </p>
          </div>

          <Link
            href="/games"
            className="hidden md:inline-flex items-center gap-2 rounded-xl border border-[rgba(0,255,163,0.15)] px-6 py-3 text-sm font-semibold transition-all hover:border-[#00FFA3] hover:text-[#00FFA3]"
          >
            View All Games
          </Link>
        </div>

        {/* GRID */}
        <div className="grid md:grid-cols-3 gap-8">
          {games.map((game) => (
            <div
              key={game.id}
              className="p-8 rounded-2xl border border-[rgba(0,255,163,0.18)] bg-surface transition-all duration-300 hover:-translate-y-2 hover:border-[#00FFA3] hover:shadow-[0_20px_70px_rgba(0,255,163,0.15)]"
            >

              {/* ✅ SAME HEADER AS GAMES PAGE */}
              <div className="flex items-center justify-between mb-6">

                {/* LEFT */}
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-[rgba(0,255,163,0.10)] flex items-center justify-center">
                    <Trophy className="w-7 h-7 text-[#FFB800]" />
                  </div>

                  <h3 className="text-xl font-display font-bold text-white">
                    {game.name}
                  </h3>
                </div>

                {/* RIGHT STATUS BADGE */}
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(game.status)}`}>
                  {game.status.toUpperCase()}
                </span>

              </div>

              {/* Prize */}
              <div className="text-4xl font-display font-bold text-gradient-gold mb-6">
                {game.prize}
              </div>

              {/* Countdown */}
              <CountdownTimer
                targetDate={new Date(game.date)}
                label="Next Draw"
              />

              {/* Players + Odds */}
              <div className="flex justify-between mt-6 text-sm">
                <span>{game.players.toLocaleString()} playing</span>
                <span className="text-green-400">Odds: {game.odds}</span>
              </div>

              {/* Button */}
              <button
                onClick={() => handlePlayNow(game)}
                className="w-full mt-6 rounded-xl bg-[#00FFA3] py-3.5 font-semibold text-[#07140F] transition-all hover:bg-[rgba(0,255,163,0.9)] hover:shadow-[0_0_30px_rgba(0,255,163,0.35)]"
              >
                Play Now — {game.credits} credits
              </button>

            </div>
          ))}
        </div>
      </div>

      <PlayNowModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        game={selectedGame}
        onPurchaseSuccess={fetchGames}
      />

      <AuthPromptModal 
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        title="Sign In to Play"
        message="Participating in lottery draws and winning prizes requires a verified account."
      />
    </section>
  );
}