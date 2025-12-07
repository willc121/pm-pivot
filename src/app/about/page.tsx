export default function AboutPage() {
  return (
    <section className="mx-auto max-w-5xl px-4 py-12 space-y-6">
      <h1 className="text-3xl font-semibold mb-2">About</h1>
      <p className="text-slate-300">
        I am a product manager with a background in military operations and an MBA from MIT Sloan.
        I like working on complex, ambiguous problems where clear thinking and strong execution
        matter more than flashy features.
      </p>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-400">
            What I bring as a PM
          </h2>
          <ul className="list-disc space-y-1 pl-5 text-slate-300">
            <li>Experience leading cross functional teams under pressure.</li>
            <li>Comfort with data, experimentation, and metrics driven decisions.</li>
            <li>Clear written and verbal communication with technical and business partners.</li>
          </ul>
        </div>
        <div className="space-y-2">
          <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-400">
            Focus areas
          </h2>
          <ul className="list-disc space-y-1 pl-5 text-slate-300">
            <li>Product discovery and user research.</li>
            <li>Defining strategy and roadmaps tied to outcomes.</li>
            <li>Launch execution and iteration after launch.</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
