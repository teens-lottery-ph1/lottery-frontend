import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Zap } from "lucide-react";

const WinBigSection = () => {
  return (
    <section className="bg-gradient-dark py-12 md:py-20">
      <div className="container">
        <div className="grid md:grid-cols-2 gap-12 items-center">

          {/* LEFT CONTENT */}
          <div>

            {/* Trusted Badge */}
            <div className="
              inline-flex items-center gap-2 
              px-4 py-1.5 
              rounded-full 
              border border-[rgba(0,255,163,0.25)] 
              bg-[rgba(0,255,163,0.10)] 
              text-[#00FFA3] 
              text-sm font-medium 
              mb-6
            ">
              <Zap className="w-4 h-4" />
              Trusted Platform
            </div>

            {/* Heading */}
            <h1 className="text-4xl md:text-6xl font-display font-bold leading-tight mb-6 text-white">
              Win <span className="text-gradient-gold">Big</span> with
              <br />
              Lottery Network
            </h1>

            {/* Description */}
            <p className="text-lg text-muted-foreground mb-8 max-w-md">
              Join thousands of winners on the most trusted decentralized
              lottery platform. Transparent, secure, and instant payouts
              guaranteed.
            </p>

            {/* Buttons */}
            <div className="flex flex-wrap gap-4">

              {/* Primary Neon Button */}
              <Link
                href="#"
                className="
                  inline-flex items-center gap-2 
                  rounded-xl 
                  bg-[#00FFA3] 
                  px-7 py-3.5 
                  text-base font-semibold 
                  text-[#07140F]
                  transition-all duration-300
                  hover:bg-[rgba(0,255,163,0.9)]
                  hover:shadow-[0_0_30px_rgba(0,255,163,0.35)]
                "
              >
                Get Started
                <ArrowRight className="w-4 h-4" />
              </Link>

              {/* Outline Neon Button */}
              <Link
                href="#how-it-works"
                className="
                  inline-flex items-center gap-2 
                  rounded-xl 
                  border border-[rgba(0,255,163,0.25)] 
                  px-7 py-3.5 
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

          {/* RIGHT IMAGE */}
          <div className="relative">
            <div className="
              relative 
              w-full 
              aspect-[4/3] 
              rounded-2xl 
              border border-[rgba(0,255,163,0.18)] 
              overflow-hidden
              hover:shadow-[0_20px_70px_rgba(0,255,163,0.15)]
              transition-all duration-300
            ">
              <Image
                src="/jackpot-celebration.png"
                alt="Jackpot Celebration"
                fill
                className="object-cover"
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default WinBigSection;