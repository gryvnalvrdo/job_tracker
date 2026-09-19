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

      {/* Mobile Top Bar */}
      <header className="lg:hidden flex h-16 items-center justify-between px-4 border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileOpen(true)}
            className="p-2 -ml-2 text-text-muted hover:text-text rounded-md focus:outline-none"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>
          <h1 className="text-base font-semibold text-text">{currentTitle}</h1>
        </div>
        <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
          {(userName ?? "U")[0].toUpperCase()}
        </div>
      </header>

      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <div 
          className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Sidebar Drawer */}
      <div 
        className={cn(
          "lg:hidden fixed inset-y-0 left-0 z-50 w-64 bg-surface border-r border-border shadow-xl transform transition-transform duration-300 ease-in-out flex flex-col",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="p-5 border-b border-border flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2.5" onClick={() => setMobileOpen(false)}>
            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
              </svg>
            </div>
            <span className="text-lg font-bold gradient-text">JobTrail</span>
          </Link>
          <button onClick={() => setMobileOpen(false)} className="p-1 text-text-muted hover:text-text">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-[#6366f1]/10 text-primary border border-[#6366f1]/20"
                    : "text-text-muted hover:text-text hover:bg-surface-2"
                )}
              >
                {item.label === "Dashboard" ? dict.dashboard : item.label === "Lamaran" ? dict.applications : item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border space-y-4">
          <div className="flex items-center justify-between px-2">
            <LangToggle />
            <ThemeToggle />
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start gap-2 text-text-muted"
            onClick={() => signOut({ callbackUrl: "/login" })}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
            </svg>
            {dict.signOut}
          </Button>
        </div>
      </div>

      {/* Floating Action Button (FAB) for Mobile */}
      <Link 
        href="/applications/new" 
        className="lg:hidden fixed bottom-6 right-6 z-30 w-14 h-14 rounded-full gradient-primary shadow-[0_8px_30px_rgb(0,0,0,0.3)] flex items-center justify-center text-white hover:scale-105 active:scale-95 transition-transform"
      >
        <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
      </Link>
    </>
  );
}
