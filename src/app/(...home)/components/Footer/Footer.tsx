import { EMAIL } from "@/lib/constants";
import { Logo } from "@/ui";
import Link from "next/link";
import { footer } from "../../content";
import styles from "./Footer.module.scss";

export function Footer() {
  return (
    <footer id="footer" className={styles.footer}>
      <div className={styles.top}>
        <div className={styles.brand}>
          <Logo />
          <p className={styles.tagline}>{footer.tagline}</p>
        </div>
        <nav className={styles.links} aria-label="Подвал">
          {footer.columns.map((column) => (
            <div key={column.title} className={styles.col}>
              <p className={styles.colTitle}>{column.title}</p>
              <div className={styles.list}>
                {column.links.map((link) => {
                  const external =
                    link.href.startsWith("http") ||
                    link.href.startsWith("mailto:");
                  if (external) {
                    return (
                      <a
                        key={link.label}
                        href={link.href}
                        className={styles.link}
                        target={
                          link.href.startsWith("http") ? "_blank" : undefined
                        }
                        rel={
                          link.href.startsWith("http")
                            ? "noopener noreferrer"
                            : undefined
                        }
                      >
                        {link.label}
                      </a>
                    );
                  }
                  return (
                    <Link
                      key={link.label}
                      href={link.href}
                      className={styles.link}
                    >
                      {link.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </div>
      <div className={styles.legal}>
        <p className={styles.copyright}>{footer.copyright}</p>
        <a href={`mailto:${EMAIL}`} className={styles.email}>
          {EMAIL}
        </a>
      </div>
    </footer>
  );
}
