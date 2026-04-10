'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
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
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    if (pathname.startsWith('/admin/login')) {
      setIsAuthorized(true);
      return;
    }

    const adminSession = localStorage.getItem("adminSession");
    if (!adminSession) {
      router.replace('/admin/login');
    } else {
      setIsAuthorized(true);
    }
  }, [pathname, router]);

  // ✅ Skip layout for login
  if (pathname.startsWith('/admin/login')) {
    return <>{children}</>;
  }

  // Prevent flash of content before auth check completes
  if (!isAuthorized) {
    return null;
  }

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
    <div className="flex h-screen bg-gray-50 text-gray-800">
      
      {/* Sidebar */}
      <div className="w-[240px] fixed left-0 top-0 h-full bg-white border-r border-gray-200 shadow-sm z-50">
        <Sidebar />
      </div>

      {/* Main Section */}
      <div className="flex-1 flex flex-col ml-[240px]">
        
        {/* Topbar */}
        <div className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
          <Topbar title={config.title} subtitle={config.subtitle} />
        </div>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-[1400px] mx-auto">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              {children}
            </div>
          </div>
        </main>
      </div>

      {/* Scrollbar Styling */}
      <style jsx global>{`
        ::-webkit-scrollbar {
          width: 6px;
        }
        ::-webkit-scrollbar-thumb {
          background: #d1d5db;
          border-radius: 6px;
        }
        ::-webkit-scrollbar-track {
          background: transparent;
        }
      `}</style>
    </div>
  );
}