import { Star } from "lucide-react";

const testimonials = [
  { text: "Best lottery platform I've used! The interface is smooth and payouts are instant.", name: "Alex Thompson", role: "Regular Player" },
  { text: "Won $10,000 last month! The whole process was transparent and secure.", name: "Emily Chen", role: "Winner" },
  { text: "Love the level system and rewards. Customer support is excellent too!", name: "Michael Rodriguez", role: "VIP Member" },
];

export default function Testimonials() {
  return (
    <section className="py-12 md:py-16 bg-gradient-dark">
      <div className="container">

        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
            What Our Players Say
          </h2>
          <p className="text-muted-foreground text-lg">
            Trusted by thousands of satisfied players worldwide
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="rounded-3xl bg-gradient-to-br from-[#06231A] to-[#041912] border border-[rgba(0,255,163,0.12)] p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_60px_rgba(0,255,163,0.08)]"
            >
              <div className="flex gap-1 mb-5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-[#F5B942] text-[#F5B942]" />
                ))}
              </div>

              <p className="mb-6 leading-relaxed text-foreground">
                "{t.text}"
              </p>

              <div>
                <p className="font-semibold">
                  {t.name}
                </p>
                <p className="text-sm text-muted-foreground">
                  {t.role}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}