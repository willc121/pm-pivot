"use client";

/**
 * Cinematic concept route — maximal "wow" direction inspired by Scale / Anduril:
 * a live WebGL shader hero, glowing color, animated gradient type, and
 * pointer-reactive 3D tilt cards. Self-contained. View at /cinematic.
 */

import Link from "next/link";
import { motion } from "framer-motion";
import { useRef, useState } from "react";
import { projects } from "@/data/projects";
import ShaderBackground from "@/components/ShaderBackground";

const EASE = [0.16, 1, 0.3, 1] as const;

/* ---------- pointer-reactive 3D tilt card ---------- */
function TiltCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [style, setStyle] = useState<React.CSSProperties>({});
  const [spot, setSpot] = useState<{ x: number; y: number } | null>(null);

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    const rx = (py - 0.5) * -10;
    const ry = (px - 0.5) * 12;
    setStyle({ transform: `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg)` });
    setSpot({ x: e.clientX - r.left, y: e.clientY - r.top });
  };

  const onLeave = () => {
    setStyle({ transform: "perspective(900px) rotateX(0deg) rotateY(0deg)" });
    setSpot(null);
  };

  return (
    <div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      style={{ ...style, transition: "transform 0.25s ease-out" }}
      className={`relative [transform-style:preserve-3d] ${className}`}
    >
      {spot && (
        <div
          className="pointer-events-none absolute inset-0 z-20 rounded-[inherit] opacity-100"
          style={{
            background: `radial-gradient(420px circle at ${spot.x}px ${spot.y}px, rgba(120,170,255,0.18), transparent 45%)`,
          }}
        />
      )}
      {children}
    </div>
  );
}

