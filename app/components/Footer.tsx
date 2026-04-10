import Link from "next/link";

const Footer = () => {
  return (
<footer className="border-t border-[hsl(var(--border))] bg-[hsl(var(--background))]/80 backdrop-blur-xl py-12 mt-20">      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="grid md:grid-cols-4 gap-8 mb-10">
          
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">🎰</span>
              <span className="text-lg font-bold text-gradient-gold">
                Lottery Network
              </span>
            </div>
            <p className="text-sm text-[hsl(var(--muted-foreground))] leading-relaxed">
              The most trusted decentralized lottery platform with transparent draws and instant payouts.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2 text-sm text-[hsl(var(--muted-foreground))]">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/games" className="hover:text-white transition-colors">
                  Games
                </Link>
              </li>
              <li>
                <Link href="/results" className="hover:text-white transition-colors">
                  Results
                </Link>
              </li>
              <li>
                <Link href="/how-to-play" className="hover:text-white transition-colors">
                  How to Play
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">
              Support
            </h4>
            <ul className="space-y-2 text-sm text-[hsl(var(--muted-foreground))]">
              <li>
                <Link href="/help" className="hover:text-white transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
                            <li>
                <Link href="/security" className="hover:text-white transition-colors">
                  Security
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">
              Connect
            </h4>
            <ul className="space-y-2 text-sm text-[hsl(var(--muted-foreground))]">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Twitter
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Discord
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Telegram
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-[hsl(var(--border))] pt-6 text-center">
          <p className="text-sm text-[hsl(var(--muted-foreground))]">
            © 2026 Lottery Network. All rights reserved. Play responsibly.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;