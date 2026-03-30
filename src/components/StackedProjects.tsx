"use client";

import Link from "next/link";
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

  const [copied, setCopied] = useState(false);
  const copyTimerRef = useRef<number | null>(null);

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

  useEffect(() => {
    return () => {
      if (copyTimerRef.current) window.clearTimeout(copyTimerRef.current);
    };
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>, index: number) => {
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
    "rounded-full border border-white/10 bg-white/[0.03] px-5 py-2.5 text-sm text-white/70 backdrop-blur-sm transition-all duration-300 hover:border-white/20 hover:bg-white/[0.06] hover:text-white hover:shadow-[0_0_20px_rgba(56,189,248,0.08)]";

  const getCardWrapperClass = (isActive: boolean) =>
    [
      "group relative isolate rounded-3xl overflow-hidden",
      "transition-all duration-500 ease-out",
      isActive ? "hover:-translate-y-1" : "",
    ].join(" ");

  return (
    <>
      <section className="pt-6">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative mt-10">
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
                    onMouseMove={(e) => isActive && handleMouseMove(e, i)}
                    onMouseLeave={handleMouseLeave}
                  >
                    {/* Mouse-tracking spotlight */}
                    {isActive && mousePos && (
                      <div
                        className="pointer-events-none absolute -inset-px rounded-3xl opacity-100 transition-opacity duration-500 z-[1]"
                        style={{
                          background: `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, rgba(56,189,248,0.06), transparent 40%)`,
                        }}
                      />
                    )}

                    {/* Card surface */}
                    <div
                      className="absolute inset-0 rounded-3xl transition-all duration-500"
                      style={{
                        background: isActive
                          ? "linear-gradient(180deg, rgba(20,28,40,0.98) 0%, rgba(15,21,32,0.98) 100%)"
                          : "linear-gradient(180deg, rgba(18,24,35,0.98) 0%, rgba(13,18,28,0.98) 100%)",
                        border: isActive
                          ? "1px solid rgba(255,255,255,0.12)"
                          : "1px solid rgba(255,255,255,0.06)",
                        boxShadow: isActive
                          ? "0 0 0 1px rgba(255,255,255,0.04), 0 25px 80px -20px rgba(0,0,0,0.7), 0 0 40px rgba(56,189,248,0.04)"
                          : "0 0 0 1px rgba(255,255,255,0.02), 0 15px 40px -15px rgba(0,0,0,0.4)",
                      }}
                    />

                    {/* Top edge highlight */}
                    <div
                      className="pointer-events-none absolute inset-x-0 top-0 h-px rounded-t-3xl"
                      style={{
                        background: isActive
                          ? "linear-gradient(90deg, transparent, rgba(255,255,255,0.1) 30%, rgba(56,189,248,0.15) 50%, rgba(255,255,255,0.1) 70%, transparent)"
                          : "linear-gradient(90deg, transparent, rgba(255,255,255,0.04) 50%, transparent)",
                      }}
                    />

                    {/* Content */}
                    <div className="relative z-10">
                      {/* Header lip */}
                      <div
                        className="flex items-center justify-between px-6"
                        style={{
                          height: headerH,
                          borderBottom: isActive
                            ? "1px solid rgba(255,255,255,0.07)"
                            : "1px solid rgba(255,255,255,0.03)",
                        }}
                      >
                        <div className="flex items-center gap-3 text-xs">
                          <span
                            className={`font-mono font-medium transition-colors duration-500 ${
                              isActive ? "text-sky-400" : "text-sky-400/40"
                            }`}
                          >
                            {p.n}
                          </span>
                          <span className="text-white/15">·</span>
                          <span
                            className={`font-semibold text-sm sm:text-xl md:text-2xl transition-colors duration-500 ${
                              isActive ? "text-white/90" : "text-white/50"
                            }`}
                          >
                            {p.title}
                          </span>
                          <span className="text-white/15">·</span>
                          <span
                            className={`rounded-full border px-3 py-1 text-xs transition-all duration-500 ${
                              isActive
                                ? "border-sky-400/20 bg-sky-400/[0.06] text-sky-300"
                                : "border-white/6 bg-white/[0.02] text-sky-300/40"
                            }`}
                          >
                            {p.outcome}
                          </span>
                        </div>

                        <Link
                          href={p.link || `/projects/${p.slug}`}
                          target={p.external ? "_blank" : undefined}
                          rel={p.external ? "noopener noreferrer" : undefined}
                          className={`flex items-center gap-2 text-sm transition-all duration-300 group/link ${
                            isActive ? "text-white/80 hover:text-white" : "text-white/40"
                          }`}
                        >
                          <span>{p.cta || "Check it out"}</span>
                          <span
                            aria-hidden
                            className="transition-transform duration-300 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5"
                          >
                            ↗
                          </span>
                        </Link>
                      </div>

                      {/* Body */}
                      <div className="grid grid-cols-1 gap-8 p-8 lg:grid-cols-2">
                        <div className="flex flex-col justify-between">
                          <div>
                            <p
                              className={`mt-1 text-[15px] leading-relaxed transition-colors duration-500 ${
                                isActive ? "text-white/70" : "text-white/45"
                              }`}
                            >
                              {p.description}
                            </p>
                          </div>

                          <div className="mt-5 space-y-4">
                            <div className="flex flex-wrap gap-2">
                              {p.tags.map((t) => (
                                <span
                                  key={t}
                                  className={`rounded-full px-3 py-1 text-xs ring-1 ring-inset transition-all duration-500 ${
                                    isActive
                                      ? "bg-white/[0.04] text-white/75 ring-white/10"
                                      : "bg-white/[0.02] text-white/50 ring-white/5"
                                  }`}
                                >
                                  {t}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Image */}
                        <div className="relative aspect-[16/9] overflow-hidden rounded-2xl bg-white/[0.02] ring-1 ring-white/[0.06]">
                          {p.image && (
                            <img
                              src={p.image}
                              alt={p.title}
                              className="h-full w-full object-contain transition-transform duration-700 group-hover:scale-[1.03]"
                            />
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0e17]/20 to-transparent" />
                        </div>
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
                  className="absolute inset-0 rounded-3xl transition-all duration-500"
                  style={{
                    background:
                      activeIndex === totalCards
                        ? "linear-gradient(180deg, rgba(20,28,40,0.98) 0%, rgba(15,21,32,0.98) 100%)"
                        : "linear-gradient(180deg, rgba(18,24,35,0.98) 0%, rgba(13,18,28,0.98) 100%)",
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
                  className="pointer-events-none absolute inset-x-0 top-0 h-px rounded-t-3xl"
                  style={{
                    background:
                      activeIndex === totalCards
                        ? "linear-gradient(90deg, transparent, rgba(255,255,255,0.1) 30%, rgba(56,189,248,0.15) 50%, rgba(255,255,255,0.1) 70%, transparent)"
                        : "linear-gradient(90deg, transparent, rgba(255,255,255,0.04) 50%, transparent)",
                  }}
                />

                {/* Footer Content */}
                <div className="relative z-10 h-full">
                  {/* Header lip */}
                  <div
                    className="flex items-center justify-between px-6"
                    style={{
                      height: headerH,
                      borderBottom:
                        activeIndex === totalCards
                          ? "1px solid rgba(255,255,255,0.07)"
                          : "1px solid rgba(255,255,255,0.03)",
                    }}
                  >
                    <div className="flex items-center gap-3 text-xs">
                      <span
                        className={`font-mono font-medium transition-colors duration-500 ${
                          activeIndex === totalCards ? "text-sky-400" : "text-sky-400/40"
                        }`}
                      >
                        ∞
                      </span>
                      <span className="text-white/15">·</span>
                      <span
                        className={`transition-colors duration-500 ${
                          activeIndex === totalCards ? "text-white/60" : "text-white/35"
                        }`}
                      >
                        End of scroll
                      </span>
                    </div>

                    <button
                      onClick={scrollToTop}
                      className={`flex cursor-pointer items-center gap-2 text-sm transition-all duration-300 hover:text-white ${
                        activeIndex === totalCards ? "text-white/80" : "text-white/40"
                      }`}
                    >
                      <span>Back to top</span>
                      <span aria-hidden>↑</span>
                    </button>
                  </div>

                  {/* Body */}
                  <div
                    className="flex flex-col items-center justify-start pt-24 px-6 text-center"
                    style={{ height: `calc(100% - ${headerH}px)` }}
                  >
                    <h3
                      className={`text-3xl font-bold tracking-tight transition-colors duration-500 sm:text-4xl lg:text-5xl ${
                        activeIndex === totalCards ? "text-white" : "text-white/80"
                      }`}
                    >
                      Still here?{" "}
                      <span className="bg-gradient-to-r from-sky-400 to-violet-400 bg-clip-text text-transparent">
                        Let&apos;s talk.
                      </span>
                    </h3>

                    <p
                      className={`mt-4 max-w-md text-base leading-relaxed transition-colors duration-500 ${
                        activeIndex === totalCards ? "text-white/50" : "text-white/35"
                      }`}
                    >
                      Always down to chat about product, building things, or the occasional helicopter story.
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
                    <p className="mt-6 font-mono text-xs text-white/20">
                      © {currentYear} Will Chung
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
          border border-white/8 bg-[#0f1520]/90 text-white/60 backdrop-blur-md
          transition-all duration-300
          hover:border-white/15 hover:bg-[#141c2b] hover:text-white
          hover:shadow-[0_0_20px_rgba(56,189,248,0.08)]
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
