"use client";

import { cx } from "@/lib/cx";
import { animate, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState, type HTMLAttributes } from "react";
import styles from "./Counter.module.scss";

type CounterProps = HTMLAttributes<HTMLSpanElement> & {
  value: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
  duration?: number;
};

export function Counter({
  value,
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
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (reduced || !isInView) return;

    const controls = animate(0, value, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (latest) => setDisplay(latest),
    });

    return () => controls.stop();
  }, [duration, isInView, reduced, value]);

  const shown = reduced ? value : display;

  return (
    <span ref={ref} className={cx(styles.root, className)} {...props}>
      {prefix}
      {shown.toFixed(decimals)}
      {suffix}
    </span>
  );
}
