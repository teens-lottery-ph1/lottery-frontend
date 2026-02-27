import { Gift, Users } from "lucide-react";

const offers = [
  {
    icon: Gift,
    title: "New User Bonus",
    description: "Get 100% bonus on your first deposit up to $100",
    cta: "Claim Now",
  },
  {
    icon: Users,
    title: "Referral Rewards",
    description: "Earn $20 for every friend you refer",
    cta: "Invite Friends",
  },
];

export default function SpecialOffers() {
  return (
    <section className="py-10 md:py-16">
      {/* Section Header */}
      <div className="container px-4 text-center mb-8 md:mb-12">
        <h2 className="text-2xl md:text-4xl font-bold mb-3">
          Special Offers
        </h2>
        <p className="text-sm md:text-base text-muted-foreground">
          Don't miss out on exclusive promotions
        </p>
      </div>

      {/* Cards */}
      <div className="container px-4 grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {offers.map((offer) => (
          <div
            key={offer.title}
           className="
  relative
  rounded-2xl
  border border-[rgba(0,255,163,0.18)]
  bg-surface
  p-6 md:p-8
  text-center
  transition-all duration-300
  hover:-translate-y-2
  hover:border-[#00FFA3]
  hover:shadow-[0_20px_70px_rgba(0,255,163,0.15)]
"
          >
            {/* Icon */}
            <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-5">
              <offer.icon className="w-6 h-6 md:w-8 md:h-8 text-primary" />
            </div>

            {/* Title */}
            <h3 className="text-lg md:text-2xl font-bold mb-3">
              {offer.title}
            </h3>

            {/* Description */}
            <p className="text-sm md:text-base text-muted-foreground mb-6">
              {offer.description}
            </p>

            {/* Button */}
            <button className="btn-primary-style px-6 py-3 w-full sm:w-auto">
              {offer.cta}
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}