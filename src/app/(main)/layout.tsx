import type { Metadata } from "next";
import Link from "next/link";
import "../globals.css";
import ScrambleLink from "../../components/ScrambleLink";

export const metadata: Metadata = {
  title: "Will Chung | PM Portfolio",
  description: "Product management portfolio and projects for Will Chung.",
};

const navLinks = [
  { href: "mailto:hello@willchung.io", label: "Email", external: false },
  { href: "https://www.linkedin.com/in/willc121/", label: "LinkedIn", external: true },
  { href: "https://github.com/willc121", label: "GitHub", external: true },
];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased bg-slate-950 text-slate-100">
        <div className="min-h-screen flex flex-col">
          {/* Header */}
          <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur">
            <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between py-4">
                <Link
                  href="/"
                  className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-400 hover:text-sky-300 transition-colors"
                >
                  Will Chung
                </Link>

                <nav className="flex flex-wrap items-center gap-6 text-sm text-slate-300">
                  {navLinks.map((link) => (
                    <ScrambleLink
                      key={link.href}
                      href={link.href}
                      className="inline-block hover:text-sky-400 transition-colors"
                      target={link.external ? "_blank" : undefined}
                      rel={link.external ? "noreferrer" : undefined}
                    >
                      {link.label}
                    </ScrambleLink>
                  ))}
                </nav>
              </div>
            </div>
          </header>

          {/* Page content */}
          <main className="flex-1">{children}</main>

          {/* Footer */}
          <footer className="border-t border-slate-800/80 bg-slate-950/80">
            <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col gap-2 py-4 text-xs text-slate-500 md:flex-row md:items-center md:justify-between">
                <p>© {new Date().getFullYear()} Will Chung. All rights reserved.</p>

                          </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
