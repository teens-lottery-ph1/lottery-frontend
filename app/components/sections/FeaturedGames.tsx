"use client";

import { useEffect, useState } from "react";
import { Star, Trophy, Users } from "lucide-react";
import CountdownTimer from "@/app/components/ui/CountdownTimer";

interface Game {
  id: number;
  name: string;
  date: string; 
  prize: string;
  credits: number;
  featured: boolean;
  players: number;
}

export default function FeaturedGames() {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        
        if (!apiUrl) {
          throw new Error("API URL is not configured. Check your .env.local file");
        }

        console.log("Fetching from:", `${apiUrl}/api/games/featured`);

        const res = await fetch(`${apiUrl}/api/games/featured`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();
        console.log("Received data:", data);
        setGames(data);
      } catch (error) {
        console.error("Error fetching games:", error);
        setError(error instanceof Error ? error.message : "Failed to fetch games");
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, []);

  if (loading) {
    return (
      <section className="py-12 md:py-16 bg-gradient-dark">
        <div className="container">
          <div className="flex justify-center items-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00FFA3] mx-auto"></div>
              <p className="mt-4 text-gray-400">Loading featured games...</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-12 md:py-16 bg-gradient-dark">
        <div className="container">
          <div className="bg-red-900/20 border border-red-500 rounded-xl p-8 text-center">
            <p className="text-red-400 mb-2">Error: {error}</p>
            <p className="text-gray-400 text-sm">
              Make sure your backend server is running at {process.env.NEXT_PUBLIC_API_URL}
            </p>
          </div>
        </div>
      </section>
    );
  }

  if (games.length === 0) {
    return (
      <section className="py-12 md:py-16 bg-gradient-dark">
        <div className="container">
          <div className="text-center py-20">
            <p className="text-gray-400">No featured games available</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 md:py-16 bg-gradient-dark">
      <div className="container">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          Featured <span className="text-[#00FFA3]">Games</span>
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {games.map((game) => (
            <div key={game.id} className="relative rounded-2xl border border-gray-800 bg-gray-900/50 p-8 hover:border-[#00FFA3]/50 transition-all">

              {game.featured && (
                <div className="absolute top-5 right-5 flex items-center gap-1 text-xs bg-[#FFB800]/20 text-[#FFB800] px-2 py-1 rounded-full">
                  <Star className="w-3 h-3" />
                  Featured
                </div>
              )}

              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-[#00FFA3]/10 rounded-xl">
                  <Trophy className="w-7 h-7 text-[#00FFA3]" />
                </div>
                <h3 className="text-xl font-bold text-white">{game.name}</h3>
              </div>

              <div className="text-4xl font-bold text-white mb-6">
                {game.prize}
              </div>

              <CountdownTimer
                targetDate={new Date(game.date)}
                label="Next Draw"
              />

              <div className="flex items-center gap-2 mt-6 pt-6 border-t border-gray-800 text-sm text-gray-400">
                <Users className="w-4 h-4" />
                {game.players.toLocaleString()} playing
              </div>

              <button className="w-full mt-6 rounded-xl bg-[#00FFA3] py-3.5 font-semibold text-black hover:bg-[#00FFA3]/90 transition-colors">
                Play Now — {game.credits} credits
              </button>

            </div>
          ))}
        </div>
      </div>
    </section>
  );
}