"use client";

export default function RadarSweep({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 grid place-items-center overflow-hidden ${className}`}
    >
      <div className="relative aspect-square w-[115%] opacity-[0.55]">
        {/* Concentric rings */}
        <div className="absolute inset-0 rounded-full border border-signal/15" />
        <div className="absolute inset-[14%] rounded-full border border-signal/12" />
        <div className="absolute inset-[30%] rounded-full border border-signal/10" />
        <div className="absolute inset-[46%] rounded-full border border-signal/10" />

        {/* Crosshair */}
        <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-signal/10" />
        <div className="absolute top-1/2 left-0 h-px w-full -translate-y-1/2 bg-signal/10" />

        {/* Rotating sweep */}
        <div
          className="absolute inset-0 rounded-full animate-radar"
          style={{
            background:
              "conic-gradient(from 0deg, rgba(242,180,65,0) 0deg, rgba(242,180,65,0) 300deg, rgba(242,180,65,0.05) 330deg, rgba(242,180,65,0.28) 358deg, rgba(242,180,65,0) 360deg)",
            mask: "radial-gradient(circle, #000 0%, #000 70%, transparent 71%)",
            WebkitMask: "radial-gradient(circle, #000 0%, #000 70%, transparent 71%)",
          }}
        />

        {/* Blips */}
        <span className="absolute left-[68%] top-[34%] h-1.5 w-1.5 rounded-full bg-signal/70 status-dot" />
        <span
          className="absolute left-[30%] top-[60%] h-1.5 w-1.5 rounded-full bg-signal/60 status-dot"
          style={{ animationDelay: "1s" }}
        />
        <span
          className="absolute left-[58%] top-[72%] h-1 w-1 rounded-full bg-signal/50 status-dot"
          style={{ animationDelay: "1.8s" }}
        />
      </div>
    </div>
  );
}
