"use client";

import { Card, Heading, Reveal, Section, Text } from "@/ui";
import Image from "next/image";
import { process as content } from "../../content";
import styles from "./Process.module.scss";

export function Process() {
  return (
    <Section id="process" padding="none" className={styles.section}>
      <Reveal className={styles.header}>
        <Heading order={2} className={styles.title}>
          <span className={styles.wide}>{content.title}</span>
          <span className={styles.narrow}>{content.titleMobile}</span>
        </Heading>
        <Text className={styles.subtitle}>{content.subtitle}</Text>
      </Reveal>
      <div className={styles.grid}>
        {content.cards.map((card, index) => (
          <Reveal key={card.title} delay={index * 0.08}>
            <Card className={styles.card}>
              <Card.Media className={styles.media}>
                {card.imageMobile || card.imageTablet ? (
                  <picture>
                    {card.imageMobile ? (
                      <source
                        media="(max-width: 767px)"
                        srcSet={card.imageMobile}
                      />
                    ) : null}
                    {card.imageTablet ? (
                      <source
                        media="(max-width: 1023px)"
                        srcSet={card.imageTablet}
                      />
                    ) : null}
                    <Image src={card.image} alt="" width={1200} height={900} />
                  </picture>
                ) : (
                  <Image src={card.image} alt="" width={1200} height={900} />
                )}
              </Card.Media>
              <Card.Body className={styles.body}>
                <Heading order={3}>
                  {card.titleMobile ? (
                    <>
                      <span className={styles.wide}>{card.title}</span>
                      <span className={styles.narrow}>{card.titleMobile}</span>
                    </>
                  ) : (
                    card.title
                  )}
                </Heading>
                <Text size="sm">{card.description}</Text>
              </Card.Body>
            </Card>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
