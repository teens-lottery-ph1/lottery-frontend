"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Gamepad2,
  Trophy,
  HelpCircle,
  Menu,
  X,
  Wallet,
  Crown,
  Bell,
  LogIn,
} from "lucide-react";

const navItems = [
  { label: "Home", icon: Home, href: "/" },
  { label: "Games", icon: Gamepad2, href: "/games" },
  { label: "Results", icon: Trophy, href: "/results" },
  { label: "Levels", icon: Crown, href: "/levels" },
  { label: "Wallet", icon: Wallet, href: "/wallets" },
  { label: "How to Play", icon: HelpCircle, href: "/how-to-play" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-[hsl(var(--border))] bg-[hsl(var(--background))]/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-8">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl">🎰</span>
          <span className="text-xl font-bold text-gradient-gold">
            Lottery Network
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                  isActive
                    ? "bg-[hsl(var(--primary))]/10 text-[hsl(var(--primary))] glow-primary"
                    : "text-[hsl(var(--muted-foreground))] hover:text-white hover:bg-[hsl(var(--surface-hover))]"
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </div>

        {/* Right Section */}
        <div className="hidden md:flex items-center gap-3">
          <button className="relative p-2 rounded-xl bg-[hsl(var(--surface))] hover:bg-[hsl(var(--surface-hover))] transition">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-yellow-400" />
          </button>

          <Link
            href="/wallets"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[hsl(var(--surface))] hover:bg-[hsl(var(--surface-hover))] transition"
          >
            <Wallet className="w-4 h-4 text-green-400" />
            $1,480
          </Link>

          <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition">
            <LogIn className="w-4 h-4" />
            Login
          </button>

          <button className="rounded-xl bg-[hsl(var(--primary))] px-5 py-2.5 text-sm font-semibold text-black hover:opacity-90 transition glow-primary">
            Sign Up
          </button>
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="lg:hidden p-2"
        >
          {mobileOpen ? <X /> : <Menu />}
        </button>
      </div>
    </nav>
  );
}