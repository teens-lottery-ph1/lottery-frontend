'use client';

import { useRouter } from "next/navigation";

interface TopbarProps {
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export default function Topbar({
  title,
  subtitle,
  actionLabel,
  onAction,
}: TopbarProps) {

  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/logout`,
        {
          method: "POST",
          credentials: "include",
        }
      );

      // redirect after logout
      router.push("/admin/login");

    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <div className="sticky top-0 h-[60px] backdrop-blur bg-white border-b border-[#e5e7eb] flex items-center justify-between px-7 z-40">
      
      <div>
        <h1 className="text-[18px] font-bold text-[#111827]">{title}</h1>
        {subtitle && (
          <p className="text-[12px] text-[#6b7280]">{subtitle}</p>
        )}
      </div>

      <div className="flex items-center gap-4">

        {/* Search Box */}
        <div className="hidden md:flex items-center gap-2 bg-[#f9fafb] border border-[#e5e7eb] rounded-xl px-4 py-2 focus-within:border-[#d97706] transition-colors">
          <span className="text-[13px]">🔍</span>
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent outline-none text-[#4b5563] text-[13px] w-32 placeholder:text-[#9ca3af]"
          />
        </div>

        {/* Notification Bell */}
        <button className="relative text-[20px] hover:text-[#d97706] transition-colors">
          🔔
          <span className="absolute top-0 right-0 w-2 h-2 bg-[#dc2626] rounded-full"></span>
        </button>

        {/* Primary Action Button */}
        {actionLabel && (
          <button
            onClick={onAction}
            className="bg-[#d97706] text-white font-bold px-6 py-2 rounded-xl hover:bg-[#b45309] transition-colors text-[13px] whitespace-nowrap"
          >
            {actionLabel}
          </button>
        )}

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="bg-red-50 text-red-600 font-semibold px-4 py-2 rounded-xl hover:bg-red-100 transition-colors text-[13px]"
        >
          Logout
        </button>

      </div>
    </div>
  );
}