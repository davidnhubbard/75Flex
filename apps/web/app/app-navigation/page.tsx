import styles from "./page.module.css";

export default function AppNavigationPage() {
  return (
    <main className={styles.shell}>
      <section className={styles.phone}>
        <section className={styles.content}>
          <div className={styles.date}>Day 30 - July 12</div>
          <h1 className={styles.title}>Today</h1>

          <div className={styles.list}>
            <div className={styles.card}>
              <div className={styles.circle} />
              <div className={styles.line} style={{ width: 120 }} />
            </div>
            <div className={styles.card}>
              <div className={styles.circle} />
              <div className={styles.line} style={{ width: 80 }} />
            </div>
            <div className={styles.card}>
              <div className={styles.circle} />
              <div className={styles.line} style={{ width: 100 }} />
            </div>
          </div>
        </section>

        <footer className={styles.tabBar}>
          <button className={`${styles.tab} ${styles.tabActive}`}>
            <span className={styles.tabIcon}>◉</span>
            <span className={styles.tabLabel}>Today</span>
          </button>
          <button className={styles.tab}>
            <span className={styles.tabIcon}>▤</span>
            <span className={styles.tabLabel}>Progress</span>
          </button>
          <button className={styles.tab}>
            <span className={styles.tabIcon}>☰</span>
            <span className={styles.tabLabel}>Plan</span>
          </button>
          <button className={styles.tab}>
            <span className={styles.tabIcon}>⚙</span>
            <span className={styles.tabLabel}>Settings</span>
          </button>
        </footer>
      </section>
    </main>
  );
}
