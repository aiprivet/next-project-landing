import { cx } from "@/lib/cx";
import type { HTMLAttributes, ReactNode } from "react";
import styles from "./Section.module.scss";

type SectionPadding = "none" | "sm" | "md" | "lg";
type SectionTone = "default" | "transparent";

type SectionProps = HTMLAttributes<HTMLElement> & {
  padding?: SectionPadding;
  tone?: SectionTone;
  children: ReactNode;
};

export function Section({
  padding = "md",
  tone = "default",
  className,
  children,
  ...props
}: SectionProps) {
  return (
    <section
      className={cx(styles.root, styles[padding], styles[tone], className)}
      {...props}
    >
      {children}
    </section>
  );
}
