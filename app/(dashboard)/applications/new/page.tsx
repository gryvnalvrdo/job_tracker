import type { Metadata } from "next";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { ApplicationForm } from "@/components/features/ApplicationForm";

export const metadata: Metadata = { title: "Tambah Lamaran" };

export default function NewApplicationPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text">Tambah Lamaran Baru</h1>
        <p className="text-sm text-text-muted mt-1">Isi detail lamaran kerja kamu</p>
      </div>
      <Card>
        <ApplicationForm />
      </Card>
    </div>
  );
}
