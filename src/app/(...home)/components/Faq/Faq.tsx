"use client";

import { Accordion, Heading, Reveal, Section, Text } from "@/ui";
import { faq } from "../../content";
import styles from "./Faq.module.scss";

export function Faq() {
  return (
    <Section id="faq" padding="none" className={styles.section}>
      <Reveal className={styles.header}>
        <Heading order={2}>{faq.title}</Heading>
        <Text className={styles.subtitle}>{faq.subtitle}</Text>
      </Reveal>
      <Accordion.Root type="single" className={styles.list}>
        {faq.items.map((item) => (
          <Accordion.Item
            key={item.question}
            value={item.question}
            className={styles.item}
          >
            <Accordion.Control>
              <span className={styles.question}>{item.question}</span>
            </Accordion.Control>
            <Accordion.Panel>
              <p className={styles.answer}>{item.answer}</p>
            </Accordion.Panel>
          </Accordion.Item>
        ))}
      </Accordion.Root>
    </Section>
  );
}
