// app/terms-of-services/page.tsx

import {
  ShieldCheck,
  Scale,
  Lock,
  CreditCard,
  Ban,
  FileText,
  Mail,
} from "lucide-react";

export const metadata = {
  title: "Terms of Service | Lottery Numbers Network",
  description:
    "Read the Terms of Service for using the Lottery Numbers Network platform.",
};

const sections = [
  {
    id: "eligibility",
    title: "1. Eligibility",
    icon: ShieldCheck,
    content: [
      "You must be at least 18 years old (or legal age in your jurisdiction).",
      "You agree to comply with all local laws related to lottery participation.",
      "KYC verification may be requested for compliance purposes.",
    ],
  },
  {
    id: "accounts",
    title: "2. User Accounts",
    icon: Lock,
    content: [
      "Users must provide accurate registration details.",
      "You are responsible for account security and activities.",
      "Fraudulent or suspicious accounts may be suspended.",
    ],
  },
  {
    id: "lottery",
    title: "3. Lottery Participation",
    icon: Scale,
    content: [
      "Lottery participation does not guarantee winnings.",
      "Results displayed are final unless technical errors occur.",
      "Tickets are generally non-refundable unless required by law.",
    ],
  },
  {
    id: "levels",
    title: "4. Levels & Rewards System",
    icon: FileText,
    content: [
      "The platform supports a 10-level membership system.",
      "Rewards and eligibility may change anytime.",
    ],
  },
  {
    id: "payments",
    title: "5. Wallet & Payments",
    icon: CreditCard,
    content: [
      "Payments are processed via secure third-party gateways.",
      "Wallet balances are non-transferable.",
    ],
  },
  {
    id: "prohibited",
    title: "6. Prohibited Activities",
    icon: Ban,
    content: [
      "No bots or manipulation attempts.",
      "No fake accounts or system exploitation.",
    ],
  },
  {
    id: "liability",
    title: "7. Limitation of Liability",
    icon: Scale,
    content: [
      "We are not liable for internet or third-party failures.",
      "Platform services are provided as-is.",
    ],
  },
  {
    id: "termination",
    title: "8. Account Termination",
    icon: ShieldCheck,
    content: ["Accounts may be suspended for violating terms."],
  },
  {
    id: "updates",
    title: "9. Changes to Terms",
    icon: FileText,
    content: [
      "Terms may be updated periodically.",
      "Continued use means acceptance.",
    ],
  },
  {
    id: "contact",
    title: "10. Contact Information",
    icon: Mail,
    content: [
      "Email: support@yourdomain.com",
      "Address: [Company Address]",
    ],
  },
];

export default function TermsOfServicePage() {
  return (
    <>
      {/* Hide Sidebar */}
      <style>{`
        aside {
          display: none !important;
        }
        main {
          margin-left: 0 !important;
          width: 100% !important;
        }
      `}</style>

      {/* LUXURY BACKGROUND */}
      <div className="min-h-screen w-full bg-[#0d120f] text-white">
        {/* HERO */}
        <section className=" bg-gradient-to-b from-[#0f1722] to-[#0b1118]">
          <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
            <p className="text-sm font-semibold uppercase tracking-widest text-yellow-400">
              Legal
            </p>

            <h1 className="mt-3 text-3xl sm:text-4xl font-bold text-white">
              Terms & Conditions
            </h1>

            <p className="mt-4 text-gray-300 leading-relaxed">
              Please read these Terms carefully before using the Lottery Numbers
              Network platform.
            </p>
          </div>
        </section>

        {/* CONTENT */}
        <section className="mx-auto max-w-4xl px-4 py-10 space-y-6">
          {sections.map((section) => {
            const Icon = section.icon;

            return (
              <article
                key={section.id}
                className="bg-[#111714] p-6 shadow-[0_0_25px_rgba(255,200,0,0.08)]"
              >
                <div className=" flex items-center gap-3">
                  <div className="rounded-lg bg-yellow-400/10 p-2">
                    <Icon className="h-5 w-5 text-yellow-400" />
                  </div>
                  <h2 className="text-lg sm:text-xl font-semibold text-yellow-300">
                    {section.title}
                  </h2>
                </div>

                <ul className="list-disc pl-5 space-y-2 text-gray-300 leading-7">
                  {section.content.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </article>
            );
          })}
        </section>

        {/* FOOTER NOTE */}
        <section className=" bg-[#0f1722]">
          <div className="mx-auto max-w-4xl px-4 py-6 text-sm text-gray-400">
            By continuing to use this platform, you acknowledge that you have
            read and agreed to these Terms of Service.
          </div>
        </section>
      </div>
    </>
  );
}