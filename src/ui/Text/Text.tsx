import { cx } from "@/lib/cx";
import type { HTMLAttributes, ReactNode } from "react";
import styles from "./Text.module.scss";

type TextSize = "sm" | "md" | "lg";
type TextTone = "primary" | "secondary" | "muted";
type TextAlign = "left" | "center" | "right";

type TextProps = HTMLAttributes<HTMLParagraphElement> & {
  size?: TextSize;
  tone?: TextTone;
  align?: TextAlign;
  as?: "p" | "span";
  children: ReactNode;
};

export function Text({
  size = "md",
  tone = "secondary",
  align = "left",
  as: Tag = "p",
  className,
  children,
  ...props
}: TextProps) {
  return (
    <Tag
      className={cx(styles.root, styles[size], styles[tone], styles[align], className)}
      {...props}
    >
      {children}
    </Tag>
  );
}
