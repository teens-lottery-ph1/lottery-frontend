import WinBigSection from "@/app/components/sections/WinBigSection";
import HeroCarousel from "@/app/components/sections/HeroCarousel";
import LiveTicker from "@/app/components/sections/LiveTicker";
import FeaturedGames from "@/app/components/sections/FeaturedGames";
import HowItWorks from "@/app/components/sections/HowItWorks";
import LevelsSection from "@/app/components/sections/LevelsSection";
import PlatformStats from "@/app/components/sections/PlatformStats";
import RecentWinners from "@/app/components/sections/RecentWinners";
import SpecialOffers from "@/app/components/sections/SpecialOffers";
import Testimonials from "@/app/components/sections/Testimonials";
import CTASection from "@/app/components/sections/CTASection";
export default function HomePage() {
  return (
    <main>
      <HeroCarousel />
      <LiveTicker />
      <WinBigSection />
      <FeaturedGames />
      <SpecialOffers />
      <LevelsSection />
      <RecentWinners />
      <HowItWorks />
      <PlatformStats />
      <Testimonials />
      <CTASection />
    </main>
  );
}