export default function ContactPage() {
  return (
    <div className="min-h-screen bg-black text-white px-6 md:px-10 py-14">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-14">
          <p className="text-yellow-400 font-semibold tracking-widest uppercase mb-3">
            Contact Support
          </p>
          <h1 className="text-4xl md:text-6xl font-bold mb-5">
            Contact Us
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Our support team is ready to help with account issues, payments,
            withdrawals, ticket questions, or general assistance.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left */}
          <div className="space-y-6">
            <div className="rounded-2xl border border-gray-800 bg-zinc-900 p-6">
              <h3 className="text-xl font-semibold mb-2">Email Support</h3>
              <p className="text-gray-400">
                support@lotterynetwork.com
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Average response time: within 24 hours.
              </p>
            </div>

            <div className="rounded-2xl border border-gray-800 bg-zinc-900 p-6">
              <h3 className="text-xl font-semibold mb-2">Business Enquiries</h3>
              <p className="text-gray-400">
                partnerships@lotterynetwork.com
              </p>
            </div>

            <div className="rounded-2xl border border-gray-800 bg-zinc-900 p-6">
              <h3 className="text-xl font-semibold mb-2">Support Hours</h3>
              <p className="text-gray-400">
                Monday to Sunday — 9:00 AM to 11:00 PM
              </p>
            </div>
          </div>

          {/* Right */}
          <div className="rounded-2xl border border-gray-800 bg-zinc-900 p-7">
            <h3 className="text-2xl font-bold mb-6">Send a Message</h3>

            <form className="space-y-5">
              <div>
                <label className="block mb-2 text-sm text-gray-400">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="Enter your name"
                  className="w-full rounded-xl bg-black border border-gray-700 px-4 py-3 outline-none focus:border-yellow-400"
                />
              </div>

              <div>
                <label className="block mb-2 text-sm text-gray-400">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full rounded-xl bg-black border border-gray-700 px-4 py-3 outline-none focus:border-yellow-400"
                />
              </div>

              <div>
                <label className="block mb-2 text-sm text-gray-400">
                  Message
                </label>
                <textarea
                  rows={5}
                  placeholder="Write your message..."
                  className="w-full rounded-xl bg-black border border-gray-700 px-4 py-3 outline-none focus:border-yellow-400 resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-yellow-400 text-black font-semibold py-3 hover:opacity-90 transition"
              >
                Submit Request
              </button>
            </form>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-14 rounded-2xl border border-yellow-500/30 bg-yellow-500/10 p-7 text-center">
          <h3 className="text-2xl font-bold text-yellow-400 mb-3">
            Need Urgent Assistance?
          </h3>
          <p className="text-gray-300">
            Please mention your registered email and transaction ID for faster support resolution.
          </p>
        </div>
      </div>
    </div>
  );
}