"use client";

import { cx } from "@/lib/cx";
import { animate, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState, type HTMLAttributes } from "react";
import styles from "./Counter.module.scss";

type CounterProps = HTMLAttributes<HTMLSpanElement> & {
  value: number;
  from?: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
  duration?: number;
};

export function Counter({
  value,
  from,
  suffix = "",
  prefix = "",
  decimals = 0,
  duration = 1.2,
  className,
  ...props
}: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.4 });
  const reduced = useReducedMotion();
  const start = from ?? 0;
  const [display, setDisplay] = useState(start);

  useEffect(() => {
    if (reduced || !isInView) return;

    const controls = animate(start, value, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (latest) => setDisplay(latest),
    });

    return () => controls.stop();
  }, [duration, isInView, reduced, start, value]);

  const shown = reduced ? value : display;

  return (
    <span ref={ref} className={cx(styles.root, className)} {...props}>
      {prefix}
      {shown.toFixed(decimals)}
      {suffix}
    </span>
  );
}
