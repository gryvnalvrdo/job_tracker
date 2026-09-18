"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteApplication } from "@/lib/actions/applications";
import { Button } from "@/components/ui/Button";
import { showToast } from "@/components/ui/Toaster";

interface DeleteApplicationButtonProps {
  id: string;
}

export function DeleteApplicationButton({ id }: DeleteApplicationButtonProps) {
  const [confirming, setConfirming] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleDelete() {
    setLoading(true);
    const result = await deleteApplication(id);
    setLoading(false);

    if (!result.success) {
      showToast(result.error, "error");
      setConfirming(false);
      return;
    }

    showToast("Lamaran berhasil dihapus", "success");
    router.push("/applications");
  }

  if (confirming) {
    return (
      <div className="flex gap-2 items-center">
        <span className="text-xs text-[#f87171]">Yakin hapus?</span>
        <Button
          variant="danger"
          size="sm"
          isLoading={loading}
          onClick={handleDelete}
        >
          Ya, Hapus
        </Button>
        <Button variant="ghost" size="sm" onClick={() => setConfirming(false)}>
          Batal
        </Button>
      </div>
    );
  }

  return (
    <Button variant="danger" size="sm" onClick={() => setConfirming(true)}>
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
      </svg>
      Hapus
    </Button>
  );
}
