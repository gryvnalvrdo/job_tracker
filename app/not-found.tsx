import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0f1117] text-center p-4">
      <div className="w-24 h-24 rounded-3xl bg-[#6366f1]/10 border border-[#6366f1]/20 flex items-center justify-center mb-6">
        <span className="text-5xl font-bold gradient-text">404</span>
      </div>
      <h1 className="text-2xl font-bold text-[#e2e8f0] mb-2">Halaman tidak ditemukan</h1>
      <p className="text-[#8892a4] mb-6 max-w-sm">
        Halaman yang kamu cari tidak ada atau telah dipindahkan.
      </p>
      <Link href="/dashboard">
        <Button>Kembali ke Dashboard</Button>
      </Link>
    </div>
  );
}
