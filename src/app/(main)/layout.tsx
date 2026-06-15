import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import "../globals.css";
import { fontVariables } from "@/lib/fonts";
import ScrambleLink from "../../components/ScrambleLink";

export const metadata: Metadata = {
  title: "Will Chung | Product Manager",
  description: "Former Army MEDEVAC Blackhawk pilot turned Product Manager at Microsoft. Building things. Shipping software.",
  openGraph: {
    title: "Will Chung | Product Manager",
    description: "Former Army MEDEVAC Blackhawk pilot turned Product Manager at Microsoft. Building things. Shipping software.",
    url: "https://www.willchung.io",
    siteName: "Will Chung",
    images: [
      {
        url: "https://www.willchung.io/og-image-2.png",
        width: 1200,
        height: 630,
        alt: "Will Chung - Pilot to Product Manager",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Will Chung | Product Manager",
    description: "Former Army MEDEVAC Blackhawk pilot turned Product Manager at Microsoft. Building things. Shipping software.",
    images: ["https://www.willchung.io/og-image-2.png"],
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
    <html lang="en" className={`dark ${fontVariables}`}>
      <body className="font-sans antialiased bg-background text-foreground">
        <div className="min-h-screen flex flex-col">
          {/* ─── Header ─── */}
          <header className="sticky top-0 z-[300] border-b border-white/[0.07] bg-background/70 backdrop-blur-xl">
            <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between py-3.5">
                {/* Brand / callsign */}
                <Link href="/" className="group flex items-center gap-3" aria-label="Home">
                  <span
                    className="relative grid h-9 w-9 place-items-center overflow-hidden rounded-md
                      border border-white/15 bg-white/[0.04]
                      transition-all duration-300
                      group-hover:border-signal/50 group-hover:bg-white/[0.07]"
                  >
                    <Image
                      src="/icon.png"
                      alt="WC"
                      fill
                      className="object-contain p-1 brightness-150 contrast-125"
                      priority
                    />
                  </span>
                  <span className="flex flex-col leading-none">
                    <span className="text-[0.95rem] font-semibold tracking-tight text-white">
                      Will Chung
                    </span>
                    <span className="mt-1 font-mono text-[0.6rem] uppercase tracking-[0.24em] text-white/40">
                      PM <span className="text-signal/70">//</span> Builder
                    </span>
                  </span>
                </Link>

                {/* Nav */}
                <nav className="flex flex-wrap items-center gap-5 sm:gap-7">
                  <span className="hidden items-center gap-2 sm:flex">
                    <span className="status-dot" />
                    <span className="font-mono text-[0.6rem] uppercase tracking-[0.22em] text-white/45">
                      Open to connect
                    </span>
                  </span>
                  <span className="hidden h-3 w-px bg-white/10 sm:block" />
                  {navLinks.map((link) => (
                    <ScrambleLink
                      key={link.href}
                      href={link.href}
                      className="link-underline font-mono text-[0.7rem] uppercase tracking-[0.18em] text-white/55 transition-colors duration-300 hover:text-white"
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

          {/* ─── Footer ─── */}
          <footer className="border-t border-white/[0.07] bg-background">
            <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col gap-2 py-5 font-mono text-[0.65rem] uppercase tracking-[0.2em] text-white/30 md:flex-row md:items-center md:justify-between">
                <p>© {new Date().getFullYear()} Will Chung</p>
                <p className="text-white/25">
                  Pilot <span className="text-signal/50">&rarr;</span> Product
                </p>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
