"use client";

import { cx } from "@/lib/cx";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ButtonHTMLAttributes,
  type ReactNode,
} from "react";
import styles from "./Tabs.module.scss";

type TabsContextValue = {
  value: string;
  setValue: (value: string) => void;
};

const TabsContext = createContext<TabsContextValue | null>(null);

function useTabs() {
  const ctx = useContext(TabsContext);
  if (!ctx) throw new Error("Tabs components must be used within Tabs.Root");
  return ctx;
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
  const [uncontrolled, setUncontrolled] = useState(defaultValue);
  const current = value ?? uncontrolled;

  const setValue = useCallback(
    (next: string) => {
      if (value === undefined) setUncontrolled(next);
      onChange?.(next);
    },
    [onChange, value],
  );

  const ctx = useMemo(() => ({ value: current, setValue }), [current, setValue]);

  return (
    <TabsContext.Provider value={ctx}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  );
}

function List({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <div className={cx(styles.list, className)} role="tablist">
      {children}
    </div>
  );
}

function Tab({
  value,
  className,
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { value: string }) {
  const { value: current, setValue } = useTabs();
  const selected = current === value;

  return (
    <button
      type="button"
      role="tab"
      aria-selected={selected}
      className={cx(styles.tab, selected && styles.tabActive, className)}
      onClick={() => setValue(value)}
      {...props}
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
  const { value: current } = useTabs();
  if (current !== value) return null;
  return (
    <div role="tabpanel" className={className}>
      {children}
    </div>
  );
}

export const Tabs = { Root, List, Tab, Panel };
