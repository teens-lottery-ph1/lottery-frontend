// import Link from "next/link";
// import { Star, Trophy, Users } from "lucide-react";
// import CountdownTimer from "@/app/components/ui/CountdownTimer";

// const games = [
//   {
//     name: "Mega Millions",
//     date: "2026-03-01T20:00:00",
//     prize: "$1,000,000",
//     credits: 100,
//     featured: true,
//     players: 12450,
//   },
//   {
//     name: "Super Jackpot",
//     date: "2026-03-05T20:00:00",
//     prize: "$2,000,000",
//     credits: 100,
//     featured: true,
//     players: 8230,
//   },
//   {
//     name: "Power Ball",
//     date: "2026-03-02T20:00:00",
//     prize: "$500,000",
//     credits: 100,
//     featured: false,
//     players: 25100,
//   },
// ];

// export default function FeaturedGames() {
//   return (
//     <section className="py-12 md:py-16 bg-gradient-dark">
//       <div className="container">
//         <div className="flex items-center justify-between mb-14">
//           <div>
//             <h2 className="text-4xl font-display font-bold mb-3">
//               Featured Games
//             </h2>
//             <p className="text-muted-foreground">
//               Choose from our exciting lottery games
//             </p>
//           </div>

//           <Link
//             href="/games"
//             className="hidden md:inline-flex items-center gap-2 rounded-xl border border-[rgba(0,255,163,0.15)] px-6 py-3 text-sm font-semibold transition-all hover:border-[#00FFA3] hover:text-[#00FFA3]"
//           >
//             View All Games
//           </Link>
//         </div>

//         <div className="grid md:grid-cols-3 gap-8">
//           {games.map((game) => (
//             <div
//               key={game.name}
//             className="
//     relative 
//     rounded-2xl 
//     border border-[rgba(0,255,163,0.18)] 
//     bg-surface 
//     p-8 
//     transition-all duration-300 
//     hover:-translate-y-2 
//     hover:border-[#00FFA3]
//     hover:shadow-[0_20px_70px_rgba(0,255,163,0.15)]
//   "
//             >
//               {/* Featured Badge */}
//               {game.featured && (
//                 <div className="absolute top-5 right-5 flex items-center gap-1 px-3 py-1 rounded-full bg-[rgba(0,255,163,0.12)] text-[#00FFA3] text-xs font-semibold border border-[rgba(0,255,163,0.25)]">
//                   <Star className="w-3 h-3 text-[#FFB800]" />
//                   Featured
//                 </div>
//               )}

//               {/* Header */}
//               <div className="flex items-center gap-4 mb-6">
//                 <div className="w-14 h-14 rounded-xl bg-[rgba(0,255,163,0.10)] flex items-center justify-center">
//                   <Trophy className="w-7 h-7 text-[#FFB800]" />
//                 </div>
//                 <h3 className="text-xl font-display font-bold text-white">
//                   {game.name}
//                 </h3>
//               </div>

//               {/* Prize */}
//               <div className="text-4xl font-display font-bold text-gradient-gold mb-6">
//                 {game.prize}
//               </div>

//               {/* Countdown */}
//               <CountdownTimer
//                 targetDate={new Date(game.date)}
//                 label="Next Draw"
//               />

//               {/* Players */}
//               <div className="flex items-center gap-2 mt-6 pt-6 border-t border-[rgba(0,255,163,0.15)] text-sm text-muted-foreground">
//                 <Users className="w-4 h-4 text-[#8FA9A2]" />
//                 {game.players.toLocaleString()} playing
//               </div>

//               {/* Play Button */}
//               <button className="w-full mt-6 rounded-xl bg-[#00FFA3] py-3.5 font-semibold text-[#07140F] transition-all hover:bg-[rgba(0,255,163,0.9)] hover:shadow-[0_0_30px_rgba(0,255,163,0.35)]">
//                 Play Now — {game.credits} credits
//               </button>
//             </div>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// }
'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import { Star, Trophy, Users } from "lucide-react";
import CountdownTimer from "@/app/components/ui/CountdownTimer";
import PlayNowModal from "@/app/components/modals/PlayNowModal";

