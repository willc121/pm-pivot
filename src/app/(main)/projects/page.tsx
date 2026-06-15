"use client";

import { motion } from "framer-motion";

const projects = [
  {
    title: "Sample project title",
    role: "Product Manager",
    timeframe: "2024",
    summary: "Short one sentence description of the problem you solved.",
    impact: "Example: improved activation by 18% and reduced support tickets by 25%.",
  },
  {
    title: "Another sample project",
    role: "Product Manager",
    timeframe: "2023",
    summary: "Another concise description of a product problem you owned.",
    impact: "Example: reduced time to resolution by 35% and increased NPS by 6 points.",
  },
];

export default function ProjectsPage() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-16">
      {/* HUD eyebrow */}
      <div className="flex items-center gap-3">
        <span className="status-dot" />
        <span className="hud-label">Index &mdash; Selected Work</span>
      </div>

      <h1 className="mt-6 text-4xl font-semibold tracking-tight sm:text-5xl">
        Projects
      </h1>
      <p className="mt-4 max-w-2xl text-[1.05rem] leading-relaxed text-white/60">
        Selected projects that show how I approach product problems, make tradeoffs,
        and drive measurable outcomes.
      </p>

      <div className="mt-12 grid gap-5 md:grid-cols-2">
        {projects.map((p, i) => (
          <motion.article
            key={p.title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 transition-all duration-300 hover:border-signal/30 hover:bg-white/[0.03]"
          >
            <span className="pointer-events-none absolute left-3 top-3 h-3.5 w-3.5 border-l border-t border-white/15" />
            <span className="pointer-events-none absolute right-3 top-3 h-3.5 w-3.5 border-r border-t border-white/15" />

            <div className="flex items-center gap-3 font-mono text-[0.6rem] uppercase tracking-[0.2em] text-white/40">
              <span className="text-signal">{String(i + 1).padStart(2, "0")}</span>
              <span className="h-px w-5 bg-white/15" />
              <span>{p.role}</span>
              <span className="text-white/20">/</span>
              <span>{p.timeframe}</span>
            </div>

            <h2 className="mt-4 text-lg font-semibold tracking-tight text-white/90">
              {p.title}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-white/55">{p.summary}</p>

            <div className="mt-5 border-t border-white/[0.06] pt-4">
              <p className="text-xs leading-relaxed text-white/45">
                <span className="font-mono uppercase tracking-[0.16em] text-signal/80">
                  Impact &mdash;{" "}
                </span>
                {p.impact}
              </p>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
