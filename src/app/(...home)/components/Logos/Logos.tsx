"use client";

import { cx } from "@/lib/cx";
import Image from "next/image";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { logos } from "../../content";
import styles from "./Logos.module.scss";

export function Logos() {
  const rootRef = useRef<HTMLElement>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const node = rootRef.current;
    if (!node) return;

    const reveal = () => setRevealed(true);

    if (typeof IntersectionObserver === "undefined") {
      reveal();
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        reveal();
        observer.disconnect();
      },
      { threshold: 0.18 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const row = logos.items.map((item, index) => (
    <div
      key={item.alt}
      className={styles.item}
      style={{ "--logo-index": index } as CSSProperties}
    >
      <Image src={item.src} alt={item.alt} width={120} height={32} />
    </div>
  ));

  return (
    <section
      id="logos"
      ref={rootRef}
      className={cx(styles.section, revealed && styles.revealed)}
    >
      <div className={styles.track} aria-hidden={false}>
        <div className={styles.content}>{row}</div>
        <div className={styles.duplicate} aria-hidden>
          {row}
        </div>
      </div>
      <p className={styles.eyebrow}>{logos.eyebrow}</p>
    </section>
  );
}
