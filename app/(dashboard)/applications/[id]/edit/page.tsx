import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { getApplicationById } from "@/lib/actions/applications";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { ApplicationForm } from "@/components/features/ApplicationForm";
import { Button } from "@/components/ui/Button";

interface EditApplicationPageProps {
  params: Promise<{ id: string }>;
}

export const metadata: Metadata = { title: "Edit Lamaran" };

export default async function EditApplicationPage({ params }: EditApplicationPageProps) {
  const { id } = await params;
  const application = await getApplicationById(id);

  if (!application) notFound();

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6 flex items-center gap-3">
        <Link href={`/applications/${id}`}>
          <Button variant="ghost" size="sm">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Kembali
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-[#e2e8f0]">Edit Lamaran</h1>
          <p className="text-sm text-[#8892a4]">
            {application.companyName} — {application.position}
          </p>
        </div>
      </div>
      <Card>
        <ApplicationForm application={application} />
      </Card>
    </div>
  );
}
