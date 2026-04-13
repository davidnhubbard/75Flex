import Link from "next/link";
import shared from "../styles/primitives.module.css";
import styles from "./page.module.css";

export default function ChallengeIntroPage() {
  return (
    <main className={`${shared.appShell} ${styles.shell}`}>
      <section className={shared.phone}>
        <header className={shared.topBar}>
          <Link
            className={shared.iconButton}
            href="/onboarding?mode=education&step=2"
            aria-label="Go back"
          >
            &lt;
          </Link>
        </header>

        <section className={shared.scrollContent}>
          <div className={styles.heroWrap}>
            <div className={styles.heroCard}>
              <div className={styles.heroImage} />
              <div className={styles.floatIcon}>P</div>
            </div>
          </div>

          <section className={styles.content}>
            <h1 className={styles.title}>Your 75-Day Challenge</h1>
            <div className={styles.text}>
              <span>Create a daily plan for fitness, habits, and routines.</span>
              <span>Track what you do each day and see progress build over time.</span>
            </div>
          </section>
        </section>

        <footer className={shared.footer}>
          <div className={styles.dots}>
            <span className={`${styles.dot} ${styles.dotActive}`} />
            <span className={styles.dot} />
            <span className={styles.dot} />
            <span className={styles.dot} />
          </div>
          <Link className={`${shared.btn} ${shared.btnPrimary} ${styles.btn}`} href="/choose-template">
            Continue
          </Link>
        </footer>
      </section>
    </main>
  );
}
