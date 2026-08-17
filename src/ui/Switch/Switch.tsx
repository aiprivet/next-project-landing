"use client";

import { cx } from "@/lib/cx";
import { motion, useReducedMotion } from "motion/react";
import { useState, type ButtonHTMLAttributes } from "react";
import styles from "./Switch.module.scss";

type SwitchProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onChange"> & {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  labelOff: string;
  labelOn: string;
};

export function Switch({
  checked,
  defaultChecked = false,
  onCheckedChange,
  labelOff,
  labelOn,
  className,
  disabled,
  ...props
}: SwitchProps) {
  const [uncontrolled, setUncontrolled] = useState(defaultChecked);
  const isOn = checked ?? uncontrolled;
  const reduced = useReducedMotion();

  function toggle() {
    const next = !isOn;
    if (checked === undefined) setUncontrolled(next);
    onCheckedChange?.(next);
  }

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isOn}
      disabled={disabled}
      {...props}
      className={cx(styles.root, className)}
      onClick={toggle}
    >
      <span className={cx(styles.caption, !isOn && styles.captionActive)}>{labelOff}</span>
      <span className={cx(styles.track, isOn && styles.trackOn)}>
        <motion.span
          layout
          className={styles.thumb}
          transition={
            reduced
              ? { duration: 0 }
              : { duration: 0.18, ease: [0.16, 1, 0.3, 1] }
          }
        />
      </span>
      <span className={cx(styles.caption, isOn && styles.captionActive)}>{labelOn}</span>
    </button>
  );
}
