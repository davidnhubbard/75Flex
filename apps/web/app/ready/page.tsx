import styles from "./page.module.css";

export default function ReadyPage() {
  return (
    <main className={styles.shell}>
      <section className={styles.phone}>
        <div className={styles.hero}>
          <div className={styles.heroBadge}>✓</div>
        </div>

        <header className={styles.head}>
          <h1 className={styles.title}>You&apos;re Ready</h1>
          <p className={styles.subtitle}>Your 75-day challenge starts now.</p>
        </header>

        <div className={styles.content}>
          <article className={styles.card}>
            <h2 className={styles.cardTitle}>Your Plan</h2>
            <ul className={styles.list}>
              <li className={styles.item}>
                <span className={styles.icon}>🏋</span> Workout
              </li>
              <li className={styles.item}>
                <span className={styles.icon}>💧</span> Drink Water
              </li>
              <li className={styles.item}>
                <span className={styles.icon}>📘</span> Read
              </li>
              <li className={styles.item}>
                <span className={styles.icon}>✍</span> Journal
              </li>
            </ul>
          </article>

          <div className={styles.pill}>🚩 Day 1 starts today</div>
        </div>

        <footer className={styles.footer}>
          <button className={`${styles.btn} ${styles.btnPrimary}`}>Start Day 1</button>
          <button className={`${styles.btn} ${styles.btnSecondary}`}>Back to edit</button>
        </footer>
      </section>
    </main>
  );
}
