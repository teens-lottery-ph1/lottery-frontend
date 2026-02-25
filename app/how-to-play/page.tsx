 "use client";

import Image from "next/image";
import {
  Ticket,
  Hash,
  Trophy,
  Wallet,
  Users,
  Shield,
  HelpCircle,
  Check,
} from "lucide-react";

type Step = {
  step: string;
  icon: React.ElementType;
  title: string;
  description: string;
};

const steps: Step[] = [
  {
    step: "01",
    icon: Users,
    title: "Create Your Account",
    description:
      "Sign up with your email or phone number. Complete KYC verification for full access to all features and higher withdrawal limits.",
  },
  {
    step: "02",
    icon: Wallet,
    title: "Fund Your Wallet",
    description:
      "Add funds via UPI, credit/debit card, net banking, or cryptocurrency. All transactions are secured with 256-bit SSL encryption.",
  },
  {
    step: "03",
    icon: Ticket,
    title: "Purchase Tickets",
    description:
      "Browse available lottery games, choose your preferred draw, and purchase tickets using credits from your wallet.",
  },
  {
    step: "04",
    icon: Hash,
    title: "Select Your Numbers",
    description:
      "Pick your lucky numbers manually or use our Quick Pick feature for random selections. You can also use AI-powered number suggestions.",
  },
  {
    step: "05",
    icon: Trophy,
    title: "Win & Claim Prizes",
    description:
      "Watch live draws, check results instantly, and claim your winnings directly to your wallet with instant payouts.",
  },
];

const faqs = [
  {
    q: "How do I know the draws are fair?",
    a: "All draws use a verifiable random number generator (RNG) that is independently audited. Results are published on-chain for full transparency.",
  },
  {
    q: "What is the minimum deposit?",
    a: "The minimum deposit is $5 via any supported payment method. There are no deposit fees for amounts over $20.",
  },
  {
    q: "How long do withdrawals take?",
    a: "Standard withdrawals are processed within 24 hours. VIP members (Level 6+) enjoy priority processing within 2 hours.",
  },
  {
    q: "Can I set up auto-draw subscriptions?",
    a: "Yes! You can subscribe to automatic ticket purchases for recurring draws. Manage subscriptions from your Wallet page.",
  },
  {
    q: "How does the referral program work?",
    a: "Share your unique referral code. When someone signs up and makes their first deposit, you both earn $20 in credits.",
  },
];

export default function HowToPlayPage() {
  return (
    <div className="bg-[#061a14] text-white min-h-screen py-10">
      <div className="max-w-6xl mx-auto px-6">
        {/* HERO */}
        <div className="relative rounded-2xl overflow-hidden border border-white/10 mb-14">

  {/* Background Image */}
  <Image
    src="/promo-welcome.png"
    alt="How to play"
    fill
    className="object-cover"
    priority
  />

  {/* Gradient Overlay */}
  <div className="absolute inset-0 bg-gradient-to-r from-[#061a14]/95 via-[#061a14]/80 to-transparent" />

  {/* Content */}
  <div className="relative z-10 px-10 py-16 max-w-xl">
    <h1 className="text-4xl font-bold mb-3">How to Play</h1>
    <p className="text-white/70">
      Everything you need to know to start winning
    </p>
  </div>
</div>
        {/* STEPS */}
        <div className="max-w-3xl mx-auto mb-20">
          {steps.map((step, i) => (
            <div key={step.step} className="relative flex gap-6 pb-12">
              {/* Vertical line */}
              {i < steps.length - 1 && (
                <div className="absolute left-7 top-16 w-px h-[calc(100%-4rem)] bg-white/10" />
              )}

              {/* Icon */}
              <div className="relative w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                <step.icon className="w-6 h-6 text-emerald-400" />
                <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-yellow-400 text-black text-[10px] font-bold flex items-center justify-center">
                  {step.step}
                </span>
              </div>

              {/* Content */}
              <div className="pt-1">
                <h3 className="text-lg font-semibold mb-2">
                  {step.title}
                </h3>
                <p className="text-white/60 text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* SECURITY */}
        <div className="rounded-2xl border border-white/10 bg-[#0b231b] p-8 mb-16">
          <div className="flex items-center gap-3 mb-6">
            <Shield className="w-6 h-6 text-emerald-400" />
            <h2 className="text-xl font-semibold">
              Security & Compliance
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {[
              "256-bit SSL data encryption",
              "PCI-DSS compliant payment processing",
              "KYC verification for legal compliance",
              "Multi-factor authentication (SMS/Email)",
              "Independent RNG auditing",
              "Licensed & regulated platform",
              "Responsible gaming tools",
              "24/7 fraud monitoring",
            ].map((item) => (
              <div
                key={item}
                className="flex items-center gap-2 text-sm text-white/70"
              >
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                {item}
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-semibold text-center mb-8">
            Frequently Asked Questions
          </h2>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <details
                key={i}
                className="group rounded-2xl border border-white/10 bg-[#0b231b]"
              >
                <summary className="flex items-center justify-between px-6 py-4 cursor-pointer list-none">
                  <span className="text-sm font-medium pr-4">
                    {faq.q}
                  </span>
                  <HelpCircle className="w-4 h-4 text-white/50 group-open:text-emerald-400 transition-colors" />
                </summary>
                <div className="px-6 pb-4">
                  <p className="text-sm text-white/60 leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}