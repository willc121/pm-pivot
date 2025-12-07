export default function ContactPage() {
  return (
    <section className="mx-auto max-w-5xl px-4 py-12 space-y-6">
      <h1 className="text-3xl font-semibold">Contact</h1>
      <p className="text-slate-300">
        For product management opportunities or collaboration, the easiest way to reach me is by email or LinkedIn.
      </p>

      <div className="space-y-3 text-slate-200">
        <p>
          <span className="font-semibold">Email: </span>
          <a
            href="mailto:willc121@gmail.com"
            className="text-sky-400 hover:text-sky-300"
          >
            willc121@gmail.com
          </a>
        </p>
        <p>
          <span className="font-semibold">LinkedIn: </span>
          <a
            href="https://www.linkedin.com/in/willc121/"
            target="_blank"
            rel="noreferrer"
            className="text-sky-400 hover:text-sky-300"
          >
            linkedin.com/in/willc121
          </a>
        </p>
      </div>
    </section>
  );
}
