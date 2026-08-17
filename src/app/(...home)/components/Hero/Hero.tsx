"use client";

import { APP_URL } from "@/lib/constants";
import { Button, GradientBox, Heading, Text } from "@/ui";
import { motion } from "motion/react";
import Image from "next/image";
import { hero } from "../../content";
import styles from "./Hero.module.scss";

const ease = [0.16, 1, 0.3, 1] as const;

export function Hero() {
  return (
    <section id="hero" className={styles.section}>
      <GradientBox variant="hero" className={styles.card}>
        <div className={styles.inner}>
          <div className={styles.intro}>
            <motion.div
              className={styles.heading}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.1, delay: 0.16, ease }}
            >
              <Heading order={1} align="center" className={styles.title}>
                {hero.title}
              </Heading>
              <Text
                size="lg"
                tone="muted"
                align="center"
                className={styles.subtitle}
              >
                {hero.subtitle}
              </Text>
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.1, delay: 0.42, ease }}
            >
              <Button
                as="a"
                href={APP_URL}
                target="_blank"
                rel="noopener noreferrer"
                variant="white"
                radius="md"
                gradientText
                shimmer
                className={styles.cta}
              >
                {hero.cta}
              </Button>
            </motion.div>
          </div>
          <motion.div
            className={styles.media}
            initial={{ opacity: 0, y: 46, scale: 0.975 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1.1, delay: 0.22, ease }}
          >
            <Image
              src={hero.image}
              alt="Интерфейс Cнэпбилд"
              width={2632}
              height={1386}
              className={styles.shot}
              priority
            />
          </motion.div>
        </div>
      </GradientBox>
    </section>
  );
}
