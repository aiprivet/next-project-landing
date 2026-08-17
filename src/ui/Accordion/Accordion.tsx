"use client";

import { cx } from "@/lib/cx";
import {
  createContext,
  useCallback,
  useContext,
  useId,
  useMemo,
  useState,
  type ButtonHTMLAttributes,
  type ReactNode,
} from "react";
import { AnimatePresence, motion } from "motion/react";
import styles from "./Accordion.module.scss";

type AccordionType = "single" | "multiple";

type AccordionContextValue = {
  type: AccordionType;
  open: string[];
  toggle: (value: string) => void;
};

const AccordionContext = createContext<AccordionContextValue | null>(null);
const ItemContext = createContext<{ value: string; itemId: string } | null>(
  null,
);

function useAccordion() {
  const ctx = useContext(AccordionContext);
  if (!ctx) throw new Error("Accordion components must be used within Accordion.Root");
  return ctx;
}

function useItem() {
  const ctx = useContext(ItemContext);
  if (!ctx) throw new Error("Accordion.Item is required");
  return ctx;
}

type RootProps = {
  type?: AccordionType;
  defaultValue?: string | string[];
  className?: string;
  children: ReactNode;
};

function Root({ type = "single", defaultValue, className, children }: RootProps) {
  const initial = Array.isArray(defaultValue)
    ? defaultValue
    : defaultValue
      ? [defaultValue]
      : [];
  const [open, setOpen] = useState<string[]>(initial);

  const toggle = useCallback(
    (value: string) => {
      setOpen((current) => {
        const isOpen = current.includes(value);
        if (type === "single") return isOpen ? [] : [value];
        return isOpen ? current.filter((item) => item !== value) : [...current, value];
      });
    },
    [type],
  );

  const value = useMemo(() => ({ type, open, toggle }), [type, open, toggle]);

  return (
    <AccordionContext.Provider value={value}>
      <div className={cx(styles.root, className)}>{children}</div>
    </AccordionContext.Provider>
  );
}

function Item({
  value,
  className,
  children,
}: {
  value: string;
  className?: string;
  children: ReactNode;
}) {
  const itemId = useId();
  return (
    <ItemContext.Provider value={{ value, itemId }}>
      <div className={cx(styles.item, className)}>{children}</div>
    </ItemContext.Provider>
  );
}

function Control({
  className,
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  const { open, toggle } = useAccordion();
  const { value, itemId } = useItem();
  const isOpen = open.includes(value);

  return (
    <button
      type="button"
      className={cx(styles.control, className)}
      aria-expanded={isOpen}
      aria-controls={`${itemId}-panel`}
      id={`${itemId}-control`}
      onClick={() => toggle(value)}
      {...props}
    >
      <span className={styles.controlContent}>{children}</span>
      <span className={cx(styles.icon, isOpen && styles.iconOpen)} aria-hidden>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M5 12h14M12 5v14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      </span>
    </button>
  );
}

function Panel({ className, children }: { className?: string; children: ReactNode }) {
  const { open } = useAccordion();
  const { value, itemId } = useItem();
  const isOpen = open.includes(value);

  return (
    <AnimatePresence initial={false}>
      {isOpen ? (
        <motion.div
          id={`${itemId}-panel`}
          role="region"
          aria-labelledby={`${itemId}-control`}
          className={cx(styles.panel, className)}
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className={styles.panelInner}>{children}</div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

export const Accordion = { Root, Item, Control, Panel };
