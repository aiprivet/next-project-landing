"use client";

import { cx } from "@/lib/cx";
import { Heading, Reveal, Section, Tabs } from "@/ui";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { useCases } from "../../content";
import styles from "./UseCases.module.scss";

const PROGRESS_MS = 4200;

export function UseCases() {
  const [tabId, setTabId] = useState(useCases.tabs[0].id);
  const [itemIndex, setItemIndex] = useState(0);

  const tab =
    useCases.tabs.find((entry) => entry.id === tabId) ?? useCases.tabs[0];
  const activeItem = tab.items[itemIndex] ?? tab.items[0];

  const selectTab = useCallback((id: string) => {
    setTabId(id);
    setItemIndex(0);
  }, []);

  const advance = useCallback(() => {
    setItemIndex((current) => {
      const tabData =
        useCases.tabs.find((entry) => entry.id === tabId) ?? useCases.tabs[0];
      if (current < tabData.items.length - 1) return current + 1;
      const tabIndex = useCases.tabs.findIndex((entry) => entry.id === tabId);
      const nextTab = useCases.tabs[(tabIndex + 1) % useCases.tabs.length];
      setTabId(nextTab.id);
      return 0;
    });
  }, [tabId]);

  useEffect(() => {
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (!reduced) return;
    const timer = window.setInterval(advance, PROGRESS_MS);
    return () => window.clearInterval(timer);
  }, [advance]);

  return (
    <Section id="use-cases" padding="none" className={styles.section}>
      <Tabs.Root
        value={tabId}
        defaultValue={useCases.tabs[0].id}
        onChange={selectTab}
      >
        <Reveal className={styles.header}>
          <Heading order={2} className={styles.title}>
            <span className={styles.titleDesktop}>{useCases.titleDesktop}</span>
            <span className={styles.titleMobile}>{useCases.title}</span>
          </Heading>
          <Tabs.List className={styles.tabs}>
            {useCases.tabs.map((entry) => (
              <Tabs.Tab key={entry.id} value={entry.id}>
                {entry.label}
              </Tabs.Tab>
            ))}
          </Tabs.List>
        </Reveal>

        <div className={styles.body}>
          <div className={styles.points}>
            {tab.items.map((item, index) => {
              const active = index === itemIndex;
              return (
                <button
                  key={item.title}
                  type="button"
                  className={cx(styles.card, active && styles.cardActive)}
                  onClick={() => setItemIndex(index)}
                >
                  <h3 className={styles.cardTitle}>{item.title}</h3>
                  <p className={styles.cardDesc}>
                    <span>{item.description}</span>
                  </p>
                  <span className={styles.progress} aria-hidden>
                    <span
                      key={`${tabId}-${index}-${active ? "on" : "off"}`}
                      className={styles.progressFill}
                      style={
                        active
                          ? { animationDuration: `${PROGRESS_MS}ms` }
                          : undefined
                      }
                      onAnimationEnd={active ? advance : undefined}
                    />
                  </span>
                </button>
              );
            })}
          </div>
          <div className={styles.panel}>
            <AnimatePresence mode="wait">
              <motion.div
                key={`${tabId}-${activeItem.image}`}
                className={styles.mediaWrap}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              >
                <Image
                  src={activeItem.image}
                  alt={activeItem.title}
                  width={1440}
                  height={810}
                  className={styles.media}
                />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </Tabs.Root>
    </Section>
  );
}
