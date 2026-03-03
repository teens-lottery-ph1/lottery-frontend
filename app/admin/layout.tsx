'use client';

import { usePathname } from 'next/navigation';
import Sidebar from './_components/Sidebar';
import Topbar from './_components/Topbar';

interface PageConfig {
  title: string;
  subtitle?: string;
  actionLabel?: string;
}

const pageConfig: Record<string, PageConfig> = {
  '/admin/dashboard': {
    title: 'Dashboard',
    subtitle: 'Welcome back to your control center',
  },
  '/admin/users': {
    title: 'Users',
    subtitle: 'Manage all platform users',
  },
  '/admin/draws': {
    title: 'Draws',
    subtitle: 'Manage all lottery draws',
    actionLabel: 'Create Draw',
  },
  '/admin/levels': {
    title: 'Levels & Rewards',
    subtitle: 'Manage user levels and rewards',
  },
  '/admin/payments': {
    title: 'Payments',
    subtitle: 'Monitor all transactions',
  },
  '/admin/wallet': {
    title: 'Wallet Management',
    subtitle: 'Manage user wallets and balance',
  },
  '/admin/referral': {
    title: 'Referral Program',
    subtitle: 'Track and manage referrals',
  },
  '/admin/kyc': {
    title: 'KYC Management',
    subtitle: 'Review and approve KYC documents',
  },
  '/admin/analytics': {
    title: 'Analytics',
    subtitle: 'Platform insights and statistics',
  },
  '/admin/notifications': {
    title: 'Notifications',
    subtitle: 'Send announcements and alerts',
  },
  '/admin/settings': {
    title: 'Settings',
    subtitle: 'Configure platform settings',
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Get config for current page or use defaults
  const getPageConfig = () => {
    for (const [path, config] of Object.entries(pageConfig)) {
      if (pathname.startsWith(path)) {
        return config;
      }
    }
    return { title: 'Admin', subtitle: 'Control Center' };
  };

  const config = getPageConfig();

  return (
    <div className="flex h-screen overflow-hidden bg-white">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden ml-[240px]">
        {/* Topbar */}
        <Topbar title={config.title} subtitle={config.subtitle} />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-7 scrollbar-thin scrollbar-thumb-[#d1d5db] scrollbar-track-transparent">
          {children}
        </main>
      </div>

      <style jsx global>{`
        ::-webkit-scrollbar {
          width: 4px;
        }
        ::-webkit-scrollbar-thumb {
          background: #d1d5db;
          border-radius: 2px;
        }
        ::-webkit-scrollbar-track {
          background: transparent;
        }
      `}</style>
    </div>
  );
}
