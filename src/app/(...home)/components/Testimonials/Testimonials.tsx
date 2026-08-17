"use client";

import { Badge, Carousel, Heading, Reveal, Section, Text } from "@/ui";
import { testimonials } from "../../content";
import styles from "./Testimonials.module.scss";

export function Testimonials() {
  return (
    <Section id="testimonials" padding="none" className={styles.section}>
      <Reveal className={styles.header}>
        <Heading order={2}>{testimonials.title}</Heading>
        <Text className={styles.subtitle}>{testimonials.subtitle}</Text>
      </Reveal>
      <Carousel.Root className={styles.carousel} aria-label={testimonials.title}>
        <Carousel.Viewport className={styles.viewport}>
          {testimonials.items.map((item) => (
            <Carousel.Slide
              key={item.name}
              className={styles.slide}
              aria-label={`${item.name}, ${item.company}`}
            >
              <article className={styles.card}>
                <p className={styles.quote}>{item.quote}</p>
                <div className={styles.meta}>
                  <p className={styles.name}>{item.name}</p>
                  <p className={styles.role}>
                    {item.role} — {item.company}
                  </p>
                  <Badge variant="brand" size="sm">
                    {item.result}
                  </Badge>
                </div>
              </article>
            </Carousel.Slide>
          ))}
        </Carousel.Viewport>
        <div className={styles.controls}>
          <Carousel.Prev className={styles.arrow} aria-label={testimonials.prev}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
              <path
                d="M12.5 5 7.5 10l5 5"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Carousel.Prev>
          <Carousel.Dots className={styles.dots} />
          <Carousel.Next className={styles.arrow} aria-label={testimonials.next}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
              <path
                d="m7.5 5 5 5-5 5"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Carousel.Next>
        </div>
      </Carousel.Root>
    </Section>
  );
}
