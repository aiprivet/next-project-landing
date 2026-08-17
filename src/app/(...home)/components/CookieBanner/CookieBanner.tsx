"use client";

import { COOKIE_KEY } from "@/lib/constants";
import { Button } from "@/ui";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useCallback, useState, useSyncExternalStore } from "react";
import { cookie } from "../../content";
import styles from "./CookieBanner.module.scss";

function subscribe(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange);
  return () => window.removeEventListener("storage", onStoreChange);
}

function getSnapshot() {
  return window.localStorage.getItem(COOKIE_KEY) !== "1";
}

function getServerSnapshot() {
  return false;
}

export function CookieBanner() {
  const unseen = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );
  const [dismissed, setDismissed] = useState(false);
  const visible = unseen && !dismissed;

  const accept = useCallback(() => {
    window.localStorage.setItem(COOKIE_KEY, "1");
    setDismissed(true);
  }, []);

  return (
    <AnimatePresence>
      {visible ? (
        <motion.aside
          className={styles.banner}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className={styles.text}>
            Мы используем файлы cookie, чтобы сделать наш сайт лучше. Используя
            сайт, вы принимаете нашу{" "}
            <Link href="/#">политику конфиденциальности</Link> и{" "}
            <Link href="/#">соглашение на обработку персональных данных</Link>.
          </p>
          <Button
            size="sm"
            radius="pill"
            className={styles.button}
            onClick={accept}
          >
            {cookie.accept}
          </Button>
        </motion.aside>
      ) : null}
    </AnimatePresence>
  );
}
