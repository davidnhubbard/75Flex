import styles from "./page.module.css";

export default function NoPlanEmptyPage() {
  return (
    <main className={styles.shell}>
      <section className={styles.phone}>
        <header className={styles.header}>
          <h2 className={styles.headTitle}>Today</h2>
        </header>

        <section className={styles.main}>
          <div>
            <div className={styles.icon}>🎯</div>
            <h1 className={styles.title}>No Plan Yet</h1>
            <p className={styles.text}>Create your 75-day challenge to get started.</p>
            <button className={styles.btn}>Create My Plan</button>
          </div>
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
