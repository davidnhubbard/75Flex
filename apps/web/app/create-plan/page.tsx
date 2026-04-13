"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import shared from "../styles/primitives.module.css";
import styles from "./page.module.css";
import { categories, CategoryKey, defaultSelections } from "../../lib/plan-config";
import { loadPlanSelections, savePlanSelections } from "../../lib/plan-storage";

export default function CreatePlanPage() {
  const [selections, setSelections] = useState<Record<CategoryKey, number>>(defaultSelections);
  const [editTarget, setEditTarget] = useState<string>("");

  useEffect(() => {
    setSelections(loadPlanSelections());
  }, []);

  useEffect(() => {
    savePlanSelections(selections);
  }, [selections]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const editKey = params.get("edit");
    if (!editKey) {
      return;
    }
    setEditTarget(editKey);
    const target = document.getElementById(`group-${editKey}`);
    target?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const summary = useMemo(() => {
    const items = categories.map((category) => {
      const selectedPreset = category.presets[selections[category.key]];
      return {
        key: category.key,
        title: category.title,
        label: selectedPreset.label,
        detail: selectedPreset.detail,
        load: selectedPreset.load
      };
    });

    const totalLoad = items.reduce((sum, item) => sum + item.load, 0);
    const level = totalLoad <= 5 ? "Light" : totalLoad <= 8 ? "Balanced" : "High";

    return { items, totalLoad, level };
  }, [selections]);

  const selectPreset = (key: CategoryKey, index: number) => {
    setSelections((prev) => ({ ...prev, [key]: index }));
  };

  return (
    <main className={shared.appShell}>
      <section className={shared.phone}>
        <header className={styles.header}>
          <button className={shared.iconButton} aria-label="Go back">
            &lt;
          </button>
          <h1 className={shared.title}>Create Your Plan</h1>
          <p className={shared.subtitle}>
            Choose one preset per category to build a realistic 75-day plan.
          </p>
        </header>

        <section className={`${shared.scrollContent} ${styles.content}`}>
          {categories.map((category) => (
            <article
              id={`group-${category.key}`}
              key={category.key}
              className={`${styles.group} ${
                editTarget === category.key ? styles.groupFocus : ""
              }`}
            >
              <h2>{category.title}</h2>
              <p>{category.helper}</p>

              <div className={styles.options}>
                {category.presets.map((preset, index) => {
                  const selected = selections[category.key] === index;

                  return (
                    <button
                      key={preset.label}
                      type="button"
                      className={`${styles.option} ${selected ? styles.optionSelected : ""}`}
                      onClick={() => selectPreset(category.key, index)}
                    >
                      <span className={styles.optionTitle}>{preset.label}</span>
                      <span className={styles.optionDetail}>{preset.detail}</span>
                    </button>
                  );
                })}
              </div>
            </article>
          ))}

          <aside className={styles.summary}>
            <h3>Plan Summary</h3>
            <ul>
              {summary.items.map((item) => (
                <li key={item.key}>
                  <span>{item.title}</span>
                  <strong>{item.label}</strong>
                </li>
              ))}
            </ul>
            <p className={styles.loadLine}>
              Daily load: <strong>{summary.level}</strong> ({summary.totalLoad} points)
            </p>
          </aside>
        </section>

        <footer className={shared.footer}>
          <Link className={`${shared.btn} ${shared.btnPrimary} ${styles.btn}`} href="/review-plan">
            Review Plan
          </Link>
        </footer>
      </section>
    </main>
  );
}
