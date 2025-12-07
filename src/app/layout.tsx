import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Will Chung | PM Portfolio",
  description: "Product management portfolio and projects for Will Chung.",
};

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/projects", label: "Projects" },
  { href: "/resume", label: "Resume" },
  { href: "/contact", label: "Contact" },
];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased bg-slate-950 text-slate-100">
        <div className="min-h-screen flex flex-col">
          {/* Header */}
          <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur">
            <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
              <Link
                href="/"
                className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-400"
              >
                Will Chung
              </Link>
              <nav className="flex flex-wrap gap-4 text-sm text-slate-300">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="hover:text-sky-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>
          </header>

          {/* Page content */}
          <main className="flex-1">{children}</main>

          {/* Footer */}
          <footer className="border-t border-slate-800/80 bg-slate-950/80">
            <div className="mx-auto flex max-w-5xl flex-col gap-2 px-4 py-4 text-xs text-slate-500 md:flex-row md:items-center md:justify-between">
              <p>© {new Date().getFullYear()} Will Chung. All rights reserved.</p>
              <p className="space-x-3">
                <a
                  href="mailto:willc121@gmail.com"
                  className="hover:text-sky-400"
                >
                  Email
                </a>
                <a
                  href="https://www.linkedin.com/in/willc121"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-sky-400"
                >
                  LinkedIn
                </a>
              </p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
