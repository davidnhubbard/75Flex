"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import shared from "../styles/primitives.module.css";
import styles from "./page.module.css";
import ActiveDatasetBadge from "../components/active-dataset-badge";
import { loadCommitments } from "../../lib/commitment-storage";
import { loadDayLogs } from "../../lib/daily-log-storage";

const days = ["M", "T", "W", "T", "F", "S", "S"];

type CellState = "empty" | "complete" | "partial" | "missed" | "today" | "future";

type CalendarCell = {
  key: string;
  day: number | "";
  dayKey?: string;
  state: CellState;
};

function toDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function shiftMonth(base: Date, delta: number): Date {
  return new Date(base.getFullYear(), base.getMonth() + delta, 1);
}

function deriveState(dayKey: string, todayKey: string): CellState {
  if (dayKey > todayKey) {
    return "future";
  }

  const commitments = loadCommitments();
  if (commitments.length === 0) {
    return dayKey === todayKey ? "today" : "missed";
  }

  const logs = loadDayLogs(dayKey);
  const statuses = commitments.map((item) => logs[item.id]?.status ?? "not-started");

  const completeCount = statuses.filter((status) => status === "complete").length;
  const partialCount = statuses.filter((status) => status === "partial").length;
  const startedCount = statuses.filter((status) => status !== "not-started").length;

  let state: CellState = "missed";

  if (completeCount === commitments.length) {
    state = "complete";
  } else if (partialCount > 0 || startedCount > 0) {
    state = "partial";
  }

  if (dayKey === todayKey) {
    return "today";
  }

  return state;
}

function getTodaySummaryState(dayKey: string): Exclude<CellState, "empty" | "future"> {
  const commitments = loadCommitments();
  if (commitments.length === 0) {
    return "today";
  }

  const logs = loadDayLogs(dayKey);
  const statuses = commitments.map((item) => logs[item.id]?.status ?? "not-started");

  if (statuses.every((status) => status === "complete")) {
    return "complete";
  }

  if (statuses.some((status) => status !== "not-started")) {
    return "partial";
  }

  return "today";
}

export default function ProgressCalendarPage() {
  const router = useRouter();
  const [monthOffset, setMonthOffset] = useState(0);

  const today = new Date();
  const todayKey = toDateKey(today);
  const monthDate = shiftMonth(today, monthOffset);
  const canMoveForward = monthOffset < 0;

  const monthLabel = monthDate.toLocaleDateString(undefined, {
    month: "long",
    year: "numeric"
  });

  const cells = useMemo<CalendarCell[]>(() => {
    const year = monthDate.getFullYear();
    const month = monthDate.getMonth();
    const firstOfMonth = new Date(year, month, 1);
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstWeekdayIndex = (firstOfMonth.getDay() + 6) % 7;

    const result: CalendarCell[] = [];

    for (let i = 0; i < firstWeekdayIndex; i += 1) {
      result.push({ key: `empty-start-${i}`, day: "", state: "empty" });
    }

    for (let day = 1; day <= daysInMonth; day += 1) {
      const dayDate = new Date(year, month, day);
      const dayKey = toDateKey(dayDate);
      const baseState = deriveState(dayKey, todayKey);
      const state = baseState === "today" ? getTodaySummaryState(dayKey) : baseState;

      result.push({
        key: dayKey,
        day,
        dayKey,
        state: dayKey === todayKey ? "today" : state
      });
    }

    while (result.length % 7 !== 0) {
      result.push({ key: `empty-end-${result.length}`, day: "", state: "empty" });
    }

    return result;
  }, [monthDate, todayKey]);

  const summary = useMemo(() => {
    return cells.reduce(
      (acc, cell) => {
        if (cell.state === "complete") {
          acc.complete += 1;
        } else if (cell.state === "partial" || cell.state === "today") {
          acc.partial += 1;
        } else if (cell.state === "missed") {
          acc.missed += 1;
        }
        return acc;
      },
      { complete: 0, partial: 0, missed: 0 }
    );
  }, [cells]);

  const openDay = (dayKey?: string) => {
    if (!dayKey) {
      return;
    }

    if (dayKey === todayKey) {
      router.push("/today");
      return;
    }

    router.push(`/today?day=${dayKey}`);
  };

  return (
    <main className={shared.appShell}>
      <section className={shared.phone}>
        <header className={styles.header}>
          <div className={styles.topRow}>
            <Link className={shared.iconButton} href="/today" aria-label="Back to today">
              &lt;
            </Link>
            <div className={styles.kicker}>Progress</div>
            <div className={styles.spacer} />
          </div>
          <h1>Calendar</h1>
          <p className={styles.sub}>Tap any day to open that daily log.</p>
          <ActiveDatasetBadge className={styles.datasetBadge} />
        </header>

        <section className={`${shared.scrollContent} ${styles.content}`}>
          <div className={styles.monthRow}>
            <button className={styles.ghostBtn} aria-label="Previous month" onClick={() => setMonthOffset((v) => v - 1)}>
              &lt;
            </button>
            <h2>{monthLabel}</h2>
            <button
              className={styles.ghostBtn}
              aria-label="Next month"
              onClick={() => setMonthOffset((v) => v + 1)}
              disabled={!canMoveForward}
            >
              &gt;
            </button>
          </div>

          <div className={styles.weekdays}>
            {days.map((day, idx) => (
              <span key={`${day}-${idx}`}>{day}</span>
            ))}
          </div>

          <div className={styles.grid}>
            {cells.map((cell) => {
              if (!cell.day) {
                return (
                  <div key={cell.key} className={`${styles.cell} ${styles.empty}`} aria-hidden>
                    {cell.day}
                  </div>
                );
              }

              const isFuture = cell.state === "future";

              return (
                <button
                  key={cell.key}
                  type="button"
                  className={`${styles.cell} ${styles.cellBtn} ${styles[cell.state]}`}
                  onClick={() => openDay(cell.dayKey)}
                  aria-label={`Open ${cell.dayKey}`}
                  disabled={isFuture}
                >
                  {cell.day}
                </button>
              );
            })}
          </div>

          <div className={styles.summary}>
            <span>Complete: {summary.complete}</span>
            <span>Partial: {summary.partial}</span>
            <span>Missed: {summary.missed}</span>
          </div>

          <div className={styles.legend}>
            <div>
              <span className={`${styles.dot} ${styles.dotComplete}`} />Complete
            </div>
            <div>
              <span className={`${styles.dot} ${styles.dotPartial}`} />Partial
            </div>
            <div>
              <span className={`${styles.dot} ${styles.dotMissed}`} />Missed
            </div>
            <div>
              <span className={`${styles.dot} ${styles.dotToday}`} />Today
            </div>
          </div>
        </section>

        <footer className={shared.tabBar}>
          <p className={shared.tabHint}>Tap a mode to switch views</p>
          <div className={shared.tabGrid}>
            <Link className={shared.tabButton} href="/today">
              Today
            </Link>
            <Link className={`${shared.tabButton} ${shared.tabActive}`} href="/progress-calendar">
              Progress
            </Link>
            <Link className={shared.tabButton} href="/review-plan">
              Plan
            </Link>
            <Link className={shared.tabButton} href="/daily-complete">
              Summary
            </Link>
          </div>
        </footer>
      </section>
    </main>
  );
}
