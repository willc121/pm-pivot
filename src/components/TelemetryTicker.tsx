"use client";

const items = [
  "System nominal",
  "Pilot \u2192 Product",
  "Shipping software",
  "SF Bay \u00b7 37.77\u00b0N 122.41\u00b0W",
  "MCP // Vision // Data pipelines",
  "MEDEVAC alumni",
  "MIT Sloan MBA",
  "Open to connect",
  "Built under pressure",
];

export default function TelemetryTicker() {
  return (
    <div className="relative flex overflow-hidden border-y border-white/[0.07] bg-white/[0.015] py-2.5">
      {/* edge fades */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-background to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-background to-transparent" />

      {[0, 1].map((dup) => (
        <div
          key={dup}
          aria-hidden={dup === 1}
          className="flex shrink-0 animate-marquee items-center whitespace-nowrap"
        >
          {items.map((it, i) => (
            <span key={`${dup}-${i}`} className="flex items-center">
              <span className="mx-5 font-mono text-[0.65rem] uppercase tracking-[0.22em] text-white/45">
                {it}
              </span>
              <span className="h-1 w-1 rounded-full bg-signal/60" />
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}
