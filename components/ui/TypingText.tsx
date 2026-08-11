"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Types out `text` character by character with a blinking caret, then after a
 * hold period erases and retypes it — repeating forever. Respects reduced-motion.
 */
export function TypingText({
  text,
  typeSpeed = 70,
  eraseSpeed = 35,
  holdMs = 3 * 60 * 1000,
  className,
}: {
  text: string;
  /** ms per character while typing. */
  typeSpeed?: number;
  /** ms per character while erasing. */
  eraseSpeed?: number;
  /** how long to stay fully typed before erasing and retyping (default: a few minutes). */
  holdMs?: number;
  className?: string;
}) {
  const [length, setLength] = useState(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const prefersReducedMotion =
      typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion || !text) {
      setLength(text.length);
      return;
    }

    let cancelled = false;
    const schedule = (fn: () => void, delay: number) => {
      timeoutRef.current = setTimeout(() => {
        if (!cancelled) fn();
      }, delay);
    };

    const typeFrom = (i: number) => {
      setLength(i);
      if (i < text.length) {
        schedule(() => typeFrom(i + 1), typeSpeed);
      } else {
        schedule(() => eraseFrom(text.length), holdMs);
      }
    };

    const eraseFrom = (i: number) => {
      setLength(i);
      if (i > 0) {
        schedule(() => eraseFrom(i - 1), eraseSpeed);
      } else {
        schedule(() => typeFrom(0), typeSpeed);
      }
    };

    typeFrom(0);

    return () => {
      cancelled = true;
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [text, typeSpeed, eraseSpeed, holdMs]);

  return (
    <span aria-label={text} className="relative">
      <span aria-hidden="true" className={className}>
        {text.slice(0, length)}
        <span className="inline-block w-[2px] -mb-1 h-[0.9em] bg-accent ml-0.5 align-middle animate-blink-caret" />
      </span>
    </span>
  );
}

