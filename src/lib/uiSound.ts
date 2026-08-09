"use client";

/* ------------------------------------------------------------------ */
/* uiSound — mesin suara UI sintetis (Web Audio, tanpa aset).         */
/* AudioContext dibuat saat enable() pertama (dalam gestur pengguna →  */
/* lolos kebijakan autoplay). Semua nada halus & pendek.               */
/* Preferensi ON/OFF dipersistenkan ke localStorage (key "ui-sound").  */
/* ------------------------------------------------------------------ */

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
/* DEFAULT ON — suara aktif sejak awal; gestur pertama me-resume audio
   (kebijakan autoplay browser). Hanya "0" tersimpan yang mematikan. */
let enabled = true;
let unlocked = false;
let bootActive = false;
let bootPlayed = false;
const PREF_KEY = "ui-sound";
const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((l) => l());
}

function ensure(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (ctx) return ctx;
  const AC =
    window.AudioContext ??
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AC) return null;
  ctx = new AC();
  master = ctx.createGain();
  master.gain.value = 0.14; /* volume master halus */
  master.connect(ctx.destination);
  return ctx;
}

type ToneOpts = { type?: OscillatorType; vol?: number; slideTo?: number };

/** Nada tunggal dengan envelope attack/release eksponensial. */
function tone(freq: number, delay: number, dur: number, opts: ToneOpts = {}) {
  const c = ensure();
  if (!c || !master) return;
  const t0 = c.currentTime + delay;
  const osc = c.createOscillator();
  const g = c.createGain();
  osc.type = opts.type ?? "sine";
  osc.frequency.setValueAtTime(freq, t0);
  if (opts.slideTo) {
    osc.frequency.exponentialRampToValueAtTime(Math.max(1, opts.slideTo), t0 + dur);
  }
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(opts.vol ?? 0.5, t0 + 0.012);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  osc.connect(g);
  g.connect(master);
  osc.start(t0);
  osc.stop(t0 + dur + 0.06);
}

export const uiSound = {
  get enabled() {
    return enabled;
  },
  getEnabled: () => enabled,
  /** Subscribe perubahan status ON/OFF (untuk useSyncExternalStore). */
  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
  /** Benar jika sebelumnya dimatikan eksplisit ("0" tersimpan). */
  wasDisabled(): boolean {
    if (typeof window === "undefined") return false;
    try {
      return window.localStorage.getItem(PREF_KEY) === "0";
    } catch {
      return false;
    }
  },
  /** Terapkan preferensi tersimpan (panggil setelah hidrasi). */
  init() {
    if (this.wasDisabled()) {
      enabled = false;
      notify();
    }
  },
  /** Gestur pertama pengguna → buat/resume konteks + boot sweep bila masih loading. */
  unlock() {
    const c = ensure();
    unlocked = true;
    void c?.resume();
    /* Hanya bila suara aktif (pengguna yang mematikan tidak boleh berbunyi) */
    if (enabled && bootActive && !bootPlayed) {
      this.bootSweep();
      bootPlayed = true;
    }
  },
  /** Tandai fase boot (loading screen) aktif — reset sweep agar dapat diputar sekali. */
  setBootActive(v: boolean) {
    bootActive = v;
    if (v) bootPlayed = false;
  },
  isUnlocked: () => unlocked,
  /** Aktifkan (panggil dalam gestur pengguna) + resume konteks audio. */
  enable() {
    const c = ensure();
    enabled = true;
    unlocked = true;
    bootPlayed = true; /* enable eksplisit sudah memberikan feedback → cegah sweep ganda */
    void c?.resume();
    try {
      window.localStorage.setItem(PREF_KEY, "1");
    } catch {
      /* abaikan (mode privat / storage diblokir) */
    }
    notify();
  },
  disable() {
    enabled = false;
    try {
      window.localStorage.setItem(PREF_KEY, "0");
    } catch {
      /* abaikan */
    }
    notify();
  },
  /** Sapuan boot: whoosh naik lembut + shimmer tipis. */
  bootSweep() {
    tone(90, 0, 1.1, { vol: 0.4, slideTo: 520 });
    tone(180, 0.04, 0.9, { type: "triangle", vol: 0.1, slideTo: 660 });
    tone(720, 0.05, 0.5, { vol: 0.05, slideTo: 1320 });
  },
  /** Tick milestone: blip pendek & halus. */
  tick() {
    tone(1180, 0, 0.05, { type: "square", vol: 0.07 });
    tone(1568, 0.02, 0.05, { vol: 0.05 });
  },
  /** Chime sukses: arpeggio C–E–G lembut. */
  chime() {
    tone(261.63, 0, 1.0, { vol: 0.16 });
    tone(523.25, 0, 0.6, { vol: 0.28 });
    tone(659.25, 0.1, 0.75, { vol: 0.24 });
    tone(783.99, 0.2, 0.95, { vol: 0.2 });
  },
  /** Hover mikro: dua nada tinggi sangat pendek & pelan. */
  hover() {
    tone(1760, 0, 0.04, { vol: 0.04 });
    tone(2200, 0.015, 0.04, { vol: 0.025 });
  },
  /** Klik mikro: blip segitiga pendek turun lembut. */
  click() {
    tone(840, 0, 0.05, { type: "triangle", vol: 0.08, slideTo: 620 });
  },
};
