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
    <section className="mx-auto max-w-5xl px-4 py-12 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold">Projects</h1>
        <p className="text-slate-300">
          Selected projects that show how I approach product problems,
          make tradeoffs, and drive measurable outcomes.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {projects.map((p) => (
          <article
            key={p.title}
            className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-sm"
          >
            <p className="text-xs uppercase tracking-[0.22em] text-sky-400 mb-2">
              {p.role} • {p.timeframe}
            </p>
            <h2 className="text-lg font-semibold mb-2">
              {p.title}
            </h2>
            <p className="text-sm text-slate-300 mb-3">
              {p.summary}
            </p>
            <p className="text-xs text-slate-400">
              <span className="font-semibold text-slate-200">Impact: </span>
              {p.impact}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
