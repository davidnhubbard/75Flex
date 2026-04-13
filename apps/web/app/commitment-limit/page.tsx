import Link from "next/link";
import shared from "../styles/primitives.module.css";
import styles from "./page.module.css";

export default function CommitmentLimitPage() {
  return (
    <main className={shared.appShell}>
      <section className={shared.phone}>
        <header className={styles.header}>
          <Link className={shared.iconButton} href="/build-plan" aria-label="Close">
            &times;
          </Link>
        </header>

        <section className={`${shared.scrollContent} ${styles.main}`}>
          <div className={styles.icon}>L</div>
          <h1 className={styles.title}>Keep it sustainable</h1>
          <p className={styles.subtitle}>
            You have reached the 4 commitment limit. Fewer commitments usually lead to better
            consistency across the full 75 days.
          </p>

          <div className={styles.cards}>
            <article className={`${styles.card} ${styles.cardCurrent}`}>
              <div className={styles.cardHead}>
                <div className={styles.cardTitle}>Free Plan</div>
                <span className={styles.badge}>Current</span>
              </div>
              <div className={styles.feature}>Maximum of 4 commitments</div>
              <div className={styles.feature}>Recommended for sustainable habit consistency</div>
            </article>

            <article className={styles.card}>
              <div className={styles.cardHead}>
                <div className={styles.cardTitle}>Flex Pro</div>
              </div>
              <div className={styles.feature}>Maximum of 6 commitments</div>
              <div className={styles.feature}>For advanced users who need more flexibility</div>
            </article>
          </div>
        </section>

        <footer className={shared.footer}>
          <Link className={`${shared.btn} ${shared.btnPrimary} ${styles.btn}`} href="/build-plan">
            Got it, back to my plan
          </Link>
          <button className={`${shared.btn} ${styles.btnSecondary} ${styles.btn}`} type="button">
            Learn more about Flex Pro
          </button>
        </footer>
      </section>
    </main>
  );
}
