"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useRef, useState, useCallback } from "react";
import { projects, type Project } from "@/data/projects";
import ScrambleLink from "./ScrambleLink";

type CardEl = HTMLDivElement | null;

export default function StackedProjects() {
  const [activeIndex, setActiveIndex] = useState(0);
  const cardRefs = useRef<CardEl[]>([]);
  const footerRef = useRef<HTMLDivElement>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null);

  const stickyTopBase = 15;
  const headerH = 64;

  type ProjectWithN = Project & { n: string; image?: string };

  const formatted: ProjectWithN[] = projects.map((p: Project, i: number) => ({
    ...p,
    image: p.image,
    n: String(i + 1).padStart(2, "0"),
  }));

  const totalCards = formatted.length;
  const currentYear = new Date().getFullYear();

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setMousePos(null);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const els = cardRefs.current.filter(Boolean) as HTMLDivElement[];
      if (!els.length) return;

      let newActiveIndex = 0;

      for (let i = 0; i < els.length; i++) {
        const rect = els[i].getBoundingClientRect();
        const stickyTop = stickyTopBase + i * headerH;
        if (rect.top <= stickyTop + 5) {
          newActiveIndex = i;
        }
      }

      if (footerRef.current) {
        const footerRect = footerRef.current.getBoundingClientRect();
        const footerStickyTop = stickyTopBase + totalCards * headerH;
        if (footerRect.top <= footerStickyTop + 5) {
          newActiveIndex = totalCards;
        }
      }

      setActiveIndex(newActiveIndex);
      setShowScrollTop(window.scrollY > 400);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [totalCards]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const pillClass =
    "rounded-full border border-white/10 bg-white/[0.03] px-5 py-2.5 font-mono text-xs uppercase tracking-[0.16em] text-white/65 transition-all duration-300 hover:border-signal/40 hover:bg-signal/[0.06] hover:text-white";

  const getCardWrapperClass = (isActive: boolean) =>
    [
      "group relative isolate rounded-2xl overflow-hidden",
      "transition-all duration-500 ease-out",
      isActive ? "hover:-translate-y-1" : "",
    ].join(" ");

  return (
    <>
      <section className="pt-6">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative mt-6">
            {formatted.map((p, i) => {
              const isActive = i === activeIndex;
              const z = 100 + i;
              const top = stickyTopBase + i * headerH;

              return (
                <div
                  key={p.slug}
                  ref={(el) => {
                    cardRefs.current[i] = el;
                  }}
                  data-index={i}
                  className="sticky"
                  style={{ top, zIndex: z }}
                >
                  <div
                    className={getCardWrapperClass(isActive)}
                    onMouseMove={(e) => isActive && handleMouseMove(e)}
                    onMouseLeave={handleMouseLeave}
                  >
                    {/* Mouse-tracking spotlight */}
                    {isActive && mousePos && (
                      <div
                        className="pointer-events-none absolute -inset-px rounded-2xl opacity-100 transition-opacity duration-500 z-[1]"
                        style={{
                          background: `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, rgba(242,180,65,0.06), transparent 40%)`,
                        }}
                      />
                    )}

                    {/* Card surface */}
                    <div
                      className="absolute inset-0 rounded-2xl transition-all duration-500"
                      style={{
                        background: isActive
                          ? "linear-gradient(180deg, rgba(18,22,28,0.98) 0%, rgba(11,14,19,0.98) 100%)"
                          : "linear-gradient(180deg, rgba(14,17,22,0.98) 0%, rgba(10,12,16,0.98) 100%)",
                        border: isActive
                          ? "1px solid rgba(255,255,255,0.12)"
                          : "1px solid rgba(255,255,255,0.06)",
                        boxShadow: isActive
                          ? "0 0 0 1px rgba(255,255,255,0.04), 0 25px 80px -20px rgba(0,0,0,0.7), 0 0 50px rgba(242,180,65,0.04)"
                          : "0 0 0 1px rgba(255,255,255,0.02), 0 15px 40px -15px rgba(0,0,0,0.4)",
                      }}
                    />

                    {/* Top edge highlight */}
                    <div
                      className="pointer-events-none absolute inset-x-0 top-0 h-px rounded-t-2xl"
                      style={{
                        background: isActive
                          ? "linear-gradient(90deg, transparent, rgba(255,255,255,0.08) 30%, rgba(242,180,65,0.5) 50%, rgba(255,255,255,0.08) 70%, transparent)"
                          : "linear-gradient(90deg, transparent, rgba(255,255,255,0.04) 50%, transparent)",
                      }}
                    />

                    {/* Content */}
                    <div className="relative z-10">
                      {/* Header lip */}
                      <div
                        className="flex items-center justify-between gap-4 px-5 sm:px-6"
                        style={{
                          height: headerH,
                          borderBottom: isActive
                            ? "1px solid rgba(255,255,255,0.07)"
                            : "1px solid rgba(255,255,255,0.03)",
                        }}
                      >
                        <div className="flex min-w-0 items-center gap-3">
                          <span
                            className={`font-mono text-xs font-medium tabular-nums transition-colors duration-500 ${
                              isActive ? "text-signal" : "text-signal/35"
                            }`}
                          >
                            {p.n}
                          </span>
                          <span className="h-3 w-px bg-white/10" />
                          <span
                            className={`truncate text-sm font-semibold tracking-tight transition-colors duration-500 sm:text-lg ${
                              isActive ? "text-white" : "text-white/50"
                            }`}
                          >
                            {p.title}
                          </span>
                          <span
                            className={`hidden shrink-0 rounded-full border px-2.5 py-0.5 font-mono text-[0.6rem] uppercase tracking-[0.16em] transition-all duration-500 sm:inline-block ${
                              isActive
                                ? "border-signal/25 bg-signal/[0.08] text-signal"
                                : "border-white/6 bg-white/[0.02] text-white/35"
                            }`}
                          >
                            {p.outcome}
                          </span>
                        </div>

                        <Link
                          href={p.link || `/projects/${p.slug}`}
                          target={p.external ? "_blank" : undefined}
                          rel={p.external ? "noopener noreferrer" : undefined}
                          className={`group/link flex shrink-0 items-center gap-2 font-mono text-[0.7rem] uppercase tracking-[0.16em] transition-all duration-300 ${
                            isActive ? "text-white/75 hover:text-signal" : "text-white/35"
                          }`}
                        >
                          <span className="hidden sm:inline">{p.cta || "Open"}</span>
                          <span
                            aria-hidden
                            className="transition-transform duration-300 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5"
                          >
                            &#8599;
                          </span>
                        </Link>
                      </div>

                      {/* Body */}
                      <div className="grid grid-cols-1 gap-8 p-6 sm:p-8 lg:grid-cols-2">
                        <div className="flex flex-col justify-between">
                          <div>
                            <div className="flex items-center gap-3 font-mono text-[0.6rem] uppercase tracking-[0.2em] text-white/35">
                              <span>{p.year}</span>
                              <span className="h-px w-6 bg-white/15" />
                              <span>{p.tags.length} systems</span>
                            </div>
                            <p
                              className={`mt-4 text-[15px] leading-relaxed transition-colors duration-500 ${
                                isActive ? "text-white/70" : "text-white/45"
                              }`}
                            >
                              {p.description}
                            </p>
                          </div>

                          <div className="mt-6 space-y-3">
                            <span className="hud-label text-white/35">Stack</span>
                            <div className="flex flex-wrap gap-2">
                              {p.tags.map((t) => (
                                <span
                                  key={t}
                                  className={`rounded-md px-2.5 py-1 font-mono text-[0.65rem] uppercase tracking-[0.08em] ring-1 ring-inset transition-all duration-500 ${
                                    isActive
                                      ? "bg-white/[0.04] text-white/75 ring-white/10"
                                      : "bg-white/[0.02] text-white/45 ring-white/5"
                                  }`}
                                >
                                  {t}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Image viewport */}
                        <motion.div
                          initial={{ opacity: 0, scale: 0.96 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          viewport={{ once: true, amount: 0.3 }}
                          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                          className="relative aspect-[16/9] overflow-hidden rounded-xl bg-white/[0.02] ring-1 ring-white/[0.06]"
                        >
                          {p.image && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={p.image}
                              alt={p.title}
                              className="h-full w-full object-contain transition-transform duration-700 group-hover:scale-[1.03]"
                            />
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-background/30 to-transparent" />
                          {/* Corner brackets */}
                          <span className="pointer-events-none absolute left-2 top-2 h-3.5 w-3.5 border-l border-t border-white/20" />
                          <span className="pointer-events-none absolute right-2 top-2 h-3.5 w-3.5 border-r border-t border-white/20" />
                          <span className="pointer-events-none absolute bottom-2 left-2 h-3.5 w-3.5 border-b border-l border-white/20" />
                          <span className="pointer-events-none absolute bottom-2 right-2 h-3.5 w-3.5 border-b border-r border-white/20" />
                        </motion.div>
                      </div>
                    </div>
                  </div>

                  {/* Spacer */}
                  {i < totalCards - 1 && <div style={{ height: headerH - 10 }} />}
                </div>
              );
            })}

            {/* ═══════ FOOTER CARD ═══════ */}
            <div
              ref={footerRef}
              className="sticky transition-[top] duration-500 ease-out mt-20"
              style={{
                top: activeIndex === totalCards ? 60 : stickyTopBase + totalCards * headerH,
                zIndex: 100 + totalCards,
              }}
            >
              <div
                className={getCardWrapperClass(activeIndex === totalCards)}
                style={{ height: `calc(100vh - 60px)` }}
              >
                {/* Card surface */}
                <div
                  className="absolute inset-0 rounded-2xl transition-all duration-500"
                  style={{
                    background:
                      activeIndex === totalCards
                        ? "linear-gradient(180deg, rgba(18,22,28,0.98) 0%, rgba(11,14,19,0.98) 100%)"
                        : "linear-gradient(180deg, rgba(14,17,22,0.98) 0%, rgba(10,12,16,0.98) 100%)",
                    border:
                      activeIndex === totalCards
                        ? "1px solid rgba(255,255,255,0.12)"
                        : "1px solid rgba(255,255,255,0.06)",
                    boxShadow:
                      activeIndex === totalCards
                        ? "0 0 0 1px rgba(255,255,255,0.04), 0 25px 80px -20px rgba(0,0,0,0.7)"
                        : "0 0 0 1px rgba(255,255,255,0.02), 0 15px 40px -15px rgba(0,0,0,0.4)",
                  }}
                />

                {/* Top edge highlight */}
                <div
                  className="pointer-events-none absolute inset-x-0 top-0 h-px rounded-t-2xl"
                  style={{
                    background:
                      activeIndex === totalCards
                        ? "linear-gradient(90deg, transparent, rgba(255,255,255,0.08) 30%, rgba(242,180,65,0.5) 50%, rgba(255,255,255,0.08) 70%, transparent)"
                        : "linear-gradient(90deg, transparent, rgba(255,255,255,0.04) 50%, transparent)",
                  }}
                />

                {/* Footer Content */}
                <div className="relative z-10 h-full">
                  {/* Header lip */}
                  <div
                    className="flex items-center justify-between px-5 sm:px-6"
                    style={{
                      height: headerH,
                      borderBottom:
                        activeIndex === totalCards
                          ? "1px solid rgba(255,255,255,0.07)"
                          : "1px solid rgba(255,255,255,0.03)",
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`font-mono text-xs font-medium transition-colors duration-500 ${
                          activeIndex === totalCards ? "text-signal" : "text-signal/35"
                        }`}
                      >
                        &#8734;
                      </span>
                      <span className="h-3 w-px bg-white/10" />
                      <span
                        className={`font-mono text-[0.7rem] uppercase tracking-[0.18em] transition-colors duration-500 ${
                          activeIndex === totalCards ? "text-white/60" : "text-white/35"
                        }`}
                      >
                        End of scroll
                      </span>
                    </div>

                    <button
                      onClick={scrollToTop}
                      className={`flex cursor-pointer items-center gap-2 font-mono text-[0.7rem] uppercase tracking-[0.16em] transition-all duration-300 hover:text-signal ${
                        activeIndex === totalCards ? "text-white/75" : "text-white/35"
                      }`}
                    >
                      <span>Back to top</span>
                      <span aria-hidden>&#8593;</span>
                    </button>
                  </div>

                  {/* Body */}
                  <div
                    className="flex flex-col items-center justify-start px-6 pt-24 text-center"
                    style={{ height: `calc(100% - ${headerH}px)` }}
                  >
                    <span className="hud-label mb-6 text-white/40">Let&apos;s connect</span>
                    <h3
                      className={`text-3xl font-semibold tracking-tight transition-colors duration-500 sm:text-4xl lg:text-5xl ${
                        activeIndex === totalCards ? "text-white" : "text-white/80"
                      }`}
                    >
                      Still here?{" "}
                      <span className="text-signal">Let&apos;s talk.</span>
                    </h3>

                    <p
                      className={`mt-4 max-w-md text-base leading-relaxed transition-colors duration-500 ${
                        activeIndex === totalCards ? "text-white/50" : "text-white/35"
                      }`}
                    >
                      Always down to chat about product, building things, or the occasional
                      helicopter story.
                    </p>

                    {/* Links */}
                    <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
                      <ScrambleLink className={pillClass} href="mailto:hello@willchung.io">
                        Email
                      </ScrambleLink>
                      <ScrambleLink
                        className={pillClass}
                        href="https://www.linkedin.com/in/willc121/"
                        target="_blank"
                        rel="noreferrer"
                      >
                        LinkedIn
                      </ScrambleLink>
                      <ScrambleLink
                        className={pillClass}
                        href="https://github.com/willc121"
                        target="_blank"
                        rel="noreferrer"
                      >
                        GitHub
                      </ScrambleLink>
                    </div>

                    {/* Divider */}
                    <div className="mx-auto mt-12 h-px w-full max-w-xs bg-gradient-to-r from-transparent via-white/8 to-transparent" />

                    {/* Copyright */}
                    <p className="mt-6 font-mono text-[0.65rem] uppercase tracking-[0.2em] text-white/20">
                      &copy; {currentYear} Will Chung &middot; Pilot &rarr; Product
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Floating scroll-to-top button */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-6 right-6 z-[200] flex h-11 w-11 items-center justify-center rounded-full
          border border-white/8 bg-surface/90 text-white/60 backdrop-blur-md
          transition-all duration-300
          hover:border-signal/30 hover:bg-surface-2 hover:text-signal
          ${showScrollTop ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"}`}
        aria-label="Scroll to top"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M18 15l-6-6-6 6" />
        </svg>
      </button>
    </>
  );
}
