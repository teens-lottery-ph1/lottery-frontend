import { Award } from "lucide-react";

const winners = [
  { name: "Sarah M.", amount: "$50,000", date: "Feb 15, 2026", initials: "SM" },
  { name: "James K.", amount: "$25,000", date: "Feb 12, 2026", initials: "JK" },
  { name: "Maria L.", amount: "$100,000", date: "Feb 10, 2026", initials: "ML" },
];

const RecentWinners = () => {
  return (
    <section id="winners" className="py-10 md:py-16">
      <div className="container px-4">

        {/* Small Label */}
        <div className="text-center mb-2">
          <span className="text-xs md:text-sm font-semibold text-primary tracking-wider uppercase">
            Recent Winners
          </span>
        </div>

        {/* Heading */}
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-2xl md:text-4xl font-bold mb-3">
            Celebrating Our Lucky Winners
          </h2>
          <p className="text-sm md:text-base text-muted-foreground">
            Join thousands of winners who've changed their lives
          </p>
        </div>

        {/* Winners Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {winners.map((winner) => (
            <div
              key={winner.name}
             className="
  rounded-2xl
  border border-[rgba(0,255,163,0.18)]
  bg-surface
  p-5 md:p-6
  text-center
  transition-all duration-300
  hover:-translate-y-2
  hover:border-[#00FFA3]
  hover:shadow-[0_20px_70px_rgba(0,255,163,0.15)]
"
            >
              {/* Avatar Circle */}
              <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-primary/10 border-2 border-primary/30 flex items-center justify-center mx-auto mb-4">
                <span className="text-base md:text-lg font-bold text-primary">
                  {winner.initials}
                </span>
              </div>

              {/* Name */}
              <h3 className="text-base md:text-lg font-bold mb-1">
                {winner.name}
              </h3>

              {/* Amount */}
              <div className="text-xl md:text-2xl font-bold text-gradient-gold mb-1">
                {winner.amount}
              </div>

              {/* Date */}
              <p className="text-xs md:text-sm text-muted-foreground">
                {winner.date}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default RecentWinners;