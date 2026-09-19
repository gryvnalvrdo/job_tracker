"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function LangToggle() {
  const router = useRouter();
  const [lang, setLang] = useState<"en" | "id">("en");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const cookies = document.cookie.split("; ");
    const langCookie = cookies.find((row) => row.startsWith("lang="));
    if (langCookie) {
      setLang(langCookie.split("=")[1] as "en" | "id");
    } else {
      document.cookie = "lang=en; path=/; max-age=31536000";
    }
  }, []);

  if (!mounted) return <div className="w-8 h-8" />;

  const toggleLang = () => {
    const nextLang = lang === "en" ? "id" : "en";
    document.cookie = `lang=${nextLang}; path=/; max-age=31536000`;
    setLang(nextLang);
    router.refresh();
  };

  return (
    <button
      onClick={toggleLang}
      className="p-2 rounded-md hover:bg-surface-2 transition-colors flex items-center justify-center border border-transparent hover:border-border"
      title="Toggle Language"
    >
      <span className="text-xs font-semibold text-text-muted hover:text-text">
        {lang === "en" ? "EN / ID" : "ID / EN"}
      </span>
    </button>
  );
}
