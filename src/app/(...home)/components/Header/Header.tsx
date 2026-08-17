"use client";

import { NAV_DESKTOP, NAV_MOBILE, APP_URL } from "@/lib/constants";
import { cx } from "@/lib/cx";
import { Button, Logo } from "@/ui";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import styles from "./Header.module.scss";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("menu-open", menuOpen);
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.documentElement.classList.remove("menu-open");
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className={cx(styles.header, scrolled && styles.scrolled, menuOpen && styles.menuOpen)}>
      <div className={styles.bar}>
        <Logo className={styles.logo} />
        <nav className={styles.nav} aria-label="Основная навигация">
          {NAV_DESKTOP.map((item) => (
            <a key={item.href} href={item.href} className={styles.link}>
              {item.label}
            </a>
          ))}
        </nav>
        <div className={styles.actions}>
          <Button
            as="a"
            href={APP_URL}
            target="_blank"
            rel="noopener noreferrer"
            size="sm"
            radius="md"
            shimmer
            className={styles.cta}
            tabIndex={menuOpen ? -1 : undefined}
          >
            Начать сейчас
          </Button>
          <button
            type="button"
            className={cx(styles.burger, menuOpen && styles.burgerOpen)}
            aria-label={menuOpen ? "Закрыть меню" : "Открыть меню"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span className={styles.burgerIcon} />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen ? (
          <motion.nav
            className={styles.menu}
            aria-label="Мобильная навигация"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.14 }}
          >
            {NAV_MOBILE.map((item, index) => (
              <motion.a
                key={item.href}
                href={item.href}
                className={styles.menuLink}
                onClick={closeMenu}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.04 + index * 0.045, duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
              >
                {item.label}
              </motion.a>
            ))}
            <motion.div
              className={styles.menuCtaWrap}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            >
              <Button
                as="a"
                href={APP_URL}
                target="_blank"
                rel="noopener noreferrer"
                size="lg"
                radius="md"
                shimmer
                className={styles.menuCta}
              >
                Начать сейчас
              </Button>
            </motion.div>
          </motion.nav>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
