import StackedProjects from "../../components/StackedProjects";
import Helicopter from "../../components/Helicopter";

export default function Home() {
  return (
    <main className="min-h-screen text-foreground bg-background noise-overlay">
      {/* Background atmosphere — refined gradient mesh */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_10%_-5%,rgba(56,189,248,0.14)_0%,transparent_55%),radial-gradient(ellipse_60%_40%_at_90%_20%,rgba(139,92,246,0.10)_0%,transparent_55%),radial-gradient(ellipse_50%_30%_at_50%_80%,rgba(56,189,248,0.06)_0%,transparent_50%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(10,14,23,0.1),rgba(10,14,23,0.95))]" />
      </div>

      <section className="mx-auto max-w-7xl px-6 pt-14 pb-4">
        <div className="flex items-start justify-between gap-16">
          {/* Left: text with staggered entrance */}
          <div className="flex-1">
            <div>
              <div className="mt-5 flex flex-wrap items-center gap-4 sm:flex-nowrap">
                <h1 className="animate-fade-in-up delay-0 min-w-0 text-5xl font-bold tracking-tight sm:text-7xl leading-none">
                  <span className="animate-gradient-text bg-gradient-to-r from-sky-200 via-cyan-300 to-violet-300 bg-clip-text text-transparent">
                    Will Chung
                  </span>
                </h1>

                <span className="animate-fade-in-up delay-200 shrink-0 whitespace-nowrap inline-flex items-center translate-y-[7px] gap-1.5
                  rounded-full border border-emerald-400/50 bg-emerald-400/10
                  px-3 py-1 text-base font-semibold text-emerald-300
                  shadow-[0_0_0_1px_rgba(52,211,153,0.15),0_10px_25px_rgba(52,211,153,0.12)]
                  sm:px-4 sm:py-1.5 sm:text-lg">
                  <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Pilot → Product
                </span>
              </div>
            </div>

            <p className="animate-fade-in-up delay-300 mt-6 max-w-2xl text-lg leading-relaxed text-white/65">
              Former Army MEDEVAC Blackhawk pilot turned Product Manager at Microsoft.
              I made the pivot through MIT Sloan, and I build things to prove ideas —
              from MCP servers to vision classifiers.
              I turn ambiguity into shipping software.
            </p>

            {/* Subtle accent line */}
            <div className="animate-fade-in-up delay-400 mt-8 h-px w-24 bg-gradient-to-r from-sky-400/50 to-transparent" />
          </div>

          {/* Right: helicopter with parallax */}
          <div className="hidden lg:block flex-shrink-0 animate-fade-in-up delay-500">
            <Helicopter />
          </div>
        </div>
      </section>

      {/* StackedProjects includes the footer as the final card */}
      <StackedProjects />
    </main>
  );
}
