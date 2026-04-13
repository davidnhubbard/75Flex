"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import shared from "../styles/primitives.module.css";
import styles from "./page.module.css";
import { Commitment, loadCommitments } from "../../lib/commitment-storage";
import { getTaskStatus, summarizeDay } from "../../lib/daily-log-storage";

export default function DailyCompletePage() {
  const [commitments, setCommitments] = useState<Commitment[]>([]);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    setCommitments(loadCommitments());
    setTick((v) => v + 1);
  }, []);

  const summary = useMemo(() => summarizeDay(commitments), [commitments, tick]);
  const allComplete = summary.total > 0 && summary.complete === summary.total;

  return (
    <main className={shared.appShell}>
      <section className={shared.phone}>
        <header className={styles.header}>
          <p className={styles.sub}>Today</p>
          <h1 className={styles.title}>{allComplete ? "All Complete" : "Keep Going"}</h1>
          <p className={styles.summary}>
            {summary.complete} of {summary.total} complete
          </p>
        </header>

        <section className={styles.content}>
          <div className={styles.completion}>
            <div>
              <strong>{allComplete ? "All done for today" : "Progress in motion"}</strong>
              <div className={styles.progressText}>{summary.percent}% complete</div>
            </div>
            <Link className={styles.chev} href="/progress-calendar">
              View
            </Link>
          </div>

          {commitments.map((item) => {
            const state = getTaskStatus(item.id);
            return (
              <article
                key={item.id}
                className={`${styles.card} ${state === "complete" ? styles.cardDone : styles.cardOpen}`}
              >
                <span className={styles.check}>{state === "complete" ? "\u2713" : "\u2022"}</span>
                <strong>{item.name}</strong>
                <span className={styles.state}>{state.replace("-", " ")}</span>
              </article>
            );
          })}

          {commitments.length === 0 ? (
            <div className={styles.empty}>No commitments found. Build your plan first.</div>
          ) : null}
        </section>

        <footer className={shared.tabBar}>
          <p className={shared.tabHint}>Tap a mode to switch views</p>
          <div className={shared.tabGrid}>
            <Link className={shared.tabButton} href="/today">
              Today
            </Link>
            <Link className={shared.tabButton} href="/progress-calendar">
              Progress
            </Link>
            <Link className={shared.tabButton} href="/review-plan">
              Plan
            </Link>
            <Link className={`${shared.tabButton} ${shared.tabActive}`} href="/daily-complete">
              Summary
            </Link>
          </div>
        </footer>
      </section>
    </main>
  );
}
