import styles from "./page.module.css";

const commitments = ["Drink Water", "Workout", "Read", "Journal"];

export default function DayOnePage() {
  return (
    <main className={styles.shell}>
      <section className={styles.phone}>
        <header className={styles.header}>
          <p className={styles.sub}>Day 1 - Aug 1</p>
          <h1 className={styles.title}>Today</h1>
          <p className={styles.summary}>0 of 4 complete</p>
        </header>

        <section className={styles.content}>
          <div className={styles.message}>✨ Day 1 - Let&apos;s get started</div>
          {commitments.map((item) => (
            <article key={item} className={styles.card}>
              <span className={styles.dot} />
              <span className={styles.item}>{item}</span>
            </article>
          ))}
        </section>

        <footer className={styles.bottomNav}>
          <button className={`${styles.nav} ${styles.active}`}>
            <span>◉</span>
            <span className={styles.label}>Today</span>
          </button>
          <button className={styles.nav}>
            <span>↗</span>
            <span className={styles.label}>Progress</span>
          </button>
          <button className={styles.nav}>
            <span>☰</span>
            <span className={styles.label}>Plan</span>
          </button>
          <button className={styles.nav}>
            <span>⚙</span>
            <span className={styles.label}>Settings</span>
          </button>
        </footer>
      </section>
    </main>
  );
}
