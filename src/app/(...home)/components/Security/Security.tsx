"use client";

import { Card, Heading, Reveal, Section, Text } from "@/ui";
import Image from "next/image";
import { security } from "../../content";
import styles from "./Security.module.scss";

export function Security() {
  return (
    <Section id="features" padding="none" className={styles.section}>
      <Reveal>
        <Heading order={2} className={styles.title}>
          {security.title}
        </Heading>
      </Reveal>
      <div className={styles.grid}>
        {security.cards.map((card, index) => (
          <Reveal key={card.title} delay={index * 0.08}>
            <Card className={styles.card}>
              <Card.Media className={styles.media}>
                {card.imageMobile ? (
                  <picture>
                    <source
                      media="(max-width: 767px)"
                      srcSet={card.imageMobile}
                    />
                    <Image src={card.image} alt="" width={864} height={720} />
                  </picture>
                ) : (
                  <Image src={card.image} alt="" width={864} height={720} />
                )}
              </Card.Media>
              <Card.Body className={styles.body}>
                <Heading order={3}>{card.title}</Heading>
                <Text size="sm">{card.description}</Text>
              </Card.Body>
            </Card>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
