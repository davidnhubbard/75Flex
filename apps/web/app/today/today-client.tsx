"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import shared from "../styles/primitives.module.css";
import styles from "./page.module.css";
import ActiveDatasetBadge from "../components/active-dataset-badge";
import { Commitment, loadCommitments } from "../../lib/commitment-storage";
import {
  DayTaskState,
  getTaskNote,
  getTaskStatus,
  getTodayKey,
  saveTaskLog,
  summarizeDay
} from "../../lib/daily-log-storage";

const cycle: Record<DayTaskState, DayTaskState> = {
  "not-started": "partial",
  partial: "complete",
  complete: "not-started"
};

type TodayClientProps = {
  initialDay: string;
};

function toDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function isValidDayKey(value: string | null): value is string {
  return !!value && /^\d{4}-\d{2}-\d{2}$/.test(value);
}

function toDateFromKey(dayKey: string): Date {
  return new Date(`${dayKey}T00:00:00`);
}

export default function TodayClient({ initialDay }: TodayClientProps) {
  const router = useRouter();

  const [commitments, setCommitments] = useState<Commitment[]>([]);
  const [version, setVersion] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setCommitments(loadCommitments());
  }, []);

  const todayKey = getTodayKey();
  const dayKey = isValidDayKey(initialDay) ? initialDay : todayKey;
  const selectedDate = toDateFromKey(dayKey);
  const isToday = dayKey === todayKey;

  const summary = useMemo(() => summarizeDay(commitments, dayKey), [commitments, dayKey, version]);
  const progressDeg = summary.percent >= 100 ? 359.99 : Math.max(0, summary.percent * 3.6);

  const onToggle = (taskId: string) => {
    const current = getTaskStatus(taskId, dayKey);
    const note = getTaskNote(taskId, dayKey);
    saveTaskLog(taskId, cycle[current], note, dayKey);
    setVersion((v) => v + 1);
  };

  const navigateDay = (offset: number) => {
    const nextDate = new Date(selectedDate);
    nextDate.setDate(nextDate.getDate() + offset);
    const nextKey = toDateKey(nextDate);

    if (nextKey === todayKey) {
      router.push("/today");
      return;
    }

    if (nextKey > todayKey) {
      return;
    }

    router.push(`/today?day=${nextKey}`);
  };

  const dateLabel = selectedDate.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric"
  });

  return (
    <main className={shared.appShell}>
      <section className={shared.phone}>
        <header className={styles.header}>
          <div className={styles.topRow}>
            <div className={styles.badge}>{isToday ? "Today" : "Past Day"}</div>
            <div className={styles.menuWrap}>
              <button
                type="button"
                className={styles.iconBtn}
                onClick={() => setMenuOpen((open) => !open)}
                aria-label="Open quick actions"
              >
                ...
              </button>
              {menuOpen ? (
                <div className={styles.menu}>
                  <Link href="/review-plan" onClick={() => setMenuOpen(false)}>
                    Review plan
                  </Link>
                  <Link href="/daily-complete" onClick={() => setMenuOpen(false)}>
                    Daily summary
                  </Link>
                  <Link href="/progress-calendar" onClick={() => setMenuOpen(false)}>
                    Progress calendar
                  </Link>
                  {!isToday ? (
                    <Link href="/today" onClick={() => setMenuOpen(false)}>
                      Jump to today
                    </Link>
                  ) : null}
                </div>
              ) : null}
            </div>
          </div>

          <div className={styles.dayNav}>
            <button type="button" className={styles.dayBtn} onClick={() => navigateDay(-1)}>
              Yesterday
            </button>
            <div className={styles.dayLabel}>{dateLabel}</div>
            <button
              type="button"
              className={`${styles.dayBtn} ${isToday ? styles.dayBtnDisabled : ""}`}
              onClick={() => navigateDay(1)}
              disabled={isToday}
            >
              {isToday ? "Today" : "Next"}
            </button>
          </div>

          <div className={styles.titleRow}>
            <div>
              <h1 className={styles.title}>Daily Log</h1>
              <div className={styles.subtitle}>
                {summary.complete} of {summary.total} complete
              </div>
              <ActiveDatasetBadge className={styles.datasetBadge} />
            </div>
            <div
              className={styles.ring}
              style={{
                ["--progress-deg" as string]: `${progressDeg}deg`
              }}
            >
              <span>{summary.percent}%</span>
            </div>
          </div>
        </header>

        <section className={styles.content}>
          <h2 className={styles.sectionTitle}>Daily Commitments</h2>

          {commitments.length === 0 ? (
            <div className={styles.empty}>
              <p>No commitments yet.</p>
              <Link href="/build-plan">Build your plan first</Link>
            </div>
          ) : (
            <div className={styles.list}>
              {commitments.map((task) => {
                const state = getTaskStatus(task.id, dayKey);
                return (
                  <article key={task.id} className={`${styles.task} ${state === "complete" ? styles.taskComplete : ""}`}>
                    <button
                      type="button"
                      onClick={() => onToggle(task.id)}
                      className={`${styles.status} ${state === "partial" ? styles.statusPartial : ""}`}
                      aria-label={`Set ${task.name} status`}
                    >
                      {state === "complete" ? "\u2713" : ""}
                    </button>
                    <Link className={styles.meta} href={`/tracked-detail?id=${task.id}&day=${dayKey}`}>
                      <h3 className={styles.taskTitle}>{task.name}</h3>
                      <p className={styles.taskText}>
                        {state === "not-started" ? "Not started" : task.detail || "In progress"}
                      </p>
                    </Link>
                    <span className={styles.stateTag}>{state.replace("-", " ")}</span>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        <footer className={shared.tabBar}>
          <p className={shared.tabHint}>Tap a mode to switch views</p>
          <div className={shared.tabGrid}>
            <Link className={`${shared.tabButton} ${shared.tabActive}`} href="/today">
              Today
            </Link>
            <Link className={shared.tabButton} href="/progress-calendar">
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
