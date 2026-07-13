"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Gamepad2,
  Trophy,
  HelpCircle,
  Wallet,
  Crown,
  Gift,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  Ticket,
  Star,
  Zap,
  Shield,
} from "lucide-react";
import { useState } from "react";

const mainNav = [
  { label: "Home", icon: Home, href: "/" },
  { label: "Games", icon: Gamepad2, href: "/games" },
  { label: "My Tickets", icon: Ticket, href: "/my-tickets" },
  { label: "Results", icon: Trophy, href: "/results" },
  { label: "Levels & Rewards", icon: Crown, href: "/levels" },
  { label: "Wallet", icon: Wallet, href: "/wallets" },
  { label: "How to Play", icon: HelpCircle, href: "/how-to-play" },
];

const gameCategories = [
  { label: "Mega Millions", icon: Star },
  { label: "Super Jackpot", icon: Zap },
  { label: "Power Ball", icon: Ticket },
  { label: "Lucky 7", icon: Gift },
  { label: "Daily Draw", icon: BarChart3 },
];

export default function AppSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <aside
      className={`hidden lg:flex flex-col border-r border-[hsl(var(--border))] bg-[hsl(var(--background))]/60 backdrop-blur-xl shrink-0 transition-all duration-300 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto ${
        collapsed ? "w-16" : "w-60"
      }`}
    >
      {/* Collapse Toggle */}
      <div className="flex justify-end p-2">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-8 h-8 rounded-lg bg-[hsl(var(--surface))] flex items-center justify-center text-[hsl(var(--muted-foreground))] hover:text-white hover:bg-[hsl(var(--surface-hover))] transition"
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Main Navigation */}
      <nav className="px-2 space-y-1">
        {!collapsed && (
          <p className="px-3 py-2 text-xs font-semibold text-[hsl(var(--muted-foreground))] uppercase tracking-wider">
            Navigation
          </p>
        )}

        {mainNav.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                isActive
                  ? "bg-[hsl(var(--primary))]/10 text-[hsl(var(--primary))] border border-[hsl(var(--primary))]/20"
                  : "text-[hsl(var(--muted-foreground))] hover:text-white hover:bg-[hsl(var(--surface-hover))]"
              }`}
              title={collapsed ? item.label : undefined}
            >
              <item.icon className="w-5 h-5 shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Game Categories */}
      {!collapsed && (
        <div className="px-2 mt-6">
          <p className="px-3 py-2 text-xs font-semibold text-[hsl(var(--muted-foreground))] uppercase tracking-wider">
            Games
          </p>
          <div className="space-y-1">
            {gameCategories.map((cat) => (
              <button
                key={cat.label}
                className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-[hsl(var(--muted-foreground))] hover:text-white hover:bg-[hsl(var(--surface-hover))] transition w-full text-left"
              >
                <cat.icon className="w-4 h-4 shrink-0" />
                <span>{cat.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Promo Card */}
      {!collapsed && (
        <div className="px-3 mt-auto mb-4">
          <div className="rounded-xl bg-[hsl(var(--primary))]/10 border border-[hsl(var(--primary))]/20 p-4">
            <Shield className="w-6 h-6 text-[hsl(var(--primary))] mb-2" />
            <p className="text-sm font-semibold text-white mb-1">
              Secure & Trusted
            </p>
            <p className="text-xs text-[hsl(var(--muted-foreground))]">
              256-bit SSL encryption. Licensed & regulated platform.
            </p>
          </div>
        </div>
      )}
    </aside>
  );
}