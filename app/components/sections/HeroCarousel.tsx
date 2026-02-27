"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";

const slides = [
  {
    image: "/carousel-banner-1.png",
    title: "$10 Million Jackpot",
    subtitle:
      "Your chance to win big is here! Play now for the biggest prize of the year.",
  },
  {
    image: "/carousel-banner-2.png",
    title: "Weekly Draws Every Friday",
    subtitle:
      "Never miss a chance to win with our exciting weekly lottery draws.",
  },
  {
    image: "/promo-welcome.png",
    title: "Welcome Bonus for New Players",
    subtitle:
      "Get 100% bonus on your first deposit. Start winning today!",
  },
];

export default function HeroCarousel() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(
      () => setCurrent((c) => (c + 1) % slides.length),
      5000
    );
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-6 md:py-10 bg-gradient-dark">
      <div className="container">

        <div className="
          relative overflow-hidden
          rounded-2xl md:rounded-3xl
          bg-gradient-to-br from-[#06231A] to-[#041912]
          border border-[rgba(0,255,163,0.15)]
        ">

          <div
            className="flex transition-transform duration-700 ease-out"
            style={{ transform: `translateX(-${current * 100}%)` }}
          >
            {slides.map((slide, i) => (
              <div
                key={i}
                className="
                  min-w-full relative
                  aspect-[16/9] md:aspect-[16/5]
                "
              >
                <Image
                  src={slide.image}
                  alt={slide.title}
                  fill
                  className="object-cover"
                  priority={i === 0}
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />

                <div className="
                  absolute
                  bottom-5 left-5
                  md:bottom-14 md:left-14
                  max-w-[85%] md:max-w-xl
                ">
                  <h2 className="
                    text-xl sm:text-2xl md:text-5xl
                    font-display font-bold
                    mb-2 md:mb-4
                  ">
                    {slide.title}
                  </h2>

                  <p className="
                    text-xs sm:text-sm md:text-base
                    text-muted-foreground
                  ">
                    {slide.subtitle}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Arrows */}
          <button
            onClick={() =>
              setCurrent((c) =>
                (c - 1 + slides.length) % slides.length
              )
            }
            className="
              absolute left-2 md:left-5
              top-1/2 -translate-y-1/2
              w-8 h-8 md:w-11 md:h-11
              rounded-full
              bg-black/60
              border border-[rgba(0,255,163,0.3)]
              flex items-center justify-center
            "
          >
            <ChevronLeft className="w-4 h-4 md:w-5 md:h-5 text-[#F5B942]" />
          </button>

          <button
            onClick={() =>
              setCurrent((c) => (c + 1) % slides.length)
            }
            className="
              absolute right-2 md:right-5
              top-1/2 -translate-y-1/2
              w-8 h-8 md:w-11 md:h-11
              rounded-full
              bg-black/60
              border border-[rgba(0,255,163,0.3)]
              flex items-center justify-center
            "
          >
            <ChevronRight className="w-4 h-4 md:w-5 md:h-5 text-[#F5B942]" />
          </button>

          {/* Dots */}
          <div className="absolute bottom-3 md:bottom-5 left-1/2 -translate-x-1/2 flex gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`h-2 rounded-full transition-all ${
                  i === current
                    ? "w-6 md:w-8 bg-[#00FFA3]"
                    : "w-2 bg-white/30"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}