"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { useState } from "react";


const navItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/applications", label: "Lamaran" },
];

interface NavbarProps {
  userName?: string | null;
}

export function Navbar({ userName }: NavbarProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const pageTitles: Record<string, string> = {
    "/dashboard": "Dashboard",
    "/applications": "Lamaran Kerja",
    "/applications/new": "Tambah Lamaran",
  };

  const currentTitle =
    pageTitles[pathname] ??
    (pathname.startsWith("/applications/") ? "Detail Lamaran" : "JobTrail");

  return (
    <>
      {/* Desktop top bar */}
      <header className="hidden lg:flex h-16 items-center justify-between px-6 border-b border-[#2e3348] bg-[#0f1117]/80 backdrop-blur-sm sticky top-0 z-30">
        <h1 className="text-base font-semibold text-[#e2e8f0]">{currentTitle}</h1>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link href="/applications/new">
            <Button size="sm">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              Tambah Lamaran
            </Button>
          </Link>
        </div>
      </header>

      {/* Mobile bottom nav */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#1a1d27] border-t border-[#2e3348] flex items-center justify-around px-4 py-2 safe-area-bottom">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-0.5 px-4 py-1.5 rounded-lg text-xs font-medium transition-all",
                isActive ? "text-[#818cf8]" : "text-[#8892a4]"
              )}
            >
              <span className={cn("w-5 h-0.5 rounded-full mb-1 transition-all", isActive ? "bg-[#6366f1]" : "bg-transparent")} />
              {item.label}
            </Link>
          );
        })}
        <Link href="/applications/new" className="flex flex-col items-center gap-0.5 px-4 py-1.5">
          <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-lg -mt-5">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </div>
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="flex flex-col items-center gap-0.5 px-4 py-1.5 text-xs text-[#8892a4]"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
          </svg>
          Keluar
        </button>
      </nav>
    </>
  );
}
