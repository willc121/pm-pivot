"use client";

/**
 * Concept route: a proof-of-concept reimagining of Will's portfolio in the
 * "defense-tech" art direction shared by Anduril / Saronic / Vannevar / Scale.
 * Self-contained. Does not touch the live homepage. View at /concept.
 *
 * The DNA being emulated: near-black canvas, monochrome restraint, one muted
 * signal accent, huge confident grotesk type, mono eyebrow labels, hairline
 * rules, generous negative space, and slow deliberate scroll reveals.
 */

import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { projects } from "@/data/projects";

const EASE = [0.16, 1, 0.3, 1] as const;

function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-12% 0px" }}
      transition={{ duration: 0.9, ease: EASE, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

const capabilities = [
  {
    n: "01",
    label: "Discovery",
    line: "Turn ambiguity into a problem worth solving — and a wedge worth shipping.",
  },
  {
    n: "02",
    label: "Velocity",
    line: "Prototype to prove the idea. Ship fast, with guardrails, not theater.",
  },
  {
    n: "03",
    label: "Judgment",
    line: "Decisions under uncertainty, made calmly. The cockpit taught me that.",
  },
  {
    n: "04",
    label: "Systems",
    line: "Data pipelines, AI, and the unglamorous plumbing that makes products real.",
  },
];

export default function ConceptPage() {
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const gridY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const heroFade = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const year = new Date().getFullYear();

  return (
    <div
      className="min-h-screen bg-[#050506] text-zinc-200 antialiased selection:bg-white selection:text-black"
      style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}
    >
      {/* Fixed chrome */}
      <div className="pointer-events-none fixed inset-x-0 top-0 z-50">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-5 sm:px-10">
          <span className="pointer-events-auto font-mono text-[11px] uppercase tracking-[0.3em] text-white/70">
            W·C
          </span>
          <span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.28em] text-white/40">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/70" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
            </span>
            Open to product roles
          </span>
          <Link
            href="/"
            className="pointer-events-auto font-mono text-[10px] uppercase tracking-[0.28em] text-white/40 transition-colors hover:text-white"
          >
            ← Live site
          </Link>
        </div>
      </div>

      {/* ───────────── HERO ───────────── */}
      <section ref={heroRef} className="relative flex min-h-screen flex-col justify-between overflow-hidden">
        {/* Perspective grid + vignette */}
        <motion.div style={{ y: gridY }} className="pointer-events-none absolute inset-0 -z-10">
          <div
            className="absolute inset-0 opacity-[0.18]"
            style={{
              backgroundImage:
                "linear-gradient(to right, rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.4) 1px, transparent 1px)",
              backgroundSize: "70px 70px",
              maskImage: "radial-gradient(ellipse 70% 60% at 50% 35%, black 0%, transparent 80%)",
              WebkitMaskImage: "radial-gradient(ellipse 70% 60% at 50% 35%, black 0%, transparent 80%)",
            }}
          />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_50%_at_50%_120%,rgba(255,255,255,0.05),transparent_70%)]" />
        </motion.div>

        <motion.div style={{ opacity: heroFade }} className="mx-auto flex w-full max-w-[1400px] flex-1 flex-col justify-center px-6 pt-28 sm:px-10">
          <Reveal>
            <p className="font-mono text-[11px] uppercase tracking-[0.4em] text-white/40">
              Pilot → Product
            </p>
          </Reveal>

          <Reveal delay={0.08}>
            <h1 className="mt-6 font-semibold leading-[0.88] tracking-[-0.045em] text-white text-[clamp(3.5rem,13vw,12rem)]">
              Will Chung
            </h1>
          </Reveal>

          <Reveal delay={0.16}>
            <p className="mt-8 max-w-xl text-lg leading-relaxed text-white/55">
              Former Army MEDEVAC Blackhawk pilot, now a Product Manager at
              Microsoft. I make decisions under uncertainty and turn ambiguity
              into shipping software.
            </p>
          </Reveal>
        </motion.div>

        {/* Bottom metadata rail */}
        <Reveal delay={0.24}>
          <div className="mx-auto w-full max-w-[1400px] px-6 pb-8 sm:px-10">
            <div className="grid grid-cols-2 gap-px overflow-hidden rounded-sm border border-white/10 bg-white/10 text-[11px] sm:grid-cols-4">
              {[
                ["Role", "Product Manager"],
                ["Org", "Microsoft"],
                ["Prior", "U.S. Army Aviation"],
                ["Pivot", "MIT Sloan"],
              ].map(([k, v]) => (
                <div key={k} className="bg-[#050506] px-5 py-4">
                  <div className="font-mono uppercase tracking-[0.2em] text-white/35">{k}</div>
                  <div className="mt-1.5 text-white/80">{v}</div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </section>

      {/* ───────────── MANIFESTO ───────────── */}
      <section className="border-y border-white/10">
        <div className="mx-auto max-w-[1400px] px-6 py-28 sm:px-10 sm:py-40">
          <Reveal>
            <p className="font-mono text-[11px] uppercase tracking-[0.4em] text-white/35">
              [ Operating principle ]
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-10 max-w-5xl text-balance text-3xl font-medium leading-[1.15] tracking-[-0.02em] text-white/90 sm:text-5xl sm:leading-[1.12]">
              I build things to prove ideas. From MCP servers to vision
              classifiers, the fastest way to resolve an argument is to{" "}
              <span className="text-white/40">ship the smallest real version of it.</span>
            </p>
          </Reveal>
        </div>
      </section>

      {/* ───────────── SELECTED WORK ───────────── */}
      <section className="mx-auto max-w-[1400px] px-6 py-24 sm:px-10 sm:py-32">
        <Reveal>
          <div className="flex items-baseline justify-between border-b border-white/10 pb-5">
            <h2 className="font-mono text-[11px] uppercase tracking-[0.4em] text-white/40">
              Selected work
            </h2>
            <span className="font-mono text-[11px] tracking-[0.2em] text-white/30">
              {String(projects.length).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}
            </span>
          </div>
        </Reveal>

        <div>
          {projects.map((p, i) => (
            <Reveal key={p.slug} delay={i * 0.06}>
              <Link
                href={p.link || `/projects/${p.slug}`}
                target={p.external ? "_blank" : undefined}
                rel={p.external ? "noopener noreferrer" : undefined}
                className="group grid grid-cols-12 items-center gap-4 border-b border-white/10 py-8 transition-colors duration-500 hover:bg-white/[0.02] sm:py-10"
              >
                <span className="col-span-2 font-mono text-xs text-white/30 sm:col-span-1">
                  {String(i + 1).padStart(2, "0")}
                </span>

                <div className="col-span-10 sm:col-span-5">
                  <h3 className="text-2xl font-semibold tracking-[-0.02em] text-white/85 transition-colors duration-300 group-hover:text-white sm:text-3xl">
                    {p.title}
                  </h3>
                  <p className="mt-2 max-w-md text-sm leading-relaxed text-white/45">
                    {p.description}
                  </p>
                </div>

                <div className="col-span-7 hidden flex-wrap gap-2 sm:col-span-3 sm:flex">
                  {p.tags.slice(0, 3).map((t) => (
                    <span
                      key={t}
                      className="rounded-full border border-white/10 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.15em] text-white/45"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                <div className="col-span-12 flex items-center justify-between sm:col-span-3 sm:justify-end sm:gap-6">
                  <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/40">
                    {p.outcome} · {p.year}
                  </span>
                  <span
                    aria-hidden
                    className="text-white/40 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-white"
                  >
                    ↗
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ───────────── CAPABILITIES ───────────── */}
      <section className="border-t border-white/10 bg-white/[0.015]">
        <div className="mx-auto max-w-[1400px] px-6 py-24 sm:px-10 sm:py-32">
          <Reveal>
            <h2 className="font-mono text-[11px] uppercase tracking-[0.4em] text-white/40">
              How I work
            </h2>
          </Reveal>
          <div className="mt-14 grid grid-cols-1 gap-px overflow-hidden border border-white/10 bg-white/10 sm:grid-cols-2">
            {capabilities.map((c, i) => (
              <Reveal key={c.n} delay={i * 0.08}>
                <div className="h-full bg-[#070708] p-8 sm:p-10">
                  <div className="flex items-center gap-4">
                    <span className="font-mono text-xs text-white/30">{c.n}</span>
                    <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-white/55">
                      {c.label}
                    </span>
                  </div>
                  <p className="mt-5 text-xl leading-snug tracking-[-0.01em] text-white/80 sm:text-2xl">
                    {c.line}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────── CONTACT ───────────── */}
      <section className="border-t border-white/10">
        <div className="mx-auto flex min-h-[80vh] max-w-[1400px] flex-col justify-between px-6 py-20 sm:px-10">
          <Reveal>
            <p className="font-mono text-[11px] uppercase tracking-[0.4em] text-white/35">
              [ Contact ]
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <h2 className="font-semibold leading-[0.9] tracking-[-0.045em] text-white text-[clamp(3rem,11vw,9rem)]">
              Let&apos;s talk.
            </h2>
          </Reveal>

          <Reveal delay={0.18}>
            <div className="mt-16 flex flex-col gap-px overflow-hidden border-t border-white/10">
              {[
                ["Email", "hello@willchung.io", "mailto:hello@willchung.io"],
                ["LinkedIn", "in/willc121", "https://www.linkedin.com/in/willc121/"],
                ["GitHub", "willc121", "https://github.com/willc121"],
              ].map(([label, value, href]) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel="noreferrer"
                  className="group flex items-center justify-between border-b border-white/10 py-6 transition-colors hover:bg-white/[0.03]"
                >
                  <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-white/40">
                    {label}
                  </span>
                  <span className="flex items-center gap-4 text-lg text-white/70 transition-colors group-hover:text-white sm:text-xl">
                    {value}
                    <span aria-hidden className="text-white/30 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-white">
                      ↗
                    </span>
                  </span>
                </a>
              ))}
            </div>
          </Reveal>

          <div className="mt-16 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.25em] text-white/25">
            <span>© {year} Will Chung</span>
            <span>Concept · v2</span>
          </div>
        </div>
      </section>
    </div>
  );
}
