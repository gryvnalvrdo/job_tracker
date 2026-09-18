"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { applicationSchema, ApplicationInput } from "@/lib/validations/application";
import { createApplication, updateApplication } from "@/lib/actions/applications";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { showToast } from "@/components/ui/Toaster";
import { formatDateInput } from "@/lib/utils";
import type { Application } from "@/generated/prisma/client";

interface ApplicationFormProps {
  application?: Application;
}

export function ApplicationForm({ application }: ApplicationFormProps) {
  const router = useRouter();
  const isEditing = !!application;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ApplicationInput>({
    resolver: zodResolver(applicationSchema),
    defaultValues: application
      ? {
          companyName: application.companyName,
          position: application.position,
          jobUrl: application.jobUrl ?? "",
          appliedDate: formatDateInput(application.appliedDate),
          salaryMin: application.salaryMin ?? undefined,
          salaryMax: application.salaryMax ?? undefined,
          notes: application.notes ?? "",
        }
      : {
          appliedDate: formatDateInput(new Date()),
        },
  });

  async function onSubmit(data: ApplicationInput) {
    let result;
    if (isEditing) {
      result = await updateApplication(application.id, data);
    } else {
      result = await createApplication(data);
    }

    if (!result.success) {
      showToast(result.error, "error");
      return;
    }

    showToast(
      isEditing ? "Lamaran berhasil diperbarui" : "Lamaran berhasil ditambahkan",
      "success"
    );

    if (!isEditing && result.data) {
      router.push(`/applications/${result.data.id}`);
    } else {
      router.push(`/applications/${application!.id}`);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Input
          label="Nama Perusahaan"
          placeholder="Google, Tokopedia, dll"
          error={errors.companyName?.message}
          required
          {...register("companyName")}
        />
        <Input
          label="Posisi"
          placeholder="Software Engineer, Product Manager, dll"
          error={errors.position?.message}
          required
          {...register("position")}
        />
      </div>

      <Input
        label="Link Job Posting"
        type="url"
        placeholder="https://..."
        error={errors.jobUrl?.message}
        hint="Opsional — URL dari job posting asli"
        {...register("jobUrl")}
      />

      <Input
        label="Tanggal Apply"
        type="date"
        error={errors.appliedDate?.message}
        required
        {...register("appliedDate")}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Input
          label="Gaji Minimum (IDR)"
          type="number"
          placeholder="5000000"
          hint="Opsional"
          error={errors.salaryMin?.message}
          {...register("salaryMin", { valueAsNumber: true })}
        />
        <Input
          label="Gaji Maximum (IDR)"
          type="number"
          placeholder="8000000"
          hint="Opsional"
          error={errors.salaryMax?.message}
          {...register("salaryMax", { valueAsNumber: true })}
        />
      </div>

      <Textarea
        label="Catatan"
        placeholder="Catatan tentang lamaran ini, hasil interview, dll..."
        hint="Opsional — maksimal 2000 karakter"
        error={errors.notes?.message}
        rows={4}
        {...register("notes")}
      />

      <div className="flex gap-3 pt-2">
        <Button
          type="button"
          variant="secondary"
          size="lg"
          onClick={() => router.back()}
        >
          Batal
        </Button>
        <Button type="submit" size="lg" isLoading={isSubmitting} className="flex-1">
          {isEditing ? "Simpan Perubahan" : "Tambah Lamaran"}
        </Button>
      </div>
    </form>
  );
}
