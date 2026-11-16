# SaaS CRM & Analytics UI/UX Engineering Skill (`skills.md`)

> **Target Application**: **JobTrail** (`jobtracker-kjmw.vercel.app`)  
> **Product Domain**: Full-Stack B2C Productivity SaaS, Job Application CRM, Kanban Pipeline & Funnel Analytics Dashboard.  
> **Tech Stack**: Next.js 15 (App Router, Server Components, Server Actions), React 19, TypeScript, Prisma 7 ORM (`@prisma/adapter-neon`), Neon Serverless PostgreSQL, NextAuth v5, Tailwind CSS v4, Recharts, React Hook Form + Zod, Vitest.

---

## 1. Domain Identity & Visual Theme (SaaS CRM Standard)

Berbeda dengan web portofolio personal atau web e-commerce perhotelan, **JobTrail** adalah aplikasi **SaaS Productivity & Analytics Dashboard** yang digunakan berulang kali untuk mengelola puluhan hingga ratusan lamaran kerja. Oleh karena itu, standar UI/UX-nya wajib berfokus pada **kepadatan informasi (data density), kejelasan status, kecepatan mutasi data, dan keterbacaan grafik**:

### 1.1 Sistem Warna & Tema Asli JobTrail
- **Dark Surface Hierarchy**:
  - Background utama: `#0f1117`
  - Card & Sidebar Surface: `#1a1d27`
  - Elevated / Hover Surface: `#22263a`
  - Border struktural: `#2e3348` (hover `#3d4465`)
- **Light Mode Override (`[data-theme="light"]`)**:
  - Background `#f8fafc`, Surface `#ffffff`, Surface-2 `#f1f5f9`, Border `#e2e8f0`, Text `#0f172a`.
- **Primary Brand Accent**:
  - **Indigo (`#6366f1`)** & **Violet (`#8b5cf6`)** untuk aksi utama, *active state* navigasi sidebar, dan integrasi ekosistem CoverCraft.
- **Semantic Pipeline Status Tokens (Wajib Konsisten di Badge, Kanban, dan Recharts)**:
  - `SAVED`: Slate/Amber (`#f59e0b`)
  - `APPLIED`: Indigo (`#6366f1`)
  - `SCREENING`: Violet (`#8b5cf6`)
  - `INTERVIEW`: Amber (`#f59e0b`)
  - `OFFER`: Emerald (`#10b981`)
  - `REJECTED`: Rose/Red (`#ef4444`)

---

## 2. Aturan Anti-AI-Slop & Gaya Bahasa SaaS

1. **Bebas Tanda Hubung AI (*Em-Dash* / *En-Dash*) & Simbol Aneh**:
   - Dilarang menggunakan tanda hubung panjang (`—` atau `–`), garis miring ganda (`//`), atau titik tengah berlebihan (`·`) pada judul halaman, label tabel, maupun pesan status.
   - Gunakan tanda baca standar (titik dua, koma, atau tanda kurung) dan komponen ikon SVG untuk pemisah atau navigasi.
2. **Bebas Emoji Dekoratif di Kontrol Aplikasi**:
   - Tombol fitur seperti `Generate Cover Letter`, `Add Application`, `Export CSV`, atau filter status tidak boleh diawali emoji seperti `✨`, `🚀`, atau `📋`. Gunakan ikon SVG Heroicons/Lucide (`strokeWidth={1.5}` atau `2`).
3. **Zero Redundancy pada Dashboard & Detail View**:
   - Jangan menampilkan tombol aksi atau informasi meta yang sama berulang kali dalam satu layar.
   - Pada halaman `/dashboard`, fokuskan pada 4 metrik ringkas (`Total`, `Interview`, `Offer`, `Rejected`), 2 grafik analitik (`StatusChart` & `MonthlyChart`), peringatan *Needs Follow-up*, dan daftar ringkas lamaran terbaru.
   - Pada halaman `/applications`, sediakan satu bar kontrol terpadu (Search, Status Filter, View Toggle `List | Board`, `Export CSV`, dan `Add Application`).

---

## 3. Arsitektur Data, Integrasi & Keahlian Spesifik JobTrail

Setiap pengembangan fitur pada repositori ini wajib menjaga keutuhan arsitektur berikut:

1. **Database & Transaksi Idempoten (Prisma 7 + Neon PostgreSQL)**:
   - Setiap perubahan status lamaran wajib mencatat entri baru pada tabel `StatusHistory` secara atomik.
   - Endpoint webhook ingesti otomatis (`POST /api/auto-apply`) wajib memvalidasi header `x-autoapply-secret` dan menggunakan `prisma.$transaction` untuk menyimpan ke `Application` sekaligus `ProcessedJob` guna mencegah duplikasi lowongan dari n8n.
2. **Integrasi Dua Arah dengan Ekosistem (AutoApply Flow & CoverCraft)**:
   - **Inbound dari AutoApply Flow**: Menerima payload `{ companyName, position, jobUrl, source }` di `/api/auto-apply` dan menampilkannya secara real-time di `/public/live` serta `/api/public/jobs`.
   - **Outbound & Sync dengan CoverCraft**: Halaman detail lamaran (`/applications/[id]`) menyediakan tombol `Generate Cover Letter` yang mengirim parameter `?job=&company=&url=&id=` ke CoverCraft dan menerima penyimpanan surat kembali melalui `POST /api/public/applications/[id]/cover-letter`.
3. **Mobile-First SaaS Ergonomics**:
   - Tabel dan daftar lamaran harus otomatis beradaptasi menjadi kartu ringkas yang mudah dipindai pada layar mobile (`< 640px`), sementara Kanban Board mendukung *horizontal scroll* per kolom status yang mulus.
   - Semua tombol aksi dan *view toggle* wajib memiliki tinggi sentuh minimal `38px` s/d `44px`.
