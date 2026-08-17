import { cx } from "@/lib/cx";
import type { HTMLAttributes, ReactNode } from "react";
import styles from "./Badge.module.scss";

type BadgeVariant = "neutral" | "brand" | "outline";
type BadgeSize = "sm" | "md";

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  variant?: BadgeVariant;
  size?: BadgeSize;
  children: ReactNode;
};

export function Badge({
  variant = "neutral",
  size = "md",
  className,
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cx(
        styles.root,
        styles[variant],
        styles[`size${size[0].toUpperCase()}${size.slice(1)}`],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
