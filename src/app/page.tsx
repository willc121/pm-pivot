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

      <section className="mx-auto max-w-7xl px-6 pt-10">
        <div className="flex items-center justify-between gap-12">
          {/* Text content */}
          <div className="flex-1">
            <p className="text-sm text-white/60">
              Lifelong Learner • Product Builder • Bias to Execute
            </p>

            <h1 className="mt-5 text-5xl font-semibold tracking-tight sm:text-7xl">
              <span className="bg-gradient-to-r from-sky-200 via-cyan-300 to-violet-200 bg-clip-text text-transparent">
                Will Chung
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/70">
              I'm a former Army Blackhawk pilot who moved into tech after earning my MBA at MIT Sloan. I'm currently
              a Product Marketing Manager at Microsoft and working toward a product management role. I like turning 
              messy problems into clear product narratives, quick prototypes, and data informed iterations.
            </p>
          </div>

          {/* Wireframe Blackhawk */}
          <div className="hidden lg:block">
            <div className="animate-float">
              <svg 
                viewBox="0 0 200 120" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
                className="w-72 h-44 drop-shadow-[0_0_20px_rgba(56,189,248,0.3)]"
              >
                {/* Main rotor */}
                <g className="origin-[100px_25px] animate-spin-rotor">
                  <line x1="20" y1="25" x2="180" y2="25" stroke="rgba(56,189,248,0.6)" strokeWidth="2"/>
                  <line x1="100" y1="18" x2="100" y2="32" stroke="rgba(56,189,248,0.4)" strokeWidth="1"/>
                </g>
                {/* Rotor mast */}
                <line x1="100" y1="25" x2="100" y2="45" stroke="rgba(56,189,248,0.5)" strokeWidth="2"/>
                {/* Cockpit */}
                <path d="M60 50 Q45 55 45 70 L45 80 Q45 88 55 88 L75 88" stroke="rgba(56,189,248,0.7)" strokeWidth="2" fill="none"/>
                {/* Body */}
                <path d="M75 45 L140 45 L155 55 L155 75 L140 88 L75 88 L60 75 L60 55 Z" stroke="rgba(56,189,248,0.7)" strokeWidth="2" fill="rgba(56,189,248,0.05)"/>
                {/* Tail boom */}
                <path d="M155 60 L185 52 L192 45 L192 70 L185 63 L155 68" stroke="rgba(56,189,248,0.5)" strokeWidth="2" fill="none"/>
                {/* Tail rotor */}
                <g className="origin-[192px_57px] animate-spin-rotor-fast">
                  <line x1="192" y1="40" x2="192" y2="75" stroke="rgba(168,85,247,0.6)" strokeWidth="2"/>
                </g>
                {/* Landing gear */}
                <line x1="70" y1="88" x2="58" y2="105" stroke="rgba(56,189,248,0.4)" strokeWidth="2"/>
                <line x1="135" y1="88" x2="147" y2="105" stroke="rgba(56,189,248,0.4)" strokeWidth="2"/>
                <line x1="50" y1="105" x2="155" y2="105" stroke="rgba(56,189,248,0.4)" strokeWidth="2"/>
                {/* Windows */}
                <rect x="65" y="52" width="18" height="14" rx="2" stroke="rgba(168,85,247,0.5)" strokeWidth="1.5" fill="rgba(168,85,247,0.1)"/>
                <rect x="88" y="52" width="12" height="14" rx="2" stroke="rgba(168,85,247,0.3)" strokeWidth="1" fill="rgba(168,85,247,0.05)"/>
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* StackedProjects now includes the footer as the final card */}
      <StackedProjects />
    </main>
  );
}