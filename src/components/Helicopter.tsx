"use client";

import { useEffect, useRef, useState } from "react";

export default function Helicopter() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const x = ((e.clientX - centerX) / (window.innerWidth / 2)) * 12;
      const y = ((e.clientY - centerY) / (window.innerHeight / 2)) * 8;
      setMouse({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div ref={containerRef} className="relative">
      {/* Ambient glow behind helicopter */}
      <div
        className="absolute inset-0 blur-3xl opacity-40"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(56,189,248,0.3) 0%, transparent 70%)",
        }}
      />

      <div
        className="animate-float transition-transform duration-200 ease-out"
        style={{
          transform: `translate(${mouse.x}px, ${mouse.y}px)`,
        }}
      >
        <svg
          viewBox="0 0 240 150"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-80 h-52 drop-shadow-[0_0_30px_rgba(56,189,248,0.25)]"
        >
          <defs>
            <linearGradient id="bodyGrad" x1="60" y1="45" x2="155" y2="95">
              <stop offset="0%" stopColor="rgba(56,189,248,0.15)" />
              <stop offset="100%" stopColor="rgba(139,92,246,0.08)" />
            </linearGradient>
            <linearGradient id="glassGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(168,85,247,0.25)" />
              <stop offset="100%" stopColor="rgba(56,189,248,0.1)" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Rotor wash particles */}
          <circle cx="60" cy="35" r="1" fill="rgba(56,189,248,0.3)" className="animate-particle-1" />
          <circle cx="140" cy="30" r="0.8" fill="rgba(56,189,248,0.2)" className="animate-particle-2" />
          <circle cx="100" cy="28" r="0.6" fill="rgba(168,85,247,0.3)" className="animate-particle-3" />

          {/* Main rotor disc (blurred for motion effect) */}
          <g className="origin-[120px_30px] animate-spin-rotor">
            <ellipse
              cx="120"
              cy="30"
              rx="90"
              ry="3"
              fill="rgba(56,189,248,0.12)"
              stroke="rgba(56,189,248,0.4)"
              strokeWidth="0.5"
            />
            <line x1="30" y1="30" x2="210" y2="30" stroke="rgba(56,189,248,0.5)" strokeWidth="1.5" strokeLinecap="round" />
          </g>

          {/* Rotor mast */}
          <line x1="120" y1="30" x2="120" y2="50" stroke="rgba(56,189,248,0.6)" strokeWidth="2.5" />
          <circle cx="120" cy="30" r="3" fill="rgba(56,189,248,0.15)" stroke="rgba(56,189,248,0.5)" strokeWidth="1" />

          {/* Fuselage body */}
          <path
            d="M75 50 Q65 50 58 58 L55 72 Q55 82 62 88 L78 95 L160 95 L168 88 Q172 82 172 72 L170 58 Q165 50 155 50 Z"
            fill="url(#bodyGrad)"
            stroke="rgba(56,189,248,0.6)"
            strokeWidth="1.5"
          />

          {/* Cockpit nose */}
          <path
            d="M75 50 Q65 50 58 58 L55 72 Q55 78 58 82 L72 82 Q80 75 80 65 L80 55 Q80 50 75 50"
            fill="url(#glassGrad)"
            stroke="rgba(168,85,247,0.5)"
            strokeWidth="1"
          />

          {/* Body panel lines */}
          <line x1="95" y1="52" x2="95" y2="93" stroke="rgba(255,255,255,0.06)" strokeWidth="0.5" />
          <line x1="135" y1="52" x2="135" y2="93" stroke="rgba(255,255,255,0.06)" strokeWidth="0.5" />

          {/* Windows */}
          <rect x="85" y="57" width="16" height="12" rx="3" fill="url(#glassGrad)" stroke="rgba(168,85,247,0.4)" strokeWidth="1" />
          <rect x="106" y="57" width="12" height="12" rx="3" fill="url(#glassGrad)" stroke="rgba(168,85,247,0.3)" strokeWidth="0.8" />
          <rect x="123" y="57" width="12" height="12" rx="3" fill="url(#glassGrad)" stroke="rgba(168,85,247,0.3)" strokeWidth="0.8" />

          {/* Red cross (MEDEVAC) */}
          <g filter="url(#glow)" opacity="0.7">
            <rect x="143" y="62" width="12" height="3" rx="0.5" fill="rgba(248,56,56,0.6)" />
            <rect x="147.5" y="57.5" width="3" height="12" rx="0.5" fill="rgba(248,56,56,0.6)" />
          </g>

          {/* Tail boom */}
          <path
            d="M168 62 L200 55 L210 50 L215 48 L215 78 L210 76 L200 72 L168 68"
            fill="rgba(56,189,248,0.04)"
            stroke="rgba(56,189,248,0.45)"
            strokeWidth="1.5"
          />

          {/* Horizontal stabilizer */}
          <path
            d="M205 60 L220 55 L225 57 L210 63 Z"
            fill="rgba(56,189,248,0.06)"
            stroke="rgba(56,189,248,0.35)"
            strokeWidth="1"
          />
          <path
            d="M205 67 L220 72 L225 70 L210 64 Z"
            fill="rgba(56,189,248,0.06)"
            stroke="rgba(56,189,248,0.35)"
            strokeWidth="1"
          />

          {/* Tail rotor */}
          <g className="origin-[215px_63px] animate-spin-rotor-fast">
            <line x1="215" y1="43" x2="215" y2="83" stroke="rgba(168,85,247,0.55)" strokeWidth="1.5" strokeLinecap="round" />
          </g>
          <circle cx="215" cy="63" r="2" fill="rgba(168,85,247,0.15)" stroke="rgba(168,85,247,0.4)" strokeWidth="0.8" />

          {/* Landing skids */}
          <line x1="82" y1="95" x2="72" y2="112" stroke="rgba(56,189,248,0.4)" strokeWidth="2" strokeLinecap="round" />
          <line x1="150" y1="95" x2="160" y2="112" stroke="rgba(56,189,248,0.4)" strokeWidth="2" strokeLinecap="round" />
          <line x1="62" y1="112" x2="170" y2="112" stroke="rgba(56,189,248,0.4)" strokeWidth="2" strokeLinecap="round" />

          {/* Skid crossbars */}
          <line x1="82" y1="95" x2="82" y2="112" stroke="rgba(56,189,248,0.25)" strokeWidth="1" />
          <line x1="150" y1="95" x2="150" y2="112" stroke="rgba(56,189,248,0.25)" strokeWidth="1" />

          {/* Navigation lights */}
          <circle cx="55" cy="72" r="2" fill="rgba(248,56,56,0.5)" className="animate-blink" />
          <circle cx="172" cy="72" r="2" fill="rgba(56,248,56,0.5)" className="animate-blink-delayed" />
          <circle cx="120" cy="95" r="1.5" fill="rgba(255,255,255,0.4)" className="animate-blink" />
        </svg>
      </div>
    </div>
  );
}
