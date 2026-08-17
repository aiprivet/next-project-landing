import { cx } from "@/lib/cx";
import type { ReactNode } from "react";
import styles from "./Card.module.scss";

type CardProps = {
  className?: string;
  children: ReactNode;
};

export function Card({ className, children }: CardProps) {
  return <article className={cx(styles.root, className)}>{children}</article>;
}

function Media({ className, children }: CardProps) {
  return <div className={cx(styles.media, className)}>{children}</div>;
}

function Body({ className, children }: CardProps) {
  return <div className={cx(styles.body, className)}>{children}</div>;
}

Card.Media = Media;
Card.Body = Body;
