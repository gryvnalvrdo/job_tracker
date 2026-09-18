import { z } from "zod";

export const applicationSchema = z.object({
  companyName: z.string().min(1, "Nama perusahaan wajib diisi").max(100),
  position: z.string().min(1, "Posisi wajib diisi").max(100),
  jobUrl: z.string().url("URL tidak valid").optional().or(z.literal("")),
  appliedDate: z.string().min(1, "Tanggal apply wajib diisi"),
  salaryMin: z
    .number({ invalid_type_error: "Harus berupa angka" })
    .positive("Harus positif")
    .optional()
    .nullable(),
  salaryMax: z
    .number({ invalid_type_error: "Harus berupa angka" })
    .positive("Harus positif")
    .optional()
    .nullable(),
  notes: z.string().max(2000).optional().or(z.literal("")),
});

export const updateStatusSchema = z.object({
  applicationId: z.string().cuid(),
  status: z.enum(["APPLIED", "SCREENING", "INTERVIEW", "OFFER", "REJECTED"]),
  note: z.string().max(500).optional(),
});

export type ApplicationInput = z.infer<typeof applicationSchema>;
export type UpdateStatusInput = z.infer<typeof updateStatusSchema>;
