"use client";

import { cx } from "@/lib/cx";
import { Heading, Reveal, Text } from "@/ui";
import { useMemo, useRef } from "react";
import { roadmap } from "../../content";
import styles from "./Roadmap.module.scss";

export function Roadmap() {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const reachedCount = useMemo(
    () => roadmap.items.filter((item) => item.reached).length,
    [],
  );

  return (
    <section id="roadmap" className={styles.section}>
      <Reveal className={styles.header}>
        <Heading order={2}>{roadmap.title}</Heading>
        <Text>{roadmap.subtitle}</Text>
      </Reveal>
      <div
        ref={scrollerRef}
        className={styles.scroller}
        onPointerDown={(event) => {
          const node = scrollerRef.current;
          if (!node) return;
          node.dataset.dragging = "true";
          node.dataset.startX = String(event.clientX);
          node.dataset.scrollLeft = String(node.scrollLeft);
        }}
        onPointerMove={(event) => {
          const node = scrollerRef.current;
          if (!node || node.dataset.dragging !== "true") return;
          const startX = Number(node.dataset.startX);
          const scrollLeft = Number(node.dataset.scrollLeft);
          node.scrollLeft = scrollLeft - (event.clientX - startX);
        }}
        onPointerUp={() => {
          const node = scrollerRef.current;
          if (node) node.dataset.dragging = "false";
        }}
        onPointerLeave={() => {
          const node = scrollerRef.current;
          if (node) node.dataset.dragging = "false";
        }}
      >
        <div
          className={styles.track}
          style={{
            ["--progress" as string]: String(Math.max(reachedCount - 1, 0)),
          }}
        >
          {roadmap.items.map((item) => (
            <article
              key={item.title}
              className={cx(styles.item, item.reached && styles.reached)}
            >
              <div className={styles.dot} aria-hidden>
                <span className={styles.halo} />
                <span className={styles.core} />
              </div>
              <div className={styles.body}>
                <h3 className={styles.name}>{item.title}</h3>
                <p className={styles.desc}>{item.description}</p>
                <p className={styles.date}>{item.date}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
