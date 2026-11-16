# Product Requirements Document (PRD)
## JobTrail: Full-Stack Job Application CRM, Kanban & Analytics SaaS

**Nama Produk**: JobTrail (`jobtracker-kjmw.vercel.app`)  
**Kategori Produk**: Full-Stack B2C Productivity SaaS & Career Pipeline CRM  
**Bagian dari Ekosistem**: Tahap 02 pada *Job Hunting Suite* (terhubung dengan **01: AutoApply Flow** dan **03: CoverCraft AI**)

---

## 1. Gambaran Umum & Tujuan Produk

**JobTrail** adalah aplikasi web SaaS full-stack yang dirancang untuk menggantikan pencatatan lamaran kerja manual di spreadsheet dengan sistem CRM terstruktur. Aplikasi ini mengelola seluruh siklus hidup lamaran kerja (`SAVED`, `APPLIED`, `SCREENING`, `INTERVIEW`, `OFFER`, `REJECTED`), menyajikan analitik konversi secara visual, mendeteksi lamaran yang membutuhkan *follow-up*, serta terintegrasi langsung dengan agen otomasi pencari loker (**AutoApply Flow**) dan generator surat lamaran AI (**CoverCraft**).

---

## 2. Spesifikasi Arsitektur Teknis

### 2.1 Tech Stack Utama
- **Framework**: Next.js 15 (App Router, Server Components, Server Actions, Route Handlers) & React 19.
- **Bahasa & Validasi**: TypeScript 5, React Hook Form, dan Zod.
- **Database & ORM**: PostgreSQL Serverless (Neon) dengan Prisma 7 ORM (`@prisma/client` & `@prisma/adapter-neon`).
- **Autentikasi**: NextAuth v5 (`bcryptjs` credential hashing + fitur *One-Click Demo Auto-Login* pada rute `/demo`).
- **Visualisasi & Styling**: Tailwind CSS v4 (`@theme` tokens dengan dukungan Dark/Light mode) dan Recharts (`StatusChart` & `MonthlyChart`).
- **Testing**: Vitest dengan `@vitest/coverage-v8`.

### 2.2 Skema Basis Data Relasional (`prisma/schema.prisma`)
1. **`User`**: Menyimpan kredensial akun (`id`, `email`, `name`, `password`, `createdAt`) dan relasi `1:N` ke `Application`.
2. **`Application`**: Menyimpan data inti lamaran (`companyName`, `position`, `jobUrl`, `salaryMin`, `salaryMax`, `coverLetter`, `status`, `appliedDate`, `notes`, `createdAt`, `updatedAt`).
3. **`StatusHistory`**: Menyimpan audit log setiap perpindahan status lamaran (`applicationId`, `status`, `changedAt`, `note`) untuk dirender pada komponen `StatusTimeline`.
4. **`ProcessedJob`**: Tabel deduplikasi berindeks (`@@index([companyName, position])`, `@@index([jobUrl])`) yang memastikan agen n8n tidak pernah memasukkan lowongan yang sama dua kali.

---

## 3. Fitur Utama & Kontrak Integrasi

1. **Analytics Dashboard (`/dashboard`)**:
   - Menampilkan 4 kartu metrik utama (`Total Applications`, `Interview`, `Offer`, `Rejected`).
   - Grafik konversi `Application Funnel` (`StatusChart`) dan tren `Monthly Activity` (`MonthlyChart`).
   - Panel peringatan otomatis `Needs Follow-up` untuk lamaran aktif yang belum diperbarui lebih dari batas hari tindak lanjut.
2. **Dual-View Application Manager (`/applications`)**:
   - Pencarian instan berdasarkan nama perusahaan/posisi dan penyaringan status.
   - **List View** dengan paginasi server-side dan **Kanban Board View** per kolom status.
   - Fitur **CSV Export** (`ExportButton`) untuk mengunduh seluruh data lamaran.
3. **Application Detail & CoverCraft Deep-Link (`/applications/[id]`)**:
   - Menampilkan informasi lengkap lowongan, rentang gaji, catatan, `Saved Cover Letter`, dan `StatusTimeline`.
   - Tombol `Generate Cover Letter` yang membuka CoverCraft dengan parameter `?job=&company=&url=&id=` terisi otomatis, serta endpoint `POST /api/public/applications/[id]/cover-letter` untuk menyimpan surat kembali ke database.
4. **Automated Webhook Ingestion & Public Live Board (`/api/auto-apply` & `/public/live`)**:
   - Menerima lowongan baru dari workflow n8n setiap 6 jam melalui header autentikasi `x-autoapply-secret`.
   - Menyediakan halaman `/public/live` (Read-Only Live Agent Activity) dan `GET /api/public/jobs` untuk telemetri real-time di portofolio.

---

## 4. Standar UI/UX & Kualitas

- **Zero AI Slop & Clean Copy**: Seluruh label UI bebas dari tanda hubung AI (*em-dash* / *en-dash*) dan bebas emoji dekoratif pada tombol kontrol.
- **Konsistensi Tema Indigo/Violet (`#6366f1`)**: Warna aksen dan status badge konsisten di seluruh kartu, grafik, dan tabel, baik pada mode gelap (`#0f1117`) maupun mode terang (`#f8fafc`).
- **Responsivitas Mobile**: Layout dashboard, filter bar, dan daftar lamaran beradaptasi penuh pada layar smartphone tanpa horizontal overflow yang merusak tata letak.
