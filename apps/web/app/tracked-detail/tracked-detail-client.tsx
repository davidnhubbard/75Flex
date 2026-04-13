"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import shared from "../styles/primitives.module.css";
import styles from "./page.module.css";
import { getCommitmentById } from "../../lib/commitment-storage";
import {
  DayTaskState,
  getTaskNote,
  getTaskStatus,
  getTodayKey,
  saveTaskLog
} from "../../lib/daily-log-storage";

type TrackedDetailClientProps = {
  id: string;
  dayKey: string;
};

function isValidDayKey(value: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

export default function TrackedDetailClient({ id, dayKey }: TrackedDetailClientProps) {
  const commitment = useMemo(() => getCommitmentById(id), [id]);
  const effectiveDayKey = isValidDayKey(dayKey) ? dayKey : getTodayKey();
  const backHref = effectiveDayKey === getTodayKey() ? "/today" : `/today?day=${effectiveDayKey}`;

  const [status, setStatus] = useState<DayTaskState>(() => getTaskStatus(id, effectiveDayKey));
  const [note, setNote] = useState<string>(() => getTaskNote(id, effectiveDayKey));

  if (!commitment) {
    return (
      <section className={`${shared.scrollContent} ${styles.content}`}>
        <h1 className={styles.title}>Commitment not found</h1>
        <p className={styles.subtitle}>This item may have been removed.</p>
      </section>
    );
  }

  const setAndSaveStatus = (next: DayTaskState) => {
    setStatus(next);
    saveTaskLog(id, next, note, effectiveDayKey);
  };

  return (
    <section className={`${shared.scrollContent} ${styles.content}`}>
      <div className={styles.hero}>
        <div className={styles.heroIcon}>{commitment.name.slice(0, 1).toUpperCase()}</div>
        <h1 className={styles.title}>{commitment.name}</h1>
        <div className={styles.badge}>{status.replace("-", " ")}</div>
      </div>

      <div>
        <h2 className={styles.sectionTitle}>Quick Log</h2>
        <div className={styles.grid}>
          <button className={styles.quickBtn} type="button" onClick={() => setAndSaveStatus("not-started")}>
            Not Started
          </button>
          <button className={styles.quickBtn} type="button" onClick={() => setAndSaveStatus("partial")}>
            Partial
          </button>
          <button className={styles.quickBtn} type="button" onClick={() => setAndSaveStatus("complete")}>
            Complete
          </button>
        </div>
      </div>

      <div>
        <h2 className={styles.sectionTitle}>Detail</h2>
        <p className={styles.detailText}>{commitment.detail || "No detail added yet"}</p>
      </div>

      <div>
        <h2 className={styles.sectionTitle}>Note</h2>
        <textarea
          className={styles.note}
          value={note}
          onChange={(event) => {
            const next = event.target.value;
            setNote(next);
            saveTaskLog(id, status, next, effectiveDayKey);
          }}
          placeholder="Optional note"
          maxLength={240}
        />
      </div>

      <Link className={`${shared.btn} ${shared.btnPrimary} ${styles.backBtn}`} href={backHref}>
        Back to Daily Log
      </Link>
    </section>
  );
}
