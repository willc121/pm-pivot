"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { projects, type Project } from "@/data/projects"
import ScrambleLink from "./ScrambleLink";

type CardEl = HTMLDivElement | null;

export default function StackedProjects() {
  const [activeIndex, setActiveIndex] = useState(0);
  const cardRefs = useRef<CardEl[]>([]);
  const footerRef = useRef<HTMLDivElement>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Copy state for footer
  const [copied, setCopied] = useState(false);
  const copyTimerRef = useRef<number | null>(null);

  // TUNING - adjust these for your design
  const stickyTopBase = 15; // px - where first card sticks
  const headerH = 64; // 👈 ADJUST HERE (was 56) - header lip height

  type ProjectWithN = Project & { n: string; image?: string }

  const formatted: ProjectWithN[] = projects.map((p: Project, i: number) => ({
    ...p,
    image: p.image,
    n: String(i + 1).padStart(3, "0"),
  }))

  const totalCards = formatted.length;
  const currentYear = new Date().getFullYear();

  // Cleanup copy timer
  useEffect(() => {
    return () => {
      if (copyTimerRef.current) window.clearTimeout(copyTimerRef.current);
    };
  }, []);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText("hello@willchung.io");
      setCopied(true);
      if (copyTimerRef.current) window.clearTimeout(copyTimerRef.current);
      copyTimerRef.current = window.setTimeout(() => setCopied(false), 1200);
    } catch {
      // Fallback if clipboard is blocked
      window.location.href = "mailto:hello@willchung.io";
    }
  };

  // Scroll detection
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

      // Check if footer is active
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
    "rounded-2xl border border-white/12 bg-white/[0.02] px-4 py-2 text-sm text-white/75 backdrop-blur-sm transition-colors hover:border-white/18 hover:bg-white/[0.05] hover:text-white/90";

  // Reusable card wrapper styles
  const getCardWrapperClass = (isActive: boolean) =>
    [
      "group relative isolate rounded-3xl",
      "transition-transform duration-300 ease-out",
      isActive ? "hover:-translate-y-1" : "",
    ].join(" ");

  return (
    <>
      <section className="pt-4">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Cards Container */}
          <div className="relative mt-10">
            {formatted.map((p, i) => {
              const isActive = i === activeIndex;
              const z = 100 + i;
              const top = stickyTopBase + i * headerH;
              const haloOpacity = isActive ? 0.6 : 0.2;

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
                  <div className={getCardWrapperClass(isActive)}>
                    {/* Halo glow */}
                    <div
                      className="pointer-events-none absolute -inset-8 rounded-[40px] blur-3xl transition-opacity duration-500"
                      style={{
                        opacity: haloOpacity,
                        background:
                          "radial-gradient(800px circle at 15% 20%, rgba(56,189,248,0.30), transparent 50%), radial-gradient(600px circle at 85% 25%, rgba(168,85,247,0.22), transparent 50%)",
                      }}
                    />

                    {/* Card surface - solid background to cover cards below */}
                    <div
                      className="absolute inset-0 rounded-3xl backdrop-blur-xl transition-all duration-300"
                      style={{
                        background: isActive
                          ? "linear-gradient(180deg, #232b38 0%, #1e2530 100%)"
                          : "linear-gradient(180deg, #1f2733 0%, #1a2029 100%)",
                        border: isActive
                          ? "1px solid rgba(255,255,255,0.22)"
                          : "1px solid rgba(255,255,255,0.12)",
                        boxShadow: isActive
                          ? "0 0 0 1px rgba(255,255,255,0.08), 0 50px 100px -40px rgba(0,0,0,0.8)"
                          : "0 0 0 1px rgba(255,255,255,0.04), 0 25px 60px -30px rgba(0,0,0,0.5)",
                      }}
                    />

                    {/* Sheen */}
                    <div
                      className="pointer-events-none absolute inset-0 rounded-3xl"
                      style={{
                        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.12)",
                        background: "linear-gradient(180deg, rgba(255,255,255,0.05) 0%, transparent 20%)",
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
                            ? "1px solid rgba(255,255,255,0.1)"
                            : "1px solid rgba(255,255,255,0.06)",
                        }}
                      >
                        <div className="flex items-center gap-3 text-xs">
  <span
    className={`font-mono font-medium transition-colors duration-300 ${
      isActive ? "text-sky-400" : "text-sky-400/60"
    }`}
  >
    {p.n}
  </span>
  <span className="text-white/20">•</span>
  <span
  className={`font-semibold text-sm sm:text-xl md:text-2xl transition-colors duration-300 ${
    isActive ? "text-white/90" : "text-white/60"
  }`}
>
  {p.title}
</span>

  <span className="text-white/20">•</span>
  <span
    className={`rounded-full border px-3 py-1 transition-all duration-300 ${
      isActive
        ? "border-white/12 bg-white/[0.06] text-sky-300"
        : "border-white/8 bg-white/[0.03] text-sky-300/60"
    }`}
  >
    {p.outcome}
  </span>
</div>

                        <Link
                          href={p.link || `/projects/${p.slug}`}
                          target={p.external ? "_blank" : undefined}
                          rel={p.external ? "noopener noreferrer" : undefined}

                          className={`flex items-center gap-2 text-sm transition-colors duration-300 hover:text-white ${
                            isActive ? "text-white/85" : "text-white/50"
                          }`}
                        >
                          <span>{p.cta || "Check it out"}</span>
                          <span
                            aria-hidden
                            className="transition-transform duration-300 hover:translate-x-0.5 hover:-translate-y-0.5"
                          >
                            ↗
                          </span>
                        </Link>
                      </div>

                      {/* Body - 👈 ADJUST HERE: p-8 and gap-8 (was p-6 gap-6) */}
                      <div className="grid grid-cols-1 gap-8 p-8 lg:grid-cols-2">
                        <div className="flex flex-col justify-between">
                          <div>
                            <h3
                              className={`text-2xl font-semibold tracking-tight transition-colors duration-300 ${
                                isActive ? "text-white" : "text-white/90"
                              }`}
                            >
                              {p.title}
                            </h3>
                            <p
                              className={`mt-3 text-sm leading-relaxed transition-colors duration-300 ${
                                isActive ? "text-white/75" : "text-white/60"
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
                                  className={`rounded-full px-3 py-1 text-xs ring-1 ring-inset transition-all duration-300 ${
                                    isActive
                                      ? "bg-white/[0.05] text-white/85 ring-white/12"
                                      : "bg-white/[0.03] text-white/70 ring-white/8"
                                  }`}
                                >
                                  {t}
                                </span>
                              ))}
                            </div>
                            <div
                              className={`text-sm transition-colors duration-300 ${
                                isActive ? "text-sky-300" : "text-sky-300/60"
                              }`}
                            >
    
                            </div>
                          </div>
                        </div>

                        {/* Image - 👈 ADJUST HERE: h-[360px] (was h-[280px]) */}
                        <div className="relative h-[360px] overflow-hidden rounded-2xl bg-white/[0.03]">
                          {p.image && (
                            <img
                              src={p.image}
                              alt={p.title}
                              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                            />
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-[#171d27]/30 to-transparent" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Spacer - creates scroll room for next card (not on last card) */}
                  {i < totalCards - 1 && <div style={{ height: headerH + -10 }} />}
                </div>
              );
            })}

            {/* ==================== FOOTER CARD ==================== */}
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
                {/* Halo glow */}
                <div
                  className="pointer-events-none absolute -inset-8 -z-10 rounded-[40px] blur-3xl transition-opacity duration-500"
                  style={{
                    opacity: activeIndex === totalCards ? 0.6 : 0.2,
                    background:
                      "radial-gradient(800px circle at 15% 20%, rgba(56,189,248,0.30), transparent 50%), radial-gradient(600px circle at 85% 25%, rgba(168,85,247,0.22), transparent 50%)",
                  }}
                />

                {/* Card surface */}
                <div
                  className="absolute inset-0 rounded-3xl transition-all duration-300"
                  style={{
                    background:
                      activeIndex === totalCards
                        ? "linear-gradient(180deg, #232b38 0%, #1e2530 100%)"
                        : "linear-gradient(180deg, #1f2733 0%, #1a2029 100%)",
                    border:
                      activeIndex === totalCards
                        ? "1px solid rgba(255,255,255,0.22)"
                        : "1px solid rgba(255,255,255,0.12)",
                    boxShadow:
                      activeIndex === totalCards
                        ? "0 0 0 1px rgba(255,255,255,0.08), 0 50px 100px -40px rgba(0,0,0,0.8)"
                        : "0 0 0 1px rgba(255,255,255,0.04), 0 25px 60px -30px rgba(0,0,0,0.5)",
                  }}
                />

                {/* Sheen */}
                <div
                  className="pointer-events-none absolute inset-0 rounded-3xl"
                  style={{
                    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.12)",
                    background: "linear-gradient(180deg, rgba(255,255,255,0.05) 0%, transparent 20%)",
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
                          ? "1px solid rgba(255,255,255,0.1)"
                          : "1px solid rgba(255,255,255,0.06)",
                    }}
                  >
                    <div className="flex items-center gap-3 text-xs">
                      <span
                        className={`font-mono font-medium transition-colors duration-300 ${
                          activeIndex === totalCards ? "text-sky-400" : "text-sky-400/60"
                        }`}
                      >
                        ∞
                      </span>
                      <span className="text-white/20">•</span>
                      <span
                        className={`transition-colors duration-300 ${
                          activeIndex === totalCards ? "text-white/70" : "text-white/50"
                        }`}
                      >
                        End of scroll
                      </span>
                    </div>

                    <button
                      onClick={scrollToTop}
                      className={`flex cursor-pointer items-center gap-2 text-sm transition-colors duration-300 hover:text-white ${
                        activeIndex === totalCards ? "text-white/85" : "text-white/50"
                      }`}
                    >
                      <span>Back to top</span>
                      <span aria-hidden>↑</span>
                    </button>
                  </div>

                  {/* Body */}
                  {/* Body */}
<div
  className="flex flex-col items-center justify-start pt-24 px-6 text-center"
  style={{ height: `calc(100% - ${headerH}px)` }}
>
                    <h3
                      className={`text-3xl font-semibold tracking-tight transition-colors duration-300 sm:text-4xl lg:text-5xl ${
                        activeIndex === totalCards ? "text-white" : "text-white/90"
                      }`}
                    >
                      Still here?{" "}
                      <span className="bg-gradient-to-r from-sky-400 to-violet-400 bg-clip-text text-transparent">
                        Let's talk.
                      </span>
                    </h3>

                    <p
                      className={`mt-4 max-w-lg text-base leading-relaxed transition-colors duration-300 sm:text-lg ${
                        activeIndex === totalCards ? "text-white/60" : "text-white/50"
                      }`}
                    >
                      Open to PM roles where design taste and technical execution matter.
                    </p>

                    {/* Links */}
                    <div className="mt-8 flex flex-col items-center justify-center gap-4">
                      <div className="flex flex-wrap items-center justify-center gap-3">
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
                    </div>

                    {/* Divider */}
                    <div className="mx-auto mt-10 h-px w-full max-w-xs bg-gradient-to-r from-transparent via-white/10 to-transparent" />

                    {/* Copyright */}
                    <p className="mt-6 font-mono text-xs text-white/30">
                      // Built with Next.js + Tailwind, {currentYear}
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
        className={`fixed bottom-6 right-6 z-[200] flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-[#1e2530]/90 text-white/70 backdrop-blur-sm transition-all duration-300 hover:border-white/20 hover:bg-[#1e2530] hover:text-white ${
          showScrollTop ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
        }`}
        aria-label="Scroll to top"
      >
        <svg
          width="18"
          height="18"
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