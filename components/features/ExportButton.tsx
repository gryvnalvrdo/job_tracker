"use client";

import { useState } from "react";
import { exportApplicationsCSV } from "@/lib/actions/export";
import { Button } from "@/components/ui/Button";
import { showToast } from "@/components/ui/Toaster";

export function ExportButton() {
  const [loading, setLoading] = useState(false);

  async function handleExport() {
    setLoading(true);
    const result = await exportApplicationsCSV();
    setLoading(false);

    if (!result.success || !result.data) {
      showToast(result.error ?? "Gagal mengekspor data.", "error");
      return;
    }

    // Trigger browser download
    const blob = new Blob(["\uFEFF" + result.data], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = result.filename ?? "lamaran.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showToast("Data berhasil diekspor ke CSV", "success");
  }

  return (
    <Button
      variant="secondary"
      size="sm"
      isLoading={loading}
      onClick={handleExport}
      title="Export semua lamaran ke CSV"
    >
      <svg
        className="w-4 h-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
        />
      </svg>
      Export CSV
    </Button>
  );
}
