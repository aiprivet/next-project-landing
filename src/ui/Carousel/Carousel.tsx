"use client";

import { cx } from "@/lib/cx";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type KeyboardEvent,
  type PointerEvent,
  type ReactNode,
  type RefObject,
} from "react";
import styles from "./Carousel.module.scss";

type CarouselContextValue = {
  viewportRef: RefObject<HTMLDivElement | null>;
  viewportId: string;
  index: number;
  count: number;
  labels: string[];
  syncFromDom: () => void;
  goTo: (index: number) => void;
  goPrev: () => void;
  goNext: () => void;
};

const CarouselContext = createContext<CarouselContextValue | null>(null);

function useCarousel() {
  const ctx = useContext(CarouselContext);
  if (!ctx) throw new Error("Carousel components must be used within Carousel.Root");
  return ctx;
}

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function Root({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement> & { children: ReactNode }) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const viewportId = useId();
  const [index, setIndex] = useState(0);
  const [count, setCount] = useState(0);
  const [labels, setLabels] = useState<string[]>([]);
  const indexRef = useRef(0);

  const syncFromDom = useCallback(() => {
    const node = viewportRef.current;
    if (!node) return;
    const slides = [...node.querySelectorAll<HTMLElement>("[data-carousel-slide]")];
    const nextLabels = slides.map(
      (slide, slideIndex) =>
        slide.getAttribute("aria-label") ?? `Slide ${slideIndex + 1}`,
    );
    setCount((current) => (current === slides.length ? current : slides.length));
    setLabels((current) =>
      current.length === nextLabels.length &&
      current.every((label, i) => label === nextLabels[i])
        ? current
        : nextLabels,
    );

    if (!slides.length) {
      indexRef.current = 0;
      setIndex((current) => (current === 0 ? current : 0));
      return;
    }

    const x = node.scrollLeft;
    let closest = 0;
    let min = Infinity;
    for (let i = 0; i < slides.length; i++) {
      const dist = Math.abs(slides[i].offsetLeft - x);
      if (dist < min) {
        min = dist;
        closest = i;
      }
    }
    indexRef.current = closest;
    setIndex((current) => (current === closest ? current : closest));
  }, []);

  const goTo = useCallback((next: number) => {
    const node = viewportRef.current;
    if (!node) return;
    const slides = node.querySelectorAll<HTMLElement>("[data-carousel-slide]");
    if (!slides.length) return;
    const clamped = Math.max(0, Math.min(next, slides.length - 1));
    const target = slides[clamped];
    node.scrollTo({
      left: target.offsetLeft,
      behavior: prefersReducedMotion() ? "auto" : "smooth",
    });
    indexRef.current = clamped;
    setIndex(clamped);
  }, []);

  const goPrev = useCallback(() => goTo(indexRef.current - 1), [goTo]);
  const goNext = useCallback(() => goTo(indexRef.current + 1), [goTo]);

  const ctx = useMemo(
    () => ({
      viewportRef,
      viewportId,
      index,
      count,
      labels,
      syncFromDom,
      goTo,
      goPrev,
      goNext,
    }),
    [count, goNext, goPrev, goTo, index, labels, syncFromDom, viewportId],
  );

  return (
    <CarouselContext.Provider value={ctx}>
      <div
        className={cx(styles.root, className)}
        role="region"
        aria-roledescription="carousel"
        {...props}
      >
        {children}
      </div>
    </CarouselContext.Provider>
  );
}

function Viewport({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement> & { children: ReactNode }) {
  const { viewportRef, viewportId, count, syncFromDom, goTo, goPrev, goNext } =
    useCarousel();

  useEffect(() => {
    const node = viewportRef.current;
    if (!node) return;
    syncFromDom();
    node.addEventListener("scroll", syncFromDom, { passive: true });
    const observer = new MutationObserver(syncFromDom);
    observer.observe(node, { childList: true, subtree: true });
    return () => {
      node.removeEventListener("scroll", syncFromDom);
      observer.disconnect();
    };
  }, [syncFromDom, viewportRef]);

  function onPointerDown(event: PointerEvent<HTMLDivElement>) {
    const node = viewportRef.current;
    if (!node) return;
    node.dataset.dragging = "true";
    node.dataset.startX = String(event.clientX);
    node.dataset.scrollLeft = String(node.scrollLeft);
  }

  function onPointerMove(event: PointerEvent<HTMLDivElement>) {
    const node = viewportRef.current;
    if (!node || node.dataset.dragging !== "true") return;
    const startX = Number(node.dataset.startX);
    const scrollLeft = Number(node.dataset.scrollLeft);
    node.scrollLeft = scrollLeft - (event.clientX - startX);
  }

  function stopDragging() {
    const node = viewportRef.current;
    if (node) node.dataset.dragging = "false";
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      goPrev();
      return;
    }
    if (event.key === "ArrowRight") {
      event.preventDefault();
      goNext();
      return;
    }
    if (event.key === "Home") {
      event.preventDefault();
      goTo(0);
      return;
    }
    if (event.key === "End") {
      event.preventDefault();
      goTo(count - 1);
    }
  }

  return (
    <div
      {...props}
      ref={viewportRef}
      id={viewportId}
      className={cx(styles.viewport, className)}
      tabIndex={0}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={stopDragging}
      onPointerLeave={stopDragging}
      onKeyDown={onKeyDown}
    >
      {children}
    </div>
  );
}

function Slide({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement> & { children: ReactNode }) {
  return (
    <div
      {...props}
      className={cx(styles.slide, className)}
      data-carousel-slide=""
      role="group"
      aria-roledescription="slide"
    >
      {children}
    </div>
  );
}

function Prev({
  className,
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  const { index, goPrev, viewportId } = useCarousel();

  return (
    <button
      type="button"
      aria-label="Previous slide"
      {...props}
      className={cx(styles.control, className)}
      aria-controls={viewportId}
      disabled={index <= 0}
      onClick={goPrev}
    >
      {children}
    </button>
  );
}

function Next({
  className,
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  const { index, count, goNext, viewportId } = useCarousel();

  return (
    <button
      type="button"
      aria-label="Next slide"
      {...props}
      className={cx(styles.control, className)}
      aria-controls={viewportId}
      disabled={count === 0 || index >= count - 1}
      onClick={goNext}
    >
      {children}
    </button>
  );
}

function Dots({ className }: { className?: string }) {
  const { count, index, labels, goTo } = useCarousel();

  return (
    <div className={cx(styles.dots, className)}>
      {Array.from({ length: count }, (_, i) => (
        <button
          key={i}
          type="button"
          className={cx(styles.dot, i === index && styles.dotActive)}
          aria-label={labels[i] ?? `Slide ${i + 1}`}
          aria-current={i === index ? "true" : undefined}
          onClick={() => goTo(i)}
        />
      ))}
    </div>
  );
}

export const Carousel = { Root, Viewport, Slide, Prev, Next, Dots };
