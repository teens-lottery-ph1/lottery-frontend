import { Users, Trophy, DollarSign, TrendingUp } from "lucide-react";

const stats = [
  { icon: Users, value: "50,000+", label: "Active Players" },
  { icon: Trophy, value: "12,500+", label: "Total Winners" },
  { icon: DollarSign, value: "$5M+", label: "Jackpots Won" },
  { icon: TrendingUp, value: "25%", label: "Win Rate" },
];

export default function PlatformStats() {
  return (
    <section className="py-8 md:py-14 bg-gradient-dark">
      <div className="container">

        {/* Heading */}
        <div className="text-center mb-8 md:mb-14">
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-display font-bold mb-3 md:mb-4">
            Platform Statistics
          </h2>
          <p className="text-sm md:text-lg text-muted-foreground">
            Join a thriving community of lottery enthusiasts
          </p>
        </div>

        {/* Stats Grid */}
        <div className="
          grid 
          grid-cols-2 
          md:grid-cols-4 
          gap-4 md:gap-8 
          max-w-6xl 
          mx-auto
        ">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="
                rounded-2xl md:rounded-3xl
                bg-gradient-to-br from-[#06231A] to-[#041912]
                border border-[rgba(0,255,163,0.12)]
                p-5 md:p-10
                text-center
                transition-all duration-300
                hover:-translate-y-2
                hover:shadow-[0_20px_60px_rgba(0,255,163,0.08)]
              "
            >
              <stat.icon className="
                w-6 h-6 md:w-8 md:h-8
                text-[#F5B942]
                mx-auto
                mb-3 md:mb-5
              " />

              <div className="
                text-xl sm:text-2xl md:text-4xl
                font-bold
                text-[#F5B942]
                mb-1 md:mb-2
              ">
                {stat.value}
              </div>

              <p className="text-xs md:text-base text-muted-foreground">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}