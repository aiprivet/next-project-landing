import { cx } from "@/lib/cx";
import type { HTMLAttributes, ReactNode } from "react";
import styles from "./Heading.module.scss";

type HeadingOrder = 1 | 2 | 3;
type HeadingAlign = "left" | "center" | "right";

type HeadingProps = HTMLAttributes<HTMLHeadingElement> & {
  order?: HeadingOrder;
  align?: HeadingAlign;
  children: ReactNode;
};

const TAGS = {
  1: "h1",
  2: "h2",
  3: "h3",
} as const;

export function Heading({
  order = 2,
  align = "left",
  className,
  children,
  ...props
}: HeadingProps) {
  const Tag = TAGS[order];

  return (
    <Tag
      className={cx(styles.root, styles[`h${order}`], styles[align], className)}
      {...props}
    >
      {children}
    </Tag>
  );
}
