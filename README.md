<div align="center">

# 🗂️ JobTrail

**Aplikasi web untuk melacak lamaran kerja secara terstruktur**

[![CI](https://github.com/gryvnalvrdo/job_tracker/actions/workflows/ci.yml/badge.svg)](https://github.com/gryvnalvrdo/job_tracker/actions/workflows/ci.yml)
![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-Strict-blue?logo=typescript)
![Prisma](https://img.shields.io/badge/Prisma-7.x-2D3748?logo=prisma)
![Tailwind](https://img.shields.io/badge/Tailwind-v4-38BDF8?logo=tailwindcss)
![License](https://img.shields.io/badge/license-MIT-green)

[Demo](#) · [Fitur](#-fitur) · [Tech Stack](#-tech-stack) · [Setup](#-setup-lokal) · [Deploy](#-deploy-ke-vercel)

![JobTrail Screenshot](./public/preview.png)

</div>

---

## ✨ Fitur

### Fase 1 — Fondasi
- 🔐 **Autentikasi** — Register & login dengan email/password (NextAuth.js v5 + bcrypt)
- 🛡️ **Protected routes** — Middleware JWT Edge-safe untuk semua halaman dashboard
- 🎨 **Dark / Light mode** — Toggle tema, tersimpan di `localStorage`

### Fase 2 — Fitur Inti
- 📋 **CRUD Lamaran** — Tambah, lihat, edit, hapus lamaran kerja
- 🔄 **Status Flow** — `Applied → Screening → Interview → Offer → Rejected`
- 📜 **Timeline Riwayat** — Setiap perubahan status tercatat dengan timestamp & catatan
- 🔍 **Filter & Search** — Filter by status, search by nama perusahaan / posisi
- 📄 **Pagination** — 10 lamaran per halaman

### Fase 3 — Nilai Tambah
- 📊 **Dashboard Statistik** — Bar chart lamaran/bulan, donut chart distribusi status
- 📈 **Response Rate** — Persentase lamaran yang lanjut ke interview
- ⏰ **Follow-up Reminder** — Badge otomatis jika ≥7 hari tanpa update
- 📥 **Export CSV** — Download semua data lamaran (Excel-compatible, dengan BOM)

### Fase 4 — Polish
- 💀 **Skeleton Loading** — Di semua halaman yang fetch data
- 📭 **Empty State** — Pesan informatif ketika tidak ada data
- 🔔 **Toast Notification** — Feedback success/error untuk semua aksi
- 🗑️ **Delete Confirmation** — 2-step confirm untuk mencegah hapus tidak sengaja
- 🧪 **Unit Tests** — 30 test (Vitest) untuk utils, date functions, dan semua Zod schemas

---

## 🛠️ Tech Stack

| Layer | Teknologi |
|-------|-----------|
| **Framework** | Next.js 15 (App Router) |
| **Language** | TypeScript (strict mode) |
| **Styling** | Tailwind CSS v4 |
| **Database** | PostgreSQL (Neon — serverless, Singapore region) |
| **ORM** | Prisma 7.x + `@prisma/adapter-neon` |
| **Auth** | NextAuth.js v5 (credentials provider, JWT session) |
| **Validation** | Zod v3 |
| **Forms** | React Hook Form + `@hookform/resolvers` |
| **Charts** | Recharts |
| **Testing** | Vitest |
| **CI/CD** | GitHub Actions → Vercel |

---

## 📁 Struktur Folder

```
/app
  /(auth)
    /login          ← Halaman login
    /register       ← Halaman register
  /(dashboard)
    /dashboard      ← Statistik & charts
    /applications
      /new          ← Form tambah lamaran
      /[id]         ← Detail + timeline
      /[id]/edit    ← Edit lamaran
  /api/auth         ← NextAuth route handler
/components
  /ui               ← Button, Input, Card, Skeleton, Toaster, ThemeProvider
  /features         ← ApplicationForm, StatusBadge, StatusTimeline, ExportButton, dll
  /layout           ← Sidebar, Navbar
/lib
  /actions          ← Server Actions (CRUD, auth, export)
  /validations      ← Zod schemas
  /prisma.ts        ← Prisma Client singleton (Neon adapter)
  /utils.ts         ← Helper functions
  /constants.ts     ← Status config, nav links
/prisma
  schema.prisma
  migrations/
/tests              ← Vitest unit tests
```

---

## 🗄️ Database Schema

```prisma
model User {
  id           String        @id @default(cuid())
  email        String        @unique
  name         String?
  password     String?
  createdAt    DateTime      @default(now())
  applications Application[]
}

model Application {
  id            String            @id @default(cuid())
  userId        String
  companyName   String
  position      String
  jobUrl        String?
  salaryMin     Int?
  salaryMax     Int?
  status        ApplicationStatus @default(APPLIED)
  appliedDate   DateTime
  notes         String?
  createdAt     DateTime          @default(now())
  updatedAt     DateTime          @updatedAt
  statusHistory StatusHistory[]
}

model StatusHistory {
  id            String            @id @default(cuid())
  applicationId String
  status        ApplicationStatus
  changedAt     DateTime          @default(now())
  note          String?
}

enum ApplicationStatus {
  APPLIED | SCREENING | INTERVIEW | OFFER | REJECTED
}
```

---

## 🚀 Setup Lokal

### Prerequisites
- Node.js 18+
- npm
- Akun [Neon](https://neon.tech) (free tier)

### 1. Clone & Install

```bash
git clone https://github.com/gryvnalvrdo/job_tracker.git
cd job_tracker
npm install --legacy-peer-deps
```

### 2. Environment Variables

Buat file `.env` di root:

```env
DATABASE_URL="postgresql://..."      # pooled connection string dari Neon
DIRECT_URL="postgresql://..."        # direct/unpooled connection string dari Neon

AUTH_SECRET="your-secret-here"       # generate: npx auth secret
NEXTAUTH_URL="http://localhost:3000"
```

> **Generate AUTH_SECRET:** `npx auth secret` lalu copy hasilnya ke `.env`

### 3. Setup Database

```bash
# Jalankan migration (buat tabel)
npx prisma migrate dev --name init

# Generate Prisma Client
npx prisma generate
```

### 4. Run

```bash
npm run dev
```

Buka **http://localhost:3000** → Register akun → mulai tracking lamaran! 🎉

---

## 📋 Scripts

```bash
npm run dev          # Development server (Turbopack)
npm run build        # Production build
npm run start        # Start production server
npm run lint         # ESLint
npm test             # Unit tests (Vitest)
npm run test:watch   # Tests in watch mode
npm run test:coverage # Tests dengan coverage report
```

---

## 🌐 Deploy ke Vercel

### Cara Cepat (via GitHub)

1. Push repo ke GitHub (sudah ✅)
2. Buka [vercel.com](https://vercel.com) → **Add New Project**
3. Import repo `gryvnalvrdo/job_tracker`
4. Vercel auto-detect Next.js → klik **Deploy**
5. Setelah deploy pertama, tambahkan **Environment Variables** di `Settings`:

| Key | Value |
|-----|-------|
| `DATABASE_URL` | Pooled connection string Neon |
| `DIRECT_URL` | Direct connection string Neon |
| `AUTH_SECRET` | Secret key untuk NextAuth |
| `NEXTAUTH_URL` | URL production (misal `https://jobtrail.vercel.app`) |

6. **Redeploy** → selesai, app bisa diakses publik!

> Setelah ini, setiap `git push` ke `main` akan auto-deploy via GitHub Actions + Vercel.

---

## 🧪 Testing

```bash
npm test
```

```
✓ tests/validations.test.ts (15 tests)
✓ tests/utils.test.ts      (15 tests)

Test Files  2 passed (2)
     Tests  30 passed (30)
  Duration  ~500ms
```

Coverage meliputi:
- `formatDate`, `formatSalary`, `getDaysAgo`, `needsFollowUp`, `formatMonthYear`
- `loginSchema`, `registerSchema`, `applicationSchema`

---

## 🤝 Kontribusi

Pull request welcome! Untuk perubahan besar, buka issue dulu.

Commit message format: `type: deskripsi singkat`  
Contoh: `feat: add CSV export`, `fix: date validation on apply form`

---

## 📝 License

MIT © [gryvnalvrdo](https://github.com/gryvnalvrdo)
