export default function ResumePage() {
  return (
    <section className="mx-auto max-w-5xl px-4 py-12 space-y-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-3xl font-semibold">Resume</h1>
        <a
          href="/resume.pdf"
          className="text-sm rounded-full border border-sky-500 px-4 py-2 text-sky-300 hover:bg-sky-500 hover:text-slate-950 transition"
        >
          Download PDF
        </a>
      </div>

      <p className="text-slate-300">
        This is a quick overview of my experience. The downloadable PDF contains the full details.
      </p>

      <div className="space-y-4 text-sm text-slate-200">
        <div>
          <h2 className="text-base font-semibold mb-1">Experience</h2>
          <ul className="space-y-2 text-slate-300">
            <li>
              <strong>Role @ Company</strong> – brief impact based description and key metrics.
            </li>
            <li>
              <strong>Role @ Company</strong> – another bullet or two to mirror your real resume.
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-base font-semibold mb-1">Education</h2>
          <p className="text-slate-300">
            MIT Sloan School of Management – MBA
          </p>
        </div>

        <div>
          <h2 className="text-base font-semibold mb-1">Skills</h2>
          <p className="text-slate-300">
            Product discovery, roadmapping, stakeholder communication, experimentation, SQL/analytics, etc.
          </p>
        </div>
      </div>
    </section>
  );
}
