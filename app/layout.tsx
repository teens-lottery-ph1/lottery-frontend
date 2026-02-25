import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./navbar/Navbar";
import Footer from "./footer/Footer";
import AppSidebar from "./sidebar/Sidebar"; // add this if you created sidebar

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Lottery Network",
  description: "Lottery gaming platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Global Navbar (Fixed Top) */}
        <Navbar />

        {/* Main Layout: Sidebar + Page Content */}
        <div className="flex">
          {/* Sidebar (Desktop Only) */}
          <AppSidebar />

          {/* Page Content */}
          <main className="flex-1 pt-16 min-h-screen px-4 md:px-8">
            {children}
          </main>
        </div>

        {/* Global Footer */}
        <Footer />
      </body>
    </html>
  );
}