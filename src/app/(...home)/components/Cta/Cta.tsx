"use client";

import { APP_URL } from "@/lib/constants";
import { Button, GradientBox, Heading, Reveal, Text } from "@/ui";
import { cta } from "../../content";
import styles from "./Cta.module.scss";

export function Cta() {
  return (
    <section id="cta" className={styles.wrap}>
      <GradientBox variant="cta" className={styles.section}>
        <div className={styles.shine} aria-hidden />
        <Reveal className={styles.content}>
          <div className={styles.intro}>
            <Heading order={2} align="center" className={styles.title}>
              <span className={styles.titleDesktop}>{cta.titleDesktop}</span>
              <span className={styles.titleMobile}>{cta.title}</span>
            </Heading>
          </div>
          <Button
            as="a"
            href={APP_URL}
            target="_blank"
            rel="noopener noreferrer"
            variant="white"
            radius="md"
            gradientText
            shimmer
            className={styles.button}
          >
            {cta.button}
          </Button>
        </Reveal>
      </GradientBox>
    </section>
  );
}
