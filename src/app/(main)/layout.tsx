import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import "../globals.css";
import ScrambleLink from "../../components/ScrambleLink";

export const metadata: Metadata = {
  title: "Will Chung | Pilot to Product",
  description: "Former Army Blackhawk pilot pivoting into product management. Building things. Breaking things.",
  openGraph: {
    title: "Will Chung | Pilot to Product",
    description: "Former Army Blackhawk pilot pivoting into product management. Building things. Breaking things.",
    url: "https://www.willchung.io",
    siteName: "Will Chung Portfolio",
    images: [
      {
        url: "https://www.willchung.io/og-image.png",
        width: 1200,
        height: 630,
        alt: "Will Chung - Pilot to Product",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Will Chung | Pilot to Product",
    description: "Former Army Blackhawk pilot pivoting into product management. Building things. Breaking things.",
    images: ["https://www.willchung.io/og-image.png"],
  },
  metadataBase: new URL("https://www.willchung.io"),
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
                {/* Logo only*/}
                <Link
                  href="/"
                  className="group flex items-center"
                  aria-label="Home"
                >
                 <span className="relative h-10 w-10 overflow-hidden rounded-lg
                  bg-white/12
                  ring-1 ring-sky-300/45
                  shadow-[0_0_0_1px_rgba(56,189,248,0.22),0_12px_30px_rgba(0,0,0,0.55)]
                  transition
                  group-hover:bg-white/16
                  group-hover:ring-sky-200/65
                  group-hover:shadow-[0_0_0_1px_rgba(56,189,248,0.25),0_10px_26px_rgba(0,0,0,0.45)]"
                  >
                    <Image
                      src="/icon.png"   // put your WC image in /public/wc.png
                      alt="WC"
                      fill
                      className="object-contain brightness-150 contrast-125 saturate-110"
                      priority
                    />
                  </span>
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