import { cx } from "@/lib/cx";
import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";
import styles from "./Button.module.scss";

type ButtonVariant = "filled" | "white" | "ghost";
type ButtonSize = "sm" | "md" | "lg";
type ButtonRadius = "md" | "lg" | "pill";

type ButtonOwnProps<T extends ElementType> = {
  as?: T;
  variant?: ButtonVariant;
  size?: ButtonSize;
  radius?: ButtonRadius;
  gradientText?: boolean;
  shimmer?: boolean;
  children: ReactNode;
  className?: string;
};

export type ButtonProps<T extends ElementType = "button"> = ButtonOwnProps<T> &
  Omit<ComponentPropsWithoutRef<T>, keyof ButtonOwnProps<T>>;

export function Button<T extends ElementType = "button">({
  as,
  variant = "filled",
  size = "md",
  radius = "md",
  gradientText = false,
  shimmer = false,
  className,
  children,
  ...props
}: ButtonProps<T>) {
  const Component = as ?? "button";

  return (
    <Component
      className={cx(
        styles.root,
        styles[variant],
        styles[`size${size[0].toUpperCase()}${size.slice(1)}`],
        styles[`radius${radius[0].toUpperCase()}${radius.slice(1)}`],
        shimmer && styles.shimmer,
        className,
      )}
      {...props}
    >
      {gradientText ? <span className={styles.gradient}>{children}</span> : children}
      {shimmer ? <span className={styles.shimmerBand} aria-hidden /> : null}
    </Component>
  );
}
