import Link from "next/link";
import styles from "./page.module.css";

export default function DailyPhotoCheckinPage() {
  return (
    <main className={styles.shell}>
      <section className={styles.phone}>
        <header className={styles.header}>
          <p className={styles.kicker}>Daily Commitment</p>
          <h1>Progress Photo</h1>
          <p className={styles.sub}>
            Keep a simple daily visual record to support consistency.
          </p>
        </header>

        <section className={styles.content}>
          <div className={styles.previewBox}>
            <p>Photo placeholder</p>
            <button className={styles.uploadBtn} type="button">
              Upload Photo
            </button>
          </div>

          <div className={styles.meta}>
            <h2>Today</h2>
            <p>July 30, 2026</p>
          </div>

          <div className={styles.options}>
            <button className={styles.optionBtn} type="button">
              Mark Complete
            </button>
            <button className={styles.optionBtn} type="button">
              Add Note
            </button>
          </div>
        </section>

        <footer className={styles.footer}>
          <Link href="/today" className={styles.cta}>
            Back To Today
          </Link>
        </footer>
      </section>
    </main>
  );
}

