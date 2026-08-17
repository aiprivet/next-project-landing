import { cx } from "@/lib/cx";
import type { ReactNode } from "react";
import styles from "./Container.module.scss";

type ContainerSize = "sm" | "md" | "lg" | "full";

type ContainerProps = {
  size?: ContainerSize;
  className?: string;
  children: ReactNode;
};

export function Container({
  size = "lg",
  className,
  children,
}: ContainerProps) {
  return (
    <div className={cx(styles.root, styles[size], className)}>{children}</div>
  );
}
