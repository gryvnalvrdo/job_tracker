import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/layout/Sidebar";
import { Navbar } from "@/components/layout/Navbar";

import { cookies } from "next/headers";
import { getDictionary, Language } from "@/lib/dictionary";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const cookieStore = await cookies();
  const lang = (cookieStore.get("lang")?.value as Language) || "en";
  const dict = getDictionary(lang);

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar
        userName={session.user.name}
        userEmail={session.user.email}
        dict={dict.sidebar}
      />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar userName={session.user.name} dict={dict.sidebar} />
        <main className="flex-1 p-4 lg:p-6 pb-24 lg:pb-6">
          {children}
        </main>
      </div>
    </div>
  );
}
