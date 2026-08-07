import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="text-center">
        <p className="font-mono text-sm font-medium text-primary-600 dark:text-primary-400">
          {"// 404"}
        </p>
        <h1 className="text-gradient mt-3 text-8xl font-bold sm:text-9xl">404</h1>
        <h2 className="mt-4 text-2xl font-bold text-slate-900 dark:text-slate-100 sm:text-3xl">
          Halaman tidak ditemukan
        </h2>
        <p className="mx-auto mt-3 max-w-md text-slate-600 dark:text-slate-400">
          Halaman yang kamu cari mungkin telah dipindahkan, dihapus, atau tidak pernah ada.
        </p>
        <div className="mt-8">
          <Button href="/">&larr; Kembali ke Beranda</Button>
        </div>
      </div>
    </div>
  );
}
