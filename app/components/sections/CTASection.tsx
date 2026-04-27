import Link from "next/link";
import { ArrowRight } from "lucide-react";

const CTASection = () => {
  return (
    <section className="py-12 md:py-16 bg-gradient-dark">
      <div className="container text-center max-w-2xl mx-auto">

        <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
          Ready to Change Your Life?
        </h2>

        <p className="text-lg text-muted-foreground mb-8">
          Join our community today and start playing for your chance to win life-changing prizes.
        </p>

        <div className="flex flex-wrap justify-center gap-4">

          {/* Primary Neon Button */}
          <Link
            href="/games"
            className="
              inline-flex items-center gap-2 
              rounded-xl 
              bg-[#00FFA3] 
              px-8 py-4 
              text-base font-semibold 
              text-[#07140F]
              transition-all duration-300
              hover:bg-[rgba(0,255,163,0.9)]
              hover:shadow-[0_0_30px_rgba(0,255,163,0.35)]
            "
          >
            Join Now
            <ArrowRight className="w-4 h-4" />
          </Link>

          {/* Outline Neon Button */}
          <Link
            href="#how-it-works"
            className="
              inline-flex items-center gap-2 
              rounded-xl 
              border border-[rgba(0,255,163,0.25)] 
              px-8 py-4 
              text-base font-semibold 
              text-white
              transition-all duration-300
              hover:border-[#00FFA3]
              hover:text-[#00FFA3]
              hover:shadow-[0_0_25px_rgba(0,255,163,0.15)]
            "
          >
            Learn More
          </Link>

        </div>
      </div>
    </section>
  );
};

export default CTASection;