export default function FeaturedGames() {

   type Game = {
  id: string;
  name: string;
  date: string;
  prize: string;
  credits: number;
  featured: boolean;
  players: number;
};

  // WHY IS THIS STATE BEING ADDED?
  // We need to track the list of games from the API, 
  // which specific game the user want to play, 
  // and whether the modal is currently open or closed.
  const [games, setGames] = useState<Game[]>([]);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        // Fetching draws from the backend API using the base URL from .env.local
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/draws`
        );

        const json = await res.json();

        if (json.success) {
          console.log("API DRAW DATA:", json.data); // DEBUG LOG
          // Mapping the backend data structure to our frontend Game type
          const formattedGames = json.data.map((item: any) => {
            const ticketPrice = item.ticketPrice || item.ticket_price || item.amount || 0;
            console.log(`Mapping game: ${item.name}, Price field found:`, ticketPrice); // DEBUG LOG
            return {
              id: item.id,
              name: item.name,
              date: item.drawDate,
              prize: `₹${Number(item.prizePool).toLocaleString()}`,
              credits: Number(ticketPrice),
              featured: item.isGuaranteed,
              players: item.currentEntries,
            };
          });
          setGames(formattedGames);
        }
      } catch (error) {
        console.error("Failed to fetch games:", error);
      }
    };

    fetchGames();
  }, []);

  /**
   * WHY IS THIS FUNCTION BEING ADDED?
   * When a user clicks "Play Now", we store that game's info and open the modal overlay.
   */
  const handlePlayNow = (game: Game) => {
    setSelectedGame(game);
    setIsModalOpen(true);
  };

  return (
    <section className="py-12 md:py-16 bg-gradient-dark">
      <div className="container">
        {/* Header */}
        <div className="flex items-center justify-between mb-14">
          <div>
            <h2 className="text-4xl font-display font-bold mb-3">
              Featured Games
            </h2>
            <p className="text-muted-foreground">
              Choose from our exciting lottery games
            </p>
          </div>

          <Link
            href="/games"
            className="hidden md:inline-flex items-center gap-2 rounded-xl border border-[rgba(0,255,163,0.15)] px-6 py-3 text-sm font-semibold transition-all hover:border-[#00FFA3] hover:text-[#00FFA3]"
          >
            View All Games
          </Link>
        </div>

        {/* Grid of Games */}
        <div className="grid md:grid-cols-3 gap-8">
          {games.map((game) => (
            <div
              key={game.id}
              className="relative rounded-2xl border border-[rgba(0,255,163,0.18)] bg-surface p-8 transition-all duration-300 hover:-translate-y-2 hover:border-[#00FFA3] hover:shadow-[0_20px_70px_rgba(0,255,163,0.15)]"
            >
              {game.featured && (
                <div className="absolute top-5 right-5 flex items-center gap-1 px-3 py-1 rounded-full bg-[rgba(0,255,163,0.12)] text-[#00FFA3] text-xs font-semibold border border-[rgba(0,255,163,0.25)]">
                  <Star className="w-3 h-3 text-[#FFB800]" />
                  Featured
                </div>
              )}

              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-xl bg-[rgba(0,255,163,0.10)] flex items-center justify-center">
                  <Trophy className="w-7 h-7 text-[#FFB800]" />
                </div>
                <h3 className="text-xl font-display font-bold text-white">
                  {game.name}
                </h3>
              </div>

              <div className="text-4xl font-display font-bold text-gradient-gold mb-6">
                {game.prize}
              </div>

              <CountdownTimer
                targetDate={new Date(game.date)}
                label="Next Draw"
              />

              <div className="flex items-center gap-2 mt-6 pt-6 border-t border-[rgba(0,255,163,0.15)] text-sm text-muted-foreground">
                <Users className="w-4 h-4 text-[#8FA9A2]" />
                {game.players.toLocaleString()} playing
              </div>

              {/* WHY IS THIS BUTTON ACTION CHANGING?
                  Instead of a static button, it now triggers handlePlayNow to launch the interactive modal.
               */}
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

      {/* 
          Integrating the Modal component. It stays hidden until isModalOpen is true.
      */}
      <PlayNowModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        game={selectedGame} 
      />
    </section>
  );
}
