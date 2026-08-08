"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { personal } from "@/content/personal";
import { projects } from "@/content/projects";

type Line = { kind: "cmd" | "out" | "ok" | "err" | "sys"; text: string };

const WELCOME: Line[] = [
  {
    kind: "sys",
    text: "SYAMSUL.SHELL v2.1 — ketik `help` untuk daftar perintah. Tekan ` atau Esc untuk keluar.",
  },
];

const lineClass: Record<Line["kind"], string> = {
  cmd: "text-slate-100",
  out: "text-slate-300",
  ok: "text-emerald-400",
  err: "text-red-400",
  sys: "text-primary-400",
};

export function TerminalOverlay() {
  const [open, setOpen] = useState(false);
  const [lines, setLines] = useState<Line[]>(WELCOME);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [histIndex, setHistIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  /* Buka/tutup dengan tombol ` (backtick) atau ~ ; Esc menutup.
     Jangan re-toggle saat mengetik di input/textarea. */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (e.key === "`" || e.key === "~") {
        e.preventDefault();
        setOpen((o) => !o);
      } else if (e.key === "Escape") {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (open) {
      // Sesi baru: tampilkan banner bila layar sempat dikosongkan (clear)
      setLines((prev) => (prev.length === 0 ? WELCOME : prev));
      const t = setTimeout(() => inputRef.current?.focus(), 60);
      return () => clearTimeout(t);
    }
  }, [open]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [lines]);

  const close = useCallback(() => setOpen(false), []);

  const run = useCallback(
    (raw: string) => {
      const cmd = raw.trim().toLowerCase();
      setLines((prev) => [...prev, { kind: "cmd", text: `> ${raw}` }]);
      setHistory((h) => [...h, raw]);
      setHistIndex(-1);
      if (!cmd) return;

      const out: Line[] = [];

      switch (cmd) {
        case "help":
          out.push(
            { kind: "ok", text: "PERINTAH TERSEDIA:" },
            { kind: "out", text: "  about       — profil singkat" },
            { kind: "out", text: "  skills      — daftar teknologi & level" },
            { kind: "out", text: "  projects    — daftar proyek" },
            { kind: "out", text: "  contact     — kontak langsung" },
            { kind: "out", text: "  social      — tautan media sosial" },
            { kind: "out", text: "  whoami      — identitas saat ini" },
            { kind: "out", text: "  date        — waktu sistem" },
            { kind: "out", text: "  clear       — bersihkan layar" },
            { kind: "out", text: "  exit        — tutup terminal" },
          );
          break;
        case "about":
          out.push(
            { kind: "ok", text: `${personal.name} — ${personal.role}` },
            { kind: "out", text: personal.bio },
            { kind: "out", text: `lokasi: ${personal.location} · domain: ${personal.domain}` },
          );
          break;
        case "skills":
          out.push({ kind: "ok", text: "TEKNOLOGI & LEVEL:" });
          personal.skills.forEach((s) =>
            out.push({ kind: "out", text: `  ${s.name.padEnd(20)} ${s.level}%` }),
          );
          break;
        case "projects":
          out.push({ kind: "ok", text: "DAFTAR PROYEK:" });
          projects.forEach((p) =>
            out.push({ kind: "out", text: `  ${p.id.toUpperCase()} — ${p.title} [${p.tags.join(", ")}]` }),
          );
          out.push({ kind: "out", text: "  lihat lengkap di /projects" });
          break;
        case "contact":
          out.push(
            { kind: "ok", text: "KONTAK:" },
            { kind: "out", text: `  email : ${personal.email}` },
            { kind: "out", text: `  wa    : ${personal.phone}` },
            { kind: "out", text: `  web   : ${personal.domain}` },
          );
          break;
        case "social":
          out.push({ kind: "ok", text: "MEDIA SOSIAL:" });
          Object.entries(personal.social).forEach(([k, v]) =>
            out.push({ kind: "out", text: `  ${k.padEnd(9)} ${v}` }),
          );
          break;
        case "whoami":
          out.push(
            { kind: "out", text: `nama   : ${personal.name}` },
            { kind: "out", text: `brand  : ${personal.brand}` },
            { kind: "out", text: `peran  : ${personal.role}` },
            { kind: "ok", text: "status : hireable — OPEN FOR WORK" },
          );
          break;
        case "date":
          out.push({
            kind: "out",
            text: new Date().toLocaleString("id-ID", { dateStyle: "full", timeStyle: "medium" }),
          });
          break;
        case "clear":
        case "cls":
          setLines([]);
          return;
        case "exit":
        case "quit":
          close();
          return;
        case "sudo":
          out.push({ kind: "err", text: "sudo: user tidak ada di file sudoers. Insiden ini akan dilaporkan. 😏" });
          break;
        case "hack":
          out.push(
            { kind: "sys", text: "> membuka koneksi aman ke mainframe..." },
            { kind: "sys", text: "> memuat exploit: buffer_overflow_v2.1..." },
            { kind: "err", text: "> akses ditolak — firewall teal terlalu kuat. Kembali ke mode hero. 🛡️" },
          );
          break;
        case "matrix":
          out.push({ kind: "ok", text: "rain aktif di background — kamu sudah di dalam Matrix." });
          break;
        case "sudo rm -rf":
          out.push({ kind: "err", text: "nice try. kamu butuh izin root untuk itu. 💾" });
          break;
        case "ls":
          out.push({ kind: "out", text: "about  skills  projects  contact  social  exit" });
          break;
        default:
          out.push({ kind: "err", text: `perintah tidak dikenal: '${raw}' — ketik 'help'` });
      }
      setLines((prev) => [...prev, ...out]);
    },
    [close],
  );

  /* Navigasi riwayat ↑ / ↓ */
  const onInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (history.length === 0) return;
      const idx = Math.min(histIndex + 1, history.length - 1);
      setInput(history[history.length - 1 - idx]);
      setHistIndex(idx);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const idx = Math.max(histIndex - 1, -1);
      setInput(idx === -1 ? "" : history[history.length - 1 - idx]);
      setHistIndex(idx);
    }
  };

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Terminal interaktif"
      className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) close();
      }}
    >
      <div className="flex h-[70vh] w-full max-w-2xl flex-col overflow-hidden rounded-xl border border-primary-500/40 bg-slate-950 shadow-2xl shadow-primary-500/20">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-primary-500/25 bg-slate-900/90 px-4 py-2.5">
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
            <span className="ml-2 font-mono text-[10px] text-slate-400">
              {personal.brand.toLowerCase()}.shell — ~/portfolio
            </span>
          </span>
          <button
            onClick={close}
            className="font-mono text-[10px] text-slate-400 transition-colors hover:text-red-400"
          >
            [x] close
          </button>
        </div>

        {/* Output */}
        <div
          ref={scrollRef}
          className="flex-1 space-y-1 overflow-y-auto px-4 py-3 font-mono text-xs leading-relaxed"
        >
          {lines.map((l, i) => (
            <p key={i} className={`whitespace-pre-wrap ${lineClass[l.kind]}`}>
              {l.text}
            </p>
          ))}
        </div>

        {/* Input */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            run(input);
            setInput("");
          }}
          className="flex items-center gap-2 border-t border-primary-500/25 bg-slate-900/90 px-4 py-3 font-mono text-xs"
        >
          <span className="shrink-0 text-primary-400">&gt;</span>
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onInputKeyDown}
            autoComplete="off"
            spellCheck={false}
            aria-label="Perintah terminal"
            className="flex-1 bg-transparent text-slate-100 caret-primary-400 outline-none"
          />
          <span className="animate-blink shrink-0 text-primary-400">▌</span>
        </form>
      </div>
    </div>
  );
}
