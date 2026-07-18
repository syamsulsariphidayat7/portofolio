import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <p className="text-primary-600 dark:text-primary-400 font-mono font-medium mb-2 text-sm">
          {'// 404'}
        </p>
        <h1 className="text-6xl sm:text-7xl font-bold text-slate-900 dark:text-slate-100 mb-4">
          Halaman tidak ditemukan
        </h1>
        <p className="text-slate-600 dark:text-slate-400 max-w-md mx-auto mb-8">
          Halaman yang kamu cari mungkin telah dipindahkan, dihapus, atau tidak pernah ada.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium bg-primary-600 text-white hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 shadow-sm hover:shadow-md transition-all duration-200"
        >
          &larr; Kembali ke Beranda
        </Link>
      </div>
    </div>
  );
}
