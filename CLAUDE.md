# CLAUDE.md

Dokumen ini adalah panduan utama untuk Claude Code (atau agentic AI lain) saat mengerjakan project ini. Baca seluruh dokumen ini sebelum menulis kode apa pun.

## 1. Project Overview

**Nama:** JobTrail — Job Application Tracker
**Tujuan:** Aplikasi web untuk melacak lamaran kerja secara terstruktur: status lamaran, timeline, statistik, dan reminder follow-up. Dibuat sebagai portofolio untuk melamar posisi web developer, jadi kualitas kode, arsitektur, dan UX harus terlihat production-ready, bukan sekadar tutorial project.

**Target user:** Job seeker yang melamar ke banyak perusahaan dan butuh cara terorganisir untuk tracking, bukan pakai spreadsheet manual.

## 2. Tech Stack (WAJIB diikuti, jangan diganti tanpa alasan kuat)

- **Framework:** Next.js 15 (App Router, bukan Pages Router)
- **Language:** TypeScript (strict mode, no `any` kecuali benar-benar tidak bisa dihindari)
- **Styling:** Tailwind CSS
- **Database:** PostgreSQL (hosted di Neon, region Singapore)
- **ORM:** Prisma **7.x** (bukan versi 6 ke bawah — arsitekturnya beda, lihat bagian 5)
- **Auth:** NextAuth.js (Auth.js) dengan credentials provider + Google OAuth
- **Validation:** Zod (untuk semua form input dan API request body)
- **Charts:** Recharts (untuk dashboard statistik)
- **Deployment target:** Vercel (frontend + serverless functions) + database di Neon/Supabase (tier gratis PostgreSQL)
- **Testing:** Vitest untuk unit test fungsi-fungsi penting (bukan cuma UI)
- **Package manager:** pnpm

Jangan menambahkan library lain tanpa menyebutkan alasannya di komentar kode atau commit message.

## 3. Core Features (urutan pengerjaan sesuai prioritas)

### Fase 1 — Fondasi (kerjakan dulu, jangan skip)
1. Setup project Next.js + TypeScript + Tailwind + Prisma
2. Schema database (lihat bagian 4)
3. Auth: register, login, logout, protected routes
4. Layout dasar: navbar, sidebar, responsive shell

### Fase 2 — Fitur Inti
5. CRUD lamaran kerja (Create, Read, Update, Delete)
   - Field: nama perusahaan, posisi, tanggal apply, status, link job posting, catatan, salary range (opsional)
6. Status lamaran dengan flow yang jelas:
   `Applied → Screening → Interview → Offer → Rejected` (juga harus bisa langsung `Rejected` dari status manapun)
7. List/table view dengan filter (by status, by tanggal) dan search (by nama perusahaan/posisi)
8. Detail view per lamaran + timeline histori perubahan status

### Fase 3 — Fitur yang Menambah Nilai Portofolio
9. Dashboard dengan visualisasi:
   - Jumlah lamaran per bulan (bar chart)
   - Distribusi status (pie/donut chart)
   - Response rate (persentase yang lanjut ke interview dari total apply)
10. Reminder/notifikasi follow-up (misal: sudah 7 hari belum ada update → tampilkan badge "perlu follow-up")
11. Export data ke CSV/PDF
12. Dark mode (toggle, tersimpan di preference user)

### Fase 4 — Polish (jangan diskip, ini yang bikin "dinotice")
13. Loading skeleton di semua halaman yang fetch data
14. Empty state yang informatif (bukan cuma "no data")
15. Error handling yang graceful (toast notification, bukan alert() atau crash)
16. Optimistic UI update untuk aksi cepat (update status, delete)
17. Unit test untuk: fungsi kalkulasi statistik, validasi form, utility date functions

## 4. Database Schema (Prisma)

Gunakan struktur ini sebagai baseline, boleh disesuaikan tapi jangan hilangkan relasi utama:

