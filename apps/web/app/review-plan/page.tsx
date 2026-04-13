"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import shared from "../styles/primitives.module.css";
import styles from "./page.module.css";
import { categories } from "../../lib/plan-config";
import { loadPlanSelections } from "../../lib/plan-storage";
import { Commitment, loadCommitments } from "../../lib/commitment-storage";

const icons: Record<string, string> = {
  reading: "R",
  workouts: "W",
  hydrationNutrition: "H",
  progressTracking: "P"
};

export default function ReviewPlanPage() {
  const [selections, setSelections] = useState(loadPlanSelections());
  const [commitments, setCommitments] = useState<Commitment[]>([]);

  useEffect(() => {
    setSelections(loadPlanSelections());
    setCommitments(loadCommitments());
  }, []);

  const summary = useMemo(() => {
    const items = categories.map((category) => {
      const preset = category.presets[selections[category.key]];
      return {
        key: category.key,
        title: category.title,
        label: preset.label,
        detail: preset.detail,
        load: preset.load
      };
    });

    const totalLoad = items.reduce((sum, item) => sum + item.load, 0);
    const level = totalLoad <= 5 ? "Light" : totalLoad <= 8 ? "Balanced" : "High";

    return { items, totalLoad, level };
  }, [selections]);

  return (
    <main className={shared.appShell}>
      <section className={shared.phone}>
        <header className={styles.header}>
          <button className={shared.iconButton} aria-label="Go back">
            &lt;
          </button>
          <h1 className={shared.title}>Review Your Plan</h1>
          <p className={shared.subtitle}>Confirm your choices before you start.</p>
        </header>

        <section className={`${shared.scrollContent} ${styles.content}`}>
          <section className={styles.customWrap}>
            <div className={styles.customHeader}>
              <h2>Custom Commitments</h2>
              <Link className={styles.customAction} href="/build-plan">
                Manage
              </Link>
            </div>

            {commitments.length ? (
              <ul className={styles.customList}>
                {commitments.map((item) => (
                  <li key={item.id} className={styles.customItem}>
                    <div>
                      <p className={styles.customName}>{item.name}</p>
                      <p className={styles.customDetail}>{item.detail || "No detail added yet"}</p>
                    </div>
                    <Link className={styles.customEdit} href={`/edit-commitment?id=${item.id}`}>
                      Edit
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className={styles.customEmpty}>
                No custom commitments added yet. You can add them from Build Plan.
              </p>
            )}
          </section>

          {summary.items.map((item) => (
            <article key={item.key} className={styles.item}>
              <div className={styles.icon}>{icons[item.key]}</div>
              <div className={styles.text}>
                <h2 className={styles.name}>{item.title}</h2>
                <p className={styles.desc}>{item.label}</p>
                <p className={styles.descSub}>{item.detail}</p>
              </div>
              <Link className={styles.edit} href={`/create-plan?edit=${item.key}`}>
                Edit
              </Link>
            </article>
          ))}

          <section className={styles.summary}>
            <p>
              Daily load: <strong>{summary.level}</strong> ({summary.totalLoad} points)
            </p>
          </section>
        </section>

        <footer className={shared.footer}>
          <Link className={`${shared.btn} ${shared.btnPrimary} ${styles.btn}`} href="/today">
            Start My Plan
          </Link>
          <Link className={`${shared.btn} ${styles.secondary} ${styles.btn}`} href="/build-plan">
            Back
          </Link>
        </footer>
      </section>
    </main>
  );
}
