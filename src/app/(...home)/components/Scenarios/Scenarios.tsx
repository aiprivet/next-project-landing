"use client";

import { Badge, Card, Heading, Reveal, Section, Tabs, Text } from "@/ui";
import { scenarios } from "../../content";
import styles from "./Scenarios.module.scss";

export function Scenarios() {
  return (
    <Section id="scenarios" padding="none" className={styles.section}>
      <Reveal className={styles.header}>
        <Heading order={2}>{scenarios.title}</Heading>
        <Text className={styles.subtitle}>{scenarios.subtitle}</Text>
      </Reveal>
      <Tabs.Root defaultValue={scenarios.tabs[0].id} className={styles.tabs}>
        <Tabs.List className={styles.list}>
          {scenarios.tabs.map((tab) => (
            <Tabs.Tab key={tab.id} value={tab.id}>
              {tab.label}
            </Tabs.Tab>
          ))}
        </Tabs.List>
        {scenarios.tabs.map((tab) => (
          <Tabs.Panel key={tab.id} value={tab.id} className={styles.panel}>
            <div className={styles.grid}>
              {tab.cards.map((card, index) => (
                <Reveal key={card.task} delay={index * 0.06}>
                  <Card className={styles.card}>
                    <Card.Body className={styles.body}>
                      <p className={styles.task}>{card.task}</p>
                      <p className={styles.how}>{card.how}</p>
                      <Badge variant="brand" size="sm">
                        {card.result}
                      </Badge>
                    </Card.Body>
                  </Card>
                </Reveal>
              ))}
            </div>
          </Tabs.Panel>
        ))}
      </Tabs.Root>
    </Section>
  );
}
