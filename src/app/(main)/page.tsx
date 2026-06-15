import Link from "next/link";
import StackedProjects from "../../components/StackedProjects";
import Helicopter from "../../components/Helicopter";
import ParticleField from "../../components/ParticleField";
import RadarSweep from "../../components/RadarSweep";
import TelemetryTicker from "../../components/TelemetryTicker";
import ScrambleText from "../../components/ScrambleText";

const metrics = [
  { k: "Now", v: "Microsoft", sub: "Product Manager" },
  { k: "Prev", v: "U.S. Army", sub: "MEDEVAC Pilot" },
  { k: "Edu", v: "MIT Sloan", sub: "MBA" },
];

export default function Home() {
  return (
    <main className="min-h-screen overflow-x-clip bg-background text-foreground noise-overlay">
      {/* Background atmosphere — blueprint grid + soft vignette */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 blueprint" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_15%_-10%,rgba(242,180,65,0.06)_0%,transparent_55%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent,rgba(8,9,12,0.9))]" />
      </div>

      <section className="relative overflow-hidden">
        {/* Live particle network */}
        <ParticleField className="absolute inset-0 opacity-70" />

        <div className="relative z-10 mx-auto max-w-7xl px-6 pt-16 pb-12 lg:pt-20">
          <div className="flex items-center justify-between gap-16">
            {/* Left: editorial text block */}
            <div className="min-w-0 flex-1">
              {/* HUD eyebrow */}
              <div className="animate-fade-in-up delay-0 flex items-center gap-3">
                <span className="status-dot" />
                <span className="hud-label">Pilot &rarr; Product</span>
                <span className="h-px w-8 bg-white/15" />
                <span className="hud-label text-white/30">Field Notes &mdash; SF</span>
              </div>

              {/* Headline */}
              <h1 className="animate-fade-in-up delay-100 mt-6 text-5xl font-semibold leading-[0.98] tracking-tight sm:text-7xl">
                Will Chung
              </h1>

              <p className="animate-fade-in-up delay-200 mt-4 flex flex-wrap items-baseline gap-x-3 gap-y-1 text-xl font-medium text-white/80 sm:text-2xl">
                Product Manager
                <span className="font-mono text-base font-normal text-signal/80">
                  @ Microsoft
                </span>
              </p>

              {/* Live terminal status line */}
              <div className="animate-fade-in-up delay-300 mt-5 flex items-center gap-2 font-mono text-sm">
                <span className="text-signal">&gt;</span>
                <span className="text-white/45">currently</span>
                <ScrambleText
                  className="font-medium text-signal/90"
                  phrases={[
                    "building MCP servers",
                    "training vision classifiers",
                    "wiring data pipelines",
                    "shipping software",
                  ]}
                />
                <span className="inline-block h-4 w-[7px] bg-signal/70 animate-blink" />
              </div>

              {/* Lead */}
              <p className="animate-fade-in-up delay-400 mt-6 max-w-2xl text-[1.05rem] leading-relaxed text-white/60">
                Former Army MEDEVAC Blackhawk pilot turned Product Manager. I made the
                pivot through MIT Sloan, and I build things to prove ideas &mdash; from MCP
                servers to vision classifiers. I turn ambiguity into shipping software.
              </p>

              {/* Metadata readout */}
              <dl className="animate-fade-in-up delay-500 mt-9 grid max-w-xl grid-cols-3 gap-px overflow-hidden rounded-lg border border-white/[0.08] bg-white/[0.02]">
                {metrics.map((m) => (
                  <div key={m.k} className="bg-background/40 px-4 py-3.5">
                    <dt className="font-mono text-[0.6rem] uppercase tracking-[0.22em] text-white/35">
                      {m.k}
                    </dt>
                    <dd className="mt-1.5 text-sm font-semibold text-white/90">{m.v}</dd>
                    <dd className="text-xs text-white/45">{m.sub}</dd>
                  </div>
                ))}
              </dl>

              {/* CTAs */}
              <div className="animate-fade-in-up delay-600 mt-9 flex flex-wrap items-center gap-3">
                <Link
                  href="#work"
                  className="group inline-flex items-center gap-2 rounded-full border border-signal/40 bg-signal/[0.08] px-5 py-2.5 text-sm font-medium text-signal transition-all duration-300 hover:border-signal/70 hover:bg-signal/[0.14]"
                >
                  View the work
                  <span className="transition-transform duration-300 group-hover:translate-y-0.5">
                    &darr;
                  </span>
                </Link>
                <a
                  href="mailto:hello@willchung.io"
                  className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.03] px-5 py-2.5 text-sm text-white/70 transition-all duration-300 hover:border-white/25 hover:text-white"
                >
                  Get in touch
                </a>
              </div>
            </div>

            {/* Right: helicopter over a live radar */}
            <div className="animate-fade-in-up delay-500 hidden flex-shrink-0 lg:block">
              <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.015] p-6">
                {/* Radar sweep behind */}
                <RadarSweep />

                {/* Corner brackets */}
                <span className="pointer-events-none absolute left-2 top-2 z-20 h-4 w-4 border-l border-t border-signal/40" />
                <span className="pointer-events-none absolute right-2 top-2 z-20 h-4 w-4 border-r border-t border-signal/40" />
                <span className="pointer-events-none absolute bottom-2 left-2 z-20 h-4 w-4 border-b border-l border-signal/40" />
                <span className="pointer-events-none absolute bottom-2 right-2 z-20 h-4 w-4 border-b border-r border-signal/40" />

                <div className="relative z-10">
                  <Helicopter />

                  <div className="mt-2 flex items-center justify-between font-mono text-[0.6rem] uppercase tracking-[0.2em] text-white/35">
                    <span>UH-60 <span className="text-signal/60">//</span> MEDEVAC</span>
                    <span className="flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-signal animate-blink" />
                      Rotors turning
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Telemetry ticker */}
      <TelemetryTicker />

      {/* Section index divider */}
      <div id="work" className="mx-auto max-w-7xl scroll-mt-24 px-6 pt-10">
        <div className="flex items-center justify-between border-t border-white/[0.08] pt-5">
          <span className="hud-label text-white/55">Selected Work</span>
          <span className="hud-label text-white/30">Scroll &darr;</span>
        </div>
      </div>

      {/* StackedProjects includes the footer as the final card */}
      <StackedProjects />
    </main>
  );
}
