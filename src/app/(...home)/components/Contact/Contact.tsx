"use client";

import { EMAIL, TELEGRAM_URL } from "@/lib/constants";
import { Button, Field, Heading, Reveal, Section, Text } from "@/ui";
import { AnimatePresence, motion } from "motion/react";
import { useState, type FormEvent, type FocusEvent } from "react";
import { contact } from "../../content";
import styles from "./Contact.module.scss";

const SUBMIT_MS = 800;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type FormValues = {
  name: string;
  email: string;
  company: string;
  interest: string;
  message: string;
  consent: boolean;
};

type FieldName = keyof FormValues;
type FormErrors = Partial<Record<FieldName, string>>;

const empty: FormValues = {
  name: "",
  email: "",
  company: "",
  interest: "",
  message: "",
  consent: false,
};

function validateField(name: FieldName, values: FormValues): string | undefined {
  const { errors } = contact;

  if (name === "consent") {
    return values.consent ? undefined : errors.consent;
  }

  const value = values[name].trim();
  if (!value) return errors.required;

  if (name === "email" && !EMAIL_RE.test(value)) return errors.email;
  if ((name === "name" || name === "company") && value.length < 2) return errors.min;
  if (name === "message" && value.length < 10) return errors.min;

  return undefined;
}

function validateAll(values: FormValues): FormErrors {
  const next: FormErrors = {};
  (Object.keys(empty) as FieldName[]).forEach((name) => {
    const error = validateField(name, values);
    if (error) next[name] = error;
  });
  return next;
}

export function Contact() {
  const [values, setValues] = useState<FormValues>(empty);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  function setField<K extends FieldName>(name: K, value: FormValues[K]) {
    setValues((current) => ({ ...current, [name]: value }));
  }

  function onBlur(event: FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const name = event.target.name as FieldName;
    const nextValues =
      name === "consent"
        ? { ...values, consent: (event.target as HTMLInputElement).checked }
        : { ...values, [name]: event.target.value };
    const error = validateField(name, nextValues);
    setErrors((current) => ({ ...current, [name]: error }));
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validateAll(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSubmitting(true);
    await new Promise((resolve) => window.setTimeout(resolve, SUBMIT_MS));
    setSubmitting(false);
    setSuccess(true);
  }

  function reset() {
    setValues(empty);
    setErrors({});
    setSuccess(false);
  }

  return (
    <Section id="contact" padding="none" className={styles.section}>
      <div className={styles.layout}>
        <Reveal className={styles.intro}>
          <Heading order={2}>{contact.title}</Heading>
          <Text className={styles.subtitle}>{contact.subtitle}</Text>
        </Reveal>

        <div className={styles.panel}>
          <AnimatePresence mode="wait">
            {success ? (
              <motion.div
                key="success"
                className={styles.success}
                role="status"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              >
                <Heading order={3}>{contact.successTitle}</Heading>
                <Text>{contact.successText}</Text>
                <Button type="button" variant="ghost" className={styles.reset} onClick={reset}>
                  {contact.successReset}
                </Button>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                className={styles.form}
                noValidate
                onSubmit={onSubmit}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              >
                <Field.Root invalid={Boolean(errors.name)}>
                  <Field.Label>{contact.nameLabel}</Field.Label>
                  <Field.Input
                    name="name"
                    autoComplete="name"
                    placeholder={contact.namePlaceholder}
                    value={values.name}
                    disabled={submitting}
                    onChange={(event) => setField("name", event.target.value)}
                    onBlur={onBlur}
                  />
                  {errors.name ? <Field.Error>{errors.name}</Field.Error> : null}
                </Field.Root>

                <Field.Root invalid={Boolean(errors.email)}>
                  <Field.Label>{contact.emailFieldLabel}</Field.Label>
                  <Field.Input
                    name="email"
                    type="email"
                    autoComplete="email"
                    inputMode="email"
                    placeholder={contact.emailPlaceholder}
                    value={values.email}
                    disabled={submitting}
                    onChange={(event) => setField("email", event.target.value)}
                    onBlur={onBlur}
                  />
                  {errors.email ? <Field.Error>{errors.email}</Field.Error> : null}
                </Field.Root>

                <Field.Root invalid={Boolean(errors.company)}>
                  <Field.Label>{contact.companyLabel}</Field.Label>
                  <Field.Input
                    name="company"
                    autoComplete="organization"
                    placeholder={contact.companyPlaceholder}
                    value={values.company}
                    disabled={submitting}
                    onChange={(event) => setField("company", event.target.value)}
                    onBlur={onBlur}
                  />
                  {errors.company ? <Field.Error>{errors.company}</Field.Error> : null}
                </Field.Root>

                <Field.Root invalid={Boolean(errors.interest)}>
                  <Field.Label>{contact.interestLabel}</Field.Label>
                  <Field.Select
                    name="interest"
                    value={values.interest}
                    disabled={submitting}
                    onChange={(event) => setField("interest", event.target.value)}
                    onBlur={onBlur}
                  >
                    <option value="">{contact.interestPlaceholder}</option>
                    {contact.interestOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Field.Select>
                  {errors.interest ? <Field.Error>{errors.interest}</Field.Error> : null}
                </Field.Root>

                <Field.Root invalid={Boolean(errors.message)}>
                  <Field.Label>{contact.messageLabel}</Field.Label>
                  <Field.Textarea
                    name="message"
                    placeholder={contact.messagePlaceholder}
                    value={values.message}
                    disabled={submitting}
                    onChange={(event) => setField("message", event.target.value)}
                    onBlur={onBlur}
                  />
                  {errors.message ? <Field.Error>{errors.message}</Field.Error> : null}
                </Field.Root>

                <Field.Root invalid={Boolean(errors.consent)}>
                  <label className={styles.consent}>
                    <input
                      className={styles.checkbox}
                      type="checkbox"
                      name="consent"
                      checked={values.consent}
                      aria-invalid={errors.consent ? true : undefined}
                      disabled={submitting}
                      onChange={(event) => setField("consent", event.target.checked)}
                      onBlur={onBlur}
                    />
                    <span>{contact.consent}</span>
                  </label>
                  {errors.consent ? <Field.Error>{errors.consent}</Field.Error> : null}
                </Field.Root>

                <Button type="submit" shimmer disabled={submitting} className={styles.submit}>
                  {submitting ? contact.submitting : contact.submit}
                </Button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </Section>
  );
}
