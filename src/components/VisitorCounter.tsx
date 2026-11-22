"use client";

import { useEffect, useState } from "react";

const NAMESPACE = "boundless.my.id";
const KEY = "visitors";

export function VisitorCounter() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    // Dulu api.countapi.xyz — layanan itu sudah mati (domain tak merespons),
    // jadi counter selalu tampil "?". Abacus adalah penerus drop-in dengan
    // model namespace/key dan bentuk respons { value } yang sama.
    fetch(`https://abacus.jasoncameron.dev/hit/${NAMESPACE}/${KEY}`)
      .then((res) => res.json())
      .then((data) => setCount(data.value))
      .catch(() => setCount(null));
  }, []);

  return (
    <span className="text-sm text-slate-500 dark:text-slate-400">
      Visitors: {count ?? "?"}
    </span>
  );
}
