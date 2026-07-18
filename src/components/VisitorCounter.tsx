"use client";

import { useEffect, useState } from "react";

const NAMESPACE = "boundless.my.id";
const KEY = "visitors";

export function VisitorCounter() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    fetch(`https://api.countapi.xyz/hit/${NAMESPACE}/${KEY}`)
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
