"use client";

import { Counter, Heading, Reveal, Section, Text } from "@/ui";
import { metrics } from "../../content";
import styles from "./Metrics.module.scss";

export function Metrics() {
  return (
    <Section id="metrics" padding="none" className={styles.section}>
      <Reveal className={styles.header}>
        <Heading order={2}>{metrics.title}</Heading>
        <Text className={styles.subtitle}>{metrics.subtitle}</Text>
      </Reveal>
      <div className={styles.strip}>
        {metrics.items.map((item, index) => (
          <Reveal key={item.label} delay={index * 0.06} className={styles.item}>
            <Counter
              value={item.value}
              from={"from" in item ? item.from : undefined}
              suffix={item.suffix}
              className={styles.value}
            />
            <p className={styles.label}>{item.label}</p>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
