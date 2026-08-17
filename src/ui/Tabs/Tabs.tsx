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
  type KeyboardEvent,
  type ReactNode,
} from "react";
import styles from "./Tabs.module.scss";

type TabsContextValue = {
  value: string;
  setValue: (value: string) => void;
  baseId: string;
};

const TabsContext = createContext<TabsContextValue | null>(null);

function useTabs() {
  const ctx = useContext(TabsContext);
  if (!ctx) throw new Error("Tabs components must be used within Tabs.Root");
  return ctx;
}

function tabId(baseId: string, value: string) {
  return `${baseId}-tab-${value}`;
}

function panelId(baseId: string, value: string) {
  return `${baseId}-panel-${value}`;
}

function Root({
  value,
  defaultValue,
  onChange,
  className,
  children,
}: {
  value?: string;
  defaultValue: string;
  onChange?: (value: string) => void;
  className?: string;
  children: ReactNode;
}) {
  const baseId = useId();
  const [uncontrolled, setUncontrolled] = useState(defaultValue);
  const current = value ?? uncontrolled;

  const setValue = useCallback(
    (next: string) => {
      if (value === undefined) setUncontrolled(next);
      onChange?.(next);
    },
    [onChange, value],
  );

  const ctx = useMemo(
    () => ({ value: current, setValue, baseId }),
    [current, setValue, baseId],
  );

  return (
    <TabsContext.Provider value={ctx}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  );
}

function List({ className, children }: { className?: string; children: ReactNode }) {
  const { setValue } = useTabs();

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;

    const tabs = Array.from(
      event.currentTarget.querySelectorAll<HTMLButtonElement>(
        '[role="tab"]:not(:disabled)',
      ),
    ).filter((tab) => tab.getAttribute("aria-disabled") !== "true");
    if (tabs.length === 0) return;

    const active = (event.target as HTMLElement).closest('[role="tab"]');
    const currentIndex = tabs.findIndex((tab) => tab === active);
    if (currentIndex === -1) return;

    const last = tabs.length - 1;
    let nextIndex = currentIndex;
    if (event.key === "ArrowRight") nextIndex = currentIndex === last ? 0 : currentIndex + 1;
    else if (event.key === "ArrowLeft") nextIndex = currentIndex === 0 ? last : currentIndex - 1;
    else if (event.key === "Home") nextIndex = 0;
    else if (event.key === "End") nextIndex = last;

    event.preventDefault();
    const next = tabs[nextIndex];
    next.focus();
    if (next.dataset.value) setValue(next.dataset.value);
  };

  return (
    <div
      className={cx(styles.list, className)}
      role="tablist"
      aria-orientation="horizontal"
      onKeyDown={onKeyDown}
    >
      {children}
    </div>
  );
}

function Tab({
  value,
  className,
  children,
  onClick,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { value: string }) {
  const { value: current, setValue, baseId } = useTabs();
  const selected = current === value;

  return (
    <button
      type="button"
      {...props}
      role="tab"
      id={props.id ?? tabId(baseId, value)}
      aria-controls={props["aria-controls"] ?? panelId(baseId, value)}
      aria-selected={selected}
      tabIndex={props.tabIndex ?? (selected ? 0 : -1)}
      data-value={value}
      className={cx(styles.tab, selected && styles.tabActive, className)}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) setValue(value);
      }}
    >
      {children}
    </button>
  );
}

function Panel({
  value,
  className,
  children,
}: {
  value: string;
  className?: string;
  children: ReactNode;
}) {
  const { value: current, baseId } = useTabs();
  if (current !== value) return null;
  return (
    <div
      role="tabpanel"
      id={panelId(baseId, value)}
      aria-labelledby={tabId(baseId, value)}
      tabIndex={0}
      className={className}
    >
      {children}
    </div>
  );
}

export const Tabs = { Root, List, Tab, Panel };
