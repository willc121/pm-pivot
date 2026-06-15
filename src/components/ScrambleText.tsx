"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  phrases: string[];
  className?: string;
  interval?: number;
};

const CHARS = "!<>-_\\/[]{}=+*^?#________";

export default function ScrambleText({
  phrases,
  className = "",
  interval = 2800,
}: Props) {
  const [index, setIndex] = useState(0);
  const [display, setDisplay] = useState(phrases[0] ?? "");
  const rafRef = useRef<number | null>(null);
  const longest = phrases.reduce((a, b) => (b.length > a.length ? b : a), "");

  useEffect(() => {
    const id = window.setInterval(() => {
      setIndex((prev) => (prev + 1) % phrases.length);
    }, interval);
    return () => window.clearInterval(id);
  }, [phrases.length, interval]);

  useEffect(() => {
    const target = phrases[index] ?? "";
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduced) {
      setDisplay(target);
      return;
    }

    const duration = 520;
    const start = performance.now();

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const reveal = Math.floor(t * target.length * 1.3);
      let next = "";
      for (let i = 0; i < target.length; i++) {
        if (target[i] === " ") {
          next += " ";
          continue;
        }
        next +=
          i < reveal
            ? target[i]
            : CHARS[Math.floor(Math.random() * CHARS.length)];
      }
      setDisplay(next);
      if (t < 1) rafRef.current = requestAnimationFrame(tick);
      else setDisplay(target);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [index, phrases]);

  return (
    <span className={`relative inline-block ${className}`}>
      {/* invisible sizer to reserve space for the longest phrase */}
      <span className="invisible" aria-hidden>
        {longest}
      </span>
      <span className="absolute inset-0" aria-live="polite">
        {display}
      </span>
    </span>
  );
}
