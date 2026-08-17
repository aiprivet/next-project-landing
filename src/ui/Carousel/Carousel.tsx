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
  pageCount: number;
  pageIndex: number;
  labels: string[];
  syncFromDom: () => void;
  syncIndex: () => void;
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

const MOBILE_MQ = "(max-width: 767px)";

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function getSlidesPerView() {
  return window.matchMedia(MOBILE_MQ).matches ? 1 : 2;
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
  const [slidesPerView, setSlidesPerView] = useState(1);
  const [labels, setLabels] = useState<string[]>([]);
  const indexRef = useRef(0);

  const pageCount = Math.max(1, count - slidesPerView + 1);
  const pageIndex = Math.min(index, pageCount - 1);

  const syncMeta = useCallback(() => {
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

    if (slides.length) {
      const nextSlidesPerView = getSlidesPerView();
      setSlidesPerView((current) =>
        current === nextSlidesPerView ? current : nextSlidesPerView,
      );
    }
  }, []);

  const syncIndex = useCallback(() => {
    const node = viewportRef.current;
    if (!node) return;
    const slides = node.querySelectorAll<HTMLElement>("[data-carousel-slide]");
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

  const syncFromDom = useCallback(() => {
    syncMeta();
    syncIndex();
  }, [syncIndex, syncMeta]);

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
      pageCount,
      pageIndex,
      labels,
      syncFromDom,
      syncIndex,
      goTo,
      goPrev,
      goNext,
    }),
    [
      count,
      goNext,
      goPrev,
      goTo,
      index,
      labels,
      pageCount,
      pageIndex,
      syncFromDom,
      syncIndex,
      viewportId,
    ],
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
  const { viewportRef, viewportId, pageCount, syncFromDom, syncIndex, goTo, goPrev, goNext } =
    useCarousel();

  useEffect(() => {
    const node = viewportRef.current;
    if (!node) return;
    syncFromDom();

    const supportsScrollEnd = "onscrollend" in node;
    let scrollEndTimer: ReturnType<typeof setTimeout> | undefined;

    const onScrollEnd = () => {
      syncIndex();
    };

    const onScroll = () => {
      if (supportsScrollEnd) return;
      clearTimeout(scrollEndTimer);
      scrollEndTimer = setTimeout(onScrollEnd, 100);
    };

    node.addEventListener("scrollend", onScrollEnd);
    node.addEventListener("scroll", onScroll, { passive: true });

    const mutationObserver = new MutationObserver(syncFromDom);
    mutationObserver.observe(node, { childList: true, subtree: true });
    const resizeObserver = new ResizeObserver(syncFromDom);
    resizeObserver.observe(node);
    const mobileQuery = window.matchMedia(MOBILE_MQ);
    mobileQuery.addEventListener("change", syncFromDom);

    return () => {
      node.removeEventListener("scrollend", onScrollEnd);
      node.removeEventListener("scroll", onScroll);
      clearTimeout(scrollEndTimer);
      mutationObserver.disconnect();
      resizeObserver.disconnect();
      mobileQuery.removeEventListener("change", syncFromDom);
    };
  }, [syncFromDom, syncIndex, viewportRef]);

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
      goTo(pageCount - 1);
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
  const { index, count, pageCount, goNext, viewportId } = useCarousel();

  return (
    <button
      type="button"
      aria-label="Next slide"
      {...props}
      className={cx(styles.control, className)}
      aria-controls={viewportId}
      disabled={count === 0 || index >= pageCount - 1}
      onClick={goNext}
    >
      {children}
    </button>
  );
}

function Dots({ className }: { className?: string }) {
  const { pageCount, pageIndex, labels, goTo } = useCarousel();

  return (
    <div className={cx(styles.dots, className)}>
      {Array.from({ length: pageCount }, (_, i) => (
        <button
          key={i}
          type="button"
          className={cx(styles.dot, i === pageIndex && styles.dotActive)}
          aria-label={labels[i] ?? `Slide ${i + 1}`}
          aria-current={i === pageIndex ? "true" : undefined}
          onClick={() => goTo(i)}
        />
      ))}
    </div>
  );
}

export const Carousel = { Root, Viewport, Slide, Prev, Next, Dots };
