import Link from "next/link";
import { Ticket, Hash, Trophy } from "lucide-react";

const steps = [
  { icon: Ticket, label: "Purchase Tickets", step: "01", desc: "Choose your lottery game and buy tickets securely" },
  { icon: Hash, label: "Select Numbers", step: "02", desc: "Pick your lucky numbers or use quick pick" },
  { icon: Trophy, label: "Win & Claim", step: "03", desc: "Check results and claim your prizes instantly" },
];

export default function HowItWorks() {
  return (
    <section className="py-12 md:py-16 bg-gradient-dark">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
            How It Works
          </h2>
          <p className="text-muted-foreground text-lg">
            Get started in three simple steps
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-16 max-w-6xl mx-auto">
          {steps.map((step) => (
            <div key={step.step} className="text-center">
              
              <div className="relative w-24 h-24 mx-auto mb-6">
                <div className="w-full h-full rounded-3xl bg-gradient-to-br from-[#06231A] to-[#041912] border border-[rgba(0,255,163,0.15)] flex items-center justify-center shadow-[0_10px_40px_rgba(0,255,163,0.05)]">
                  <step.icon className="w-10 h-10 text-[#00FFA3]" />
                </div>

                <span className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-[#F5B942] text-black text-xs font-bold flex items-center justify-center shadow-md">
                  {step.step}
                </span>
              </div>

              <h3 className="text-xl font-bold mb-3">
                {step.label}
              </h3>

              <p className="text-muted-foreground leading-relaxed max-w-xs mx-auto">
                {step.desc}
              </p>
            </div>
          ))}
        </div>

        <div className="text-center mt-16">
          <Link
            href="#"
            className="inline-flex items-center rounded-xl border border-[rgba(0,255,163,0.2)] px-8 py-3 font-semibold hover:bg-[#06231A] transition-all"
          >
            Learn More
          </Link>
        </div>
      </div>
    </section>
  );
}