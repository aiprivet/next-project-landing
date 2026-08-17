"use client";

import { Heading, Reveal, Section, Text } from "@/ui";
import { compare } from "../../content";
import styles from "./Compare.module.scss";

export function Compare() {
  return (
    <Section id="compare" padding="none" className={styles.section}>
      <Reveal className={styles.header}>
        <Heading order={2} className={styles.title}>
          {compare.title}
        </Heading>
        <Text className={styles.subtitle}>{compare.subtitle}</Text>
      </Reveal>
      <div className={styles.scroll}>
        <div className={styles.table} role="table" aria-label={compare.title}>
          <div className={styles.brandBorder} aria-hidden />
          <div className={styles.row} role="row">
            {compare.columns.map((column, index) => (
              <div
                key={column}
                role="columnheader"
                className={`${styles.cell} ${styles.head} ${index === 0 ? styles.label : ""} ${index === 1 ? styles.brand : ""}`}
              >
                {index === 1 ? (
                  <span className={styles.brandName}>{column}</span>
                ) : (
                  column
                )}
              </div>
            ))}
          </div>
          {compare.rows.map((row) => (
            <div key={row.label} className={styles.row} role="row">
              <div
                role="rowheader"
                className={`${styles.cell} ${styles.label}`}
              >
                {row.label}
              </div>
              {row.values.map((value, index) => (
                <div
                  key={`${row.label}-${index}`}
                  role="cell"
                  className={`${styles.cell} ${index === 0 ? styles.brand : ""}`}
                >
                  {value.split("\n").map((line, lineIndex, lines) => (
                    <span key={line}>
                      {line}
                      {lineIndex < lines.length - 1 ? <br /> : null}
                    </span>
                  ))}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}
