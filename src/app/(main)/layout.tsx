import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import "../globals.css";
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
    <html lang="en" className="dark">
      <body className="antialiased bg-[#0a0e17] text-slate-100">
        <div className="min-h-screen flex flex-col">
          {/* Header */}
          <header className="border-b border-white/[0.06] bg-[#0a0e17]/80 backdrop-blur-xl sticky top-0 z-[300]">
            <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between py-4">
                <Link
                  href="/"
                  className="group flex items-center"
                  aria-label="Home"
                >
                  <span className="relative h-10 w-10 overflow-hidden rounded-lg
                    bg-white/8
                    ring-1 ring-white/15
                    shadow-[0_0_0_1px_rgba(255,255,255,0.06),0_8px_24px_rgba(0,0,0,0.4)]
                    transition-all duration-300
                    group-hover:bg-white/12
                    group-hover:ring-white/25
                    group-hover:shadow-[0_0_0_1px_rgba(255,255,255,0.1),0_8px_24px_rgba(0,0,0,0.3)]"
                  >
                    <Image
                      src="/icon.png"
                      alt="WC"
                      fill
                      className="object-contain brightness-150 contrast-125 saturate-110"
                      priority
                    />
                  </span>
                </Link>

                <nav className="flex flex-wrap items-center gap-6 text-sm text-white/50">
                  {navLinks.map((link) => (
                    <ScrambleLink
                      key={link.href}
                      href={link.href}
                      className="inline-block transition-colors duration-300 hover:text-white"
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
          <footer className="border-t border-white/[0.06] bg-[#0a0e17]/80">
            <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col gap-2 py-4 text-xs text-white/30 md:flex-row md:items-center md:justify-between">
                <p>© {new Date().getFullYear()} Will Chung</p>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