export default function CinematicPage() {
  const year = new Date().getFullYear();

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#05060b] text-white antialiased">
      {/* Live shader — fixed behind everything */}
      <div className="fixed inset-0 -z-10">
        <ShaderBackground className="h-full w-full" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,transparent,rgba(5,6,11,0.55)_70%,#05060b_100%)]" />
      </div>

      {/* top bar */}
      <header className="fixed inset-x-0 top-0 z-50">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.25em] text-white/70 backdrop-blur-md">
            W·C
          </span>
          <Link
            href="/"
            className="rounded-full border border-white/15 bg-white/5 px-4 py-1.5 font-mono text-[10px] uppercase tracking-[0.25em] text-white/60 backdrop-blur-md transition-colors hover:text-white"
          >
            ← Live site
          </Link>
        </div>
      </header>

      {/* ───────────── HERO ───────────── */}
      <section className="relative flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE }}
          className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-4 py-1.5 text-sm font-medium text-white/80 backdrop-blur-md"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/70" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
          </span>
          Pilot → Product
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: EASE, delay: 0.08 }}
          className="mt-7 text-[clamp(3.5rem,15vw,13rem)] font-bold leading-[0.85] tracking-[-0.05em]"
        >
          <span className="animate-gradient-text bg-gradient-to-r from-sky-200 via-fuchsia-300 to-violet-300 bg-clip-text text-transparent drop-shadow-[0_4px_40px_rgba(150,120,255,0.35)]">
            Will Chung
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: EASE, delay: 0.18 }}
          className="mt-8 max-w-xl text-lg leading-relaxed text-white/70"
        >
          Former Army MEDEVAC Blackhawk pilot, now a Product Manager at Microsoft.
          I turn ambiguity into shipping software.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: EASE, delay: 0.28 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          <a
            href="#work"
            className="group relative overflow-hidden rounded-full px-7 py-3 text-sm font-semibold text-[#05060b]"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-sky-300 via-cyan-200 to-violet-300 transition-transform duration-500 group-hover:scale-110" />
            <span className="relative">See the work ↓</span>
          </a>
          <a
            href="mailto:hello@willchung.io"
            className="rounded-full border border-white/20 bg-white/5 px-7 py-3 text-sm font-semibold text-white/80 backdrop-blur-md transition-colors hover:border-white/40 hover:text-white"
          >
            Get in touch
          </a>
        </motion.div>

        <div className="pointer-events-none absolute bottom-8 left-1/2 -translate-x-1/2">
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/40"
          >
            Scroll
          </motion.div>
        </div>
      </section>

      {/* ───────────── WORK ───────────── */}
      <section id="work" className="relative mx-auto max-w-7xl px-6 py-28">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15% 0px" }}
          transition={{ duration: 0.8, ease: EASE }}
          className="text-center text-4xl font-bold tracking-tight sm:text-5xl"
        >
          Things I&apos;ve{" "}
          <span className="bg-gradient-to-r from-sky-300 to-fuchsia-300 bg-clip-text text-transparent">
            shipped
          </span>
        </motion.h2>

        <div className="mt-16 grid gap-7 md:grid-cols-3">
          {projects.map((p, i) => (
            <motion.div
              key={p.slug}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10% 0px" }}
              transition={{ duration: 0.7, ease: EASE, delay: i * 0.1 }}
            >
              <TiltCard className="h-full rounded-3xl">
                {/* gradient ring */}
                <div className="absolute -inset-px rounded-3xl bg-gradient-to-br from-white/20 via-white/5 to-transparent opacity-60" />
                <Link
                  href={p.link || `/projects/${p.slug}`}
                  target={p.external ? "_blank" : undefined}
                  rel={p.external ? "noopener noreferrer" : undefined}
                  className="relative z-10 flex h-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-[#0a0c16]/80 backdrop-blur-xl transition-shadow duration-500 hover:shadow-[0_30px_80px_-20px_rgba(110,140,255,0.45)]"
                >
                  <div className="relative aspect-[16/10] overflow-hidden">
                    {p.image && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={p.image}
                        alt={p.title}
                        className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0c16] via-transparent to-transparent" />
                    <span className="absolute left-4 top-4 rounded-full border border-white/15 bg-black/40 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-white/80 backdrop-blur-md">
                      {p.outcome} · {p.year}
                    </span>
                  </div>

                  <div className="flex flex-1 flex-col p-6">
                    <h3 className="text-xl font-semibold tracking-tight text-white">
                      {p.title}
                    </h3>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-white/55">
                      {p.description}
                    </p>
                    <div className="mt-5 flex flex-wrap gap-2">
                      {p.tags.slice(0, 3).map((t) => (
                        <span
                          key={t}
                          className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] text-white/60"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                    <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-sky-300">
                      {p.cta || "Check it out"}
                      <span aria-hidden>↗</span>
                    </span>
                  </div>
                </Link>
              </TiltCard>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ───────────── CONTACT ───────────── */}
      <section className="relative px-6 py-32">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15% 0px" }}
          transition={{ duration: 0.9, ease: EASE }}
          className="mx-auto max-w-3xl rounded-[2rem] border border-white/12 bg-white/[0.04] p-12 text-center backdrop-blur-2xl"
        >
          <h2 className="text-4xl font-bold tracking-tight sm:text-6xl">
            Let&apos;s{" "}
            <span className="animate-gradient-text bg-gradient-to-r from-sky-300 via-fuchsia-300 to-violet-300 bg-clip-text text-transparent">
              build something
            </span>
          </h2>
          <p className="mx-auto mt-5 max-w-md text-white/60">
            Always down to chat about product, building things, or the occasional
            helicopter story.
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            {[
              ["Email", "mailto:hello@willchung.io"],
              ["LinkedIn", "https://www.linkedin.com/in/willc121/"],
              ["GitHub", "https://github.com/willc121"],
            ].map(([label, href]) => (
              <a
                key={label}
                href={href}
                target={href.startsWith("http") ? "_blank" : undefined}
                rel="noreferrer"
                className="rounded-full border border-white/15 bg-white/5 px-6 py-2.5 text-sm font-medium text-white/80 backdrop-blur-md transition-all hover:border-white/35 hover:bg-white/10 hover:text-white"
              >
                {label}
              </a>
            ))}
          </div>
          <p className="mt-10 font-mono text-[10px] uppercase tracking-[0.25em] text-white/25">
            © {year} Will Chung · Concept · Cinematic
          </p>
        </motion.div>
      </section>
    </div>
  );
}
