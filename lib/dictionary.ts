export const dictionary = {
  en: {
    sidebar: {
      dashboard: "Dashboard",
      applications: "Applications",
      signOut: "Sign Out"
    },
    dashboard: {
      title: "Dashboard",
      subtitle: "Overview of your application progress",
      stats: {
        total: "Total Applications",
        totalSub: "All time",
        applied: "Applied",
        appliedSub: "Sent applications",
        interview: "Interview",
        interviewSub: "Active process",
        offer: "Offer",
        offerSub: "Accepted",
        rejected: "Rejected",
        rejectedSub: "Declined"
      },
      charts: {
        funnelTitle: "Application Funnel",
        funnelSub: "Conversion rate",
        monthlyTitle: "Monthly Activity",
        monthlySub: "Last 6 months"
      },
      followUp: {
        title: "Needs Follow-up",
        viewAll: "View All"
      },
      recent: {
        title: "Recent Applications",
        viewAll: "View All",
        empty: "No applications yet",
        newBtn: "Add New"
      }
    },
    applications: {
      title: "Applications",
      subtitle: "Manage your job hunting progress",
      newBtn: "+ Add Application",
      searchPh: "Search company or position...",
      statusFilter: "Status",
      all: "All",
      sortNewest: "Newest first",
      sortOldest: "Oldest first",
      emptyTitle: "No applications found",
      emptySub: "You haven't added any applications that match the criteria.",
      edit: "Edit",
      delete: "Delete",
      generateCoverLetter: "✨ Generate Cover Letter",
      detail: {
        title: "Application Detail",
        back: "All Applications",
        jobPosting: "Job Posting",
        salary: "Salary",
        created: "Created",
        updated: "Updated",
        notes: "Notes",
        history: "History",
        noNotes: "No notes.",
        updateStatus: "Update Status",
        currentStatus: "CURRENT STATUS",
        optionalNote: "NOTE (OPTIONAL)",
        notePh: "Add a note about this update...",
        needsFollowUp: "Needs Follow-up",
        daysAgo: "days ago",
        today: "Today"
      }
    }
  },
  id: {
    sidebar: {
      dashboard: "Dasbor",
      applications: "Lamaran",
      signOut: "Keluar"
    },
    dashboard: {
      title: "Dasbor",
      subtitle: "Gambaran umum progres lamaran Anda",
      stats: {
        total: "Total Lamaran",
        totalSub: "Semua waktu",
        applied: "Dilamar",
        appliedSub: "Lamaran terkirim",
        interview: "Wawancara",
        interviewSub: "Proses aktif",
        offer: "Penawaran",
        offerSub: "Diterima",
        rejected: "Ditolak",
        rejectedSub: "Ditolak"
      },
      charts: {
        funnelTitle: "Funnel Lamaran",
        funnelSub: "Tingkat konversi",
        monthlyTitle: "Aktivitas Bulanan",
        monthlySub: "6 bulan terakhir"
      },
      followUp: {
        title: "Perlu Follow-up",
        viewAll: "Lihat Semua"
      },
      recent: {
        title: "Lamaran Terkini",
        viewAll: "Lihat Semua",
        empty: "Belum ada lamaran",
        newBtn: "Tambah Baru"
      }
    },
    applications: {
      title: "Lamaran",
      subtitle: "Kelola progres pencarian kerja Anda",
      newBtn: "+ Tambah Lamaran",
      searchPh: "Cari perusahaan atau posisi...",
      statusFilter: "Status",
      all: "Semua",
      sortNewest: "Terbaru",
      sortOldest: "Terlama",
      emptyTitle: "Lamaran tidak ditemukan",
      emptySub: "Belum ada lamaran yang cocok dengan kriteria pencarian.",
      edit: "Edit",
      delete: "Hapus",
      generateCoverLetter: "✨ Buat Cover Letter",
      detail: {
        title: "Detail Lamaran",
        back: "Semua Lamaran",
        jobPosting: "Lowongan Pekerjaan",
        salary: "Gaji",
        created: "Dibuat",
        updated: "Diperbarui",
        notes: "Catatan",
        history: "Riwayat Status",
        noNotes: "Tidak ada catatan.",
        updateStatus: "Update Status",
        currentStatus: "STATUS SAAT INI",
        optionalNote: "CATATAN (OPSIONAL)",
        notePh: "Tambahkan catatan tentang perubahan status...",
        needsFollowUp: "Perlu Follow-up",
        daysAgo: "hari lalu",
        today: "Hari ini"
      }
    }
  }
};

export type Language = 'en' | 'id';
export type Dictionary = typeof dictionary.id;

export function getDictionary(lang: Language): Dictionary {
  return dictionary[lang] || dictionary.en;
}
