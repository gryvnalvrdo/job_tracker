"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { LangToggle } from "@/components/ui/LangToggle";
import { useState } from "react";


const navItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/applications", label: "Lamaran" },
];

interface NavbarProps {
  userName?: string | null;
  dict: Record<string, string>;
}

export function Navbar({ userName, dict }: NavbarProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const pageTitles: Record<string, string> = {
    "/dashboard": dict.dashboard,
    "/applications": dict.applications,
    "/applications/new": "Tambah Lamaran", // Wait, new application title...
  };

  const currentTitle =
    pageTitles[pathname] ??
    (pathname.startsWith("/applications/") ? "Detail Lamaran" : "JobTrail");

  return (
    <>
      {/* Desktop top bar */}
      <header className="hidden lg:flex h-16 items-center justify-between px-6 border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-30">
        <h1 className="text-base font-semibold text-text">{currentTitle}</h1>
        <div className="flex items-center gap-2">
          <LangToggle />
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
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-surface border-t border-border flex items-center justify-around px-4 py-2 safe-area-bottom">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-0.5 px-4 py-1.5 rounded-lg text-xs font-medium transition-all",
                isActive ? "text-primary" : "text-text-muted"
              )}
            >
              <span className={cn("w-5 h-0.5 rounded-full mb-1 transition-all", isActive ? "bg-[#6366f1]" : "bg-transparent")} />
              {item.label === "Dashboard" ? dict.dashboard : item.label === "Lamaran" ? dict.applications : item.label}
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
          className="flex flex-col items-center gap-0.5 px-4 py-1.5 text-xs text-text-muted"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
          </svg>
          {dict.signOut}
        </button>
        <div className="flex flex-col items-center justify-center gap-1">
          <div className="flex items-center gap-1">
            <LangToggle />
            <ThemeToggle />
          </div>
        </div>
      </nav>
    </>
  );
}
