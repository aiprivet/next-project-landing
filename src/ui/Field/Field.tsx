"use client";

import { cx } from "@/lib/cx";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useState,
  type InputHTMLAttributes,
  type LabelHTMLAttributes,
  type ReactNode,
  type SelectHTMLAttributes,
  type TextareaHTMLAttributes,
} from "react";
import styles from "./Field.module.scss";

type FieldContextValue = {
  id: string;
  describedBy: string | undefined;
  invalid: boolean;
  hintId: string;
  errorId: string;
  setDescribed: (key: "hint" | "error", present: boolean) => void;
};

const FieldContext = createContext<FieldContextValue | null>(null);

function useField() {
  const ctx = useContext(FieldContext);
  if (!ctx) throw new Error("Field components must be used within Field.Root");
  return ctx;
}

function Root({
  invalid = false,
  className,
  children,
}: {
  invalid?: boolean;
  className?: string;
  children: ReactNode;
}) {
  const id = useId();
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;
  const [hasHint, setHasHint] = useState(false);
  const [hasError, setHasError] = useState(false);

  const describedBy =
    [hasHint ? hintId : null, hasError ? errorId : null].filter(Boolean).join(" ") ||
    undefined;

  const setDescribed = useCallback((key: "hint" | "error", present: boolean) => {
    if (key === "hint") setHasHint(present);
    else setHasError(present);
  }, []);

  const value = useMemo(
    () => ({
      id,
      describedBy,
      invalid,
      hintId,
      errorId,
      setDescribed,
    }),
    [describedBy, errorId, hintId, id, invalid, setDescribed],
  );

  return (
    <FieldContext.Provider value={value}>
      <div className={cx(styles.root, className)}>{children}</div>
    </FieldContext.Provider>
  );
}

function Label({
  className,
  children,
  ...props
}: LabelHTMLAttributes<HTMLLabelElement> & { children: ReactNode }) {
  const { id } = useField();

  return (
    <label htmlFor={id} className={cx(styles.label, className)} {...props}>
      {children}
    </label>
  );
}

function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  const { id, describedBy, invalid } = useField();

  return (
    <input
      {...props}
      id={id}
      aria-describedby={describedBy}
      aria-invalid={invalid || undefined}
      className={cx(styles.control, invalid && styles.controlInvalid, className)}
    />
  );
}

function Textarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const { id, describedBy, invalid } = useField();

  return (
    <textarea
      {...props}
      id={id}
      aria-describedby={describedBy}
      aria-invalid={invalid || undefined}
      className={cx(styles.control, styles.textarea, invalid && styles.controlInvalid, className)}
    />
  );
}

function Select({
  className,
  children,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement> & { children: ReactNode }) {
  const { id, describedBy, invalid } = useField();

  return (
    <select
      {...props}
      id={id}
      aria-describedby={describedBy}
      aria-invalid={invalid || undefined}
      className={cx(styles.control, styles.select, invalid && styles.controlInvalid, className)}
    >
      {children}
    </select>
  );
}

function Hint({ className, children }: { className?: string; children: ReactNode }) {
  const { hintId, setDescribed } = useField();

  useEffect(() => {
    setDescribed("hint", true);
    return () => setDescribed("hint", false);
  }, [setDescribed]);

  return (
    <p id={hintId} className={cx(styles.hint, className)}>
      {children}
    </p>
  );
}

function FieldError({ className, children }: { className?: string; children: ReactNode }) {
  const { errorId, setDescribed } = useField();

  useEffect(() => {
    setDescribed("error", true);
    return () => setDescribed("error", false);
  }, [setDescribed]);

  return (
    <p id={errorId} className={cx(styles.error, className)} role="alert">
      {children}
    </p>
  );
}

export const Field = { Root, Label, Input, Textarea, Select, Hint, Error: FieldError };
