import Link from "next/link";
import StackedProjects from "../components/StackedProjects";
import ScrambleLink from "../components/ScrambleLink";

export default function Home() {
  return (
    <main className="min-h-screen text-foreground bg-background">
      {/* background atmosphere */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(70%_55%_at_12%_10%,rgba(56,189,248,0.18)_0%,rgba(17,19,24,0.0)_55%),radial-gradient(60%_50%_at_85%_25%,rgba(167,139,250,0.14)_0%,rgba(17,19,24,0.0)_60%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(6,7,10,0.2),rgba(6,7,10,0.85))]" />
      </div>

      <section className="mx-auto max-w-7xl px-6 pt-24">
        <p className="text-sm text-white/60">
          Product builder • technical depth • design-forward execution
        </p>

        <h1 className="mt-5 text-5xl font-semibold tracking-tight sm:text-7xl">
          <span className="bg-gradient-to-r from-sky-200 via-cyan-300 to-violet-200 bg-clip-text text-transparent">
            Will Chung
          </span>
        </h1>

        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/70">
          I build clear product narratives and sharp prototypes. I'm pivoting into
          product management and I like work at the intersection of UX, data, and
          shipping.
        </p>

        
      </section>

      {/* StackedProjects now includes the footer as the final card */}
      <StackedProjects />
    </main>
  );
}