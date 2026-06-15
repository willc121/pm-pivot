import "../globals.css";
import Script from "next/script";
import { fontVariables } from "@/lib/fonts";

export default function StandaloneLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`dark ${fontVariables}`}>
      <head />
      <body className="font-sans">
        {children}
        <Script
          src="https://challenges.cloudflare.com/turnstile/v0/api.js"
          strategy="beforeInteractive"
        />
      </body>
    </html>
  );
}
