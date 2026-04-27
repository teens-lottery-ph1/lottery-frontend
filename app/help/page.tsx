export default function HelpPage() {
  const faqs = [
    {
      q: "How do I participate in a lottery draw?",
      a: "Create an account, add funds to your wallet, choose an active game, select your numbers, and confirm your ticket purchase before the draw closes.",
    },
    {
      q: "How are winners selected?",
      a: "All draws are processed through a transparent and secure randomization system. Results are published instantly after the draw ends.",
    },
    {
      q: "When will I receive winnings?",
      a: "Winning amounts are credited instantly or within a short processing window to your wallet after result verification.",
    },
    {
      q: "Can I cancel a ticket after purchase?",
      a: "Once a ticket is successfully confirmed for an active draw, it cannot be cancelled or modified.",
    },
    {
      q: "How do I withdraw funds?",
      a: "Go to your Wallet section, choose Withdraw, enter your amount and payout details, then submit your request.",
    },
    {
      q: "Is my account secure?",
      a: "Yes. We use secure authentication, encrypted sessions, and continuous monitoring to protect your account activity.",
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white px-6 md:px-10 py-14">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-14">
          <p className="text-yellow-400 font-semibold tracking-widest uppercase mb-3">
            Support Center
          </p>
          <h1 className="text-4xl md:text-6xl font-bold mb-5">
            Help Center
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Find answers, understand how the platform works, and get assistance
            for your Lottery Network account, wallet, tickets, and results.
          </p>
        </div>

        {/* Quick Help Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-14">
          <div className="rounded-2xl border border-gray-800 bg-zinc-900 p-6">
            <h3 className="text-xl font-semibold mb-3">Account Help</h3>
            <p className="text-gray-400 text-sm">
              Login issues, profile settings, password resets, and verification support.
            </p>
          </div>

          <div className="rounded-2xl border border-gray-800 bg-zinc-900 p-6">
            <h3 className="text-xl font-semibold mb-3">Wallet & Payments</h3>
            <p className="text-gray-400 text-sm">
              Deposits, withdrawals, payment confirmations, and transaction history.
            </p>
          </div>

          <div className="rounded-2xl border border-gray-800 bg-zinc-900 p-6">
            <h3 className="text-xl font-semibold mb-3">Games & Results</h3>
            <p className="text-gray-400 text-sm">
              Draw timings, ticket status, result updates, and winning payouts.
            </p>
          </div>
        </div>

        {/* FAQ */}
        <div className="mb-14">
          <h2 className="text-3xl font-bold mb-8">Frequently Asked Questions</h2>

          <div className="space-y-5">
            {faqs.map((item, index) => (
              <div
                key={index}
                className="rounded-2xl border border-gray-800 bg-zinc-900 p-6"
              >
                <h3 className="font-semibold text-lg mb-2">{item.q}</h3>
                <p className="text-gray-400 text-sm leading-7">{item.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Responsible Gaming */}
        <div className="rounded-2xl border border-yellow-500/30 bg-yellow-500/10 p-7">
          <h3 className="text-2xl font-bold mb-3 text-yellow-400">
            Play Responsibly
          </h3>
          <p className="text-gray-300 leading-7">
            Lottery games are designed for entertainment. Please play within your
            limits, manage your spending responsibly, and seek support if gaming
            stops being enjoyable.
          </p>
        </div>
      </div>
    </div>
  );
}