```prisma
model User {
  id            String    @id @default(cuid())
  email         String    @unique
  name          String?
  password      String?   // null jika login via OAuth
  createdAt     DateTime  @default(now())
  applications  Application[]
}

model Application {
  id            String    @id @default(cuid())
  userId        String
  user          User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  companyName   String
  position      String
  jobUrl        String?
  salaryMin     Int?
  salaryMax     Int?
  status        ApplicationStatus @default(APPLIED)
  appliedDate   DateTime
  notes         String?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  statusHistory StatusHistory[]
}

model StatusHistory {
  id              String    @id @default(cuid())
  applicationId   String
  application     Application @relation(fields: [applicationId], references: [id], onDelete: Cascade)
  status          ApplicationStatus
  changedAt       DateTime  @default(now())
  note            String?
}

enum ApplicationStatus {
  APPLIED
  SCREENING
  INTERVIEW
  OFFER
  REJECTED
}
```

Setiap kali status lamaran berubah, buat entry baru di `StatusHistory` — jangan overwrite. Ini penting untuk fitur timeline.

## 5. Database Setup — Prisma 7 + Neon (SUDAH SELESAI, Jangan Diulang oleh AI)

Database hosting menggunakan **Neon** (serverless PostgreSQL, free tier, region AWS Asia Pacific/Singapore). Prisma yang dipakai adalah **versi 7**, yang arsitekturnya BEDA JAUH dari versi 6 ke bawah — jangan pakai pola lama (`directUrl` di schema.prisma, `prisma-client-js`, dll).

**Yang sudah dikerjakan (AI tidak perlu mengulang):**

1. Project Neon dibuat (`job_tracker`), CLI `neonctl` di-install dan `neon link` sudah dijalankan — ini otomatis membuat `.env.local` berisi `DATABASE_URL` (pooled) dan `DATABASE_URL_UNPOOLED`.
2. File `.env` diisi manual:
   ```
   DATABASE_URL="<pooled connection string, dari .env.local>"
   DIRECT_URL="<unpooled/direct connection string, dari .env.local>"
   ```
3. `prisma/schema.prisma` — **TANPA `url` sama sekali di datasource** (koneksi dipindah ke `prisma7.config.ts`):
   ```prisma
   generator client {
     provider = "prisma-client"
     output   = "../generated/prisma"
   }

   datasource db {
     provider = "postgresql"
   }
   ```
4. `prisma7.config.ts` — **PENTING:** di Prisma 7, field `directUrl` SUDAH DIHAPUS. Field `url` di config ini yang dipakai CLI untuk migration, jadi harus diisi **DIRECT_URL** (bukan pooled):
   ```ts
   import "dotenv/config";
   import { defineConfig, env } from "prisma/config";

   export default defineConfig({
     schema: "prisma/schema.prisma",
     migrations: { path: "prisma/migrations" },
     datasource: {
       url: env("DIRECT_URL"),
     },
   });
   ```
5. Driver adapter terinstal: `@prisma/adapter-neon` + `@neondatabase/serverless`
6. `lib/prisma.ts` — ini yang dipakai di runtime aplikasi (Server Actions, dll), pakai **DATABASE_URL (pooled)**, terpisah dari config di atas:
   ```ts
   import { PrismaClient } from "../generated/prisma/client";
   import { PrismaNeon } from "@prisma/adapter-neon";

   const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL! });

   export const prisma = new PrismaClient({ adapter });
   ```
7. `@types/node` terinstal (dibutuhkan supaya `process.env` dikenali TypeScript)
8. Migration pertama sudah dijalankan (`npx prisma migrate dev --name init`), tabel `User`, `Application`, `StatusHistory` sudah ada di database.

