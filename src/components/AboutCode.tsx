"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { personal } from "@/content/personal";

const syntax = {
  keyword: "text-purple-400",
  string: "text-emerald-400",
  property: "text-blue-300",
  comment: "text-slate-500 italic",
  operator: "text-yellow-300",
  number: "text-orange-300",
  bracket: "text-slate-300",
};

export function AboutCode() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="about" className="max-w-6xl mx-auto px-4 sm:px-6 py-24">
      <motion.div
        ref={ref}
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        <p className="text-primary-600 dark:text-primary-400 font-medium mb-2 uppercase text-sm tracking-wider">
          // tentang.ts
        </p>
        <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
          <div className="flex items-center gap-2 px-4 py-3 bg-slate-900 border-b border-slate-800">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span className="text-xs text-slate-500 ml-2 font-mono">tentang.ts</span>
          </div>
          <div className="p-6 sm:p-8 font-mono text-sm leading-relaxed overflow-x-auto">
            <pre className="text-slate-300">
              <span className={syntax.comment}>// Hai! Selamat datang di portofolio saya 👋</span>{"\n"}
              {"\n"}
              <span className={syntax.keyword}>const</span>{" "}
              <span className={syntax.property}>developer</span>{" "}
              <span className={syntax.operator}>=</span> {"{"}
              {"\n"}
              {"  "}<span className={syntax.property}>name</span>
              :{" "}<span className={syntax.string}>"{personal.name}"</span>,{"\n"}
              {"  "}<span className={syntax.property}>role</span>
              :{" "}<span className={syntax.string}>"{personal.role}"</span>,{"\n"}
              {"  "}<span className={syntax.property}>location</span>
              :{" "}<span className={syntax.string}>"{personal.location}"</span>,{"\n"}
              {"  "}<span className={syntax.property}>email</span>
              :{" "}<span className={syntax.string}>"{personal.email}"</span>,{"\n"}
              {"}"};{"\n"}
              {"\n"}
              <span className={syntax.keyword}>const</span>{" "}
              <span className={syntax.property}>skills</span>{" "}
              <span className={syntax.operator}>=</span> {"["}
              {"\n"}
              {personal.skills.map((s, i) => (
                <span key={s.name}>
                  {"  "}"{s.name}",{"\n"}
                </span>
              ))}
              {"]"};{"\n"}
              {"\n"}
              <span className={syntax.comment}>// Tersedia untuk proyek & kolaborasi</span>{"\n"}
              <span className={syntax.keyword}>export</span>{" "}
              <span className={syntax.keyword}>default</span>{" "}
              <span className={syntax.property}>developer</span>;
            </pre>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
