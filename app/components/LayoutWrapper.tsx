"use client";

import { usePathname } from "next/navigation";
import AppSidebar from "./Sidebar";

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Pages where sidebar should be hidden (document pages)
  const hideSidebarRoutes = ["/security", "/privacy", "/terms"];
  const shouldHideSidebar = hideSidebarRoutes.includes(pathname);

  return (
    <div className="flex">
      {/* Sidebar (hidden only on specific pages) */}
      {!shouldHideSidebar && <AppSidebar />}

      {/* Page Content (UNCHANGED theme & spacing) */}
      <main className="flex-1 pt-16 min-h-screen px-4 md:px-8">
        {children}
      </main>
    </div>
  );
}