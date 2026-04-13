import Link from "next/link";
import shared from "../styles/primitives.module.css";
import styles from "./page.module.css";

export default function WhatIs75HardPage() {
  return (
    <main className={`${shared.appShell} ${styles.appShell}`}>
      <section className={shared.phone}>
        <header className={shared.topBar}>
          <Link aria-label="Back to onboarding" href="/onboarding" className={shared.iconButton}>
            &#x2039;
          </Link>
        </header>

        <article className={`${shared.scrollContent} ${styles.content}`}>
          <div className={styles.hero}>
            <p className={styles.kicker}>Reference Guide</p>
            <h1>What Is 75 Hard?</h1>
            <p className={styles.lead}>
              75 Hard is a 75-day challenge built around strict daily rules.
            </p>
            <p className={styles.lead}>
              It&apos;s designed to build discipline, but it can be difficult to sustain in
              real life.
            </p>
          </div>

          <section className={styles.block}>
            <h2>The 75 Hard Rules</h2>
            <p>Every day for 75 days, you must:</p>
            <ul>
              <li>Follow a diet with no cheat meals or alcohol</li>
              <li>Do two workouts, including one outdoors</li>
              <li>Hit a fixed daily water goal</li>
              <li>Read personal development every day</li>
              <li>Take a progress photo</li>
            </ul>
            <p className={styles.callout}>
              <strong>Miss one requirement, and you start over.</strong>
            </p>
          </section>

          <section className={styles.block}>
            <h2>Why It&apos;s So Hard to Stick With</h2>
            <ul>
              <li>The daily load is high</li>
              <li>Real life makes perfect streaks difficult</li>
              <li>One miss can erase your progress</li>
            </ul>
            <p>For many people, it becomes an all-or-nothing cycle.</p>
          </section>

          <section className={styles.block}>
            <h2>How 75 Flex Changes the Approach</h2>
            <p>75 Flex keeps the structure, but makes it more realistic.</p>
            <p>You still challenge yourself.</p>
            <p>You just build a version that fits your life.</p>
            <div className={styles.examples}>
              <article>
                <h3>Reading</h3>
                <p>Set a daily goal that fits your routine (e.g., 10–30 minutes)</p>
              </article>
              <article>
                <h3>Workouts</h3>
                <p>Choose a plan you can sustain (e.g., one solid session or two shorter ones)</p>
              </article>
              <article>
                <h3>Hydration &amp; Nutrition</h3>
                <p>Use goals that are challenging but repeatable</p>
              </article>
              <article>
                <h3>Progress Tracking</h3>
                <p>Keep a simple record and keep moving forward</p>
              </article>
            </div>
          </section>

          <section className={styles.block}>
            <h2>The Big Difference</h2>
            <p className={styles.bigDifference}>
              <strong>You don&apos;t restart.</strong>
            </p>
            <p className={styles.bigDifference}>
              <strong>You keep going.</strong>
            </p>
          </section>
        </article>

        <footer className={`${shared.footer} ${styles.controls}`}>
          <div className={styles.actions}>
            <Link className={`${shared.btn} ${shared.btnPrimary} ${styles.btn}`} href="/create-plan">
              Start My Plan
            </Link>
            <Link className={`${shared.btn} ${shared.btnSecondary} ${styles.btn}`} href="/onboarding">
              Back to Onboarding
            </Link>
          </div>
        </footer>
      </section>
    </main>
  );
}
