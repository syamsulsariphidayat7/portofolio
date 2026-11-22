/**
 * bootSignal — sinyal satu arah "loading screen selesai" (tirai mulai
 * membuka). LoadingScreen memanggil markDone(); HeroSection berlangganan
 * via useSyncExternalStore supaya animasi masuk hero BARU berjalan saat
 * tirai membuka — bukan di balik layar boot (bug yang dilaporkan
 * Syamsul 22 Nov 2026: tangga hero sudah selesai sebelum loading kelar).
 * Pola meniru modul uiSound (store eksternal mungil).
 */
let done = false;
const listeners = new Set<() => void>();

export const bootSignal = {
  markDone() {
    if (done) return;
    done = true;
    listeners.forEach((l) => l());
  },
  isDone() {
    return done;
  },
  subscribe(fn: () => void) {
    listeners.add(fn);
    return () => {
      listeners.delete(fn);
    };
  },
};
