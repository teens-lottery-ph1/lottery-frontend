'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';

interface SidebarItem {
  label: string;
  href: string;
  icon: string;
  badge?: string;
  badgeColor?: string;
  badge_pulse?: boolean;
}

const sidebarSections = [
  {
    label: 'MAIN',
    items: [
      { label: 'Dashboard', href: '/admin/dashboard', icon: '📊' },
      {
        label: 'Users',
        href: '/admin/users',
        icon: '👥',
        badge: '24.8k',
        badgeColor: 'gray',
      },
      {
        label: 'Draws',
        href: '/admin/draws',
        icon: '🎰',
        badge: 'LIVE',
        badgeColor: 'green',
        badge_pulse: true,
      },
      { label: 'Categories', href: '/admin/categories', icon: '🎲' },
      { label: 'Levels & Rewards', href: '/admin/levels-game', icon: '🏆' },
      { label: 'Payments', href: '/admin/payments', icon: '💳' },
      { label: 'Tickets', href: '/admin/tickets', icon: '🎫' },
    ],
  },
  {
    label: 'FINANCE',
    items: [
      { label: 'Wallet', href: '/admin/wallet', icon: '👛' },
      { label: 'Referral Program', href: '/admin/referral', icon: '🔗' },
      {
        label: 'KYC',
        href: '/admin/kyc',
        icon: '📋',
        badge: '8',
        badgeColor: 'red',
      },
    ],
  },
  {
    label: 'SYSTEM',
    items: [
      { label: 'Analytics', href: '/admin/analytics', icon: '📈' },
      { label: 'Notifications', href: '/admin/notifications', icon: '🔔' },
      { label: 'Settings', href: '/admin/settings', icon: '⚙️' },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    return pathname.startsWith(href);
  };

  return (
    <aside className="fixed left-0 top-0 flex flex-col h-screen w-[240px] bg-[#f8f9fa] border-r border-[#e5e7eb] overflow-y-auto scrollbar-thin scrollbar-thumb-[#d1d5db] scrollbar-track-transparent">
      {/* Logo Section */}
      <div className="p-6 border-b border-[#e5e7eb]">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-[#fef3c7] rounded-lg flex items-center justify-center">
            <span className="text-xl">🎰</span>
          </div>
          <span className="font-bold text-[#d97706] text-[15px]">LottoAdmin</span>
        </div>
        <p className="text-[11px] text-[#6b7280]">Control Center</p>
      </div>

      {/* Navigation Sections */}
      <nav className="flex-1 overflow-y-auto py-6 px-3">
        {sidebarSections.map((section) => (
          <div key={section.label} className="mb-8">
            <p className="text-[10px] font-semibold text-[#6b7280] uppercase tracking-widest px-3 mb-3">
              {section.label}
            </p>

            <div className="space-y-1">
              {section.items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-r-xl text-[13.5px] transition-all ${isActive(item.href)
                      ? 'text-[#d97706] bg-[#fef3c7] border-l-2 border-[#d97706]'
                      : 'text-[#4b5563] hover:text-[#1f2937] hover:bg-[#f0f1f3]'
                    }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span className="flex-1">{item.label}</span>
                  {item.badge && (
                    <span
                      className={`text-[10px] font-semibold px-2 py-1 rounded-full ${item.badgeColor === 'green'
                          ? 'bg-[#dcfce7] text-[#16a34a]'
                          : item.badgeColor === 'red'
                            ? 'bg-[#fee2e2] text-[#dc2626]'
                            : 'bg-[#f3f4f6] text-[#4b5563]'
                        } ${item.badge_pulse ? 'animate-pulse' : ''}`}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Admin Profile Footer */}
      <div className="p-4 border-t border-[#e5e7eb]">
        <div className="bg-[#f0f1f3] rounded-xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#fef3c7] flex items-center justify-center text-[#d97706] font-bold text-[13px]">
            A
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-semibold text-[#1f2937]">Admin</p>
            <p className="text-[11px] text-[#6b7280] truncate">Super Administrator</p>
          </div>
          <span className="text-lg">🚪</span>
        </div>
      </div>
    </aside>
  );
}
