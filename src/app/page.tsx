export default function Home() {
  return (
    <section className="mx-auto max-w-5xl px-4 py-16">
      <div className="max-w-2xl rounded-2xl border border-slate-800 bg-slate-900/60 p-8 shadow-lg">
        <p className="text-sm uppercase tracking-[0.25em] text-sky-400 mb-3">
          Product Management Portfolio
        </p>
        <h1 className="text-3xl md:text-4xl font-semibold mb-4">
          Will Chung
        </h1>
        <p className="text-slate-300 mb-6">
          This site will showcase my product case studies, thinking, and
          outcomes. Check back soon as I add real projects and stories.
        </p>
        <button className="inline-flex items-center gap-2 rounded-full bg-sky-500 px-5 py-2 text-sm font-medium text-slate-950 hover:bg-sky-400 transition">
          What I'm working on
        </button>
      </div>
    </section>
  );
}