**Instruksi untuk AI:**
- Selalu import Prisma Client dari `lib/prisma.ts` (yang sudah pakai adapter), JANGAN pernah instantiate `new PrismaClient()` langsung tanpa adapter di file lain — di Prisma 7 itu akan error karena driver adapter wajib.
- Kalau perlu ubah model di `schema.prisma`, jalankan `npx prisma migrate dev --name <deskripsi_singkat>`, lalu `npx prisma generate` kalau tidak otomatis.
- Jangan sarankan `npm i --save-dev prisma@latest` ke versi 8.x (masih release candidate/beta) — tetap di Prisma 7.x stabil.
- Jangan tambahkan `directUrl` di `prisma7.config.ts` — field itu sudah tidak ada di v7 dan akan diabaikan diam-diam (pernah jadi bug tersembunyi saat setup).

## 6. Struktur Folder

```
/app
  /(auth)
    /login
    /register
  /(dashboard)
    /applications
      /[id]
      /new
    /dashboard
  /api
    /applications
    /auth
/components
  /ui          <- komponen generic (Button, Input, Card, dll)
  /features    <- komponen spesifik fitur (ApplicationCard, StatusBadge, dll)
/lib
  /db.ts       <- Prisma client instance
  /validations <- Zod schemas
  /utils.ts
/prisma
  schema.prisma
/tests
```

## 7. Coding Conventions

- **Komponen:** Selalu functional component dengan TypeScript interface untuk props, jangan pakai `React.FC`
- **Naming:** PascalCase untuk komponen, camelCase untuk fungsi/variabel, kebab-case untuk file non-komponen
- **Server vs Client Component:** Default ke Server Component. Tambahkan `"use client"` HANYA kalau butuh interaktivitas (state, event handler, hooks browser)
- **Data fetching:** Gunakan Server Actions untuk mutasi (create/update/delete), bukan API routes kecuali dibutuhkan untuk hal lain (misal webhook)
- **Error handling:** Selalu wrap operasi database dengan try-catch, return error message yang jelas ke UI
- **Form:** Gunakan `react-hook-form` + Zod resolver untuk semua form
- **Comment:** Beri komentar untuk logic yang tidak straightforward (misal kalkulasi statistik), skip komentar untuk kode yang self-explanatory
- **Commit message:** Format `type: deskripsi singkat` (contoh: `feat: add application status timeline`, `fix: date validation on apply form`)

## 8. Hal yang HARUS Dihindari

- Jangan hardcode data dummy di komponen — selalu dari database
- Jangan pakai `localStorage` untuk data yang harus persist di server (auth token boleh, tapi data aplikasi tidak)
- Jangan skip loading/error state dengan alasan "biar cepat" — ini justru poin utama portofolio
- Jangan bikin semua jadi Client Component demi kemudahan
- Jangan lupa validasi input di server side meskipun sudah divalidasi di client side

## 9. Definition of Done (per fitur)

Sebuah fitur baru dianggap selesai kalau:
- [ ] Berfungsi sesuai spesifikasi di atas
- [ ] Responsive (mobile, tablet, desktop)
- [ ] Ada loading state saat fetch data
- [ ] Ada error handling yang user-friendly
- [ ] Ada empty state jika relevan
- [ ] TypeScript tidak ada error/warning
- [ ] Kalau ada logic penting, ada unit test-nya

## 10. Deployment Checklist

- Environment variables (`DATABASE_URL`, `NEXTAUTH_SECRET`, dll) diatur di Vercel dashboard, jangan pernah commit `.env`
- Jalankan `prisma migrate deploy` sebelum build di production
- Setup GitHub Actions untuk run test otomatis sebelum merge ke `main`

## 11. Catatan untuk Agentic AI

- Kerjakan fitur satu per satu sesuai urutan fase di bagian 3, jangan loncat-loncat
- Setelah selesai satu fitur, jalankan `pnpm build` untuk memastikan tidak ada error sebelum lanjut ke fitur berikutnya
- Kalau ada keputusan arsitektur yang ambigu, pilih pendekatan yang paling standar/konvensional di ekosistem Next.js, bukan yang paling "kreatif"
- Prioritaskan kualitas kode yang bisa dijelaskan saat interview, bukan cuma yang "jalan"
