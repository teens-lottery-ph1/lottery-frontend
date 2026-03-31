"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";
import AppSidebar from "./Sidebar";

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {

  const pathname = usePathname();

  /* Pages with NO layout (auth pages) */
  const noLayoutRoutes = ["/login", "/signup"];

  if (noLayoutRoutes.includes(pathname) || pathname.startsWith("/admin")) {
    return <>{children}</>;
  }

  /* Pages where sidebar should be hidden */
  const hideSidebarRoutes = ["/security", "/privacy", "/terms"];
  const shouldHideSidebar = hideSidebarRoutes.includes(pathname);

  return (
    <>
      <Navbar />

      <div className="flex">

        {!shouldHideSidebar && <AppSidebar />}

        <main className="flex-1 pt-16 min-h-screen px-4 md:px-8">
          {children}
        </main>

      </div>

      <Footer />
    </>
  );

}
// 1