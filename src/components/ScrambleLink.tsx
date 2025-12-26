"use client";

import { useMemo, useRef, useState } from "react";

type Props = {
  href: string;
  children: string;
  className?: string;
  target?: string;
  rel?: string;
};

export default function ScrambleLink({
  href,
  children,
  className = "",
  target,
  rel,
}: Props) {
  const original = children;

  // removed the long dash character
  const chars = useMemo(() => "!<>-_\\/[]{}=+*^?#________", []);

  const rafRef = useRef<number | null>(null);
  const [display, setDisplay] = useState(original);

  const scramble = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);

    const durationMs = 200;
    const start = performance.now();

    const tick = (now: number) => {
      const elapsed = now - start;
      const t = Math.min(1, elapsed / durationMs);

      const revealCount = Math.floor(t * original.length * 1.25);

      let next = "";
      for (let i = 0; i < original.length; i++) {
        if (original[i] === " ") {
          next += " ";
          continue;
        }

        next += i < revealCount ? original[i] : chars[Math.floor(Math.random() * chars.length)];
      }

      setDisplay(next);

      if (t < 1) rafRef.current = requestAnimationFrame(tick);
      else setDisplay(original);
    };

    rafRef.current = requestAnimationFrame(tick);
  };

  const onLeave = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    setDisplay(original);
  };

  return (
    <a
      href={href}
      target={target}
      rel={rel}
      onMouseEnter={scramble}
      onMouseLeave={onLeave}
      className={className}
    >
      {display}
    </a>
  );
}
