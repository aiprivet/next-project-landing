import { cx } from "@/lib/cx";
import type { HTMLAttributes, ReactNode } from "react";
import styles from "./GradientBox.module.scss";

type GradientVariant = "hero" | "cta" | "brand";

type GradientBoxProps = HTMLAttributes<HTMLDivElement> & {
  variant?: GradientVariant;
  children?: ReactNode;
};

export function GradientBox({
  variant = "hero",
  className,
  children,
  ...props
}: GradientBoxProps) {
  return (
    <div className={cx(styles.root, styles[variant], className)} {...props}>
      {children}
    </div>
  );
}
