import { cx } from "@/lib/cx";
import Image from "next/image";
import Link from "next/link";
import styles from "./Logo.module.scss";

type LogoProps = {
  className?: string;
  href?: string;
};

export function Logo({ className, href = "/" }: LogoProps) {
  const mark = (
    <Image
      src="/images/logo.svg"
      alt="Снэпбилд"
      width={153}
      height={22}
      className={styles.image}
      priority
    />
  );

  if (!href) {
    return <span className={cx(styles.root, className)}>{mark}</span>;
  }

  return (
    <Link href={href} className={cx(styles.root, className)} aria-label="Снэпбилд">
      {mark}
    </Link>
  );
}
