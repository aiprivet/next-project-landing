"use client";

import { APP_URL, BASE_PATH } from "@/lib/constants";
import { cx } from "@/lib/cx";
import { Badge, Button, Heading, Reveal, Section, Switch, Text } from "@/ui";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { useState } from "react";
import { plans } from "../../content";
import styles from "./Plans.module.scss";

export function Plans() {
  const [company, setCompany] = useState(false);
  const cards = company ? plans.sets.company : plans.sets.team;

  return (
    <Section id="plans" padding="none" className={styles.section}>
      <Reveal className={styles.header}>
        <Heading order={2}>{plans.title}</Heading>
        <Text className={styles.subtitle}>{plans.subtitle}</Text>
        <Switch
          checked={company}
          onCheckedChange={setCompany}
          labelOff={plans.labelOff}
          labelOn={plans.labelOn}
          className={styles.switch}
        />
      </Reveal>
      <AnimatePresence mode="wait">
        <motion.div
          key={company ? "company" : "team"}
          className={styles.grid}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        >
          {cards.map((card) => {
            const href = card.href === "app" ? APP_URL : "#contact";
            const external = card.href === "app";

            return (
              <article
                key={card.id}
                className={cx(styles.card, card.featured && styles.cardFeatured)}
              >
                {card.featured ? (
                  <Badge variant="brand" size="sm" className={styles.badge}>
                    {plans.recommended}
                  </Badge>
                ) : null}
                <div className={styles.top}>
                  <h3 className={styles.name}>{card.name}</h3>
                  <p className={styles.price}>{card.price}</p>
                  <p className={styles.period}>{card.period}</p>
                  <p className={styles.desc}>{card.description}</p>
                </div>
                <ul className={styles.features}>
                  {card.features.map((feature) => (
                    <li key={feature} className={styles.feature}>
                      <Image
                        src={`${BASE_PATH}/images/ui/check.svg`}
                        alt=""
                        width={16}
                        height={16}
                        className={styles.check}
                      />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  as="a"
                  href={href}
                  target={external ? "_blank" : undefined}
                  rel={external ? "noopener noreferrer" : undefined}
                  variant={card.featured ? "filled" : "ghost"}
                  shimmer={card.featured}
                  className={cx(styles.cta, !card.featured && styles.ctaGhost)}
                >
                  {card.href === "app" ? plans.ctaApp : plans.ctaContact}
                </Button>
              </article>
            );
          })}
        </motion.div>
      </AnimatePresence>
    </Section>
  );
}
